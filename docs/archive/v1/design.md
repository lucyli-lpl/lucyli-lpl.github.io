# design.md — lucyli-lpl 个人站点 界面规范

版本 v1.0 · 2026-09-05
配套文档：`PRD.md`（页面需求）、`tech.md`（数据与实现）
本文档面向负责界面的 AI（v0 / Lovable / Claude Code 等）。它**不包含数据来源**——所有内容假定以结构化数据传入组件；数据字段名与 `tech.md` 内容契约一致。

---

## 0. 交付要求

- 产出物：一套可直接迁移进 Astro 的组件（HTML + CSS，允许极少量原生 JS；不引入 React / Vue / Tailwind 运行时）。若执行环境只能产出 React，请保证每个组件是无状态纯展示组件，且样式用 CSS 变量而非工具类。
- 必须先产出 `tokens.css`（§2），所有组件只引用变量，不写裸色值。
- 组件与页面的命名必须使用本文档的名字（§4、§5），技术侧会按名字集成。
- 字体：Google Fonts CDN 引入 Noto Serif SC、Inter、JetBrains Mono。

## 1. 设计方向

### 1.1 基调
延续作者 visual-library 中 **scholar（克制学术风）** 的底子，做成站点变体：暖白纸面、衬线中文标题、无框卡片、克制的语义色。整体感觉像一本排版讲究的工作手册，不像 SaaS 产品页。

### 1.2 硬性禁止
- 不做深色模式、不用深色大面积背景（verdict 卡是唯一允许的深色块）
- 不用科技蓝渐变、霓虹、玻璃拟态、发光描边
- 不用 `#F4F1EA` 一类奶油底和 `#D97757` 一类珊瑚 / 陶土强调色
- 不用 emoji；图标仅允许线性单色图标（建议 Lucide），且只在导航、按钮、元数据处使用
- 不用统一投影的卡片网格作为主布局；卡片默认无阴影，用边框和留白分隔
- 不做进场动画、视差；允许 hover 状态过渡 ≤ 150ms

### 1.3 层级原则
scholar 为单篇报告设计，站点需要更多层级。规则：
- 页面 ≤ 3 个字号层级同时可见（标题 / 正文 / 元数据）
- 用**留白和边框**分区，不用背景色块分区
- 强调靠字重和衬线 / 无衬线切换，不靠颜色
- 颜色只承载语义（链接、状态、callout 类型），不承载装饰

## 2. Tokens（`tokens.css`）

```css
:root {
  /* 色彩 — 继承 scholar */
  --ink:          #1a1a1a;
  --paper:        #fafaf7;
  --paper-2:      #f3f3ef;   /* 次级底：代码块、iframe 容器、空状态 */
  --accent:       #2563eb;   /* 仅用于链接、当前导航、pattern status=evolving */
  --accent-light: #dbeafe;
  --warm:         #c2410c;   /* 风险、警告、status=concept */
  --warm-light:   #fff7ed;
  --green:        #166534;   /* 建议、行动、status=converging */
  --green-light:  #f0fdf4;
  --gray-100:     #f3f4f6;
  --gray-200:     #e5e7eb;
  --gray-300:     #d1d5db;
  --gray-500:     #6b7280;
  --gray-700:     #374151;
  --border:       #d1d5db;

  /* 字体 */
  --font-display: "Noto Serif SC", "Songti SC", serif;
  --font-body:    "Inter", -apple-system, "PingFang SC", "Noto Sans SC", sans-serif;
  --font-mono:    "JetBrains Mono", "SF Mono", Menlo, monospace;

  /* 字号 */
  --fs-h1: 2rem;      /* 页面标题 */
  --fs-h2: 1.4rem;    /* 区块标题 / 文章 h2 */
  --fs-h3: 1.05rem;   /* 卡片标题 / 文章 h3 */
  --fs-body: 0.95rem;
  --fs-meta: 0.8rem;
  --fs-tag: 0.7rem;
  --lh-body: 1.75;

  /* 间距（8 基准） */
  --sp-1: 0.5rem; --sp-2: 1rem; --sp-3: 1.5rem; --sp-4: 2rem;
  --sp-6: 3rem;  --sp-8: 4rem;

  /* 布局 */
  --w-prose: 780px;   /* 正文容器 */
  --w-wide:  1080px;  /* 列表 / 首页 / 带侧栏页面 */
  --w-side:  220px;   /* ChapterNav 侧栏 */
  --radius:  4px;     /* 全站统一，不做大圆角 */
}
```

断点：`sm ≤ 640px`、`md ≤ 900px`、`lg > 900px`。侧栏在 `md` 及以下折叠为顶部横向目录。

## 3. 全局骨架

### 3.1 Header（`SiteHeader`）
- 高度 56px，底部 1px `--border`，背景 `--paper`，sticky
- 左：站点标识 `lucyli-lpl`，`--font-mono` 500 weight，`--fs-body`；不用 logo 图
- 中：6 项导航，`--font-body` 500，当前项下划线 2px `--ink`（不用颜色高亮）；`sm` 折叠为汉堡菜单
- 右：搜索入口（图标 + "搜索" 文本，`sm` 只显示图标）、GitHub 图标链接
- 搜索点击后弹出全宽搜索层（Pagefind 默认 UI 即可，覆盖样式到 tokens）

### 3.2 Footer（`SiteFooter`）
- 上方 1px `--border`，`--fs-meta` `--gray-500`
- 左：`© 2026 lucyli-lpl · 内容以 CC BY-NC-SA 4.0 共享`（文案由作者确认）
- 右：GitHub · 飞书 · RSS 三个文字链接
- 不放站点地图、不放多列

### 3.3 容器
- `Container.prose`：max-width `--w-prose`，用于文章正文
- `Container.wide`：max-width `--w-wide`，用于列表、首页、带侧栏页
- `Layout.sidebar`：`wide` 内两栏，主栏 + `--w-side` 右侧栏，gap `--sp-6`

### 3.4 面包屑（`Breadcrumb`）
- `--font-mono` `--fs-meta` `--gray-500`，分隔符 `/`，最后一级不可点击
- 二级及以下页面显示，紧贴页首上方

## 4. 组件清单

每个组件给出：用途、结构、状态、响应式。数据字段名见括号。

### 4.1 `PageHeader`
页面顶部标识区，所有页面复用。
- 结构：Kicker（`--font-mono` `--fs-meta` 大写字母间距 0.08em，例如 `PATTERN · EVOLVING`）→ h1（`--font-display` 700）→ 副标题（`--font-body` `--gray-700`，可选）→ MetaRow（一行元数据，`--font-mono` `--fs-meta`，项目间用 `·` 分隔）
- 下方 `--sp-4` 留白，无分隔线

### 4.2 `Tag`
- 内联小标签，`--font-mono` `--fs-tag`，1px 边框 `--gray-300`，padding 2px 8px，`--radius`
- 变体：`neutral`（默认）、`status`（见 §4.3 色映射）、`type`（用于"最近更新"里的 collection 类型，纯文字 + 左侧 4px 方块色标）
- 可点击时 hover 边框变 `--ink`

### 4.3 `StatusBadge`
pattern 状态专用，四个值固定映射，不可新增颜色：

| status | 文字 | 前景 / 背景 |
|---|---|---|
| concept | 概念期 | `--warm` / `--warm-light` |
| landed | 已落地 | `--ink` / `--gray-100` |
| evolving | 进化中 | `--accent` / `--accent-light` |
| converging | 趋同期 | `--green` / `--green-light` |

### 4.4 `Card`
无阴影、1px `--border`、padding `--sp-3`、`--radius`；整卡可点击时 hover 边框 `--ink`。
变体：
- `Card.module`（方法论模块）：编号（`--font-mono`，如 `01`）、模块名（`--font-display` 600）、一句话、底部 MetaRow（`N 章 · N 个关联 skill · 更新 YYYY-MM-DD`）
- `Card.pattern`（列表用行式，非卡片）：见 §4.9 `ListRow`
- `Card.case`（品鉴 / 公司拆解）：产品名 + 公司（`--font-display` 600）、一句话结论（斜体不要，用 `--gray-700`）、Tag 行（涉及 pattern）、MetaRow（发布 / 分析日期）
- `Card.skill`（SkillCard）：名称（`--font-mono` 600）、一句话、MetaRow（来源仓库 · 所属模块）、底部小字"站内产出 N 条"
- `Card.preset`（PresetCard）：顶部预览图（16:10，`object-fit: cover`，1px 边框）、名称 + 中文名、一句话、Tag 行
- `Card.note`：标题（`--font-display` 600）、日期、摘要两行截断

### 4.5 `Callout`
文章内语义块，与 scholar 一致：左侧 3px 色条 + 浅底。
- `info`（`--accent` / `--accent-light`）、`warn`（`--warm` / `--warm-light`）、`action`（`--green` / `--green-light`）
- 标题行可选，`--font-body` 600
- 由 markdown 中的 `> [!info]` 等语法生成（技术侧处理）

### 4.6 `Verdict`
结论卡：背景 `--ink`，文字 `--paper`，`--font-display` 600，padding `--sp-4`。全站唯一深色块；一页最多一个。用于品鉴页首的一句话结论、方法论模块页的核心命题。

### 4.7 `Timeline`
纵向时间线，用于方法论迭代记录、pattern Evolution Log。
- 左轴 1px `--gray-200`，节点 8px 实心圆 `--ink`
- 每节点：日期 / 版本（`--font-mono` `--fs-meta`）、driver 或类型 Tag（可选）、标题（`--font-body` 600）、正文、影响模块 Tag 行（可选）
- 节点间距 `--sp-4`

### 4.8 `ChapterNav`
文章目录侧栏。
- `lg`：右侧 sticky，top 80px，`--fs-meta`，当前章节左侧 2px `--ink` 指示；二级条目缩进 `--sp-2`
- `md` 及以下：折叠为正文顶部一个可展开的"目录"块，展开后为纵向列表
- 使用原生 IntersectionObserver 高亮当前章节，允许 JS

### 4.9 `ListRow`
pattern 列表用的行式布局（不用卡片）。
- 一行：pattern 英文名（`--font-body` 600）+ 中文名（`--gray-500`）| StatusBadge | heat（用 `●●●●○` 五格，`--font-mono`）| first_seen | 产品数 | Tag 行（`sm` 隐藏）
- 行之间 1px `--gray-200`，hover 整行底色 `--paper-2`
- 顶部一行过滤 Tag（全部 / 四个 status），纯前端切换，允许 JS

### 4.10 `Prose`
markdown 正文样式，全站文章页共用。规则继承 scholar：
- h2 `--font-display` 700 + 底部 1px 边框；h3 `--font-body` 600
- 正文 `--fs-body` / `--lh-body`；段间距 `--sp-2`
- 表格：`thead` 底 `--gray-100`，边框 `--border`，`sm` 下容器横向滚动
- 代码：行内 `--font-mono` 底 `--gray-100`；块级 `--paper-2` 底，无高亮主题的强色
- 链接：`--accent`，下划线 1px 偏移 3px；站内 pattern 链接额外用 `--font-mono` 呈现
- 图片 / SVG：宽度 100%，可选 `figcaption` `--fs-meta` `--gray-500`
- 引用块：左 3px `--gray-300`，`--gray-700`

### 4.11 `EmptyState`
空 collection 或空分组：`--paper-2` 底，padding `--sp-6`，居中，`--font-display` 600 一句标题（如"公司拆解 · 筹备中"）+ 一行说明（`--gray-500`）。不放插图。

### 4.12 `UpdateFeed`
首页最近更新流。每条一行：type Tag（§4.2）| 标题 | 日期（右对齐 `--font-mono`）。8 条，行间 1px `--gray-200`。

### 4.13 `InstallBlock`
skill 页安装说明，两个 Tab（Claude 桌面 / 网页 · Claude Code），Tab 用下划线切换，内容为代码块。允许 JS 切换；无 JS 时两段全部展示。

### 4.14 `PreviewFrame`
视觉库 preset 预览：`--paper-2` 底容器，内嵌 iframe（宽 100%，高 640px，`sm` 480px），右上角"新窗口打开"文字链接。

## 5. 页面线框

按区块自上而下描述。所有页面 = `SiteHeader` + 内容 + `SiteFooter`。

### 5.1 首页 `/`（`Container.wide`）
1. Hero：左对齐。`--font-mono` kicker `AI PM · 方法论 / 观察 / 工具`，h1 站点标识或一句话定位（`--font-display`，2.4rem 允许超出 h1 token），一段 2 行说明，两个按钮（主：黑底白字"读方法论"；次：边框"看观察"）。右侧留空，不放图。
2. 方法论概览：区块标题 h2 "方法论" + 右侧"全部 →"；`Card.module` 三列网格（`md` 两列，`sm` 一列），最多 6 张。
3. 最近更新：h2 "最近更新"；`UpdateFeed`。
4. 工具箱速览：h2 "工具箱"；`Card.skill` 横向一行（`sm` 纵向），最多 4 张，"全部 →"。
5. 底部一行：`视觉库 N 个 preset · 笔记 N 篇`，文字链接，`--fs-meta`。

### 5.2 方法论列表 `/methodology/`（`Container.wide`）
1. `PageHeader`：kicker `METHODOLOGY · v2.1`，h1 "AI 应用能力边界方法论"，副标题 = 一句话内核，MetaRow（模块数 · 最近更新 · GitHub 链接）
2. `Verdict`：核心命题（"能力三区不是难度分级，而是三种产品承诺"）
3. "从哪读起"：一张两列表，`Prose` 样式
4. 模块列表：`Card.module` 两列网格（`sm` 一列），按编号排列
5. 迭代记录入口：一行 `Card` 变体——左"迭代记录 v1 → v2.1"，右"N 个版本 · 最近 YYYY-MM"，整卡可点

### 5.3 方法论模块页 `/methodology/[module]/`（`Layout.sidebar`）
主栏：
1. `Breadcrumb`：方法论 / 模块名
2. `PageHeader`：kicker `MODULE 03`，h1 模块名，副标题一句话，MetaRow（章节数 · 所属版本）
3. 模块示意图：SVG，宽度 100%，下方 figcaption
4. `Prose` 正文（各章节顺序拼接，章节 h2 带编号锚点）
5. 底部：上一模块 / 下一模块 两个链接，左右分布
侧栏（sticky）：
- `ChapterNav`
- "关联 skill"：Tag 列表（`--font-mono`）
- "被引用于"：品鉴 / pattern 标题列表（反链，为空时不显示该区）

### 5.4 迭代记录 `/methodology/changelog/`（`Container.prose`）
1. `Breadcrumb`
2. `PageHeader`：h1 "迭代记录"，副标题 "v1 → v2.1，每一步校正都有据可查"
3. `Timeline`：每节点版本号 + 日期 + 变更摘要 + 影响模块 Tag

### 5.5 观察分组页 `/observations/`（`Container.wide`）
三个区块纵向排列，每块：h2（collection 名 + 右侧计数 + "全部 →"）、一句说明、最新 3 条（pattern 用 `ListRow`，品鉴 / 拆解用 `Card.case` 三列）。空 collection 用 `EmptyState`。

### 5.6 pattern 列表 `/patterns/`（`Container.wide`）
1. `Breadcrumb`
2. `PageHeader`：kicker `PATTERNS`，h1 "AI 设计模式追踪"，副标题定位句，MetaRow（N 个 pattern · 最后扫描 YYYY-MM-DD · GitHub）
3. 过滤 Tag 行
4. `ListRow` 列表

### 5.7 pattern 详情 `/patterns/[slug]/`（`Layout.sidebar`）
主栏：
1. `Breadcrumb`
2. `PageHeader`：kicker `PATTERN · {status}`，h1 `{pattern_name}`，副标题 `{chinese_name}`，MetaRow（heat ●●●●○ · first seen · originated by），Tag 行（tags），"关联模式"一行链接
3. `Prose` 正文；其中 Evolution Log 段改用 `Timeline` 渲染
4. 底部"被提到的品鉴"（反链列表，`Card.case` 或简单链接列表）
侧栏：`ChapterNav`（Definition / Implementations / Evolution Log / PM Notes 四段）

### 5.8 品鉴列表 `/tastings/`（`Container.wide`）
1. `Breadcrumb`
2. `PageHeader`：kicker `TASTINGS`，h1 "AI 产品品鉴"，副标题一句，MetaRow（N 篇 · 框架：ai-product-tasting → 链接）
3. `Card.case` 两列网格（`sm` 一列）

### 5.9 品鉴详情 `/tastings/[slug]/`（`Layout.sidebar`）
主栏：
1. `Breadcrumb`
2. `PageHeader`：kicker `TASTING · {company}`，h1 `{product}`，MetaRow（产品发布 · 分析日期 · 框架 vX）
3. `Verdict`：一句话结论
4. `Prose` 正文，章节 h2 带编号
5. 底部：涉及 pattern Tag 行 + "使用的框架"链接
侧栏：`ChapterNav`（章节列表，固定显示）

`/anatomies/` 列表与详情同 5.8 / 5.9，kicker 改 `ANATOMY`。

### 5.10 工具箱 `/skills/`（`Container.wide`）
1. `PageHeader`：kicker `SKILLS`，h1 "工具箱"，副标题"可安装到 Claude 的 skill，每个都在站内有对应产出"
2. `Card.skill` 两列网格

### 5.11 skill 详情 `/skills/[slug]/`（`Container.prose`）
1. `Breadcrumb`
2. `PageHeader`：kicker `SKILL · {repo}`，h1 名称（`--font-mono` 700，这一页例外不用衬线），MetaRow（所属模块 · GitHub 直达 SKILL.md）
3. `InstallBlock`
4. h2 "这个 skill 做什么" → `Prose`（SKILL.md 正文）
5. h2 "站内产出" → 链接列表（为空则不显示）

### 5.12 视觉库 `/presets/`（`Container.wide`）
1. `PageHeader`：kicker `VISUAL LIBRARY`，h1 "视觉库"，副标题"按输出类型组织的视觉风格 preset，供 skill 生成 HTML 时加载"
2. 每个输出类型一个区块：h2 类型名（`--font-mono`）+ 一行硬约束摘要（来自 `_README.md`，`--gray-500`）；`Card.preset` 三列网格（`md` 两列，`sm` 一列）；空类型 `EmptyState`

### 5.13 preset 详情 `/presets/[slug]/`（`Container.prose`）
1. `Breadcrumb`
2. `PageHeader`：kicker `PRESET · {output_type}`，h1 `{preset_name}` + 副标题 `{chinese_name}`，MetaRow（origin · GitHub），Tag 行
3. `PreviewFrame`
4. `Prose`（TOKENS.md 正文，色板代码块保留）
5. Callout `info`："如何使用：安装 visual-library skill →"

### 5.14 笔记 `/notes/` 与 `/notes/[slug]/`
列表：`Container.prose`，`PageHeader` + 纵向 `Card.note` 列表（无网格）。
详情：`Container.prose`，`Breadcrumb` + `PageHeader`（kicker `NOTE · YYYY-MM-DD`）+ `Prose`；侧栏无。

### 5.15 关于 `/about/`（`Container.prose`）
1. `PageHeader`：h1 "关于"
2. `Prose` 介绍段
3. h2 "联系"：飞书二维码图片（最大宽 200px，1px 边框）+ GitHub 链接
4. h2 "本站由这些仓库构建"：三行（仓库名 `--font-mono` + 一句话 + 链接）

### 5.16 搜索层与 404
- 搜索层：全屏覆盖，`--paper` 底 95% 不透明，顶部输入框（`--font-body` 1.2rem，无边框只有底线），结果列表 = 标题 + collection Tag + 摘要片段
- 404：`Container.prose`，h1 "没有这一页"，一行说明，返回首页链接

## 6. 响应式与可访问性

- 所有网格在 `sm` 退化为单列；`Layout.sidebar` 在 `md` 退化为单列且 `ChapterNav` 折叠到顶部
- 表格 `sm` 下容器横向滚动，不折行破坏结构
- 触控目标 ≥ 40px
- 颜色对比：正文 `--ink` on `--paper` ≥ 12:1；`--gray-500` 仅用于元数据，不用于正文
- 所有交互（过滤、Tab、目录高亮）在无 JS 时有可用退化
- 图片、SVG 必须有 `alt`；iframe 有 `title`
- 语言标记 `lang="zh-CN"`，英文术语不需单独标记

## 7. 文案约束（写给组件内的固定文案）

- 中文表述，英文术语保持原文，不翻译：pattern、skill、preset、token、computer use、shared agent、MCP、LLM、Claude Code 等
- 不用感叹号，不用"！"，不用 emoji
- 空状态文案模板：`{collection 名} · 筹备中` / `这个类型还没有 preset`
- 按钮动词简短：读方法论、看观察、全部、新窗口打开
