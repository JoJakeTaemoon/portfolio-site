// Resized copies of the masked screenshots (scripts/mask-shots.ts --thumbs): shot-3.png -> shot-3-160.png, ...
// Only widths up to 70% of the original exist. Relative imports only so node can run it directly.
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const WIDTHS = [128, 160, 320, 640];
/** Variants worth making for an original `w` wide: at most 70% of it (a canvas PNG of nearly the same size is no lighter than the optimised original). */
export const variantWidths = (w: number) => WIDTHS.filter((x) => x <= w * 0.7);
const variant = (src: string, w: number) => src.replace(/\.png$/, `-${w}.png`);

/** `srcset` for a /img/*.png under public/: every variant narrower than the original, plus the original. undefined = nothing to choose from. */
export function srcSet(src: string): string | undefined {
  if (!/^\/img\/.+\.png$/.test(src)) return undefined;
  let w: number;
  try {
    w = readFileSync(join(process.cwd(), "public", src)).readUInt32BE(16); // PNG IHDR width
  } catch {
    return undefined;
  }
  const ws = variantWidths(w);
  return ws.length ? [...ws.map((x) => `${variant(src, x)} ${x}w`), `${src} ${w}w`].join(", ") : undefined;
}

/** Width and height of a /img/*.png under public/ (PNG IHDR), for the img's width and height attributes. */
export function pngSize(src: string): { width: number; height: number } | undefined {
  try {
    const b = readFileSync(join(process.cwd(), "public", src));
    return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  } catch {
    return undefined;
  }
}
