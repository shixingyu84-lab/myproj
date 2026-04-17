# myproj

一个轻量级网页工具，用于批量生成 **抖音短视频脚本**（针对积木/益智玩具品牌，如 Lumibricks）。

## 功能

- 批量生成 5/10/20 条脚本
- 可勾选内容方向（亲子、教程、开箱、剧情、STEM）
- 自动包含：黄金3秒、痛点共鸣、产品植入、情绪高潮、行动号召
- 一键复制全部脚本
- 导出 Markdown 文件

## 本地运行

直接用浏览器打开 `index.html` 即可。

或使用本地静态服务器：

```bash
python3 -m http.server 8000
```

然后访问：

`http://localhost:8000`

## 文件结构

- `index.html`：页面结构
- `styles.css`：UI 样式
- `script.js`：脚本生成逻辑
