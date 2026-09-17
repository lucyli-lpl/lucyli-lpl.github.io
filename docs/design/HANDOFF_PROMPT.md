# Prompt to start the Claude / Fable 5.1 implementation

Use this prompt from the repository root after placing the handoff files into the project.

---

You are taking over implementation of the lucyli-lpl website redesign.

Before editing code, read these files in this exact order:

1. `CLAUDE.md`
2. `docs/design/final-visual-overview.png`
3. `design.md`
4. `PRD.md`
5. `implementation-map.md`
6. `acceptance-checklist.md`
7. existing `tech.md`

Then inspect the current Astro project and produce a concise implementation plan mapped to existing files/components.

Important:
- the visual design is approved; do not redesign it
- the homepage is the visual mother-language for all pages
- use the current Astro/content architecture rather than replacing it
- you have freedom to choose motion/interaction technology when it improves fidelity
- motion is part of the product experience, but must remain progressive enhancement
- user-facing `工具箱` becomes `技能箱`; route/collection key may remain `skills`
- do not implement the whole site in one unreviewable rewrite

Work checkpoint by checkpoint:
1. tokens/materials/global shell
2. header/footer/search
3. homepage
4. Article System
5. methodology
6. observations/patterns
7. skills/presets
8. retros/pitfalls/cases
9. notes/about/404
10. responsive, accessibility, motion and performance polish

At each checkpoint:
- run the build
- inspect desktop + mobile
- compare visually against the approved reference
- summarize what changed and any design fidelity risks
- do not proceed through a known visual regression

Start by auditing the repository against the handoff docs and give me the implementation plan. Do not change code until the audit is complete.
