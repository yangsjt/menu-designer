# 动径 MovePath — 菜单设计系统

> 咖啡与骑行的城市探索站 — 菜单设计系统（墙面菜单 + A4 立牌 + 季节主题）

零依赖、零构建、纯静态。浏览器预览 + `Ctrl-P` 直出印刷 PDF。

---

## 快速开始

```bash
# 需通过 HTTP 服务预览（iframe 在 file:// 下受限）
python3 -m http.server 8000
# 打开 http://localhost:8000

# 或直接查看单个菜单
open wall-menu.html     # 墙面菜单
open a4-menu.html       # A4 立牌菜单

# 导出 PDF（首次需安装依赖）
npm install             # 安装 Puppeteer
npm run pdf             # 导出全部菜单
npm run pdf:wall        # 仅导出墙面菜单
npm run pdf:a4          # 仅导出 A4 立牌
```

---

## 文档导航

| 文档 | 说明 |
|------|------|
| `README.md` | 设计规范（色彩、字体、布局尺寸） |
| [`CLAUDE.md`](CLAUDE.md) | AI 操作指南 + CSV → HTML 映射表 + 主题系统 |
| [`docs/PRD.md`](docs/PRD.md) | 产品需求文档 |
| `docs/动径咖啡店铺菜单 - 当前菜单.csv` | 菜单数据源（唯一） |

---

## 用户操作流程

### 步骤 1：更新菜单数据

编辑 `docs/动径咖啡店铺菜单 - 当前菜单.csv`，修改品名、价格、描述、店长推荐等字段。

### 步骤 2：同步到 HTML（使用 Claude Code）

在项目目录启动 Claude Code，执行 `/更新菜单` 命令：

```
/更新菜单
```

Claude 将自动：读取 CSV → 验证格式 → 展示变更报告 → **等待确认** → 同步 `wall-menu.html` 和 `a4-menu.html`。

### 步骤 3：在 Gallery 预览

```bash
python3 -m http.server 8000
# 打开 http://localhost:8000
```

在 Gallery 页面切换主题（5 套季节主题）和布局（Layout A/B），确认效果。

### 步骤 4：导出 PDF

```bash
npm install                                        # 仅首次
npm run pdf                                        # 导出全部（默认主题+布局）
node scripts/generate-pdf.js wall --theme cny      # 指定主题
node scripts/generate-pdf.js a4 --layout b         # 指定布局
```

PDF 输出到 `output/` 目录。

---

## 项目结构

```
menu-designer/
├── index.html              ← Gallery 索引页（主题切换 + 布局切换 + 双格式预览）
├── wall-menu.html          ← 墙面菜单（1250×600 横版）
├── a4-menu.html            ← A4 立牌菜单（210×297 竖版）
├── css/
│   ├── base.css            ← 共享：变量、reset、组件样式
│   ├── themes.css          ← 5 套季节主题定义
│   ├── wall-menu.css       ← 墙面菜单专属布局 + 布局变体 + @page landscape
│   └── a4-menu.css         ← A4 菜单专属布局 + 布局变体 + @page portrait
├── js/
│   └── theme-switcher.js   ← 主题/布局切换 + localStorage + postMessage
├── scripts/
│   └── generate-pdf.js     ← Puppeteer PDF 导出工具
├── imgs/                   ← 产品摄影与品牌素材
├── docs/
│   ├── PRD.md              ← 产品需求文档
│   ├── 动径咖啡店铺菜单 - 当前菜单.csv  ← 菜单数据源（唯一）
│   └── ...                 ← 品牌资产文档
├── output/                 ← PDF 导出输出目录（git ignored）
├── .claude/
│   └── commands/
│       └── 更新菜单.md     ← Claude Code 斜杠命令：CSV → HTML 同步
├── package.json            ← npm 脚本（PDF 导出）
└── README.md
```

---

## 菜单格式

### 墙面菜单 (wall-menu.html)

| 属性 | 值 |
|------|------|
| 画布尺寸 | 1250 × 600 px |
| 印刷尺寸 | 125 cm × 60 cm |
| 像素映射 | 1 mm = 1 px |
| 预览缩放 | `scale(0.75)` |
| `@page` | `1250mm × 600mm landscape` |
| 布局 | 三栏横排 |

```
┌─ Header 66px ─────────────────────────────────────────┐
├──────────┬────────────────┬───────────────────────────┤
│ Col 1    │ Col 2          │ Col 3                     │
│ 290px    │ 430px          │ flex:1 (≈530px)           │
│ 季节限定  │ 动径特调        │ 经典日常    │ 自行车租赁  │
│          │ 能量组合        │ 非咖啡类    │             │
├──────────┴────────────────┴───────────────────────────┤
└─ Footer 26px ─────────────────────────────────────────┘
```

### A4 立牌菜单 (a4-menu.html)

| 属性 | 值 |
|------|------|
| 画布尺寸 | 210 × 297 px |
| 印刷尺寸 | 21 cm × 29.7 cm (A4) |
| 像素映射 | 1 mm = 1 px |
| 预览缩放 | `scale(3.5)` |
| `@page` | `210mm × 297mm portrait` |
| 阅读距离 | 30–50 cm（桌面立牌） |

```
┌──────────────────────────────────┐
│  HEADER                          │
├──────────────────────────────────┤
│  季节限定（横排 3 卡）            │
├──────────────────────────────────┤
│  动径特调（2×4 网格）             │
├──────────────────────────────────┤
│  能量组合（横排 3 卡）            │
├───────────────┬──────────────────┤
│ 经典日常       │ 非咖啡类          │
├───────────────┴──────────────────┤
│  自行车租赁（全宽横条）           │
├──────────────────────────────────┤
│  FOOTER                          │
└──────────────────────────────────┘
```

### Gallery 索引页 (index.html)

- 通过 `<iframe>` 嵌入两个菜单的缩放预览
- 主题切换器：5 套季节主题实时切换
- 布局切换器：每个菜单独立的 Layout A/B 切换按钮
- 每个格式卡片下方有「查看原尺寸」和「导出 PDF」按钮
- 导出 PDF 弹窗引导用户使用 CLI 命令
- 需通过 HTTP 服务预览（`python3 -m http.server`）

---

## 季节主题系统

### 双层变量架构

- **品牌基底层** `--orange`：Header/Footer 边框、标语颜色——永不变
- **主题可变层** `--accent`：季节卡片、特调价格、组合 badge——随季节切换

### 5 套主题

| 主题 | `data-theme` | `--accent` | 色值 |
|------|-------------|-----------|------|
| 默认 | `default` | 品牌橙 | `#f05f22` |
| 春节 | `cny` | 中国红 | `#d4382a` |
| 春天 | `spring` | 多巴胺粉 | `#e85d9a` |
| 夏天 | `summer` | 薄荷青 | `#2dbbab` |
| 秋天 | `autumn` | 焦糖琥珀 | `#c87e3a` |

### 切换方式

- **Gallery 页面**：点击主题色块按钮
- **控制台**：`MenuTheme.apply('cny')` 或 `localStorage.setItem('menu-theme','summer')`
- **持久化**：通过 localStorage，刷新后保持

---

## 布局变体系统

主题全局共享（`data-theme`）、布局各菜单独立（`data-layout`），纯 CSS 实现。

### 墙面菜单 Layout A vs B

| 属性 | Layout A（默认） | Layout B（特调优先） |
|------|-----------------|-------------------|
| 列顺序 | 季节限定 → 特调 → 经典 | 特调 → 季节限定 → 经典 |
| 特调网格 | 2 列 (430px) | 3 列 (480px) |
| 季节限定列宽 | 290px | 250px |
| 组合卡方向 | 纵向堆叠 | 横向并排 |

### A4 菜单 Layout A vs B

| 属性 | Layout A（默认） | Layout B（双栏紧凑） |
|------|-----------------|-------------------|
| 主体布局 | flex 纵向堆叠 | CSS Grid 双栏 (115px + 95px) |
| 季节限定卡 | 横向 3 卡 | 纵向 3 卡 |
| 特调+组合 | 独立区块 | 与季节限定同列（左栏） |
| 经典+非咖啡+租赁 | 横排双列 | 右栏纵向堆叠 |

### 切换方式

- **Gallery 页面**：每个菜单卡片标题旁的 Layout A/B 切换按钮
- **控制台**：`MenuLayout.apply('b')` / `MenuLayout.current()`
- **持久化**：`wall-layout` / `a4-layout` 存储在 localStorage

---

## 色彩系统

| Token | 值 | 用途 |
|-------|------|------|
| `--bg` | `#111111` | 主背景 |
| `--surface` | `#1a1a1a` | 卡片/组合背景 |
| `--surface-2` | `#222222` | 分类栏背景 |
| `--orange` | `#f05f22` | 品牌主色（不可变） |
| `--accent` | 主题色 | 季节强调色（可变） |
| `--accent-dim` | 主题色 12% | 强调底色（可变） |
| `--text-1` | `#ffffff` | 主文字 |
| `--text-2` | `#cccccc` | 次要文字 |
| `--text-3` | `#888888` | 辅助文字 |
| `--divider` | `rgba(255,255,255,0.08)` | 分割线 |

---

## 字体

| 字体 | 用途 |
|------|------|
| Noto Sans SC 300/400/500/700 | 中文正文 |
| Bebas Neue | 英文标题、价格、标签 |

---

## 字号体系

### 墙面菜单

| 层级 | 字号 | 使用场景 |
|------|------|----------|
| XL | 17 px | 特调价格、高亮 badge |
| L | 15–16 px | 季节限定价格、价目表价格 |
| M | 13 px | 菜品中文名、分类标题 |
| S | 10–12 px | 英文名、描述、价目表菜名 |
| XS | 9 px | 卡片描述、标签、footer 副文字 |

### A4 立牌菜单

| 元素 | A4 尺寸 |
|------|---------|
| 分类标题中文 | 5 px |
| 分类标题英文 | 4 px |
| 品名中文 | 5 px |
| 品名英文 | 3.5 px |
| 描述 | 3 px |
| 价格 (Bebas) | 5–6 px |
| Footer | 3 px |

---

## 数据源

菜单内容的**唯一数据源**为 `docs/动径咖啡店铺菜单 - 当前菜单.csv`，包含 33 行数据覆盖 6 个类别。

### 推荐流程：使用 `/更新菜单` 命令

在 Claude Code 中执行 `/更新菜单`，自动完成 CSV 解析 → 差异对比 → 用户确认 → 双 HTML 同步。

```
/更新菜单
```

### 手动流程

1. 修改 CSV 中的品名、价格、描述等字段
2. 参照 [`CLAUDE.md`](CLAUDE.md) 中的映射表，定位 HTML 中对应元素
3. **同时更新** `wall-menu.html` 和 `a4-menu.html` 中的文本内容
4. 浏览器预览验证效果

### 数据一致性原则

- CSV 是唯一真实数据源，HTML 内容必须与 CSV 保持一致
- 每次变更必须同时更新两个 HTML 文件
- 详细映射关系见 [`CLAUDE.md`](CLAUDE.md)

---

## 品牌资产

`docs/` 目录包含完整品牌资产：

- 6 款官方 SVG Logo（白/黑/圆形/文字/门头黑/门头橙）
- VI 识别指南 PDF
- 菜单文案与定价策略文档

---

## License

Private — 仅限动径 MovePath 内部使用。
