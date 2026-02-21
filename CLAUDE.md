# 动径 MovePath — AI 操作指南

## 项目概述

动径 MovePath 咖啡店铺菜单设计系统，包含墙面菜单 + A4 立牌菜单 + Gallery 索引页 + 季节主题切换。

- **墙面菜单**：1250 × 600 px（125 cm × 60 cm，1 mm = 1 px）
- **A4 立牌菜单**：210 × 297 px（A4 竖版，1 mm = 1 px）
- **Gallery 索引页**：双格式预览 + 主题切换
- 零依赖、零构建、纯静态

---

## 项目结构

```
menu-designer/
├── index.html              ← Gallery 索引页（主题切换 + 双格式预览）
├── wall-menu.html          ← 墙面菜单（1250×600 横版）
├── a4-menu.html            ← A4 立牌菜单（210×297 竖版）
├── css/
│   ├── base.css            ← 共享：变量、reset、组件样式
│   ├── themes.css          ← 5 套季节主题定义
│   ├── wall-menu.css       ← 墙面菜单专属布局 + @page landscape
│   └── a4-menu.css         ← A4 菜单专属布局 + @page portrait
├── js/
│   └── theme-switcher.js   ← 主题切换 + localStorage + postMessage
├── imgs/                   ← 产品摄影与品牌素材
└── docs/                   ← 数据源 + 品牌文档
```

### 每个菜单 HTML 的 `<head>`

```html
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/themes.css">
<link rel="stylesheet" href="css/wall-menu.css">  <!-- 或 a4-menu.css -->
<script src="js/theme-switcher.js" defer></script>
```

---

## 季节主题系统

### 双层变量架构

```css
:root {
  /* 品牌基底层 — 永不被主题覆盖 */
  --orange: #f05f22;       /* Header/Footer 边框、Logo 旁标语 */

  /* 主题可变层 — 被 [data-theme] 覆盖 */
  --accent: #f05f22;       /* 默认=品牌橙 */
  --accent-dim: rgba(240,95,34,0.12);
}
```

### 5 套主题

| 主题 | `data-theme` | `--accent` | 设计意图 |
|------|-------------|-----------|---------|
| 默认 | `default` | `#f05f22` 品牌橙 | 无季节活动时 |
| 春节 | `cny` | `#d4382a` 中国红 | 年味菜品 |
| 春天 | `spring` | `#e85d9a` 多巴胺粉 | 水果季 |
| 夏天 | `summer` | `#2dbbab` 薄荷青 | 冰饮季 |
| 秋天 | `autumn` | `#c87e3a` 焦糖琥珀 | 坚果季 |

### `--accent` 作用范围

**使用 `var(--accent)` 的位置：**
- `.section-header.orange-bar` 背景色
- `.seasonal-card.premium` 轮廓色
- `.seasonal-card .en-name` 颜色
- `.sig-item .price` 颜色
- `.sig-item.accent` 背景 `--accent-dim`
- `.combo-mini` 左边框、`.combo-badge` 边框/文字色
- `.combo-mini.highlight` 背景色
- `.rental-price-big` 颜色、`.rental-tier strong` 颜色
- `.header` 底边框
- `.footer` 顶边框
- `.header-tagline .district` 文字色

### 切换方式

```javascript
// 控制台切换
localStorage.setItem('menu-theme', 'cny');
location.reload();

// 或使用 API
MenuTheme.apply('summer');
```

---

## 布局变体系统

### 设计原则

主题全局共享（`data-theme`）、布局各菜单独立（`data-layout`），纯 CSS 实现（不改菜单 HTML 结构）。

### `data-layout` 属性值

| 值 | 含义 | 说明 |
|----|------|------|
| `a` | 默认布局 | 当前的标准布局（默认值） |
| `b` | 变体布局 | 各菜单各有不同的 Layout B |

### 墙面菜单 Layout B —— "特调优先"

| 属性 | Layout A | Layout B |
|------|----------|----------|
| 列顺序 | seasonal → sig → classic | **sig → seasonal → classic** |
| 特调网格 | 2×4 (2col) | **3 列** |
| 特调列宽 | 430px | **480px** |
| 季节限定列宽 | 290px | **250px** |
| 组合卡方向 | 纵向堆叠 | **横向并排** |

CSS 选择器前缀：`[data-layout="b"]`，位于 `css/wall-menu.css` 的 `@page` 之前。

### A4 菜单 Layout B —— "双栏紧凑"

| 属性 | Layout A | Layout B |
|------|----------|----------|
| `.main-body` | flex-direction: column | **CSS Grid 2 列 (115px + 95px)** |
| 季节限定卡 | 横向 3 卡 | **纵向 3 卡** |
| 特调+组合 | 独立区块 | **与季节限定同列（左栏）** |
| 经典+非咖啡+租赁 | 横排双列 | **右栏纵向堆叠** |

CSS 选择器前缀：`[data-layout="b"]`，位于 `css/a4-menu.css` 的 `@page` 之前。

### localStorage Keys

| Key | 用途 | 默认值 |
|-----|------|--------|
| `wall-layout` | 墙面菜单布局（Gallery + wall-menu.html 共用） | `a` |
| `a4-layout` | A4 菜单布局（Gallery + a4-menu.html 共用） | `a` |

`theme-switcher.js` 根据 `location.pathname` 自动选择对应的 key（包含 `a4` → `a4-layout`，否则 → `wall-layout`）。

### `window.MenuLayout` API

```javascript
// 控制台切换布局
MenuLayout.apply('b');

// 查看当前布局
MenuLayout.current(); // → 'a' 或 'b'
```

### Gallery 布局切换器

每个 `.preview-card` 的 `<h2>` 内包含独立的布局切换按钮组（`.layout-toggle`），通过 `data-target` 区分墙面/A4 菜单，点击后通过 postMessage 同步到对应 iframe。

---

## 数据源

**唯一数据源：** `docs/动径咖啡店铺菜单 - 当前菜单.csv`

CSV 包含 33 行菜品数据（序号 1–28 + 31–33），覆盖 6 个类别。所有菜品信息（品名、英文名、描述、价格、店长推荐）均以此文件为准。

### CSV 列结构

| 列 | 含义 | 示例 |
|----|------|------|
| B | 序号 | 1, 2, 3... |
| C | 类别 | `季节限定`、`动径特调` 等 |
| D | 品名 | `鸿运当头` |
| E | 英文名/包含内容 | `Good Luck Ahead` |
| F | 描述/规格 | `迷人酒香樱桃美式、冰糖脆皮口感、复古年味` |
| G | 规格 | `Ice`、`Hot`、`Ice / Hot`（仅供参考，HTML 不显示） |
| H | 价格 (¥) | `42`、`+15`、`25元/小时` |
| I | 店长推荐 | `是`（空白=否）→ HTML 品名后加 `<span style="font-size:0.65em">👍</span>` |

---

## CSV → HTML 映射表

> **重要：** 更新菜单数据时，需同时修改 `wall-menu.html` 和 `a4-menu.html`。

### 类别 1：季节限定（CSV 序号 1–3）

**HTML 位置：** `.col-seasonal` > `.seasonal-cards` > `.seasonal-card`

| CSV 列 | HTML 元素 | 示例 |
|---------|-----------|------|
| D 品名 | `.seasonal-card .cn-name` | `鸿运当头` |
| E 英文名 | `.seasonal-card .en-name`（全大写显示） | `GOOD LUCK AHEAD` |
| F 描述 | `.seasonal-card .desc` | `迷人酒香樱桃美式、冰糖脆皮口感、复古年味` |
| H 价格 | `.seasonal-card .price` | `35` |
| I 店长推荐 | `.cn-name` 后追加 👍 span | `好事花生 👍` |

**特殊规则：**
- 价格 > 45 → 卡片加 `.premium` 类（accent 色轮廓线）
- 图片规格：548 × 306 px / 16:9 比例
- 图片路径：`imgs/` 目录，`<img>` 标签 `alt` 属性 = 品名

### 类别 2：动径特调（CSV 序号 4–10）

**HTML 位置：** `.col-sig` > `.sig-grid` > `.sig-item`

7 个品项占据 2×4 网格的前 7 格，第 8 格为 Logo 水印。

| CSV 列 | HTML 元素 | 示例 |
|---------|-----------|------|
| D 品名 | `.sig-item .cn-name` | `荔枝气泡美式` |
| E 英文名 | `.sig-item .en-name`（原始大小写） | `Lychee Sparkling Americano` |
| F 描述 | `.sig-item .desc` | `清甜荔枝、细腻气泡、双倍清爽` |
| H 价格 | `.sig-item .price` | `32` |
| I 店长推荐 | `.cn-name` 后追加 👍 span | `黑芝麻维也纳 👍` |

**特殊规则：**
- `.accent` 类按序号手动指定（当前：序号 8、9），不自动按价格判定
- 更新菜品时保持现有 `.accent` 分配，如需调整须人工确认

### 类别 3：能量组合（CSV 序号 11–13）

**HTML 位置：** `.col-sig` > `.combo-mini-list` > `.combo-mini`

| CSV 列 | HTML 元素 | 示例 |
|---------|-----------|------|
| D 品名 | `.combo-mini .combo-title` | `脆墩墩补给套餐` |
| E 英文名 | `.combo-mini .combo-tag`（全大写显示） | `AFTERNOON SPECIAL` |
| F 描述 | `.combo-mini .combo-desc` | `任意饮品 + 黑巧燕麦脆墩墩，单点18` |
| H 价格 | `.combo-mini .combo-badge` | `+15` 或 `99` |
| I 店长推荐 | `.combo-title` 后追加 👍 span | `脆墩墩补给套餐 👍` |

**特殊规则：**
- 价格列为 `+N` → badge 显示 `+N`（原值直出）
- 价格列为 `-N` → badge 显示 `-N`（原值直出）
- 价格列为纯数字 → badge 直接显示数字，卡片加 `.highlight` 类（accent 背景）

### 类别 4：经典日常（CSV 序号 14–22）

**HTML 位置：**
- 墙面菜单：`.col-classic` > `.classic-sub-drinks` > 第一个 `.price-list.compact-list`
- A4 菜单：`.col-classic` > `.classic-inner` > 第一个 `.classic-sub-drinks` > `.price-list.compact-list`

| CSV 列 | HTML 元素 | 示例 |
|---------|-----------|------|
| D 品名 | `.pl-row .pl-name` | `美式` |
| E 英文名 | `.pl-row .pl-en` | `Americano` |
| H 价格 | `.pl-row .pl-price` | `25` |

**特殊规则：**
- 品名为 `升级项` → 该行加 `.upgrade` 类
- 升级项价格显示为 `+N`（加号前缀），如 `+3`
- 升级项品名使用 CSV E 列内容（如 `燕麦奶 / 冰博克升级`），非 D 列
- 普通行与升级项之间有 `<hr class="pl-divider">`

### 类别 5：非咖啡类（CSV 序号 23–28）

**HTML 位置：**
- 墙面菜单：`.col-classic` > `.classic-sub-drinks` > 第二个 `.price-list.compact-list`
- A4 菜单：`.col-classic` > `.classic-inner` > 第二个 `.classic-sub-drinks` > `.price-list.compact-list`

映射方式同类别 4，无升级项。

### 类别 6：自行车租赁（CSV 序号 31–33）

**HTML 位置：**
- 墙面菜单：`.col-classic` > `.rental-sub` > `.rental-overlay`
- A4 菜单：`.rental-sub` > `.rental-info-wrap` > `.rental-overlay`

| CSV 序号 | HTML 元素 | 内容格式 |
|---------|-----------|----------|
| 31 (1H) | `.rental-price-big` + `.rental-tiers` 第 1 个 `.rental-tier strong` | `¥25 / 1H` / `¥25` |
| 32 (4H) | `.rental-tiers` 第 2 个 `.rental-tier strong` | `¥88` |
| 33 (24H) | `.rental-tiers` 第 3 个 `.rental-tier strong` | `¥158` |

**附加静态信息（来自 CSV 备注区）：**
- 流程文字：`扫码进行实名核验 > 缴纳押金或申请免押 > 凭取车码出发 · 超时每小时 ¥20`

**叠加文字颜色规则：**
租赁区文字叠在底图上，文字颜色需根据底图明暗选择：
- 深色底图（当前 `brompton-rental.jpg`）→ 白色系文字（默认深色主题下由 `--text-1/2/3` 实现；浅色主题需在 `themes.css` 中强制覆盖为白色系）
- 若更换为浅色底图 → 需反向调整，在深色主题中强制深色文字
- 价格始终使用 `var(--accent)`，不受底图明暗影响

---

## 非 CSV 静态内容（不随菜单数据变更）

以下内容**不来自 CSV 数据行**，修改时需手动编辑 HTML。

### Header

| 内容 | HTML 位置 | 当前值 |
|------|-----------|--------|
| Logo SVG（白色横版） | `.header-logo svg` | 内联 SVG |
| 中文标语 | `.header-tagline .district` | `咖啡与骑行的城市探索站` |
| 英文标语 | `.header-tagline .sub` | `URBAN EXPLORATION HUB OF COFFEE & CYCLING` |

### Section 英文标题

| 类别 | 英文标题 | CSS 选择器 |
|------|----------|-----------|
| 季节限定 | `SEASONAL SPECIALS` | `.col-seasonal .section-title-en` |
| 动径特调 | `SIGNATURE SPECIALS` | `.col-sig .section-title-en`（第 1 个） |
| 能量组合 | `ENERGY COMBO` | `.col-sig .section-title-en`（第 2 个） |
| 经典日常 | `DAILY DRINKS` | `.classic-sub-drinks .section-title-en`（第 1 个） |
| 非咖啡类 | `NON-COFFEE` | `.classic-sub-drinks .section-title-en`（第 2 个） |
| 自行车租赁 | `BIKE RENTAL` | `.rental-sub .section-title-en` |

### 季节限定图片

| 品名 | 图片路径 |
|------|----------|
| 鸿运当头 | `imgs/鸿运当头.jpg` |
| 好事花生 | `imgs/好事花生.png` |
| 大橘大利 | `imgs/大橘大利.jpg` |

> 新增/替换季节限定品项时需同步更新图片文件和两个 HTML 中的 `<img>` 标签。

### 动径特调第 8 格

Logo 圆形水印 SVG，固定占位，不随菜品数据变动。

---

## 价格显示规则

1. **纯数字**：不加 "元"、"¥" 或任何货币符号
2. **升级项**：价格前加 `+` 号，如 `+3`
3. **加型组合**：`+N` 原值直出（如 `+15`）
4. **减型组合**：`-N` 原值直出（如 `-5`）
5. **租赁主价格**：格式为 `¥N / 1H`（租赁价格带 ¥ 前缀，与时间单位区分）

---

## CSV 更新操作指南

当 CSV 数据变更时，按以下步骤定位并修改 HTML：

1. **确定变更行的类别**（C 列）
2. **根据上方映射表**找到对应 HTML 区块的 CSS 选择器
3. **按序号**定位到具体元素（类别内顺序与 HTML 中元素顺序一致）
4. **同时修改 `wall-menu.html` 和 `a4-menu.html`**
5. **修改对应文本内容**，注意：
   - 检查是否需要变更样式类（`.premium`、`.accent`、`.highlight`、`.upgrade`）
   - 升级项使用 E 列而非 D 列作为显示名
   - 价格遵循上方显示规则
   - I 列「店长推荐」为 `是` → 品名后加 `<span style="font-size:0.65em">👍</span>`
   - I 列为空 → 确保品名后无 👍 span

### 新增/删除菜品

- **新增**：在两个 HTML 对应区块内，复制相邻元素结构，填入新数据
- **删除**：移除两个 HTML 中对应元素
- **注意**：动径特调区域固定 2×4 网格，第 8 格为 Logo 水印

---

## Footer 静态信息

Footer 内容来自 CSV 备注区，非数据行：

| Emoji | 内容 | HTML 元素 |
|-------|------|-----------|
| 🚲 | 骑行到店减3 | `.footer-icon` + `.footer-main strong`（第 1 组） |
| ☕ | 自带杯减3 | `.footer-icon` + `.footer-main strong`（第 2 组） |
| 🐾 | 宠物友好 | `.footer-icon` + `.footer-main strong`（第 3 组） |
| 👍 | 店长推荐 | `.footer-icon` + `.footer-main strong`（第 4 组） |
| 🔄 | 租车骑行后，回店续杯享半价 | `.footer-icon` + `.footer-main strong`（第 5 组） |
| — | 货币单位为人民币 (RMB) | `.footer-currency` |

**结构规则：** 每组为 `<span class="footer-icon">` + `<span class="footer-main">`，emoji 在前文字在后，组间用 `<span class="sep">\|</span>` 分隔。

---

## A4 立牌菜单布局差异

A4 菜单与墙面菜单共享相同数据，但布局不同：

| 特性 | 墙面菜单 | A4 立牌 |
|------|---------|---------|
| 方向 | 横版 landscape | 竖版 portrait |
| 尺寸 | 1250 × 600 px | 210 × 297 px |
| 预览缩放 | scale(0.75) | scale(3.5) |
| 分类布局 | 3 列并排 | 竖向堆叠 |
| 季节限定 | 纵向 3 卡 | 横向 3 卡 |
| 能量组合 | 纵向 3 卡 | 横向 3 卡 |
| 经典/非咖啡 | 经典+非咖啡共一列 | 双列并排 |
| 自行车租赁 | 右子列（图+叠加文字） | 全宽横条（左图右文） |

---

## 相关文档

- `README.md` — 设计规范（色彩、字体、布局尺寸）
- `docs/PRD.md` — 产品需求文档
- `docs/动径咖啡店铺菜单 - 当前菜单.csv` — 菜单数据源
