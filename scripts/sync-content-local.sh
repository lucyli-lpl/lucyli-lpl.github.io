#!/usr/bin/env bash
# Local dev: symlink sibling repos instead of cloning from GitHub
set -e

SITE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PROJECTS_DIR="$(cd "$SITE_DIR/.." && pwd)"

rm -rf "$SITE_DIR/.content"
mkdir "$SITE_DIR/.content"

for r in ai-design-patterns ai-business-anatomy ai-pm-fieldbook; do
  if [ -d "$PROJECTS_DIR/$r" ]; then
    cp -r "$PROJECTS_DIR/$r" "$SITE_DIR/.content/$r"
    echo "Copied $r"
  else
    echo "WARN: $PROJECTS_DIR/$r not found, skipping"
  fi
done

# Copy preset assets
mkdir -p "$SITE_DIR/public/presets" "$SITE_DIR/public/content"
for d in "$SITE_DIR/.content/ai-design-patterns/skills/visual-library/presets"/*/*/; do
  if [ -d "$d" ]; then
    slug="$(basename "$(dirname "$d")")--$(basename "$d")"
    mkdir -p "$SITE_DIR/public/presets/$slug"
    cp "$d/example.html" "$d/preview.png" "$SITE_DIR/public/presets/$slug/" 2>/dev/null || true
  fi
done

# Copy methodology diagrams
for mod_dir in "$SITE_DIR/.content/ai-pm-fieldbook/methodology"/*/; do
  mod_name="$(basename "$mod_dir")"
  if [ -f "$mod_dir/diagram.svg" ]; then
    mkdir -p "$SITE_DIR/public/content/methodology/$mod_name"
    cp "$mod_dir/diagram.svg" "$SITE_DIR/public/content/methodology/$mod_name/"
  fi
done

echo "Local sync complete"
