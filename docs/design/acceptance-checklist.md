# acceptance-checklist.md — v3 Release Gate

Use this as the final implementation QA. P0 items are mandatory.

## A. Visual identity

- [ ] **P0** Every primary page visibly belongs to the same editorial research archive as the homepage.
- [ ] **P0** Warm paper dominates the foundation; navy/blue-gray carries hierarchy; silver/glass is restrained; gold is a marker only.
- [ ] **P0** No primary page looks like the old scholar template or a generic academic document page.
- [ ] **P0** No generic SaaS card dashboard appears anywhere.
- [ ] **P0** No people imagery in hero or major section art.
- [ ] **P0** No scenic landscape used as irrelevant filler.
- [ ] Images communicate the content domain: paper notes, diagrams, tools, UI, dossiers, research material, sample pages.
- [ ] Glass surfaces are limited and purposeful.
- [ ] Gold accents stay scarce enough to remain meaningful.

## B. Homepage

- [ ] **P0** H1 is `让学习和实践沉淀为方法，构建更清晰的思考体系。`
- [ ] **P0** Five primary archive-note entries are present and clickable.
- [ ] **P0** `工具箱` is shown as `技能箱` in user-facing copy.
- [ ] **P0** Homepage has no stat-card wall.
- [ ] **P0** Current Focus and Featured Content share one combined main screen/section.
- [ ] Current Focus has max 3 items.
- [ ] Featured Content has max 3 items (1 primary + up to 2 secondary).
- [ ] Secondary thought includes `慢，就是快` where designed.
- [ ] Footer is narrow and visually subordinate.

## C. Progressive disclosure

- [ ] **P0** Methodology modules are accordion/archive rows, not 2-column equal cards.
- [ ] **P0** Skills use an expandable list/drawer pattern, not a flat card grid.
- [ ] **P0** Full Evolution Matrix is not dumped above the fold.
- [ ] **P0** Observations use layered folders / spatial navigation rather than three equal cards.
- [ ] **P0** Presets use gallery/sample-book behavior rather than a 2-column grid.
- [ ] Retros use archive-style expansion.
- [ ] Pitfalls are grouped and expandable.

## D. Motion

- [ ] **P0** All motion is optional enhancement; base navigation works without it.
- [ ] **P0** `prefers-reduced-motion` removes tilt/parallax/choreography.
- [ ] Homepage notes have subtle lift/depth interaction on fine pointers.
- [ ] Methodology expansion feels spatial/editorial rather than generic collapse.
- [ ] Observation folder selection has spatial continuity.
- [ ] Preset browsing supports native scroll-snap.
- [ ] Page transitions enhance continuity where browser support allows.
- [ ] No long scroll hijacking.
- [ ] No effect blocks reading or clicking.

## E. Reading system

- [ ] **P0** Long-form body width remains readable (~720–780px).
- [ ] **P0** Article body is paper, not glass.
- [ ] **P0** ChapterNav is sticky on desktop and collapsible on smaller screens.
- [ ] H2/H3 hierarchy is consistent.
- [ ] Related content appears after the main article, not in the reading path.
- [ ] Verdict/KeyClaim blocks are used only when content semantics justify them.

## F. Accessibility

- [ ] **P0** All interactions usable with keyboard.
- [ ] **P0** Accordions expose `aria-expanded`.
- [ ] **P0** Drawer/sheet focus is managed correctly.
- [ ] **P0** Focus states are visible.
- [ ] Hover does not reveal the only way to access critical content.
- [ ] Color is not the only state indicator.

## G. Responsive

- [ ] **P0** 375px viewport has no page-level horizontal overflow.
- [ ] Homepage notes become intentional horizontal rail or stack on mobile.
- [ ] Observation folders use scroll-snap on mobile.
- [ ] Preset gallery remains browsable on touch devices.
- [ ] Desktop preview drawer becomes route/full-screen sheet on mobile.
- [ ] Header/menu/search remain usable at 320–375px.

## H. Performance / engineering

- [ ] **P0** Existing Astro content collections and route contracts remain intact.
- [ ] **P0** Build succeeds.
- [ ] **P0** Pagefind still works.
- [ ] **P0** GitHub Pages static deployment still works.
- [ ] New JS is localized to pages/components that need it.
- [ ] Noncritical imagery is lazy-loaded.
- [ ] No essential content requires WebGL.
- [ ] Any new dependency has a documented reason.

## I. Final drift review

For each primary page, compare side-by-side with `docs/design/final-visual-overview.png` and answer:

- [ ] Does this feel like the same archive space?
- [ ] Is the visual hierarchy intentional rather than evenly distributed?
- [ ] Are the materials and imagery semantically meaningful?
- [ ] Did engineering convenience flatten a designed interaction into a generic card grid?
- [ ] Did any old scholar visual rule leak back into the new design?

If any answer indicates drift, revise before release.
