/**
 * 把 src/assets/img/*.png 压成站点用的 webp，输出到 public/img/。
 * 摄影素材：1440 / 800 两档；纸张纹理：800 方形平铺图。
 * 用法：pnpm images
 */
import sharp from 'sharp';
import { readdirSync, mkdirSync, statSync } from 'node:fs';
import { resolve, basename, extname } from 'node:path';

const SRC = resolve('src/assets/img');
const OUT = resolve('public/img');
mkdirSync(OUT, { recursive: true });

const PHOTO_WIDTHS = [1440, 800];

for (const file of readdirSync(SRC)) {
  if (!/\.(png|jpe?g)$/i.test(file)) continue;
  const name = basename(file, extname(file));
  const input = resolve(SRC, file);
  const meta = await sharp(input).metadata();

  if (name === 'paper-texture') {
    const out = resolve(OUT, `${name}.webp`);
    await sharp(input).resize(800, 800, { fit: 'cover' }).webp({ quality: 68 }).toFile(out);
    console.log(`${name}.webp  800x800  ${(statSync(out).size / 1024).toFixed(0)} KB`);
    continue;
  }

  for (const w of PHOTO_WIDTHS) {
    if (meta.width && meta.width < w) continue;
    const out = resolve(OUT, `${name}-${w}.webp`);
    await sharp(input).resize({ width: w }).webp({ quality: 76 }).toFile(out);
    console.log(`${name}-${w}.webp  ${(statSync(out).size / 1024).toFixed(0)} KB`);
  }
}
