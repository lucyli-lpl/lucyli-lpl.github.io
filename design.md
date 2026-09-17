# design.md — lucyli-lpl Design System v2

版本：v2.0 · 2026-09-17  
主题：**Editorial Research Archive / 编辑部式研究档案室**  
适用：Astro 5；交互实现技术开放，以视觉保真、渐进增强、性能与可维护性为约束

---

# 0. 一句话设计原则

> **纸张的温度 + 蓝灰的理性 + 银色的精致 + 少量金色的标记感。**

设计不是为了“更像科技产品”，而是为了让方法、学习与实践看起来像一套正在持续修订的知识档案。

---

# 1. 设计语义

## 1.1 核心隐喻

站点是一个可进入、可翻阅、可检索的“编辑部 / 研究档案室”。

视觉对象对应关系：

| 网站元素 | 视觉隐喻 |
|---|---|
| 一级栏目 | 半透明索引便签 / 文件卡 |
| 方法论模块 | 档案条 / 手册章节 |
| Pattern | 索引记录 |
| 品鉴 / 公司拆解 | dossier 案卷 |
| Skill | 抽屉里的 recipe / 方法模块 |
| Preset | 样本册 / swatch archive |
| Notes | 日期索引笔记 |
| Changelog | 修订记录 |
| Pitfall | 金色经验标记 |

## 1.2 禁止方向

- 不做 SaaS dashboard。
- 不做等宽等高卡片海。
- 不做蓝白科技公司宣传站。
- 不用人物主视觉。
- 不用风景图作为主要页面语义。
- 不做整页深色模式。
- 不做玻璃拟态“无处不在”。
- 不用高饱和亮蓝、紫色霓虹、赛博渐变。

---

# 2. Color Tokens

建议直接替换现有 `src/styles/tokens.css` 的色彩层，同时保留变量式设计。

```css
:root {
  /* Foundation */
  --paper:        #F6F2E9;
  --paper-2:      #EEE8DD;
  --paper-3:      #E5DED1;
  --paper-white:  #FCFAF6;

  /* Ink / primary */
  --ink:          #113053;
  --ink-2:        #294C6F;
  --ink-3:        #5A7187;

  /* Blue-gray */
  --blue:         #3B6287;
  --blue-soft:    #89A2B8;
  --blue-wash:    #E6EDF2;

  /* Silver */
  --silver:       #B7C0C8;
  --silver-dark:  #7C8893;
  --silver-light: #DCE2E6;

  /* Muted gold — only marker/accent */
  --gold:         #AC8E56;
  --gold-soft:    #DCCBA8;
  --gold-wash:    #F1E9D9;

  /* Text neutrals */
  --text:         #252C32;
  --text-2:       #5C6670;
  --text-3:       #879099;

  /* Lines */
  --line:         rgba(17, 48, 83, .16);
  --line-soft:    rgba(17, 48, 83, .08);

  /* Glass */
  --glass-bg:     rgba(247, 249, 250, .56);
  --glass-bg-hi:  rgba(255, 255, 255, .72);
  --glass-border: rgba(255, 255, 255, .72);
  --glass-shadow: 0 18px 45px rgba(25, 42, 58, .10);

  /* Semantic aliases — map old component API to new theme */
  --accent:       var(--blue);
  --accent-light: var(--blue-wash);
  --warm:         var(--gold);
  --warm-light:   var(--gold-wash);
  --green:        #526E63;
  --green-light:  #E8EEEA;
  --border:       var(--line);
}
```

## 2.1 色彩占比

- 65–72%：paper / warm neutral
- 18–24%：ink / blue-gray
- 6–10%：silver / glass
- ≤ 3%：gold

Gold 只用于：
- 当前页小圆点
- section number
- revision marker
- pitfall marker
- 极少量分割线 / clip / paper fastener

---

# 3. Typography

```css
--font-display: "Noto Serif SC", "Songti SC", serif;
--font-body: "Inter", "PingFang SC", "Noto Sans SC", sans-serif;
--font-mono: "JetBrains Mono", "SF Mono", monospace;
--font-hand: "Caveat", "Kaiti SC", cursive; /* decorative only */
```

## 3.1 类型角色

- `display`：H1/H2、核心文章标题。
- `body`：正文、卡片说明、导航。
- `mono`：版本、日期、slug、meta、编号。
- `hand`：装饰性英文旁注，一页最多 1–2 处，不承载必要信息。

## 3.2 推荐字号

```css
--fs-display: clamp(2.6rem, 5.1vw, 5.2rem);
--fs-h1: clamp(2rem, 3.2vw, 3.5rem);
--fs-h2: clamp(1.55rem, 2vw, 2.2rem);
--fs-h3: 1.15rem;
--fs-body: 0.98rem;
--fs-small: 0.86rem;
--fs-meta: 0.76rem;
```

长文正文建议 `line-height: 1.86`，中文每行 30–42 字附近。

---

# 4. Spacing / Layout

```css
--space-1: .5rem;
--space-2: 1rem;
--space-3: 1.5rem;
--space-4: 2rem;
--space-5: 3rem;
--space-6: 4.5rem;
--space-7: 7rem;

--w-prose: 760px;
--w-wide: 1180px;
--w-hero: 1320px;
--w-side: 220px;
```

原则：
- 首页可宽，文章必须窄。
- “内容密度”通过折叠与空白控制，而不是缩字号。
- section 不要求同高、同宽；刻意制造视觉优先级。

---

# 5. Material System

## 5.1 Paper

用于：正文、页面底、长内容。

```css
.paper {
  background: var(--paper);
  color: var(--text);
}
```

允许叠加 1–2% 透明度的噪点纹理，但不要明显仿旧。

## 5.2 Glass

用于：Hero 便签、导航、drawer、小型 metadata 容器。

```css
.glass {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(18px) saturate(.85);
  -webkit-backdrop-filter: blur(18px) saturate(.85);
  box-shadow: var(--glass-shadow);
}
```

限制：
- 一个 viewport 同时最多 5–6 个 glass surface。
- 文章正文、长列表行不使用 glass。
- 不做亮白发光边缘。

## 5.3 Metal / Silver

不要用银色填满背景。

体现方式：
- 1px 细边框
- 图标 stroke
- paper clip / binder / divider
- drawer edge
- 输入框边缘

## 5.4 Gold

不是奢华风主色，而是“编辑标记色”。

使用元素：
- `01 / 02 / 03`
- changelog current version
- pitfall
- active dot
- selected tab underbar

---

# 6. Global Components

## 6.1 `SiteHeader`

Desktop：
- 高 64px
- sticky top 0
- `background: rgba(246,242,233,.78)` + blur 12–16px
- 左 logo / 中导航 / 右搜索
- 当前导航：墨蓝文字 + 1 个 4px gold dot 或 2px underline（二选一，不同时使用）
- “工具箱”用户文案改为“技能箱”

Scroll：
- 首屏 0–40px：背景更透明
- 向下后增加 blur 与 bottom border

Mobile：
- logo + search + menu
- menu 使用 full-width sheet，不用传统小 popover

## 6.2 `SearchModal`

定位：检索档案，而不是通用搜索弹窗。

- max-width 760px
- 顶部大搜索框
- Result 按 collection label 显示
- hover/focus 显示银灰 selection bar
- `Cmd/Ctrl + K` 保留

## 6.3 `SiteFooter`

- 首页：窄幅 88–112px
- 长文：常规 120–160px
- 不做多列 sitemap
- 不放额外图片

---

# 7. Interaction Primitives

## 7.1 `ArchiveNote`

首页一级入口卡。

结构：
- icon
- title
- 2 行说明
- corner arrow

状态：
```css
.archive-note {
  transform: translate3d(0,0,0);
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
}
.archive-note:hover,
.archive-note:focus-visible {
  transform: translateY(-6px) rotate(.25deg);
}
```

可选 JS：pointermove 实现 X/Y tilt，绝对值 ≤ 2deg。

## 7.2 `AccordionRow`

用于 Methodology / Skill / Retro / Pitfall。

- 原生 `<button>` header
- `aria-expanded`
- 内容使用 CSS grid `0fr → 1fr`
- 动画 260ms
- 一个列表默认只打开 1 个；允许用户打开多个，但初始不超过 1 个。

## 7.3 `HorizontalRail`

用于 Observations folders / Cases / Presets。

```css
.rail {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}
.rail > * { scroll-snap-align: start; }
```

桌面允许 wheel-to-horizontal 的增强，但不能阻止普通页面纵向滚动。

## 7.4 `PreviewDrawer`

用于 Pattern 快速预览。

Desktop：right drawer 420–520px。  
Mobile：不弹 drawer，直接进入详情或 full-screen sheet。

必须：
- Esc close
- focus trap
- route link `阅读全文`

## 7.5 Scroll choreography

允许：
- sticky
- opacity reveal
- translateY 8–20px
- Hero 背景/便签 0.92–0.98 比例轻视差

不允许：
- 大缩放
- 360° 旋转
- 长时间 pin 住页面导致无法正常滚动
- WebGL 依赖作为核心导航

技术策略：**结果导向，不限定实现手段。** 可以根据效果与复杂度选择 CSS、View Transitions API、Web Animations API、GSAP/ScrollTrigger、Motion One、局部 client island；必要时允许局部 Three.js。

约束：
- 新依赖必须服务于明确体验目标，不做技术展示。
- 所有交互均为渐进增强，基础导航与阅读不可依赖动画库或 WebGL。
- 若 CSS / 原生 API 已能稳定复现，则不为了“技术感”额外引库。

---

# 8. Page Components

## 8.1 `HomeHero`

布局：
- desktop：左 42–46%，右 54–58%
- min-height：680px 左右，不强制 100vh

右侧由 `ArchiveNote[]` 组合成“研究板”。

视觉背景应是：
- 纸张 / 活页夹 / 编辑部桌面 / 书脊 / clip / 笔记
- 不使用雪山、湖泊、海岸等风景主图

## 8.2 `CurrentFocus`

- 固定最多 3 项
- 小编号 + icon + question
- 不需要更新时间
- 容器可有极弱 glass，但内容行本身是 paper / transparent

## 8.3 `FeaturedEditorial`

1 + 2 布局：
- 主卡占 60–65%
- 右侧两个次卡纵向
- 只支持 3 条
- image 必须与内容语义相关：图表、纸面、工具、界面、研究材料；不放无意义风景

## 8.4 `ModuleAccordion`

替代原 `CardModule` 网格。

props：
```ts
{
  order,
  title,
  oneLiner,
  chapterCount,
  skills,
  updated,
  href,
  defaultOpen?
}
```

## 8.5 `EvolutionStrip`

替代首页式完整 Matrix 直接暴露。

- compact strip
- current version highlighted
- CTA `展开演进`
- `EvolutionMatrix` 作为展开内容或独立 changelog 页面继续复用

## 8.6 `ObservationFolders`

3 个 folder item，视觉层叠。

focus 规则：
- current z-index 3
- next z-index 2
- last z-index 1
- transform 只做平移 / 微旋转

## 8.7 `CaseShelf`

- featured case + horizontal compact cases
- company anatomy 与 tasting 共用

## 8.8 `SkillDrawerList`

替代 `.skill-grid`。

Accordion details：repo / module / outputs / CTA。

## 8.9 `PresetGallery`

- TypeNav vertical
- PreviewStage large
- PresetRail horizontal
- mobile TypeNav 变 horizontal tabs

## 8.10 `NoteTimeline`

- 年 / 月 / 日期 / 标题
- 摘要默认不展示
- hover/focus 展开摘要但不改变整体布局高度过大；推荐 absolute popover 或 2 行 reveal

---

# 9. Unified Article System

适用所有详情页。

结构：

```txt
Breadcrumb (optional)
ArticleHeader
MetaStrip
KeyClaim / Verdict (optional)
┌───────────────────────┬──────────────┐
│ Prose                 │ ChapterNav   │
│                       │ sticky       │
└───────────────────────┴──────────────┘
RelatedEntries
PrevNext
```

## 9.1 `ArticleHeader`

- kicker / collection + status
- H1
- subtitle 0–3 行
- meta row

## 9.2 `KeyClaim`

- methodology：`KeyClaim` 使用 blue-wash
- tasting：`Verdict` 使用 solid navy
- retro：`LearningShift` 使用 paper + gold marker

## 9.3 `ChapterNav`

- lg：sticky top 96px
- current：2px blue indicator + ink text
- tablet/mobile：native details 折叠目录

## 9.4 `Prose`

长文优先 paper：
- 不放 glass background
- h2 serif
- h3 body semibold
- table 容器横向 scroll
- code mono
- blockquote 银灰线
- callout 最多 3 种语义

---

# 10. Motion Tokens

```css
--ease-standard: cubic-bezier(.2,.8,.2,1);
--ease-soft: cubic-bezier(.22,.61,.36,1);
--dur-fast: 160ms;
--dur-base: 260ms;
--dur-slow: 420ms;
```

使用：
- hover `--dur-fast`
- accordion/drawer `--dur-base`
- section reveal `--dur-slow`

`prefers-reduced-motion`：

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    transition-duration: .01ms !important;
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

---

# 11. Responsive System

## ≥ 1180
- wide 1180–1320
- sticky side nav
- hero note board full interaction

## 768–1179
- wide padding 32px
- hero still 2 columns where possible
- Article nav collapses
- drawers max 46vw

## < 768
- padding 20px
- H1 max 2.4rem
- hero stack
- notes / folders / presets use horizontal rail
- no tilt / parallax
- drawer → full-screen sheet or route

---

# 12. Existing Components Migration Map

| 当前组件 | v2 去向 |
|---|---|
| `SiteHeader` | 保留，改材质与 active state |
| `SiteFooter` | 保留，首页使用 compact 变体 |
| `SearchModal` | 保留 Pagefind，重构为 Archive Search |
| `PageHeader` | 演进为 `ArticleHeader` / `SectionIntro` |
| `CardModule` | 替换为 `ModuleAccordion` |
| `EvolutionMatrix` | 保留，但移入渐进披露 |
| `EvolutionStrip` | 升级为主入口 |
| `ListRow` | Pattern 列表继续使用 |
| `ChapterNav` | 保留，重做响应式折叠 |
| `Verdict` | 保留，仅 tasting/关键结论使用 |
| `Timeline` | 保留，用于 changelog / evolution |
| `Tag` / `StatusBadge` | 保留，换 tokens |
| `EmptyState` | 改文案与档案式视觉 |

---

# 13. CSS Architecture

建议文件：

```txt
src/styles/
  tokens.css
  global.css
  prose.css
  materials.css      # paper / glass / metal
  motion.css         # reduced-motion / transitions
  interactions.css   # accordion / rail / drawer
```

原则：
- 组件 CSS 优先使用 token。
- 禁止组件直接写新的 hex 色值。
- `backdrop-filter` 必须提供无 blur fallback。
- 页面级 CSS 只负责 composition，不复制组件样式。

---

# 14. Interaction Engineering

站点继续坚持**静态内容优先 + 局部交互增强**，但本轮不设死板的 JS 行数或库限制。

允许：
- Search modal
- accordion / drawer / sheet state
- ChapterNav IntersectionObserver
- pointer tilt / depth
- View Transitions API
- scroll-driven animation
- GSAP / Motion One 等局部动画库
- 局部 client island
- 仅在确有空间叙事价值时使用局部 Three.js

工程目标：
- 不把全站改造成 SPA
- 不因视觉改版引入无意义的全站 hydration
- 每页仅加载需要的交互代码
- 动画失败时页面仍完整可用
- 视觉保真优先于“技术栈纯洁度”，但可维护性优先于炫技

---

# 15. Image / Asset Rules

图片必须与知识内容语义相关：

允许：
- 工作台 / 资料 / 手写草图
- UI 局部截图
- 抽象图表
- 书籍 / 笔记 / 工具
- 内容生成的 diagram / preview

避免：
- 与文章无关的风景占位图
- 商务握手 / 团队会议 stock photo
- 人物肖像主视觉
- 纯装饰 3D 球体

`FeaturedEditorial` 图片如果无合适素材，宁可使用排版式图形 / diagram，而不是随机摄影。

---

# 16. Acceptance Checklist

- [ ] 视觉第一印象是“研究档案 / 编辑部”，不是公司官网。
- [ ] 暖白比冷白多，蓝灰比亮蓝多。
- [ ] Silver 是材质，不是大背景。
- [ ] Gold ≤ 3% 视觉面积。
- [ ] 首页只有 3 个主要层级：Hero / Combined Content / Compact Footer。
- [ ] 不出现 6+ 等权卡片首屏。
- [ ] 至少方法论、技能箱、复盘使用 accordion。
- [ ] 至少观察、案例、视觉库使用 horizontal rail / scroll-snap。
- [ ] 长文页面统一 Article System。
- [ ] 所有交互支持 keyboard + reduced motion。
- [ ] 所有用户可见“工具箱”改成“技能箱”。



# 16. Motion Priority Levels

为了给实现模型足够发挥空间，同时避免风格失控，所有交互分三级：

## Core — 必须实现
- Accordion / drawer / sticky index / scroll-snap
- 清晰 hover + focus 状态
- 移动端等价交互
- `prefers-reduced-motion`
- 页面切换不可有明显闪烁、跳变或布局抖动

## Delight — 应实现
- 首页便签轻微 lift / tilt / depth
- 档案卡片从层叠态进入前景
- Methodology 展开具“抽出 dossier”感
- Observations folder 在选择时重排而非单纯替换
- Preset 像样本册一样可横向翻阅
- section transition 使用纸张、索引、资料层的语言，而非统一 fade-up

## Experimental — 可由实现模型发挥
- shared-element-like page transitions
- 研究板多层轻视差
- 可拖动的样本册
- 局部 3D perspective / Three.js 档案空间

Experimental 必须可以关闭、降级或删除；任何实验效果若降低可读性、性能或导航确定性，直接回退。
