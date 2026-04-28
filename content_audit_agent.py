"""Simple content-quality audit agent for short-video UGC platforms.

This prototype focuses on two goals:
1. ecosystem health (ad/spam/commercial abuse)
2. safety (high-risk content cues)

It is intentionally lightweight and explainable.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
import re
from typing import Dict, List, Tuple


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class Decision(str, Enum):
    ALLOW = "allow"
    REVIEW = "human_review"
    REJECT = "reject"


@dataclass
class ContentItem:
    text: str
    tags: List[str] = field(default_factory=list)
    has_external_link: bool = False
    account_age_days: int = 0
    daily_post_count: int = 0


@dataclass
class AuditResult:
    decision: Decision
    risk_level: RiskLevel
    score: int
    reasons: List[str]


class ContentAuditAgent:
    """Rule-based baseline agent.

    You can later replace each detector with an ML model while keeping the same
    interface.
    """

    def __init__(self) -> None:
        self.safety_patterns: Dict[str, int] = {
            r"\b(自杀|自残|炸药|枪支交易|毒品交易)\b": 60,
            r"\b(未成年人.*饮酒|未成年人.*赌博)\b": 45,
            r"\b(仇恨|种族歧视|暴力威胁)\b": 50,
        }
        self.ecosystem_patterns: Dict[str, int] = {
            r"\b(刷单|引流到私域|VX:|加微|返利群)\b": 40,
            r"\b(假一赔十|100%治愈|稳赚不赔)\b": 35,
            r"\b(点击链接领取|限时0元购|免费送钱)\b": 30,
        }

    def _match_patterns(self, text: str, patterns: Dict[str, int]) -> List[Tuple[str, int]]:
        hits: List[Tuple[str, int]] = []
        for pattern, weight in patterns.items():
            if re.search(pattern, text, flags=re.IGNORECASE):
                hits.append((pattern, weight))
        return hits

    def audit(self, item: ContentItem) -> AuditResult:
        score = 0
        reasons: List[str] = []

        # Safety detectors
        safety_hits = self._match_patterns(item.text, self.safety_patterns)
        for pattern, weight in safety_hits:
            score += weight
            reasons.append(f"safety_pattern_hit:{pattern}(+{weight})")

        # Commercial ecosystem detectors
        ecosystem_hits = self._match_patterns(item.text, self.ecosystem_patterns)
        for pattern, weight in ecosystem_hits:
            score += weight
            reasons.append(f"ecosystem_pattern_hit:{pattern}(+{weight})")

        # Behavioral risk signals
        if item.has_external_link:
            score += 10
            reasons.append("has_external_link(+10)")
        if item.account_age_days < 7:
            score += 10
            reasons.append("new_account(+10)")
        if item.daily_post_count > 15:
            score += 15
            reasons.append("high_post_frequency(+15)")

        # Decision policy
        if score >= 80:
            decision = Decision.REJECT
            risk_level = RiskLevel.HIGH
        elif score >= 35:
            decision = Decision.REVIEW
            risk_level = RiskLevel.MEDIUM
        else:
            decision = Decision.ALLOW
            risk_level = RiskLevel.LOW

        return AuditResult(
            decision=decision,
            risk_level=risk_level,
            score=score,
            reasons=reasons,
        )


if __name__ == "__main__":
    agent = ContentAuditAgent()

    sample = ContentItem(
        text="限时0元购，点击链接领取，VX:abc123，稳赚不赔",
        tags=["电商", "促销"],
        has_external_link=True,
        account_age_days=2,
        daily_post_count=22,
    )

    result = agent.audit(sample)
    print("decision:", result.decision.value)
    print("risk_level:", result.risk_level.value)
    print("score:", result.score)
    print("reasons:")
    for reason in result.reasons:
        print(" -", reason)
