# 动径 MovePath — AI 操作指南

## 项目概述

动径 MovePath 咖啡店铺横版菜单，单文件 `index.html` 实现。

- 画布尺寸：**1250 × 600 px**
- 印刷尺寸：125 cm × 60 cm（1 mm = 1 px）
- 三栏布局：季节限定 (290px) | 动径特调 + 能量组合 (430px) | 经典日常 + 非咖啡 + 自行车租赁 (flex:1)

---

## 数据源

**唯一数据源：** `docs/动径咖啡店铺菜单 - 工作表1.csv`

CSV 包含 31 行菜品数据，覆盖 6 个类别。所有菜品信息（品名、英文名、描述、价格）均以此文件为准。

### CSV 列结构

| 列 | 含义 | 示例 |
|----|------|------|
| B | 序号 | 1, 2, 3... |
| C | 类别 | `1. 季节限定`、`2. 动径特调` 等 |
| D | 品名 | `草莓维也纳` |
| E | 英文名/包含内容 | `STRAWBERRY VIENNESE` |
| F | 描述/规格 | `草莓莓粉、新鲜草莓、手作浓郁奶盖` |
| G | 价格 (¥) | `42`、`减 5`、`1.5` |

---

## CSV → HTML 映射表

### 类别 1：季节限定（CSV 序号 1–3）

**HTML 位置：** `.col-seasonal` > `.seasonal-cards` > `.seasonal-card`

每张卡片按 CSV 顺序排列，映射关系：

| CSV 列 | HTML 元素 | 示例 |
|---------|-----------|------|
| D 品名 | `.seasonal-card .cn-name` | `草莓维也纳` |
| E 英文名 | `.seasonal-card .en-name` | `STRAWBERRY VIENNESE` |
| F 描述 | `.seasonal-card .desc` | `草莓莓粉、新鲜草莓、手作浓郁奶盖` |
| G 价格 | `.seasonal-card .price` | `42` |

**特殊规则：**
- 价格 > 50 → 卡片加 `.premium` 类（橙色轮廓线）
- 图片规格：548 × 306 px / 16:9 比例
- 图片路径：`imgs/` 目录，`<img>` 标签 `alt` 属性 = 品名

### 类别 2：动径特调（CSV 序号 4–10）

**HTML 位置：** `.col-sig` > `.sig-grid` > `.sig-item`

7 个品项占据 2×4 网格的前 7 格，第 8 格为 Logo 水印。

| CSV 列 | HTML 元素 | 示例 |
|---------|-----------|------|
| D 品名 | `.sig-item .cn-name` | `咸柚子 Dirty` |
| E 英文名 | `.sig-item .en-name` | `Salty Yuzu Dirty` |
| F 描述 | `.sig-item .desc` | `盐渍柚子、清爽微咸、分层口感` |
| G 价格 | `.sig-item .price` | `38` |

**特殊规则：**
- 价格 > 38 → 加 `.accent` 类（橙色渐变背景，价格色 `#ff7a45`）

### 类别 3：能量组合（CSV 序号 11–13）

**HTML 位置：** `.col-sig` > `.combo-mini-list` > `.combo-mini`

| CSV 列 | HTML 元素 | 示例 |
|---------|-----------|------|
| D 品名 | `.combo-mini .combo-title` | `午后社区套餐` |
| E 英文名 | `.combo-mini .combo-tag` | `AFTERNOON SPECIAL` |
| F 描述 | `.combo-mini .combo-desc` | `任意经典咖啡 + 黑巧燕麦脆墩墩` |
| G 价格 | `.combo-mini .combo-badge` | `减5` 或 `58` |

**特殊规则：**
- 价格列为 `减 N` → badge 显示 `减N`（无"元"字）
- 价格列为纯数字 → badge 直接显示数字，卡片加 `.highlight` 类（橙色背景）

### 类别 4：经典日常（CSV 序号 14–21）

**HTML 位置：** `.col-classic` > `.classic-sub-drinks` > 第一个 `.price-list.compact-list`

| CSV 列 | HTML 元素 | 示例 |
|---------|-----------|------|
| D 品名 | `.pl-row .pl-name` | `美式` |
| E 英文名 | `.pl-row .pl-en` | `Americano` |
| G 价格 | `.pl-row .pl-price` | `25` |

**特殊规则：**
- 品名为 `升级项` → 该行加 `.upgrade` 类
- 升级项价格显示为 `+N`（加号前缀），如 `+3`、`+5`
- 升级项品名使用 CSV E 列内容（如 `燕麦奶 / 冰博克升级`），非 D 列
- 普通行与升级项之间有 `<hr class="pl-divider">`

### 类别 5：非咖啡类（CSV 序号 22–27）

**HTML 位置：** `.col-classic` > `.classic-sub-drinks` > 第二个 `.price-list.compact-list`

映射方式同类别 4，无升级项。

| CSV 列 | HTML 元素 | 示例 |
|---------|-----------|------|
| D 品名 | `.pl-row .pl-name` | `抹茶拿铁` |
| E 英文名 | `.pl-row .pl-en` | `Matcha Latte` |
| G 价格 | `.pl-row .pl-price` | `32` |

### 类别 6：自行车租赁（CSV 序号 28–31）

**HTML 位置：** `.col-classic` > `.rental-sub` > `.rental-overlay`

| CSV 序号 | HTML 元素 | 内容格式 |
|---------|-----------|----------|
| 28 (15min) | `.rental-price-big` | `1.5 / 15MIN` |
| 29 (1H) | `.rental-tiers` 第 1 个 `.rental-tier strong` | `35` |
| 30 (4H) | `.rental-tiers` 第 2 个 `.rental-tier strong` | `88` |
| 31 (24H) | `.rental-tiers` 第 3 个 `.rental-tier strong` | `158` |

**附加静态信息（来自 CSV 备注区）：**
- 押金：`.rental-process` 中显示 `4,000`
- 流程文字：`扫码实名核验 > 缴纳押金 4,000 > 凭取车码出发`

---

## 价格显示规则

1. **纯数字**：不加 "元"、"¥" 或任何货币符号
2. **升级项**：价格前加 `+` 号，如 `+3`
3. **减型组合**：显示 `减N`，不加"元"
4. **租赁主价格**：格式为 `N / 15MIN`
5. **千分位**：押金等大数字保留千分位逗号，如 `4,000`

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

### 新增/删除菜品

- **新增**：在对应区块内，复制相邻元素结构，填入新数据
- **删除**：移除对应 HTML 元素
- **注意**：动径特调区域固定 2×4 网格，第 8 格为 Logo 水印

---

## Footer 静态信息

Footer 内容来自 CSV 备注区，非数据行：

| 内容 | HTML 元素 |
|------|-----------|
| 骑行到店减3 | `.footer .footer-main:nth-of-type(1) strong` |
| 自带杯减3 | `.footer .footer-main:nth-of-type(2) strong` |
| 宠物友好 | `.footer .footer-main:nth-of-type(3) strong` |
| 货币单位为人民币 (RMB) | `.footer-currency` |

---

## 相关文档

- `README.md` — 设计规范（色彩、字体、布局尺寸）
- `docs/PRD.md` — 产品需求文档
- `docs/动径咖啡店铺菜单 - 工作表1.csv` — 菜单数据源
