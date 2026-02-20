# 动径 MovePath — 横版菜单板

> 咖啡与骑行的城市探索站 — 印刷菜单设计稿

单文件 `index.html` 实现，浏览器预览 + `Ctrl-P` 直出印刷 PDF。
零依赖、零构建、纯静态。

- 印刷尺寸：**125 cm × 60 cm**
- 像素映射：**1250 × 600 px**（1 mm = 1 px）

---

## 文档导航

| 文档 | 说明 |
|------|------|
| `README.md` | 设计规范（色彩、字体、布局尺寸） |
| [`CLAUDE.md`](CLAUDE.md) | AI 操作指南 + CSV → HTML 映射表 |
| [`docs/PRD.md`](docs/PRD.md) | 产品需求文档 |
| `docs/动径咖啡店铺菜单 - 当前菜单.csv` | 菜单数据源（唯一） |

---

## 快速开始

```bash
open index.html          # 直接预览
# 或
python3 -m http.server 8000   # http://localhost:8000
```

## 项目结构

```
menu-designer/
├── index.html          # 完整菜单页面（HTML + 内嵌 CSS）
├── imgs/               # 产品摄影与品牌素材
├── docs/
│   ├── 动径 MovePath | 梧桐区街区探索站.md    # 菜单文案与定价
│   ├── 动径 MovePath 官方矢量资产库.md        # 品牌 SVG 资产
│   └── 动径 VI 识别指南（2026）.pdf           # 品牌 VI 手册
└── README.md
```

---

## 画布与印刷

| 属性 | 值 |
|------|------|
| 画布尺寸 | 1250 × 600 px |
| 预览缩放 | `scale(0.75)`，预览宽 ≈ 937.5 px |
| `@page` | `1250mm × 600mm landscape` |
| `margin-bottom` 补偿 | `-150px`（600 × 0.25） |
| 色彩还原 | `print-color-adjust: exact` |

---

## 布局结构

```
┌─ Header 66px ─────────────────────────────────────────┐
├──────────┬────────────────┬───────────────────────────┤
│ Col 1    │ Col 2          │ Col 3                     │
│ 290px    │ 430px          │ flex:1 (≈530px)           │
│ 季节限定  │ 动径特调        │ 经典日常                   │
│          │ 能量组合        │ 非咖啡类                   │
├──────────┴────────────────┴───────────────────────────┤
└─ Footer 26px ─────────────────────────────────────────┘
```

---

## 色彩系统

| Token | 值 | 用途 |
|-------|------|------|
| `--bg` | `#111111` | 主背景 |
| `--surface` | `#1a1a1a` | 卡片/组合背景 |
| `--surface-2` | `#222222` | 分类栏背景 |
| `--orange` | `#f05f22` | 品牌主色 |
| `--orange-dim` | `rgba(240,95,34,0.12)` | 强调底色 |
| `--text-1` | `#ffffff` | 主文字 |
| `--text-2` | `#cccccc` | 次要文字 |
| `--text-3` | `#888888` | 辅助文字 |
| `--divider` | `rgba(255,255,255,0.08)` | 分割线 |

**硬编码颜色（待统一）：**
- `#ff7a45` — accent 价格（`.sig-item.accent .price`）
- `rgba(255,255,255,0.62)` — 季节限定卡片描述
- `rgba(255,255,255,0.50)` — 季节限定卡片价格
- `rgba(255,255,255,0.75)` — highlight 组合描述

---

## 字体

| 字体 | 用途 |
|------|------|
| Noto Sans SC 300/400/500/700 | 中文正文 |
| Bebas Neue | 英文标题、价格、标签 |

---

## 字号体系

| 层级 | 字号 | 使用场景 |
|------|------|----------|
| XL | 18 px | 特调价格、高亮 badge |
| L | 15–16 px | 价目表价格、compact 价格 |
| M | 13 px | 菜品中文名、分类标题、compact 菜名 |
| S | 10–12 px | 英文名、描述、价目表菜名 |
| XS | 9 px | 卡片描述、标签、footer 副文字 |

---

## 关键组件尺寸

| 组件 | 高度 | 其他 |
|------|------|------|
| Header | 66 px | `padding: 0 16px`，`border-bottom: 2px orange` |
| Logo SVG | auto × 117 w | `viewBox="95 168 560 270"` |
| Section Header（普通） | 22 px | `padding: 3px 12px` |
| Section Header（橙色） | 26 px | 仅季节限定使用 |
| Footer | 26 px | `border-top: 1px orange` |
| 季节限定卡片 | flex:1 等分 | `border-radius: 8px`，`gap: 4px` |
| 特调 Grid | 2 col × 4 row | `gap: 1px` |
| 组合卡片 | flex:1 等分 | `border-left: 3px orange`，`border-radius: 6px` |

---

## 待统一 / 未来设计决策

| 问题 | 现状 | 建议 |
|------|------|------|
| accent 价格色 | `#ff7a45` 硬编码 | 抽为 `--orange-light` 变量 |
| 卡片文字透明度 | `0.62` / `0.50` / `0.75` 各处不一 | 统一为 2–3 档 opacity token |
| section-header 高度 | 22 px vs 26 px 两种 | 统一为一种或明确命名 |
| border-radius | 4 / 6 / 8 px 三种 | 定义 `--radius-sm/md/lg` |
| 间距系统 | 1–10 px 各处自由值 | 采用 4 px 基准栅格 |
| line-height | 1 / 1.2 / 1.35 / 1.4 / 1.5 多种 | 收敛为 3 档 |
| 价格字号 | 14 / 15 / 16 / 18 px 四种 | 按场景收敛为 2–3 档 |
| 打印适配 | 仅 width/height，无字号缩放 | 验证实际打印效果后决定 |
| 深色渐变 | `rgba(0,0,0,0.82)` 硬编码 | 可抽为变量 |

---

## 品牌资产

`docs/` 目录包含完整品牌资产：

- 6 款官方 SVG Logo（白/黑/圆形/文字/门头黑/门头橙）
- VI 识别指南 PDF
- 菜单文案与定价策略文档

## 数据源

菜单内容的唯一数据源为 `docs/动径咖啡店铺菜单 - 当前菜单.csv`，包含 34 行数据覆盖 7 个类别。

### CSV → HTML 更新流程

1. 修改 CSV 中的品名、价格、描述等字段
2. 参照 [`CLAUDE.md`](CLAUDE.md) 中的映射表，定位 HTML 中对应元素
3. 更新 `index.html` 中的文本内容
4. 浏览器预览验证效果

> 详细映射关系（每个 CSV 列对应哪个 HTML 元素）见 `CLAUDE.md`。

---

## License

Private — 仅限动径 MovePath 内部使用。
