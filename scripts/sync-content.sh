#!/usr/bin/env bash
set -e

rm -rf .content && mkdir .content

for r in ai-design-patterns ai-business-anatomy ai-pm-fieldbook; do
  git clone --depth 1 "https://github.com/lucyli-lpl/$r" ".content/$r"
done

# Copy preset assets (example.html + preview.png) to public
mkdir -p public/presets public/content
for d in .content/ai-design-patterns/skills/visual-library/presets/*/*/; do
  slug="$(basename "$(dirname "$d")")--$(basename "$d")"
  mkdir -p "public/presets/$slug"
  cp "$d/example.html" "$d/preview.png" "public/presets/$slug/" 2>/dev/null || true
done

# Copy methodology diagrams to public
for mod_dir in .content/ai-pm-fieldbook/methodology/*/; do
  mod_name="$(basename "$mod_dir")"
  if [ -f "$mod_dir/diagram.svg" ]; then
    mkdir -p "public/content/methodology/$mod_name"
    cp "$mod_dir/diagram.svg" "public/content/methodology/$mod_name/"
  fi
done
