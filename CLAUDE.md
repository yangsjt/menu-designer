# 动径 MovePath — AI 操作指南

## 项目概述

动径 MovePath 咖啡店铺横版菜单，单文件 `index.html` 实现。

- 画布尺寸：**1250 × 600 px**
- 印刷尺寸：125 cm × 60 cm（1 mm = 1 px）
- 三栏布局：季节限定 (290px) | 动径特调 + 能量组合 (430px) | 经典日常 + 非咖啡类 + 自行车租赁 (flex:1)

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
| H | 价格 (¥) | `42`、`加15`、`25元/小时` |
| I | 店长推荐 | `是`（空白=否）→ HTML 品名后加 `<span style="font-size:0.65em">👍</span>` |

---

## CSV → HTML 映射表

### 类别 1：季节限定（CSV 序号 1–3）

**HTML 位置：** `.col-seasonal` > `.seasonal-cards` > `.seasonal-card`

每张卡片按 CSV 顺序排列，映射关系：

| CSV 列 | HTML 元素 | 示例 |
|---------|-----------|------|
| D 品名 | `.seasonal-card .cn-name` | `鸿运当头` |
| E 英文名 | `.seasonal-card .en-name`（全大写显示） | `GOOD LUCK AHEAD` |
| F 描述 | `.seasonal-card .desc` | `迷人酒香樱桃美式、冰糖脆皮口感、复古年味` |
| H 价格 | `.seasonal-card .price` | `35` |
| I 店长推荐 | `.cn-name` 后追加 👍 span | `好事花生 👍` |

**特殊规则：**
- 价格 > 45 → 卡片加 `.premium` 类（橙色轮廓线）
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
- 价格 ≥ 38 且非手冲 → 加 `.accent` 类（橙色渐变背景，价格色 `var(--orange)`）
- 精品手冲不加 `.accent`（保持素底以区分风格）

### 类别 3：能量组合（CSV 序号 11–13）

**HTML 位置：** `.col-sig` > `.combo-mini-list` > `.combo-mini`

| CSV 列 | HTML 元素 | 示例 |
|---------|-----------|------|
| D 品名 | `.combo-mini .combo-title` | `脆墩墩补给套餐` |
| E 英文名 | `.combo-mini .combo-tag`（全大写显示） | `AFTERNOON SPECIAL` |
| F 描述 | `.combo-mini .combo-desc` | `任意饮品 + 黑巧燕麦脆墩墩，单点18` |
| H 价格 | `.combo-mini .combo-badge` | `加15` 或 `99` |
| I 店长推荐 | `.combo-title` 后追加 👍 span | `脆墩墩补给套餐 👍` |

**特殊规则：**
- 价格列为 `加 N` → badge 显示 `加N`（无"元"字）
- 价格列为 `减 N` → badge 显示 `减N`（无"元"字）
- 价格列为纯数字 → badge 直接显示数字，卡片加 `.highlight` 类（橙色背景）

### 类别 4：经典日常（CSV 序号 14–22）

**HTML 位置：** `.col-classic` > `.classic-sub-drinks` > 第一个 `.price-list.compact-list`

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

**HTML 位置：** `.col-classic` > `.classic-sub-drinks` > 第二个 `.price-list.compact-list`

映射方式同类别 4，无升级项。

| CSV 列 | HTML 元素 | 示例 |
|---------|-----------|------|
| D 品名 | `.pl-row .pl-name` | `巴黎水` |
| E 英文名 | `.pl-row .pl-en` | `Water` |
| H 价格 | `.pl-row .pl-price` | `25` |

### 类别 6：自行车租赁（CSV 序号 31–33）

**HTML 位置：** `.col-classic` > `.rental-sub` > `.rental-overlay`

| CSV 序号 | HTML 元素 | 内容格式 |
|---------|-----------|----------|
| 31 (1H) | `.rental-price-big` + `.rental-tiers` 第 1 个 `.rental-tier strong` | `¥25 / 1H` / `¥25` |
| 32 (4H) | `.rental-tiers` 第 2 个 `.rental-tier strong` | `¥88` |
| 33 (24H) | `.rental-tiers` 第 3 个 `.rental-tier strong` | `¥158` |

**附加静态信息（来自 CSV 备注区）：**
- 流程文字：`扫码进行实名核验 > 缴纳押金或申请免押 > 凭取车码出发 · 超时每小时 ¥20`

---

## 非 CSV 静态内容（不随菜单数据变更）

以下内容**不来自 CSV 数据行**，修改时需手动编辑 HTML。

### Header

| 内容 | HTML 位置 | 当前值 |
|------|-----------|--------|
| Logo SVG（白色横版） | `.header-logo svg` | 内联 SVG |
| 中文标语 | `.header-tagline .district` | `咖啡与骑行的城市探索站` |
| 英文标语 | `.header-tagline .sub` | `URBAN EXPLORATION HUB OF COFFEE & CYCLING` |
| 页面标题 | `<title>` | `动径 MovePath \| 梧桐区街区探索站 · 菜单` |

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

> 新增/替换季节限定品项时需同步更新图片文件和 `<img>` 标签。

### 自行车租赁静态元素

| 内容 | HTML 元素 | 当前值 |
|------|-----------|--------|
| 租赁图片 | `.rental-img-wrap img` | `imgs/brompton-rental.jpg` |
| Slogan | `.rental-slogan` | `品质骑行，轻松即享` |
| Tier 标签 | `.rental-tier`（文字部分） | `1H 尝鲜` / `4H 深度` / `24H 沉浸` |
| 流程标题 | `.rental-process strong` | `PROCESS / 流程` |

### 动径特调第 8 格

Logo 圆形水印 SVG，固定占位，不随菜品数据变动。

---

## 价格显示规则

1. **纯数字**：不加 "元"、"¥" 或任何货币符号
2. **升级项**：价格前加 `+` 号，如 `+3`
3. **加型组合**：显示 `加N`，不加"元"
4. **减型组合**：显示 `减N`，不加"元"
5. **租赁主价格**：格式为 `¥N / 1H`（租赁价格带 ¥ 前缀，与时间单位区分）

---

## CSV 更新操作指南

当 CSV 数据变更时，按以下步骤定位并修改 HTML：

1. **确定变更行的类别**（C 列）
2. **根据上方映射表**找到对应 HTML 区块的 CSS 选择器
3. **按序号**定位到具体元素（类别内顺序与 HTML 中元素顺序一致）
4. **修改对应文本内容**，注意：
   - 检查是否需要变更样式类（`.premium`、`.accent`、`.highlight`、`.upgrade`）
   - 升级项使用 E 列而非 D 列作为显示名
   - 价格遵循上方显示规则
   - I 列「店长推荐」为 `是` → 品名后加 `<span style="font-size:0.65em">👍</span>`
   - I 列为空 → 确保品名后无 👍 span

### 新增/删除菜品

- **新增**：在对应区块内，复制相邻元素结构，填入新数据
- **删除**：移除对应 HTML 元素
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

## 相关文档

- `README.md` — 设计规范（色彩、字体、布局尺寸）
- `docs/PRD.md` — 产品需求文档
- `docs/动径咖啡店铺菜单 - 当前菜单.csv` — 菜单数据源
