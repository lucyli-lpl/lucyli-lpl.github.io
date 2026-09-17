# PRD — lucyli-lpl 个人知识与项目网站 v2

版本：v2.0 Design Direction · 2026-09-17  
状态：**部分实施**（2026-09-17，按缩减范围）——完成情况、有意不做的项及其重新评估条件见 `docs/PROGRESS.md`；实际落地的组件与 token 见 `design.md` 附录 A  
配套：`design.md`（视觉与交互规范）、`tech.md`（现有技术架构）

> 核心定位：**编辑部 / 研究档案室式的可探索知识空间**。  
> 不是个人简历，不是 SaaS 宣传页，也不是普通卡片式博客。
>
> 最高优先级视觉母版：`docs/design/final-visual-overview.png`。其他页面必须继承首页的材质、层叠、非对称编排与探索感。
> 本 PRD 不再引用任何旧版/被否决视觉稿；实现时只允许使用上述 Final Visual Overview 作为图片级视觉参考。

---

## 0. 本轮设计结论

### 0.1 设计目标

1. 强化“方法论 + 学习 + 实践沉淀”的网站属性，弱化个人介绍。
2. 首页降低信息密度，只承担：**定调 → 导航 → 当前关注 + 精选 → 收束**。
3. 从“平铺页面”转向“渐进披露”：折叠、抽屉、横向滚动、sticky、scroll-snap、章节切换。
4. 保留可读性：交互用于组织信息，不用于制造炫技负担。
5. 让所有页面看起来属于同一套“研究档案系统”，而不是独立模板集合。

### 0.2 视觉基调

- 暖白纸张：知识厚度、阅读温度。
- 深墨蓝 / 灰蓝：理性、方法、主信息。
- 银灰 / 毛玻璃：编辑部、文件夹、资料袋、索引卡的现代化转译。
- 少量 muted gold：章节编号、当前状态、重要标记。
- 避免：纯蓝银冷科技、SaaS 渐变、大面积深色、霓虹、平均分布卡片墙。

### 0.3 内容文案已确认

- 首页主标题：**让学习和实践沉淀为方法，构建更清晰的思考体系。**
- 导航：**工具箱 → 技能箱**。
- 精选思考标题：**慢，就是快**。

## 0.4 Implementation interaction levels

To preserve design intent while allowing Fable 5.1 technical freedom, page interactions are classified as:

- **Core**: required for information architecture and usability (accordion, drawer/sheet, sticky index, horizontal scroll-snap, keyboard/focus equivalents, reduced-motion fallback).
- **Delight**: strongly desired expressive motion (note lift/tilt, dossier unfolding, folder reordering, sample-book browsing, subtle page continuity).
- **Experimental**: implementation-model discretion (shared-element-like transitions, layered parallax, drag interactions, localized 3D/Three.js). Experimental effects must degrade gracefully and never block reading/navigation.

The design handoff specifies the intended experience, not a mandatory animation library.

---

## 1. 当前技术与信息结构基线

现有站点基于 Astro 5 + GitHub Pages + Pagefind，内容由多个 GitHub 仓库同步驱动。现有主路由：

| 一级区域 | 路由 | 当前实现 |
|---|---|---|
| 首页 | `/` | Hero + 统计卡 + 最近更新 |
| 方法论 | `/methodology/` | 模块网格 + Evolution Matrix |
| 方法论详情 | `/methodology/[slug]/` | 多章节长文 |
| 版本历史 | `/methodology/changelog/` | 版本迭代 |
| 项目复盘 | `/retros/` | 复盘卡片列表 |
| 项目复盘详情 | `/retros/[slug]/` | 多章节案例 |
| 坑库 | `/pitfalls/` | 跨项目坑汇总 |
| 观察 | `/observations/` | Pattern / 品鉴 / 公司拆解入口 |
| Pattern | `/patterns/`、`/patterns/[slug]/` | 列表 + 详情 |
| 产品品鉴 | `/tastings/`、`/tastings/[slug]/` | 案例列表 + 多章节详情 |
| 公司拆解 | `/anatomies/` | 当前预留 |
| 技能箱 | `/skills/`、`/skills/[slug]/` | Skill 列表 + SKILL.md 详情 |
| 视觉库 | `/presets/`、`/presets/[slug]/` | Preset 列表 + iframe / token 详情 |
| 笔记 | `/notes/` | 当前空状态 |
| 关于 | `/about/` | 内容来源 / 技术栈 / 许可 |
| 404 | `404` | 基础错误页 |

现有内容模型、collection loader、构建流程保持不变；本轮主要改**表现层、信息层级与交互组织方式**。

---

# 2. 首页 `/`


## 2.1 页面职责

首页不是“内容总目录”，只回答三个问题：

1. 这个站在研究什么？
2. 我从哪里进入？
3. 最近最值得看的是什么？

## 2.2 页面结构

### A. Hero / Knowledge Desk

左侧：
- kicker：`A QUIETER MIND · A BRIGHTER YOU`（可替换，但保持低权重）
- H1：已确认主标题
- 2–3 行副文
- CTA：`进入知识地图` / `查看最近更新`

右侧：五张“档案便签”作为一级入口：
- 方法论
- 观察
- 技能箱
- 视觉库
- 笔记

交互：
- pointer hover：`translateY(-6px)` + `rotateX/rotateY ≤ 2deg`
- focus-visible：与 hover 等价
- 点击整张便签进入栏目
- 桌面端可做 12–24px 的轻微 scroll parallax；移动端关闭
- `prefers-reduced-motion` 时完全静止

### B. 合并内容屏

一屏完成“正在沉淀 + 精选内容”。

左侧 28–32%：`正在沉淀`
- 最多 3 条长期主题
- 每条只展示标题 + 一句话问题
- 不显示详细文章、更新时间、统计等噪音

右侧 68–72%：`精选内容`
- 1 个主内容 + 2 个次内容
- 可混合方法论 / 工具 / 笔记 / 品鉴
- 最多 3 条
- 第二条思考内容可使用标题“慢，就是快”

### C. 窄幅 Footer

高度显著小于前两屏：88–112px。
- logo
- 站点一句话
- 导航简表
- GitHub / RSS

不要增加第四个“重要内容区”。

## 2.3 数据策略

首页数据由现有 collection 直接组合：
- 导航便签：固定配置，不依赖数量统计。
- 正在沉淀：建议在 `site.config.ts` 增加 `currentFocus[]` 静态配置，避免自动生成导致语义失控。
- 精选内容：建议 frontmatter 增加可选 `featured: true` 或在 `site.config.ts` 维护 `featuredEntries[]`。
- 不再显示“8 模块 / 4 Skill”等统计卡；统计信息转移到各栏目页。

---

# 3. 方法论 `/methodology/`


## 3.1 目标

像翻一套“持续修订的研究手册”，而不是浏览 8 张等权功能卡。

## 3.2 索引页

- 页首保留：方法论名、当前版本、核心命题。
- 移除 2×N 模块网格。
- 模块改为 `ModuleAccordion`：纵向档案条。
- 默认第一个模块展开；其他收起。
- 折叠态：编号 / 标题 / 一句话。
- 展开态：增加章节数、关联 Skill、最近修订、进入详情。
- Evolution Matrix 不默认完整展开：
  - 默认只显示横向版本节点 `v1 → v1.4 → v2.0 → v2.1`
  - 点击 `展开演进` 再展示完整矩阵或进入 changelog。

## 3.3 模块详情

统一 `Article System`：
- 页面 title/meta
- 核心命题摘要块
- 正文宽度 720–780px
- 右侧 sticky `ChapterNav`
- 移动端 ChapterNav 折叠为顶部目录
- 关联 skill / 案例放到文章尾部，不中断正文

## 3.4 版本历史

`/methodology/changelog/` 使用“修订档案”视觉：
- 版本节点纵向时间线
- 当前版本用 muted gold 标记
- 每个版本默认只展示 summary
- 点击展开 details 和 affected modules

---

# 4. 观察 `/observations/` 与 Pattern


## 4.1 观察 Hub

三类内容不要再做三张并排卡片。

改为“档案夹 / folder tabs”：
- Pattern 追踪
- 产品品鉴
- 公司拆解

桌面端：
- 当前 folder 处于前景
- 另外两个略后退、错位
- click / wheel / trackpad 横向切换

移动端：
- 横向 `scroll-snap`
- 每次完整露出 1 张 + 下一张 10–15% 提示

## 4.2 Pattern 列表 `/patterns/`

- 保持高信息密度，但减少视觉噪音。
- Status filter sticky。
- 每个 pattern 采用 compact row，不做卡片墙。
- 点击 row：桌面先开右侧 preview drawer；移动端直接进入详情。
- drawer 只显示 20–30% 内容：definition + status + heat + latest evolution + `阅读全文`。

## 4.3 Pattern 详情

- metadata 作为窄条置于标题下。
- 内容顺序固定：Definition → Evidence / Implementations → Evolution → PM Notes。
- Evolution 使用时间线。
- related patterns / 品鉴反链放文末。

---

# 5. 产品品鉴 / 公司拆解


## 5.1 列表页

视觉语义：**研究案卷 / dossier shelf**。

- 第一条为主案卷（Featured Case）。
- 其余条目以“书脊 / 索引卡”横向滚动。
- 不做 2×N 卡片网格。
- 卡片优先展示 verdict，不展示长 summary。

公司拆解与品鉴共用同一 `CaseIndex`，只替换字段。

## 5.2 详情页

顺序：
1. 产品 / 公司 title + meta
2. `Verdict`：唯一深墨蓝实色块
3. 章节 tabs / ChapterNav
4. 正文
5. 关联 Pattern / 使用框架

注意：Verdict 必须是真判断，不是摘要。

---

# 6. 项目复盘 / 坑库


## 6.1 复盘列表

目标：表达“现实如何反向修订方法论”。

- 使用纵向“项目档案堆”。
- 默认每条折叠。
- 折叠态优先显示：状态 / 坑数 / 影响模块 / 是否推动版本。
- 当前项目可默认展开 1 条。
- `Pitfall` 不使用红色警告，统一用 muted gold。

## 6.2 复盘详情

章节建议：
- 背景与目标
- 关键决策
- 失败 / Pitfalls
- 判断发生了什么变化
- 方法论修订
- 下一次怎么做

其中“判断如何变化”要视觉上高于项目过程描述。

## 6.3 坑库

`/pitfalls/` 作为跨项目索引：
- 默认按 methodology module 分组
- 每组 accordion
- 展开后显示来源项目、影响、修复原则
- 避免“错误大全”的负面感，定位为经验索引

---

# 7. 技能箱 `/skills/`


## 7.1 命名

站点展示文案统一：**技能箱**。

代码层 collection key 仍保留 `skills`，避免不必要迁移。

## 7.2 列表页

- 不做两列 SkillCard。
- 使用 `SkillDrawer / accordion`。
- 折叠态：display name / slug / 一句话用途。
- 展开态：来源 repo / 关联方法论 / 站内产出数量 / CTA。

## 7.3 详情页

视觉语义：**recipe / 可调用认知模块**。

信息优先级：
1. 适用什么问题
2. 如何安装 / 调用（带 copy button）
3. 输入要求
4. 分析步骤
5. 输出结构
6. 站内实际产出
7. GitHub 原始 SKILL.md

不能只把 SKILL.md 原样渲染后就结束。

---

# 8. 视觉库 `/presets/`


## 8.1 列表页

视觉语义：**样本册 / swatch archive**。

- 左侧：output type 纵向索引。
- 中间：当前 preset 大预览。
- 底部 / 右侧：其他 preset 横向滑动。
- 不使用 2 列 Preview Card 网格。

## 8.2 详情页

- 真实 iframe preview 为第一视觉层。
- `TOKENS.md` 默认折叠。
- 支持：
  - 新窗口预览
  - 复制提示词 / preset identifier
  - 展开 Typography / Color / Components / Density

---

# 9. 笔记 / 关于 / 404 / 搜索


## 9.1 笔记 `/notes/`

不要做传统博客卡片墙。

- 按年月纵向索引。
- 默认只显示日期 / 标题 / tag。
- hover / focus 可展开 1–2 行摘要。
- 未有内容时：文案使用“正在整理 / 正在沉淀”，不要“敬请期待”。

建议后续补 `/notes/[slug]/`，复用统一 Article System。

## 9.2 关于 `/about/`

弱化“关于我”，保留“关于这个站”。

只讲：
- 为什么建站
- 内容来源
- 如何持续更新
- 开源技术栈
- 许可 / 联系

不放履历时间线，不放人物照片，不做职业宣传。

## 9.3 Search

保留 Pagefind，视觉重构为“检索档案”：
- 搜索框顶部固定
- result group 显示 collection label
- title + snippet + type
- 键盘上下选择 / Enter 打开 / Esc 关闭

## 9.4 404

设计为“空档案抽屉”：
- `这份档案不存在或已被移动`
- CTA：返回首页 / 搜索档案
- 不做大插画，不抢整站视觉。

---

# 10. 统一详情页系统


长文页面统一使用 `Article System`：

- `ArticleHeader`
- `MetaStrip`
- 可选 `Verdict / KeyClaim`
- `Prose`
- `ChapterNav`
- `RelatedEntries`

适用：
- methodology detail
- pattern detail
- tasting/anatomy detail
- retro detail
- skill detail（正文段落略有差异）
- note detail（未来）

这样确保内容类型扩展时，仍保持阅读节奏一致。

---

# 11. 全局交互规则

## 11.1 渐进披露优先级

优先使用：
1. accordion
2. sticky index
3. horizontal scroll / scroll-snap
4. preview drawer
5. hover / focus reveal

少用：
- 同屏 6+ 张平铺卡片
- 大面积自动轮播
- 内容无关 3D / canvas 特效

## 11.2 动效预算

- hover：150–220ms
- accordion：220–320ms
- drawer：260–360ms
- section reveal：320–450ms
- hero parallax：只做轻位移，不做缩放穿越

所有动效使用 transform + opacity，避免 layout thrash。

## 11.3 无障碍

- 所有 hover 必须有 keyboard focus 等价。
- accordion 使用 `<button aria-expanded>`。
- drawer 使用 dialog / focus trap。
- `prefers-reduced-motion: reduce` 时取消 tilt / parallax / smooth choreography。
- 颜色不是唯一状态信息载体。

---

# 12. 响应式

## Desktop ≥ 1024
- Hero 50/50 左右布局。
- 档案便签可 hover tilt。
- ChapterNav sticky。
- preview drawer 从右侧进入。

## Tablet 768–1023
- Hero 45/55。
- 五张便签缩小并允许局部横向滑动。
- ChapterNav 改折叠目录。

## Mobile < 768
- Hero 文案在上，入口便签下方横向 scroll-snap。
- 当前关注和精选改为上下布局。
- 主精选 1 条 + 次精选最多 2 条。
- 所有内容抽屉直接进入详情或 full-screen sheet。
- Footer 单行信息优先，次要导航隐藏。

---

# 13. 开发验收

### 设计一致性
- [ ] 首页无统计卡片墙。
- [ ] 首页中段仅“正在沉淀 + 精选内容”。
- [ ] Footer 明显低于主体视觉权重。
- [ ] `工具箱` 所有用户可见文案改为 `技能箱`。
- [ ] 全站没有大面积纯科技蓝 / 霓虹渐变。
- [ ] 毛玻璃只用于导航、便签、抽屉、轻容器，不用于长文正文。

### 交互
- [ ] 至少 4 类页面使用渐进披露而非全量平铺。
- [ ] 所有 accordion 可键盘操作。
- [ ] 移动端 horizontal scroll 有 scroll-snap。
- [ ] reduced motion 生效。

### 内容
- [ ] 首页最多 3 条精选。
- [ ] 首页当前关注最多 3 条。
- [ ] 每个详情页存在明确的下一步：关联内容 / 下一章节 / GitHub 源。

---

# 14. 实施建议顺序

P0：Design System / tokens / Header / Footer / Search  
P0：首页  
P0：统一 Article System  
P1：方法论 + Pattern  
P1：技能箱 + 视觉库  
P1：复盘 + 坑库  
P2：品鉴 / 公司拆解  
P2：笔记 + About + 404

