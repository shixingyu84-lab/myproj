const hookPool = [
  '“别划走！这个开头90%家长都中招了…”',
  '“你以为是玩具？其实是孩子的大脑训练器。”',
  '“我只离开2分钟，客厅变成了未来城！”',
  '“先别买！看完这条再决定值不值。”',
  '“同样一盒积木，为什么别人家孩子能玩1小时？”'
];

const painPool = [
  '孩子回家只想看屏幕，亲子互动越来越少',
  '买过很多玩具，新鲜感只有三天',
  '担心孩子专注力和动手能力不足',
  '家里玩具杂乱，收纳和重复利用困难',
  '不知道如何把“玩”变成“启蒙学习”'
];

const climaxPool = [
  '成品点亮瞬间，全家一起“哇”出声',
  '孩子第一次主动讲解自己的设计逻辑',
  '同一盒积木三种风格改造，视觉冲击拉满',
  '亲子配合完成高难结构，击掌庆祝',
  '模型从倒塌到稳定，完成逆袭反转'
];

const ctaPool = [
  '评论“想要”领取同款拼搭思路',
  '在评论区打1/2/3投票你最爱的版本',
  '关注我，明天发“10分钟亲子拼搭模板”',
  '点赞过500，更新进阶挑战版',
  '私信“积木”获取新手清单'
];

const bgmPool = [
  '热门电子卡点 / 变装风',
  'Lo-fi治愈节奏 / 亲子日常风',
  '轻快鼓点 / 教程拆解风',
  '悬念感低音 / 剧情反转风',
  '温暖钢琴+节拍 / 情感共鸣风'
];

const memoryPool = [
  '金句：会拼搭的孩子，先学会拆解问题。',
  '视觉符号：一声“咔哒”触发变形。',
  '反转点：家长不插手，孩子反而更快成功。',
  '记忆动作：完成后固定“击掌庆祝”。',
  '标志画面：3秒前后对比分屏。'
];

function pick(arr, i) {
  return arr[i % arr.length];
}

function randomDuration(range, i) {
  const [min, max] = range.split('-').map(Number);
  return min + ((i * 7) % (max - min + 1));
}

function buildScript(index, direction, cfg) {
  const duration = randomDuration(cfg.duration, index);
  const hook = pick(hookPool, index);
  const pain = pick(painPool, index + 1);
  const climax = pick(climaxPool, index + 2);
  const cta = pick(ctaPool, index + 3);
  const bgm = pick(bgmPool, index);
  const memory = pick(memoryPool, index + 4);

  return `---
**脚本#${index + 1} | ${direction} | 预估时长：${duration}秒**

**标题：** ${['🔥','🎯','🚀','✨','🧠'][index % 5]} ${cfg.brand}爆款脚本#${index + 1}：${direction}高互动打法

**黄金3秒（画外音/台词）：**
${hook}

**分镜脚本：**
| 时间 | 画面 | 台词/字幕 | BGM建议 |
|-----|------|----------|---------|
| 0-3s | 高冲突开场/前后反差镜头 | “${hook.replace(/[“”]/g, '')}” | ${bgm} |
| 3-10s | 痛点场景演绎（家庭/拼搭现场） | 痛点：${pain} | 节奏推进 |
| 10-22s | ${cfg.brand}产品核心玩法展示（模块拼搭/可重构） | 卖点：${cfg.sellingPoints} | 卡点转场 |
| 22-${Math.max(24, duration - 6)}s | 情绪高潮画面 | ${climax} | 音乐高潮 |
| ${Math.max(24, duration - 6)}-${duration}s | CTA收口+评论引导 | ${cta} | 结尾记忆音效 |

**爆款元素：**
- 钩子类型：${['悬念','冲突','反常识','视觉冲击'][index % 4]}
- 互动埋点：你家孩子更喜欢“自由拼搭”还是“任务挑战”？
- 记忆点：${memory}
- 标签建议：#${cfg.brand} #积木 #亲子玩具 #益智玩具 #STEM启蒙 #抖音爆款
`;
}

function generate() {
  const brand = document.querySelector('#brand').value.trim() || 'Lumibricks';
  const audience = document.querySelector('#audience').value.trim();
  const sellingPoints = document.querySelector('#sellingPoints').value.trim();
  const themesInput = document.querySelector('#themes').value.trim();
  const count = Number(document.querySelector('#count').value);
  const duration = document.querySelector('#duration').value;
  const directions = [...document.querySelectorAll('.direction:checked')].map(el => el.value);

  if (!directions.length) {
    alert('请至少勾选一个内容方向。');
    return;
  }

  const themes = themesInput ? themesInput.split(',').map(t => t.trim()).filter(Boolean) : directions;

  const cfg = { brand, audience, sellingPoints, duration, themes };

  const intro = `# ${brand} 抖音短视频脚本批量产出\n\n- 目标受众：${audience}\n- 核心卖点：${sellingPoints}\n- 目标完播率：>65%\n- 脚本数量：${count}\n\n`;

  let output = intro;

  for (let i = 0; i < count; i++) {
    const direction = directions[i % directions.length];
    output += buildScript(i, direction, cfg) + '\n';
  }

  document.querySelector('#output').value = output;
}

function copyOutput() {
  const output = document.querySelector('#output');
  if (!output.value.trim()) return;
  output.select();
  document.execCommand('copy');
  alert('已复制到剪贴板。');
}

function downloadMarkdown() {
  const text = document.querySelector('#output').value;
  if (!text.trim()) return;
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lumibricks-scripts-${new Date().toISOString().slice(0, 10)}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

document.querySelector('#generateBtn').addEventListener('click', generate);
document.querySelector('#copyBtn').addEventListener('click', copyOutput);
document.querySelector('#downloadBtn').addEventListener('click', downloadMarkdown);
