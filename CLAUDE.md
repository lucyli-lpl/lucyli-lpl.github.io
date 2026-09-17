# CLAUDE.md — lucyli-lpl v3 Implementation Handoff

## Mission

Implement the approved v3 visual direction for `lucyli-lpl/lucyli-lpl.github.io`.

The site should feel like an **editorial research archive / knowledge newsroom**: warm paper, ink navy, blue-gray, silver/glass detail, muted gold markers, real research-material semantics, strong typography, progressive disclosure, and deliberate motion.

This is not a redesign exercise. The design has been decided. Your job is to reproduce and implement it faithfully while using strong engineering judgment.

## Source of truth priority

When sources conflict, use this order:

1. `docs/design/final-visual-overview.png`
2. page-specific approved visual references in `docs/design/`
3. `design.md`
4. `PRD.md`
5. `implementation-map.md`
6. current code and legacy `design.md` behavior
7. your own design preference

**Do not re-design visual hierarchy, palette, content density, or component language on your own.**

You do have freedom on implementation technology and motion technique if it improves fidelity and maintainability.

## Current stack

The existing project is Astro 5, static output, GitHub Pages, Pagefind, CSS tokens, markdown/content collections. Preserve the content/data architecture unless implementation genuinely requires a minimal extension.

Do not replace Astro with another app framework.

## Technical freedom

You may use, when justified:

- CSS scroll-driven animations
- View Transitions API
- GSAP / ScrollTrigger
- Motion One
- CSS 3D transforms
- native Web Animations API
- small client-side islands
- localized Three.js only if it materially strengthens the archive-space experience

Do not add a library merely to satisfy a checklist. Choose the lightest robust solution for the intended effect.

If you add a runtime dependency, document why in the PR description and keep it localized.

## Motion hierarchy

Implement effects by priority:

### Core — required
- accordion/drawer progressive disclosure
- sticky section/index behavior
- horizontal scroll-snap where specified
- clear hover/focus states
- accessible mobile equivalents
- reduced-motion support
- page transitions should not feel abrupt where browser support allows graceful enhancement

### Delight — strongly desired
- homepage archive notes lift/tilt slightly on pointer hover
- notes feel physically layered; active item comes forward
- methodology accordion opens like an archive folder rather than a generic SaaS panel
- observation folders reorganize spatially on selection
- preset gallery behaves like a sample book / swatch archive
- section entrances use subtle paper/material motion, not generic fade-up everywhere

### Experimental — optional
- shared-element-like transitions between homepage notes and destination headers
- subtle depth/parallax of research-board layers
- drag interaction for sample/preset browsing
- localized 3D perspective where it stays readable and performant

Experimental behavior must gracefully fall back and may not block navigation.

## Hard visual constraints

- no hero people imagery
- no scenic mountain/lake image as the core semantic background
- no SaaS dashboard look
- no neon or high-saturation tech gradients
- no giant equal-weight card grids
- no glassmorphism everywhere
- no dense homepage metrics wall
- no redesign of the homepage into a portfolio/resume
- user-facing label is `技能箱`, while code collection key remains `skills`

## Homepage copy

Use the approved main title:

> 让学习和实践沉淀为方法，构建更清晰的思考体系。

The secondary featured thought uses:

> 慢，就是快

## Implementation sequence

Do not rewrite all pages at once. Work in checkpoints:

1. design tokens + materials + typography + global shell
2. SiteHeader / SiteFooter / SearchModal
3. homepage
4. shared Article System
5. Methodology index/detail/changelog
6. Observations + Patterns
7. Skills + Presets
8. Retros + Pitfalls + Cases
9. Notes + About + 404
10. responsive polish + motion polish + accessibility + performance

After each major checkpoint:

- run the build
- visually inspect desktop and mobile
- compare against `docs/design/final-visual-overview.png`
- fix design drift before moving on

## Design drift check

Before considering a page complete, ask:

1. Does it look like it belongs to the same physical/editorial archive as the homepage?
2. Is information progressively disclosed instead of flattened?
3. Is there a clear visual priority, or did I accidentally make every region equally important?
4. Are images semantically related to the content?
5. Is interaction helping exploration rather than showing off animation tech?

If any answer is no, revise before proceeding.

## Accessibility / performance

- keyboard access for every interactive control
- use semantic buttons/links
- `aria-expanded` for accordions
- focus management for drawers/sheets
- `prefers-reduced-motion` supported
- no essential hover-only information
- 375px mobile width must not produce page-level horizontal scrolling except deliberate local rails/tables
- avoid layout thrash; prefer transform/opacity
- lazy-load noncritical images
- do not make WebGL or JS required for base content access

## Completion

Use `acceptance-checklist.md` as the final gate. Do not mark the redesign complete while any P0 item remains failing.

## Status (2026-09-17)

Implemented under a **reduced scope** agreed with the author — see `docs/PROGRESS.md` §2–§3 for what is done, what is intentionally deferred (pattern drawer, folder switching, preset gallery, retro/pitfall accordions, notes index) and the content-volume thresholds for revisiting each. Do not treat the checklist P0s for those items as failures. The implemented component/token specs are in `design.md` Appendix A and take precedence over §2–§16 where they differ.
