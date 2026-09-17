# implementation-map.md — Existing Astro → v3 Design

## 1. Repository baseline

The current repository already has the right content architecture and should be evolved, not replaced.

Key existing files:

- `src/pages/index.astro` — current homepage
- `src/pages/methodology/`
- `src/pages/observations/`
- `src/pages/patterns/`
- `src/pages/tastings/`
- `src/pages/anatomies/`
- `src/pages/retros/`
- `src/pages/pitfalls/`
- `src/pages/skills/`
- `src/pages/presets/`
- `src/pages/notes/`
- `src/pages/about/`
- `src/components/`
- `src/styles/tokens.css`
- `src/styles/global.css`
- `src/styles/prose.css`
- `site.config.ts`

The current public nav includes Methodology, Retros, Observations, Tools/Skills, Visual Library, Notes, About. Keep the routes and collection keys stable. Rename only the user-facing `工具箱` copy to `技能箱`.

---

# 2. Global system mapping

| Existing | v3 action | Notes |
|---|---|---|
| `src/styles/tokens.css` | Rewrite tokens | Warm paper + ink navy + blue-gray + silver + muted gold |
| `global.css` | Extend | Add editorial layout, archive backgrounds, global focus states |
| `prose.css` | Keep + retheme | Reading remains restrained; no glass body surfaces |
| `Base.astro` | Keep | Add page transition hooks / global motion hooks if chosen |
| `SiteHeader.astro` | Redesign | warm translucent editorial header, active marker, compact scroll state |
| `SiteFooter.astro` | Redesign | compact variant on home; restrained elsewhere |
| `SearchModal.astro` | Redesign | “archive search” styling; keep Pagefind |
| `PageHeader.astro` | Split role | use `SectionIntro` for indexes and `ArticleHeader` for details |
| `Tag.astro` | Keep | retheme |
| `StatusBadge.astro` | Keep | retheme; avoid loud semantic colors |
| `Timeline.astro` | Keep | archive revision styling |
| `ChapterNav.astro` | Keep | editorial sticky index; mobile collapsible |
| `Verdict.astro` | Keep selectively | only for strong judgment/key conclusion |
| `EmptyState.astro` | Redesign | “empty archive / still being整理” rather than generic empty state |

Suggested new components:

- `ArchiveNote.astro`
- `ResearchBoard.astro`
- `CurrentFocus.astro`
- `FeaturedEditorial.astro`
- `ModuleAccordion.astro`
- `EvolutionStripV3.astro`
- `ObservationFolders.astro`
- `PreviewDrawer.astro`
- `CaseShelf.astro`
- `SkillDrawerList.astro`
- `PresetGallery.astro`
- `NoteTimeline.astro`
- `SectionIntro.astro`
- `ArticleHeader.astro`
- `MetaStrip.astro`
- `RelatedEntries.astro`

Do not create all components preemptively. Build them when a page proves the abstraction useful.

---

# 3. Homepage `/`

Current implementation is hero + stat cards + recent updates. Replace that composition completely while reusing collection data.

## New composition

### `HomeHero`
Left:
- kicker
- approved H1
- concise description
- primary CTA `进入知识地图`
- secondary CTA `查看最近更新`

Right:
- research board made of five clickable `ArchiveNote`s:
  - 方法论 → `/methodology/`
  - 观察 → `/observations/`
  - 技能箱 → `/skills/`
  - 视觉库 → `/presets/`
  - 笔记 → `/notes/`

### Combined second screen
Left 28–32%:
- `CurrentFocus`, max 3 items

Right 68–72%:
- `FeaturedEditorial`, exactly 1 primary + up to 2 secondary entries

### Footer
Compact, visually subordinate.

## Remove from homepage
- stat-card wall
- 8-entry recent update list
- collection-count-first navigation

## Optional data additions
In `site.config.ts`:

```ts
export const currentFocus = [
  { title: '学习方法论', question: '如何更高效地学习、思考和构建个人知识体系？' },
  { title: '信息整理与写作', question: '如何让知识真正被理解、连接与输出？' },
  { title: '产品与设计思维', question: '好的产品、工具与设计如何提升学习与生活？' },
]

export const featuredEntries = [
  // stable IDs / hrefs, manually curated
]
```

Manual curation is intentional: homepage editorial judgment should not be auto-generated from recency alone.

---

# 4. Methodology

## `/methodology/`

Current: `PageHeader` + Verdict + 2-column `CardModule` grid + full EvolutionMatrix.

Replace with:

- editorial `SectionIntro`
- small current-version marker
- `ModuleAccordion` vertical archive stack
- first module may open by default
- `EvolutionStripV3` compact by default
- full EvolutionMatrix appears only after explicit expansion or on changelog page

Archive row collapsed state:
- order
- title
- one-liner

Expanded state:
- chapter count
- related skills
- since version / last revision
- CTA to detail

## `/methodology/[slug]/`

Move into Unified Article System.

Preserve content order and existing generated chapters.

Add:
- archive-like header
- KeyClaim block
- sticky ChapterNav
- related skills / cases at bottom
- prev/next module

## `/methodology/changelog/`

Keep Timeline concept, but style as revision archive.

Current version uses muted gold marker.

---

# 5. Observations + Patterns

## `/observations/`

Current 3 equal cards are replaced by `ObservationFolders`.

Desktop:
- three layered folders, current one forward
- click switches front folder and preview content

Mobile:
- horizontal scroll-snap, one folder per viewport with next-edge hint

## `/patterns/`

Keep compact rows; do not convert to cards.

Enhance:
- sticky filter bar
- row hover/focus preview affordance
- desktop `PreviewDrawer`
- mobile direct route or full-screen sheet

Drawer content:
- name/status/heat
- short definition
- latest evolution item
- `阅读全文`

## `/patterns/[slug]/`

Unified Article System with Evolution Timeline.

---

# 6. Tastings / Anatomies

Use one shared `CaseShelf` index pattern.

Index composition:
- one featured dossier
- compact horizontal case rail
- verdict first, summary second

Detail composition:
- ArticleHeader
- Verdict
- ChapterNav
- Prose
- related patterns
- framework/skill reference

---

# 7. Retros / Pitfalls

## `/retros/`

Current full cards become archive accordions.

Collapsed shows:
- status
- pitfall count
- affected modules
- produced methodology version, if any

Expanded shows summary + key change + CTA.

## `/pitfalls/`

Group by methodology module.

Each group is accordion-like.
Muted gold is the marker color; do not use alarming red.

## Retro detail

Use Article System but introduce a `LearningShift` block for “what changed in my judgment”.

That block has higher visual priority than chronological project details.

---

# 8. Skills

Public label: `技能箱`.

Keep `/skills/` route and `skills` collection.

## `/skills/`

Replace two-column skill grid with `SkillDrawerList`.

Collapsed:
- display name
- slug
- one sentence use case

Expanded:
- source repo
- related methodology
- site outputs
- “查看 skill” CTA

## `/skills/[slug]/`

Order content as:
1. What problem is this for?
2. Install / invoke
3. Inputs
4. Process
5. Output structure
6. Site examples produced by this skill
7. Raw SKILL.md / GitHub source

Do not simply dump SKILL.md as the primary UX.

---

# 9. Presets

## `/presets/`

Replace 2-column cards with `PresetGallery`:
- output type index
- one large preview stage
- horizontal preset rail

## `/presets/[slug]/`

Priority:
1. real iframe preview
2. actions: new window / copy preset identifier
3. design decisions
4. collapsible tokens sections

This page may have the richest interaction after homepage, because a visual preset benefits from direct inspection.

---

# 10. Notes / About / 404

## Notes
Use date-oriented `NoteTimeline`, not blog-card wall.

## About
Keep “关于这个站” framing; no personal résumé timeline.

## 404
“这份档案不存在或已被移动” + Return / Search.

---

# 11. Motion implementation suggestions

This section is intentionally outcome-driven, not prescriptive.

### Home notes
Desired effect: layered research notes have depth, respond to pointer subtly, and feel “picked up” on hover/focus.

Possible tech: CSS transforms, pointer tilt utility, Motion One, GSAP.

### Page transitions
Desired effect: navigation between an archive-note entry and target index should feel continuous where practical.

Possible tech: View Transitions API with progressive enhancement.

### Methodology accordion
Desired effect: dossier unfolding, not generic height animation.

Possible tech: CSS grid animation + small transform layers; GSAP if necessary.

### Observation folders
Desired effect: selected folder slides forward, inactive folders offset behind.

Possible tech: CSS transforms / FLIP / GSAP Flip.

### Preset gallery
Desired effect: sample-book browsing with scroll-snap and optional drag.

Possible tech: native scroll-snap; enhance with pointer drag or Motion One.

### Section choreography
Desired effect: paper layers settle into place, not every element doing generic fade-up.

Avoid uniform “all cards animate from y=20” behavior.
