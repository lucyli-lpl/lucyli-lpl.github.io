# tech.md — lucyli-lpl 个人站点 技术方案

版本 v1.0 · 2026-09-05
配套文档：`PRD.md`（需求）、`design.md`（界面）
本文档面向负责实现的 AI（Claude Code / Codex 等）。它可以直接作为站点仓库的 `CLAUDE.md` / `AGENTS.md` 主体使用。§3 内容契约同时约束三个内容仓库，需要在内容仓库里执行的前置任务见 §10。

---

## 1. 技术选型

| 项 | 选择 | 理由 |
|---|---|---|
| 框架 | **Astro 5**（content collections + glob loader） | 纯静态输出、原生 markdown collection、零客户端 JS 默认；contract 驱动的 collection 正好映射到 Astro 的 `defineCollection` |
| 托管 | **GitHub Pages**，仓库名 `lucyli-lpl.github.io` | 内容全在 GitHub，Actions 可直接 clone 兄弟仓库；根路径无 `base` 麻烦；免费；日后换 Cloudflare Pages 只改 workflow |
| 构建 | GitHub Actions | 触发源：站点 push、内容仓库 `repository_dispatch`、每日定时兜底、手动 |
| 搜索 | Pagefind | 构建后静态索引，无服务端 |
| 图表 | 内容仓库提供静态 SVG；正文中的 mermaid 代码块用 `rehype-mermaid` 在构建时渲染为 SVG（需 playwright；若 CI 装不上则退化为客户端 `mermaid.js` 按页懒加载） | 不引 React |
| 样式 | 纯 CSS + `tokens.css`（design.md §2） | 与 visual-library 同源，便于以后反向沉淀成 preset |
| Markdown | Astro 内置 remark/rehype + 插件：`remark-gfm`、callout 语法插件、自定义 `remark-pattern-links`（§7.3）、`rehype-slug`、`rehype-autolink-headings` | |
| RSS | `@astrojs/rss` | |
| 包管理 | pnpm | |

不使用：Next.js、Tailwind、任何 CMS、任何数据库、任何需要环境变量密钥的第三方服务（除 Actions 的 dispatch token）。

## 2. 站点仓库结构

```
lucyli-lpl.github.io/
├─ .github/workflows/
│   └─ build.yml                 # §5
├─ scripts/
│   ├─ sync-content.sh           # clone 内容仓库到 .content/（§5.1）
│   └─ collect-updates.ts        # 生成"最近更新"与反链索引（§8）
├─ content.config.ts             # collection 注册：唯一需要为新 collection 修改的代码文件（§4）
├─ site.config.ts                # 导航、collection→导航映射、固定文案、仓库列表
├─ content/
│   ├─ notes/                    # 站点自有内容
│   └─ about.md
├─ public/
│   ├─ contact/feishu-qr.png
│   └─ presets/                  # sync 时拷贝 example.html 与 preview.png（§7.4）
├─ src/
│   ├─ styles/tokens.css, prose.css, global.css
│   ├─ components/               # 名称与 design.md §4 一一对应
│   ├─ layouts/Base.astro, Article.astro, Sidebar.astro
│   ├─ lib/
│   │   ├─ collections.ts        # 读取 registry、统一 entry 访问、空 collection 判定
│   │   ├─ backlinks.ts          # §8
│   │   └─ install-snippets.ts   # skill 安装说明固定文案
│   └─ pages/                    # §6 路由
├─ .content/                     # gitignore；sync 产物
└─ CLAUDE.md                     # 指向本文档
```

**硬约束**：新增 collection 只允许修改 `content.config.ts` 与 `site.config.ts`。`src/pages/` 下的列表页 / 详情页是按 collection 类型（§4.2 的 `kind`）复用的通用模板，不得为某个 collection 单独写页面。

## 3. 内容契约（Content Contract）

站点只读取满足以下规范的文件。每个内容仓库根目录建议放一份 `CONTENT_CONTRACT.md` 复制对应小节，方便在那边工作的 AI 遵守。frontmatter 一律 YAML；日期格式 `YYYY-MM-DD` 或 `YYYY-MM`；slug = 目录名或文件名（kebab-case，ASCII）。

### 3.1 `ai-pm-fieldbook` → `methodology`

**目标结构**（需从现有单文件 `methodology/00-capability-boundary-methodology.md` 拆分，见 §10.1）：

```
methodology/
├─ methodology.yaml              # 方法论级元数据
├─ CHANGELOG.yaml                # 迭代记录，结构化
├─ README-reading-guide.md       # "从哪读起"片段（从 README 抽出）
├─ 01-three-zones/
│   ├─ module.md                 # 模块元数据 + 导语
│   ├─ diagram.svg               # 模块示意图（必需）
│   ├─ 01-core.md                # 章节，按文件名排序
│   ├─ 02-product-view.md
│   └─ ...
├─ 02-zoning-complex-scenarios/
├─ 03-testing/
├─ 04-data-ops/
├─ 05-generation-control/
├─ 06-architecture/
├─ 07-guardrails/
└─ 08-delivery-workflow/         # 预留：AI PM 交付流程（UI-SPEC 等），可先只有 module.md
```

建议的模块划分（与原文章节的对应，最终以作者梳理为准）：

| 模块 | 名称 | 原文来源 |
|---|---|---|
| 01 | 能力三区 = 三种产品承诺 | 第一章 + 第六章 |
| 02 | 复杂场景判区与场景库 | 第二、三、四章 |
| 03 | 测试与验收 | 5.1 |
| 04 | 数据运营 | 5.2 |
| 05 | 生成把关：prompt 与 skill | 5.3 |
| 06 | 架构选择 | 5.4 |
| 07 | 生产护栏与可靠性 | 5.5 |
| 08 | AI PM 交付流程 | 尚未成文，预留 |

`methodology.yaml`
```yaml
name: AI 应用能力边界方法论
version: "2.1"
one_liner: 能力三区不是难度分级，而是三种产品承诺——核心区保证结果，边缘区保证处理，界外区保证边界
repo: https://github.com/lucyli-lpl/ai-pm-fieldbook
updated: 2026-09-05
```

`module.md`
```yaml
---
order: 3
title: 测试与验收
one_liner: 上线前判定够不够格发布：四层结构、S0/S1/S2 × L1/L2/L3、验收规范表
skills: [ai-product-tasting]     # 关联 skill 的 slug，可为空
since_version: "1.3"             # 该模块首次出现的版本
---
（导语正文，可选）
```

章节文件：`NN-slug.md`，frontmatter 只需 `title`；正文从 `##` 起（站点会把章节 `title` 渲染为带编号的 h2，正文内标题自动降一级）。

`CHANGELOG.yaml`
```yaml
- version: "2.1"
  date: 2026-09            # 可缺省
  summary: 补齐 prompt 体系分层、架构选择前置判断、生产护栏与可靠性
  modules: [05, 06, 07]    # 影响的模块 order
  details: |
    多行 markdown，可缺省
- version: "2.0"
  ...
```

### 3.2 `ai-design-patterns` → `patterns`

沿用仓库现有 `DATA_SCHEMA.md`，不改内容仓库。站点读取 `patterns/*.md`：

- frontmatter：`pattern_name`（作为唯一 id）、`chinese_name`、`status`（枚举 concept / landed / evolving / converging）、`first_seen`、`originated_by`、`heat`（1–5）、`tags[]`、`related_patterns[]`（值为其他 pattern 的 `pattern_name`）
- slug = 文件名
- 正文按 h2 分段：`Definition` / `Implementations` / `Evolution Log` / `PM Notes`。站点通过 h2 文本前缀匹配（忽略 `/ 中文` 部分），`Evolution Log` 段内的列表项解析为时间线节点（格式 `- **YYYY-MM-DD** [driver] 描述`，若解析失败则原样渲染，不报错）
- `INDEX.md` 首行 `> Last updated:` 读取为"最后扫描日期"
- `updated` 字段：取 Evolution Log 最新日期；没有则取 git 最后提交时间

### 3.3 `ai-business-anatomy` → `tastings` / `anatomies`

新增目录（§10.2）：

```
cases/
├─ tastings/
│   └─ claude-tag/
│       ├─ case.md
│       ├─ 01-why.md
│       ├─ 02-how.md
│       ├─ 03-interaction.md
│       └─ 04-landscape.md
└─ anatomies/                     # 空目录，放 .gitkeep
```

`case.md`
```yaml
---
product: Claude Tag
company: Anthropic
product_launched: 2026-06-23
analyzed: 2026-09-01
framework: ai-product-tasting          # skill slug，用于反链
framework_version: "1.0"
verdict: 一句话结论（渲染为 Verdict 卡）
patterns: [Shared-Agent, Ambient-Agent] # pattern_name，用于互链；不存在的名字只渲染为普通 Tag 并在构建日志 warn
tags: [agent, multiplayer, slack]
---
（可选摘要，出现在列表卡片）
```

章节文件 `NN-slug.md`，frontmatter `title`。`anatomies` 契约相同，`framework: ipo-archaeology`，`product` 改为 `company`，可加 `filing_date`、`exchange`。

### 3.4 skills → `skills`

站点从三个仓库读取所有 `skills/*/SKILL.md`（visual-library 目录下的 `presets/` 不算 skill）。SKILL.md 通常有 `name`、`description` frontmatter；站点额外需要的字段放在 `site.config.ts` 的 `skills` 表里，不改 SKILL.md：

```ts
skills: {
  'ai-product-tasting': { repo: 'ai-business-anatomy', module: '03', display: 'AI 产品品鉴' },
  'ipo-archaeology':    { repo: 'ai-business-anatomy', display: '招股书考古' },
  'auto-analysis':      { repo: 'ai-business-anatomy', display: '自动路由' },
  'pattern-tracker':    { repo: 'ai-design-patterns', display: 'pattern 追踪' },
  'visual-library':     { repo: 'ai-design-patterns', display: '视觉库' },
}
```
`ui-design-prompt` 目前不在 GitHub，v1 不展示；上传后加一行即可。

### 3.5 visual-library → `presets`

读取 `skills/visual-library/presets/<type>/<preset>/`：
- `TOKENS.md` frontmatter：`preset_name`、`chinese_name`、`output_type`、`origin`、`one_liner`、`tags[]`
- `example.html`（必需）、`preview.png`（必需，1200×750 左右；现有 scholar 缺此文件，§10.3）
- `<type>/_README.md` 第一段作为类型说明；类型列表由目录枚举，空类型也展示
- slug = `<type>--<preset>`

### 3.6 站点仓库 → `notes`

`content/notes/YYYY-MM-DD-slug.md`
```yaml
---
title: 
date: 2026-09-05
summary: 一两句
tags: []
draft: false        # true 时不构建
---
```

### 3.7 通用规则
- 所有 md 支持 GFM、callout 语法 `> [!info]` / `> [!warn]` / `> [!action]`（映射到 design.md §4.5）、mermaid 代码块、相对路径图片（sync 时随目录一起拷贝到 `public/content/<collection>/...`）
- frontmatter 校验失败的条目：构建 **warn 并跳过**，不中断构建（作者可能在内容仓库写到一半就 push）
- 内容仓库内的相对链接（如 pattern 文件互链 `../patterns/x.md`）由 remark 插件改写为站内路由；无法解析的保留原样指向 GitHub

## 4. Collection 注册机制

### 4.1 `content.config.ts`
```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const patterns = defineCollection({
  loader: glob({ base: '.content/ai-design-patterns/patterns', pattern: '*.md' }),
  schema: z.object({
    pattern_name: z.string(), chinese_name: z.string(),
    status: z.enum(['concept','landed','evolving','converging']),
    first_seen: z.string(), originated_by: z.string().optional(),
    heat: z.number().min(1).max(5), tags: z.array(z.string()).default([]),
    related_patterns: z.array(z.string()).default([]),
  }),
});
// methodology / tastings / anatomies / skills / presets / notes 同理
export const collections = { patterns, methodology, tastings, anatomies, skills, presets, notes };
```
多章节条目（方法论模块、品鉴案例）用自定义 loader：以 `module.md` / `case.md` 为 entry，把同目录 `NN-*.md` 读入 `chapters[]`。

### 4.2 `site.config.ts` 的 collection 注册表
```ts
export const registry = {
  methodology: { kind: 'modules',  nav: '方法论', path: '/methodology', label: '方法论' },
  patterns:    { kind: 'articles', nav: '观察',   path: '/patterns',    label: 'pattern 追踪', listStyle: 'rows' },
  tastings:    { kind: 'cases',    nav: '观察',   path: '/tastings',    label: '产品品鉴' },
  anatomies:   { kind: 'cases',    nav: '观察',   path: '/anatomies',   label: '公司拆解' },
  skills:      { kind: 'skills',   nav: '工具箱', path: '/skills',      label: '工具箱' },
  presets:     { kind: 'presets',  nav: '视觉库', path: '/presets',     label: '视觉库' },
  notes:       { kind: 'articles', nav: '笔记',   path: '/notes',       label: '笔记' },
};
```
`kind` 决定用哪套通用模板（`modules` / `articles` / `cases` / `skills` / `presets` 五种）。`nav` 相同的 collection 归入同一分组页（v1 只有"观察"是分组）。`lib/collections.ts` 提供 `isEmpty(key)`，Header 与首页据此隐藏。

## 5. 构建与同步流水线

### 5.1 `scripts/sync-content.sh`
```bash
set -e
rm -rf .content && mkdir .content
for r in ai-design-patterns ai-business-anatomy ai-pm-fieldbook; do
  git clone --depth 1 https://github.com/lucyli-lpl/$r .content/$r
done
# 拷贝需要作为静态资源直出的文件
mkdir -p public/presets public/content
for d in .content/ai-design-patterns/skills/visual-library/presets/*/*/; do
  slug="$(basename $(dirname $d))--$(basename $d)"
  mkdir -p public/presets/$slug && cp $d/example.html $d/preview.png public/presets/$slug/ 2>/dev/null || true
done
cp -r .content/ai-pm-fieldbook/methodology/*/diagram.svg ...  # 同理按模块拷到 public/content/methodology/<module>/
```
本地开发同样先跑这个脚本；`.content/` 与 `public/presets/`、`public/content/` 均 gitignore。

### 5.2 `.github/workflows/build.yml`
```yaml
on:
  push: { branches: [main] }
  repository_dispatch: { types: [content-updated] }
  schedule: [{ cron: '0 18 * * *' }]     # 每日 UTC 18:00 = 北京 02:00 兜底
  workflow_dispatch:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4  { with: { node-version: 22, cache: pnpm } }
      - run: pnpm install --frozen-lockfile
      - run: bash scripts/sync-content.sh
      - run: pnpm build          # astro build && pagefind --site dist
      - uses: actions/upload-pages-artifact@v3 { with: { path: dist } }
  deploy:
    needs: build
    permissions: { pages: write, id-token: write }
    environment: github-pages
    runs-on: ubuntu-latest
    steps: [ { uses: actions/deploy-pages@v4 } ]
```

### 5.3 内容仓库侧触发（三个仓库各放一份 `.github/workflows/notify-site.yml`）
```yaml
on: { push: { branches: [main, master] } }
jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -sS -X POST -H "Authorization: Bearer ${{ secrets.SITE_DISPATCH_TOKEN }}" \
            -H "Accept: application/vnd.github+json" \
            https://api.github.com/repos/lucyli-lpl/lucyli-lpl.github.io/dispatches \
            -d '{"event_type":"content-updated","client_payload":{"repo":"${{ github.repository }}"}}'
```
`SITE_DISPATCH_TOKEN`：fine-grained PAT，仅对站点仓库授予 `contents: write`（dispatch 所需），作为三个内容仓库的 secret。**这是全方案唯一的密钥**。若作者不想配 PAT，仅靠每日定时兜底也可，代价是延迟。

## 6. 路由表

| 路由 | 模板 | 数据 |
|---|---|---|
| `/` | `pages/index.astro` | registry 全部 + updates 索引 |
| `/methodology/` | `kind=modules` 列表 | methodology.yaml + modules + reading-guide |
| `/methodology/[module]/` | modules 详情（Sidebar 布局） | module + chapters + backlinks |
| `/methodology/changelog/` | 固定页 | CHANGELOG.yaml |
| `/observations/` | 分组页 | nav='观察' 的 collections |
| `/patterns/`, `/patterns/[slug]/` | articles（rows）| |
| `/tastings/`, `/tastings/[slug]/` | cases | |
| `/anatomies/`, `/anatomies/[slug]/` | cases | |
| `/skills/`, `/skills/[slug]/` | skills | |
| `/presets/`, `/presets/[slug]/` | presets | |
| `/notes/`, `/notes/[slug]/` | articles | |
| `/about/` | 固定页 | content/about.md |
| `/rss.xml` | `@astrojs/rss` | updates 索引 |
| `/404` | 固定页 | |

所有路由尾部带斜杠（`trailingSlash: 'always'`），GitHub Pages 友好。

## 7. 渲染细节

### 7.1 多章节拼接
`modules` / `cases` 详情页把 `chapters[]` 按文件名顺序渲染；每章 `title` 输出为 `<h2 id="ch-NN">NN. title</h2>`，章内原有 `##` 降为 `###`（remark 插件 `remark-shift-headings`）。ChapterNav 从这些 h2/h3 生成。

### 7.2 pattern Evolution Log → Timeline
解析 `## Evolution Log` 段下的列表项，正则 `^\*\*(\d{4}-\d{2}(-\d{2})?)\*\*\s*\[?(product-design|ux|tech|market|academic)?\]?\s*(.*)$`；匹配的渲染为 Timeline 节点，未匹配的保留为普通列表项追加在时间线下方。

### 7.3 `remark-pattern-links`
构建时拿到全部 `pattern_name` 集合；扫描 `tastings` / `anatomies` / `methodology` / `notes` 正文的文本节点，把**首次出现**的每个 pattern_name（大小写不敏感，词边界匹配，跳过代码块和已有链接）包成站内链接 `<a class="pattern-link">`。同时把命中记录进反链索引（§8）作为隐式引用；显式 `patterns[]` 与隐式命中合并去重。

### 7.4 preset 预览
`PreviewFrame` 的 iframe `src=/presets/<slug>/example.html`，`sandbox="allow-same-origin"`（example 是静态 HTML，不需要脚本；若某 preset 需要 JS，在 TOKENS.md frontmatter 加 `needs_js: true` 则放开 `allow-scripts`）。

### 7.5 Callout
`remark-callouts`（或自写 20 行插件）：`> [!info] 标题` 转为 `<aside class="callout callout-info">`。

### 7.6 mermaid
优先 `rehype-mermaid`（strategy `inline-svg`）。CI 中 `npx playwright install chromium` 失败时，通过环境变量 `MERMAID_CLIENT=1` 切换为在含 mermaid 的页面注入 `<script type="module">` 懒加载 `mermaid@11` ESM。

### 7.7 搜索
`pnpm build` = `astro build && pagefind --site dist`。Pagefind 索引 `main` 元素；`data-pagefind-meta="collection:{label}"` 用于结果里的 Tag。

## 8. 更新索引与反链（`scripts/collect-updates.ts`，构建期运行）

输出 `src/data/index.json`：
```ts
{
  updates: [{ collection, slug, title, date, kind: 'new'|'evolved'|'changelog' }],  // 按 date 倒序
  backlinks: {
    patternToCases: { [pattern_name]: [{collection, slug, title}] },
    moduleToSkills: { [moduleOrder]: [skillSlug] },
    moduleToCases:  { [moduleOrder]: [...] },     // 案例 frontmatter `modules: []` 或正文引用（v1 仅显式）
    skillToOutputs: { [skillSlug]: [...] },       // 由 cases.framework 与 patterns（pattern-tracker 产出全部 pattern）计算
  },
  counts: { [collection]: number },
  lastScan: '2026-09-05',
}
```
`updates` 的 date 来源：notes/cases 取 frontmatter；patterns 取 Evolution Log 最新日期（kind=evolved）或 first 提交（kind=new）；methodology 取 CHANGELOG 最新版本（kind=changelog）。git 时间用 `git log -1 --format=%cI -- <file>` 在 `.content/<repo>` 内执行（clone 用 `--depth 1` 时仅能取到最新提交；若需要精确文件时间改为 `--filter=blob:none` 而非 depth 1）。

## 9. 约束与禁止（写给实现 AI）

1. 不为任何单个 collection 写专属页面；所有页面按 `kind` 复用
2. 不在站点仓库复制内容仓库的 markdown；内容只从 `.content/` 读取
3. 不引入 React / Vue / Tailwind / UI 库；组件按 `design.md` 手写
4. 不用裸色值；只用 `tokens.css` 变量
5. frontmatter 缺字段 → warn 并跳过该条，不让构建失败
6. 空 collection 必须仍生成列表页（EmptyState），但从导航和首页移除
7. 不翻译内容中的英文术语；组件固定文案遵守 design.md §7
8. 客户端 JS 仅允许：过滤 Tag、InstallBlock Tab、ChapterNav 高亮、搜索层、mermaid 退化方案；每处 ≤ 50 行原生 JS
9. 图片一律 `loading="lazy"`；preview.png 走 Astro `<Image>` 生成 webp

## 10. 内容仓库前置任务（在各内容仓库里执行，与站点开发并行）

### 10.1 `ai-pm-fieldbook`
1. 按 §3.1 结构把 `00-capability-boundary-methodology.md` 拆成 8 个模块目录（08 只放 `module.md` 占位）；原文件保留为 `methodology/FULL.md` 并在顶部注明"完整版，模块版见各目录"
2. 拆分时**不改写内容**，只移动；章节标题去掉原编号（编号由站点生成）
3. 为每个模块画一张 `diagram.svg`：手写 SVG，纯线框 + `--font-mono` 文字，色彩只用 `#1a1a1a` / `#6b7280` / `#e5e7eb`，宽 780 高 ≤ 420；内容按模块核心结构（如 01 = 三区 × 三种承诺矩阵；03 = 四层结构图；06 = 三刀决策树）
4. 把第七章"迭代记录"转成 `CHANGELOG.yaml`，每条标注影响模块；日期不可考的留空
5. 从 README 抽出"从哪读起"表为 `README-reading-guide.md`
6. 更新 README 指向新结构；加 `notify-site.yml`

### 10.2 `ai-business-anatomy`
1. 新建 `cases/tastings/claude-tag/`，放入作者的 4 章 markdown，按 `01-why.md … 04-landscape.md` 命名，各加 `title` frontmatter
2. 写 `case.md`（§3.3），`patterns` 字段填该分析涉及的 pattern（以 ai-design-patterns 中已存在或计划新增的 `pattern_name` 为准）
3. 新建 `cases/anatomies/.gitkeep`
4. 加 `notify-site.yml`

### 10.3 `ai-design-patterns`
1. 为 scholar 生成 `preview.png`（浏览器截图 example.html 顶部 1200×750），并把 TOKENS.md 的 `preview_url` 改为 `./preview.png`
2. 确认两个 pattern 的 Evolution Log 条目格式符合 §7.2 正则（不符合的调整为 `- **YYYY-MM-DD** [driver] 描述`）
3. 加 `notify-site.yml`

## 11. 实施顺序（站点仓库）

每个里程碑结束时可独立部署预览。

**M0 骨架**（半天）
- 初始化 Astro + pnpm；`tokens.css`、`prose.css`、Base 布局、SiteHeader / SiteFooter / Breadcrumb
- `sync-content.sh`、`build.yml`，部署一个只有首页占位的站
- 验收：Actions 绿色，Pages 可访问

**M1 patterns + notes**（1 天）——契约最稳定、内容已就绪
- `content.config.ts` 注册两者；`articles` 模板（列表 rows / 详情 Sidebar）；ListRow、StatusBadge、Tag、ChapterNav、Timeline、Callout
- Evolution Log 解析；`remark-shift-headings`
- 验收：两个 pattern 页与仓库内容一致，status 过滤可用

**M2 methodology**（1.5 天）——依赖 §10.1 完成
- 多章节 loader；`modules` 模板；Card.module、Verdict；changelog 页
- 验收：8 模块（含 1 个占位）+ changelog 时间线

**M3 cases + skills + presets**（1.5 天）——依赖 §10.2 / §10.3
- `cases` / `skills` / `presets` 模板；InstallBlock、PreviewFrame、Card.case / skill / preset、EmptyState
- 观察分组页；空 collection 隐藏逻辑
- 验收：Claude Tag 品鉴完整可读；anatomies 显示空状态且不在导航

**M4 关联与全站**（1 天）
- `collect-updates.ts`、反链、`remark-pattern-links`、首页 UpdateFeed、RSS、Pagefind、404、about
- 验收：PRD §9 全部通过

**M5 内容仓库 dispatch 联调**（0.5 天）
- 配 PAT、三仓库 notify workflow；从任一仓库 push 一次验证 10 分钟内更新

总计约 6 个工作日的 AI 执行量，其中 §10 的内容工作可并行由另一实例完成。
