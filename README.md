# 动径 MovePath | Menu Designer

> 咖啡与骑行的城市探索站 — 专业菜单设计工具

为「动径 MovePath」咖啡骑行探索站打造的横版菜单看板设计系统。输出 1200×600mm 印刷级静态页面，支持直接打印或数字屏展示。

## 预览

打开 `index.html` 即可预览完整菜单效果：

- 屏幕预览：75% 缩放（900×450px）
- 打印输出：100% 原尺寸（1200×600mm）

## 技术栈

| 技术 | 说明 |
|------|------|
| HTML5 | 语义化结构 |
| CSS3 | 自定义属性、Flexbox 布局、印刷媒体查询 |
| Google Fonts | Bebas Neue + Noto Sans SC |

零依赖、零构建、纯静态。无需 npm install，无需编译。

## 项目结构

```
menu-designer/
├── index.html          # 完整菜单页面（HTML + 内嵌 CSS）
├── imgs/               # 产品摄影与品牌素材（14 张）
├── docs/
│   ├── 动径 MovePath | 梧桐区街区探索站.md    # 菜单文案与定价
│   ├── 动径 MovePath 官方矢量资产库.md        # 品牌 SVG 资产
│   └── 动径 VI 识别指南（2026）.pdf           # 品牌 VI 手册
└── README.md
```

## 快速开始

### 方式一：直接打开

```bash
open index.html
```

### 方式二：本地服务器

```bash
python3 -m http.server 8000
# 访问 http://localhost:8000
```

## 菜单布局

1200×600px 横版三栏布局：

| 区域 | 宽度 | 内容 |
|------|------|------|
| 左栏 | 290px | 季节限定（3 款，42-58 元） |
| 中栏 | 430px | 招牌特调（7 款，38-42 元）+ 能量套餐（3 款） |
| 右栏 | 480px | 日常经典 + 非咖啡饮品 + Brompton 单车租赁 |

顶部 Header（72px）：品牌 Logo + 标语
底部 Footer（48px）：骑行优惠 / 单车租赁 / 宠物友好

## 设计系统

### 配色

```
主背景    #111111
卡片面    #1a1a1a
品牌橙    #f05f22
主文字    #ffffff
副文字    #cccccc
辅助文字  #888888
```

### 字体

- **展示字体**：Bebas Neue — 价格、标签、英文
- **正文字体**：Noto Sans SC — 中文内容（300/400/500/700）

## 打印导出

页面内置 `@media print` 样式，直接 `Ctrl+P` 打印：

- 页面尺寸：1200mm × 600mm 横向
- 颜色模式：精确色彩还原（`print-color-adjust: exact`）
- 无缩放、无边距

## 品牌资产

`docs/` 目录包含完整品牌资产：

- 6 款官方 SVG Logo（白/黑/圆形/文字/门头黑/门头橙）
- VI 识别指南 PDF
- 菜单文案与定价策略文档

## License

Private — 仅限动径 MovePath 内部使用。
