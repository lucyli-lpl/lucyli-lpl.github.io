# PRD — lucyli-lpl 个人站点

版本 v1.0 · 2026-09-05 · 作者：品璐（lucyli-lpl）
配套文档：`design.md`（界面与视觉）、`tech.md`（架构、内容契约、实施）
三份文档通过 **collection 名** 和 **组件名** 相互对齐；执行 AI 只拿到其中一份也应能完成对应部分的工作。

---

## 0. 一句话

一个由多个 GitHub 内容仓库驱动的静态站点，把作者散落在各处的 AI PM 方法论、观察分析（pattern 追踪 / 产品品鉴 / 公司拆解）、Claude skill 和视觉模板库汇总成一个**可浏览、可分享、可持续更新**的知识工作台。

## 1. 背景与目标

### 1.1 现状
内容资产分布在四处：
- GitHub 仓库 `ai-design-patterns`（pattern 库 + pattern-tracker skill + visual-library skill）
- GitHub 仓库 `ai-business-anatomy`（ai-product-tasting / ipo-archaeology / auto-analysis 三个 skill，以及一篇 Claude Tag 品鉴案例）
- GitHub 仓库 `ai-pm-fieldbook`（AI 应用能力边界方法论 v2.1，单文件约 1000 行，含 v1→v2.1 迭代记录）
- 本地 / Claude 环境（未发布的品鉴 markdown、零散笔记）

它们各自能用，但没有一个入口能看到全貌，也没有一个地方能让作者"再看一遍自己的体系"。

### 1.2 目标（按优先级）
1. **作者自用**：一个随时可以打开的"我的体系"视图——方法论分模块可导航、可看到演进；观察类内容可回溯；skill 和视觉模板一目了然。
2. **可分享**：任何一个页面都可以直接丢给同行 / 面试官，对方不需要上下文就能看懂这是什么、能拿走什么。
3. **可持续**：作者在原内容仓库 push 一次 markdown，站点自动更新；新增一个内容类别不需要改布局代码。

### 1.3 成功标准
- 作者每周至少打开一次自己的站点用于回看或找东西（自用是第一目标）
- 新增一篇 pattern / 品鉴 / 笔记，从 push 到上线 ≤ 10 分钟，无需人工干预
- 新增一个 collection（例如"公司拆解"从 0 到有第一篇）只需：加一份配置 + 内容仓库里加一个目录
- 全站任何页面在 375px 手机宽度下可读，无横向滚动（表格除外）

## 2. 读者与使用场景

| 读者 | 优先级 | 典型场景 | 对站点的要求 |
|---|---|---|---|
| 作者本人 | P0 | 写新内容前回看方法论某模块；给 pattern 加演化记录后确认展示；找某个 skill 的安装说明发给同事 | 导航快、搜索可用、内容结构忠实于仓库 |
| 同行 / 社区 | P1 | 通过某篇品鉴或 pattern 页进站，顺着链接读方法论，想安装 skill | 单页可独立成立；skill 页有清晰的 GitHub 链接 + 安装说明；有联系入口 |
| 面试官 / 招聘方 | P2（顺带） | 从简历链接进首页，5 分钟内判断作者的系统思考能力和产出深度 | 首页能展示"在持续做什么"和产出规模；关于页有简短介绍 |

**表达语言**：中文表述，社区公认的英文术语、缩写、产品名、原生 slogan 保持英文（token、computer use、shared agent、LLM、Claude Tag、MCP 等），不强行翻译，不做全站双语切换。

## 3. 非目标（v1 明确不做）

- 不做交互式"能力雷达"仪表盘（筛选器、时间轴拖动等）；pattern 以列表 + 详情页呈现
- 不做评论系统；联系方式仅飞书二维码 + GitHub
- 不做全站中英双语版本
- 不放公司项目（百胜、Citi）内容；不放尚无成品的个人项目
- 不做实时资讯聚合；站点内容全部是作者的分析与沉淀，按作者节奏更新
- 不做用户系统、后台、CMS；内容源只有 git 仓库
- 不做深色模式

## 4. 内容模型

### 4.1 核心抽象：collection
全站只有一种内容单元叫 **collection**。每个 collection 由一份配置定义：内容来自哪个仓库的哪个目录、frontmatter 字段是什么、用哪套列表页 / 详情页模板渲染。"模块"就是 collection 的展示层叫法。这是保证"加新类别不改布局代码"的唯一机制，`tech.md` 给出具体实现。

### 4.2 collection 清单

| key | 展示名 | 来源仓库 / 路径 | v1 状态 | 条目单位 |
|---|---|---|---|---|
| `methodology` | 方法论 | `ai-pm-fieldbook` / `methodology/` | 有内容，需先梳理成模块（见 §7） | 一个模块 = 一个目录 |
| `patterns` | pattern 追踪 | `ai-design-patterns` / `patterns/` | 有内容（2 篇） | 一个 pattern = 一个 md |
| `tastings` | 产品品鉴 | `ai-business-anatomy` / `cases/tastings/` | 有内容（Claude Tag，4 章，实施时上传） | 一个案例 = 一个目录（多章） |
| `anatomies` | 公司拆解 | `ai-business-anatomy` / `cases/anatomies/` | 空，预留 | 一个案例 = 一个目录 |
| `skills` | 工具箱 | 各仓库的 `skills/*/SKILL.md` | 有内容（5 个 skill） | 一个 skill = 一个 SKILL.md |
| `presets` | 视觉库 | `ai-design-patterns` / `skills/visual-library/presets/` | 有内容（1 个 preset） | 一个 preset = 一个目录 |
| `notes` | 笔记 | 站点仓库 / `content/notes/` | 空，随写随发 | 一篇 = 一个 md |

**空 collection 规则**：条目数为 0 的 collection 自动从导航和首页隐藏，其列表页路由仍存在但显示空状态。不需要人工开关。

### 4.3 导航结构

一级导航固定 6 项，顺序即优先级：

```
方法论 · 观察 · 工具箱 · 视觉库 · 笔记 · 关于
```

- **观察** 是一个分组页，下辖 `patterns` / `tastings` / `anatomies` 三个 collection
- 其余每项对应一个 collection 或一个静态页
- 未来新增 collection 时，配置里声明它属于哪个一级导航项（或新增一项）

## 5. 页面需求

每个页面按"读者要看到什么 → 页面包含什么 → 交互"描述。组件名与 `design.md` 一致。

### 5.1 首页 `/`
读者要在一屏内知道：这个人在持续做什么、有多少产出、从哪进。
- Hero：站点标识 `lucyli-lpl`、一句话定位（"企业 AI PM 的方法论、观察与工具沉淀"或作者提供的文案）、两个入口按钮（方法论 / 观察）
- 方法论概览：模块卡片网格（每张卡：模块名、一句话、章节数、最近更新），点击进模块页
- 最近更新流：跨 collection 混排，取最近 8 条（pattern 演化记录、新品鉴、新笔记都算"更新"），每条显示类型标签 + 标题 + 日期
- 工具箱速览：skill 卡片一行（名称 + 一句话），"查看全部"
- 页脚：GitHub、飞书、RSS

### 5.2 方法论

**模块列表页 `/methodology/`**
- 页首：方法论名称（AI 应用能力边界方法论）、当前版本号（读自内容仓库）、一句话内核
- "从哪读起"表：按阶段导读（内容来自仓库 README，作为一个 md 片段渲染）
- 模块卡片列表：按顺序排列，每张卡显示模块编号、名称、一句话、包含的章节数、关联 skill 数
- 迭代记录入口：链接到时间线页

**模块详情页 `/methodology/[module]/`**
- 页首：模块编号 + 名称 + 一句话 + 所属版本
- 模块示意图：一张静态 SVG（内容仓库提供），放在正文前
- 正文：该模块下的章节顺序拼接，或按章节分页（章节 ≥ 4 时右侧显示章节目录 ChapterNav）
- 侧栏 / 底部："关联 skill"（配置声明）、"关联案例"（品鉴或 pattern 中引用了本模块的条目，自动反链）
- 上一模块 / 下一模块 导航

**迭代记录页 `/methodology/changelog/`**
- 纵向时间线：v1 → v2.1 每个版本一个节点，显示版本号、日期（若有）、变更摘要、影响的模块（配置或 frontmatter 声明）
- 这是方法论"活着"的证据，需要在模块列表页有醒目入口

### 5.3 观察

**分组页 `/observations/`**
- 三个 collection 各一个区块：名称、一句话说明、条目数、最新 3 条；空 collection 显示"筹备中"文案，不显示条目

**pattern 列表页 `/patterns/`**
- 页首说明：这是什么（pattern 库定位一句话）、当前条目数、最后扫描日期（读自 INDEX.md）
- 列表：每行 pattern 英文名 + 中文名、status 徽章（concept / landed / evolving / converging）、heat、first_seen、产品数、tags
- 可按 status 过滤（纯前端、无需服务端）

**pattern 详情页 `/patterns/[slug]/`**
- 页首：pattern_name、chinese_name、status 徽章、heat、first_seen、originated_by、tags、related_patterns（链接）
- 正文：按仓库 DATA_SCHEMA 的段落结构渲染（Definition / Implementations / Evolution Log / PM Notes），每段一个锚点，ChapterNav 可跳转
- Evolution Log 段以时间线组件渲染（日期 + driver 类型徽章 + 描述）
- 反链区："提到此 pattern 的品鉴"（自动）

**品鉴列表页 `/tastings/`**
- 卡片列表：产品名、公司、发布日期、分析日期、一句话结论、涉及的 pattern 标签
- 顶部说明：链接到 ai-product-tasting skill 页（"这些分析用这个框架产出"）

**品鉴详情页 `/tastings/[slug]/`**
- 页首：产品名、公司、产品发布日期、分析日期、框架版本、一句话结论（verdict 卡）
- 正文：多章节顺序渲染，ChapterNav 固定显示章节列表
- 章节内出现 pattern 名时可链到 pattern 页（实现见 tech.md）
- 底部：涉及的 pattern 列表、使用的框架（skill 链接）

**公司拆解列表 / 详情页 `/anatomies/`**
- 结构同品鉴，字段见 tech.md 内容契约；v1 为空状态

### 5.4 工具箱 `/skills/`
- 列表页：每个 skill 一张 SkillCard——名称、一句话、来源仓库、所属方法论模块（若有）、"在站内产出了什么"（例如 ai-product-tasting → N 篇品鉴）
- 详情页 `/skills/[slug]/`：
  - 页首：名称、一句话、GitHub 链接（直达 SKILL.md）
  - 安装说明：固定模板（Claude 环境 user skill 目录放置方式 + Claude Code 放置方式），文案由站点维护，不从 SKILL.md 读
  - SKILL.md 正文渲染（去掉 frontmatter）
  - 关联：站内用该 skill 产出的条目列表

### 5.5 视觉库 `/presets/`
- 列表页：按输出类型分组（html-report / html-slides / html-demo-pc / html-demo-mobile），每组标题 + 一句话规则说明（来自各组 `_README.md`）；组内每个 preset 一张 PresetCard：预览图、preset 名 + 中文名、一句话、tags；空组显示"暂无 preset"
- 详情页 `/presets/[slug]/`：
  - 页首：名称、所属类型、来源（origin 字段）、tags
  - 预览：`example.html` 以 iframe 嵌入，可"新窗口打开"
  - TOKENS.md 正文渲染（设计决策、色板、字体等）
  - "如何使用"：固定文案，指向 visual-library skill 页

### 5.6 笔记 `/notes/`
- 列表：按日期倒序，标题 + 日期 + 摘要 + tags
- 详情页：标准文章页，支持全部 markdown 特性与 callout
- 笔记是站点唯一"自有内容"，不依赖外部仓库

### 5.7 关于 `/about/`
- 一段介绍（作者提供文案，占位可用：企业 AI PM，做 agent 产品，写方法论，攒 skill）
- 联系：飞书个人二维码（图片）、GitHub 链接
- 站点说明：内容仓库列表 + 各自链接，"本站由这些仓库自动构建"

### 5.8 全站功能
- **搜索**：全站静态搜索（Pagefind），入口在 header，覆盖所有 collection 正文
- **RSS**：`/rss.xml`，聚合全部 collection 的更新
- **404 页**
- **面包屑**：二级以下页面显示

## 6. 跨 collection 关联

| 关系 | 方向 | 数据来源 | 展示位置 |
|---|---|---|---|
| 品鉴 → pattern | 显式 | 品鉴 frontmatter `patterns: [...]` | 品鉴页底部 |
| pattern → 品鉴 | 反链 | 由上一条计算 | pattern 页底部 |
| pattern ↔ pattern | 显式 | `related_patterns` | pattern 页首 |
| skill → 方法论模块 | 显式 | skill 配置 `module` | skill 卡片 |
| 方法论模块 → skill | 反链 | 由上一条计算 | 模块页侧栏 |
| skill → 产出 | 反链 | 品鉴 / pattern frontmatter `produced_by` | skill 页 |
| 迭代记录 → 模块 | 显式 | changelog 条目 `modules: [...]` | 时间线节点 |

所有反链在构建时计算，不需要作者手动维护两边。

## 7. 内容更新流程（作者视角）

```
写 / 改 markdown（在对应内容仓库，用 Claude Code 或 skill）
  → git push 到内容仓库
  → 内容仓库触发站点重建（自动）
  → 站点更新（≤ 10 分钟）
```

作者不需要碰站点仓库，除非：写笔记（笔记在站点仓库）、改关于页、改 collection 配置。

**v1 上线前的内容前置工作**（在内容仓库完成，不属于站点开发，但站点依赖它）：
1. `ai-pm-fieldbook`：把单文件方法论拆成模块目录，每模块一张 SVG 示意图，迭代记录拆成结构化 changelog——具体结构见 `tech.md` §3.1
2. `ai-business-anatomy`：新建 `cases/tastings/claude-tag/`，放入 4 章 markdown + `case.md` 元数据——结构见 `tech.md` §3.3
3. `ai-design-patterns`：scholar preset 补 `preview.png`；各 preset 类型 `_README.md` 已有，无需改

## 8. 范围与阶段

**v1（本次交付）**：§5 全部页面；`anatomies` 与空 preset 类型以空状态上线；搜索、RSS。

**v1 之后可能的扩展（方案需容纳，不实现）**：
- 新 collection：个人作品集、公司项目（脱敏后）、阅读笔记
- pattern 关系图 / 时间线的交互视图
- visual-library 扩展到 slides / demo 类型后，preset 详情页需要支持非单页 HTML 的预览方式（例如截图轮播）
- 评论（giscus）——若启用只需在文章页模板加一个组件

## 9. 验收标准

1. 三个内容仓库任一 push 后，站点在 10 分钟内反映变更，无人工操作
2. 新增一个 collection 的操作仅涉及：一份配置文件 + 内容目录；不修改任何页面模板或布局组件
3. 空 collection 不出现在导航与首页；有内容后自动出现
4. 所有反链（§6）正确，且不需要作者手动维护两端
5. 所有页面 375px 宽度可读；正文页 Lighthouse 性能 ≥ 90
6. 搜索可命中方法论、pattern、品鉴正文中的关键词
7. 全站无深色主题、无科技蓝渐变、无 emoji（设计约束见 design.md）
8. 术语保持原文（token、computer use、MCP 等不被翻译）
