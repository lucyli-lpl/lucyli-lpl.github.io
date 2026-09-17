# PROGRESS.md — 站点建设进度与未做项

更新：2026-09-17  
线上：https://lucyli-lpl.github.io  
相关：`design.md` 附录 A（实现规格）、`PRD.md`（v2 设计方向）、`docs/design/acceptance-checklist.md`（验收清单）

---

## 1. 里程碑总览

| 阶段 | 内容 | 状态 | 关键提交 |
|---|---|---|---|
| M0–M4 | Astro 站点、7 个 collection、loader、CI/CD、搜索、RSS | ✅ | `dcc3e13` … |
| M5 | 内容仓库 push → `repository_dispatch` → 站点 90s 内重建 | ✅ | notify-site.yml ×3 |
| 方法论可视化 | 模块 × 版本演化矩阵、模块页成长记录、CHANGELOG `trigger`/`retro` 字段 | ✅ | `dcfe164` |
| 复盘体系 | `retros` collection、坑库、与方法论双向链接、模板与 inbox | ✅ | `4ec3695` |
| Pattern 可视化 | 解析 DATA_SCHEMA 结构化渲染、驱动力泳道、行业演化全景 | ✅ | `c27d6e3` |
| 中文化 | 两个 pattern 正文中文，结构标题保留双语 | ✅ | ai-design-patterns `0628358` |
| **v2 视觉改版** | 见下表 | 🟡 缩减范围已完成 | `38eeee4` → `23bc691` |

## 2. v2 改版：10 个 checkpoint 的完成情况

| # | Checkpoint | 状态 | 说明 |
|---|---|---|---|
| 1 | tokens / materials / motion / 全局壳 | ✅ | 别名机制让旧组件零改动换肤 |
| 2 | Header / Footer / Search | ✅ | 金点 active、⌘K、检索档案 + 键盘选择、技能箱改名 |
| 3 | 首页 | ✅ | 研究板 5 便签、正在沉淀 + 精选、窄 footer；统计卡墙已移除 |
| 4 | 统一 Article System | ✅ | ArticleHeader / KeyClaim / RelatedEntries / 侧栏整体 sticky；方法论、品鉴、pattern、复盘详情已接入 |
| 5 | 方法论索引 / 详情 / changelog | ✅ 索引 + 详情<br>🟡 changelog | 索引 accordion + 版本条 + 矩阵折叠；详情核心命题块；**changelog 页仅换皮**（卡片式，未做"修订档案"纵向时间线与 details 折叠） |
| 6 | 观察 + Pattern | 🟡 | 观察页三张错位档案夹（静态，无前景切换）；pattern 列表未加 sticky 筛选与预览抽屉；pattern 详情已用 ArticleHeader |
| 7 | 技能箱 + 视觉库 | 🟡 | 技能箱 drawer 列表 + 详情重排 ✅；**视觉库未动**（仍是 2 列卡片，只换了皮） |
| 8 | 复盘 + 坑库 + 案例 | 🟡 | 复盘详情 Learning Shift 块 ✅、坑标记金色 ✅、品鉴详情 ArticleHeader ✅；**复盘列表未做 accordion、坑库未做分组折叠、品鉴列表未做 CaseShelf** |
| 9 | 笔记 / 关于 / 404 | ⬜ | 只随页头组件换皮；未做日期索引、关于页重排、"空档案抽屉" 404 |
| 10 | 响应式 / 无障碍 / 动效 / 性能打磨 | 🟡 | 375px 无溢出、reduced-motion、键盘 accordion 已验证；未做系统性 a11y 审计、未跑 Lighthouse |

## 3. 有意不做的项（及重新评估的触发条件）

这些是 2026-09-17 与作者商定的**缩减范围**，理由都是"内容量撑不起交互"。不是遗漏，不要因为 CLAUDE.md / acceptance-checklist 列为 P0 就补做。

| 项 | 设计要求 | 为什么现在不做 | 什么时候做 |
|---|---|---|---|
| Pattern 预览抽屉 | 桌面点 row 先开右侧 drawer | 只有 2 个 pattern，省一次点击没有意义；抽屉需要 focus trap、移动端 sheet，成本高 | pattern ≥ 6 |
| 观察页层叠文件夹切换 | 前景/后景切换、wheel 横向 | 公司拆解为空，三个夹子里一个是空的 | 三类内容都 ≥ 3 |
| 视觉库样本册画廊 | 左类型索引 + 大预览台 + 横向轨 | 只有 1 个 preset，会像空货架 | preset ≥ 4，或出现第二种 output type |
| 复盘列表 accordion | 纵向档案堆，默认折叠 | 只有 1 篇复盘，折叠反而多一步 | 复盘 ≥ 4 |
| 坑库分组折叠 | 每个模块一组 accordion | 3 个坑全在模块 5，一组 | 坑 ≥ 10 或跨 ≥ 3 个模块 |
| 品鉴 CaseShelf | 主案卷 + 横向书脊 | 只有 1 篇品鉴 | 品鉴 + 拆解 ≥ 4 |
| 笔记日期索引 | 年/月纵向索引 + hover 摘要 | 笔记 collection 为空 | 第一篇笔记写出来时 |
| Experimental 动效 | 共享元素过渡、多层视差、拖拽样本册、局部 3D | 明确为可选项；当前内容不需要 | 视觉库画廊做的时候一起评估拖拽 |

## 4. 已知小缺口（内容量无关，有空就做）

- changelog 页改成"修订档案"纵向时间线，当前版本金色，details 折叠
- pattern 列表 status 筛选条 sticky
- 关于页按 PRD §9.2 重排（为什么建站 / 内容来源 / 如何更新 / 技术栈 / 许可），去掉简历感
- 404 改成"这份档案不存在或已被移动" + 返回 / 检索
- 笔记页空状态文案（已是"正在整理"），加日期索引骨架
- `CardModule.astro` 已无引用，可删
- 搜索结果按 collection 分组显示（现在只有 tag）
- Lighthouse / axe 审计一次；`<img>` 全部补 width/height 防 CLS

## 5. 内容侧待办

- CHANGELOG 三处 `# TODO` 触发源待作者确认：v2.1、v1.9、v1.5
- 复盘《慎用反例与兜底》的三条原则尚未写进方法论模块 5；下次修订时在 CHANGELOG 新条目加 `trigger: project` + `retro: 2026-09-negative-examples`
- 首页 `featuredEntries` 第三条现在是这篇复盘，原"v2.1 迭代记录"被替换，作者可在 `site.config.ts` 调整
- 素材：hero 更合适的"文件夹 01–04 + 中心留白"那张图丢失，如能重出（16:9，≥2400 宽）可替换 `board-wall-wide`

## 6. 关键决策记录

| 日期 | 决策 | 理由 |
|---|---|---|
| 09-16 | 内容仓库是唯一事实源；`.content/` 是可丢弃的 clone | 曾因本地内容未推送导致线上空站 |
| 09-16 | 演化矩阵以"演化"而非"结构"为可视化核心 | 复盘越多图越有料，与"方法论 + 复盘迭代"同构 |
| 09-17 | v2 改版按缩减范围执行（见 §3） | 内容量不足；先拿视觉和文章系统的 80% 收益 |
| 09-17 | 色板以 design.md token 为准，不用总览图上的 hex | 图片里的色值是模型"画"出来的，不可靠 |
| 09-17 | "慢，就是快"是笔记模块的展示别名，不是文章标题 | 作者澄清 |
| 09-17 | 心得脱敏后进 `retros/` 而非 `notes/` | 复盘能与坑库、模块页、矩阵双向连通，笔记不能 |
| 09-17 | 纸色提亮到 #FAF7F1、纹理 16% | 作者反馈主体比 header/hero 偏黄 |
| 09-17 | 首屏不依赖入场动画 | 合成线程被节流时首绘为空；LCP |
