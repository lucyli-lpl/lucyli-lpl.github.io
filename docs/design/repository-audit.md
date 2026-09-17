# repository-audit.md — Current implementation baseline

Audit date: 2026-09-17
Repository: `lucyli-lpl/lucyli-lpl.github.io`

## Architecture to preserve

- Astro 5 static site
- GitHub Pages deployment
- Pagefind static search
- content collections / loaders
- routes already split by domain
- centralized `site.config.ts`
- CSS token architecture

## Existing top-level routes observed

- `/`
- `/methodology/` + detail + changelog
- `/retros/` + detail
- `/pitfalls/`
- `/observations/`
- `/patterns/` + detail
- `/tastings/` + detail
- `/anatomies/`
- `/skills/` + detail
- `/presets/` + detail
- `/notes/`
- `/about/`
- RSS / 404

## Existing reusable components observed

- Breadcrumb
- Callout
- CardModule
- ChapterNav
- EmptyState
- EvolutionMatrix
- EvolutionStrip
- GrowthLog
- ListRow
- MechanismFlow
- PageHeader
- PatternStatusBar
- PitfallCard
- ProductCards
- SearchModal
- SiteFooter
- SiteHeader
- StatusBadge
- Tag
- Timeline
- Verdict

## Main redesign pressure points

### Homepage
Current implementation is hero + count/stat cards + up to 8 recent-update rows. This conflicts with the approved v3 low-density editorial structure and should be replaced compositionally, not merely reskinned.

### Methodology
Current index uses a Verdict + 2-column module cards + full EvolutionMatrix. The new design intentionally replaces the card grid with progressive disclosure and pushes full evolution detail deeper.

### Observations
Current page uses three equal cards. This is a major design mismatch and becomes layered folder navigation.

### Skills
Current page is a 2-column skill grid. This becomes a drawer/accordion-like skill archive.

### Presets
Current page is a 2-column preview card grid. This becomes a sample-book/gallery composition.

### Notes
Current page is essentially an empty state. It can adopt the new timeline/index pattern without migration cost.

### About
Current content is structurally compatible. The redesign should focus on presentation and hierarchy, not expand personal biography.

## Config naming note

`site.config.ts` currently exposes `工具箱` publicly and maps the `skills` collection to that nav label. In v3, change user-visible strings to `技能箱`; keep the collection key and route `/skills/` unchanged.

## Dependency baseline

Current package is lightweight: Astro, RSS, gray-matter, js-yaml, marked, Pagefind. There is currently no animation framework dependency. The v3 handoff intentionally allows adding one localized motion dependency if it improves fidelity enough to justify it.
