// Regenerates the brand asset pack in public/brand/ from the design tokens
// in src/app/globals.css (--color-brand-green / -terracotta / -cream).
// After any palette change, re-running this script is enough:
//
//   node scripts/build-brand-assets.mjs
//
// What it does:
// 1. Recolors the brand SVGs in place. Path geometry is NEVER touched.
//    On the first run paths are identified by the original pack colors
//    (#305545 line art, #C6724D heart, #FFFFFF cross) and stamped with a
//    data-brand="line|heart|cross" attribute; later runs match by that
//    attribute, so recoloring stays repeatable after the hexes change.
//    In the ondark variant both lines and cross take the cream token.
// 2. Rasterizes favicon-mark.svg into favicon.ico (16/32/48),
//    icon-192.png / icon-512.png (transparent) and apple-touch-icon.png
//    (180px, cream background). favicon-full.ico is left untouched.
// 3. Syncs the App Router icon files: src/app/favicon.ico, icon.svg,
//    apple-icon.png (Next serves them via the metadata file conventions).

import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const ROOT = new URL("../", import.meta.url);
const BRAND = new URL("public/brand/", ROOT);

// --- 1. Tokens: the single source of color -------------------------------

const css = readFileSync(new URL("src/app/globals.css", ROOT), "utf8");

function token(name) {
  const m = css.match(new RegExp(`--color-brand-${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`token --color-brand-${name} not found in globals.css`);
  return m[1];
}

const GREEN = token("green");
const TERRACOTTA = token("terracotta");
const CREAM = token("cream");
console.log(`tokens: green ${GREEN}, terracotta ${TERRACOTTA}, cream ${CREAM}`);

// --- 2. Recolor the SVGs in place ----------------------------------------

// Original pack colors, used only to classify paths on the first run.
const ORIGINAL = { "#305545": "line", "#C6724D": "heart", "#FFFFFF": "cross" };

// role -> token value; the ondark variant paints lines and cross cream.
const PALETTE = {
  default: { line: GREEN, heart: TERRACOTTA, cross: CREAM },
  ondark: { line: CREAM, heart: TERRACOTTA, cross: CREAM },
};

function recolor(file, variant) {
  const url = new URL(file, BRAND);
  const roleColor = PALETTE[variant];
  let changed = 0;
  const svg = readFileSync(url, "utf8").replace(
    /fill="(#[0-9a-fA-F]{6})"( data-brand="(\w+)")?/g,
    (match, hex, tagged, role) => {
      // ondark has no unique hex per role: white is both lines and cross —
      // they share the cream slot, so classifying it as "cross" is exact.
      role ??= ORIGINAL[hex.toUpperCase()] ?? null;
      if (!role) throw new Error(`${file}: unclassifiable fill ${hex}`);
      changed++;
      return `fill="${roleColor[role]}" data-brand="${role}"`;
    },
  );
  writeFileSync(url, svg);
  console.log(`${file}: ${changed} fills -> ${variant} palette`);
}

recolor("newlife-logo.svg", "default");
recolor("newlife-logo-mono.svg", "default");
recolor("newlife-logo-ondark.svg", "ondark");
recolor("favicon-mark.svg", "default");

// --- 3. Rasterize favicons from the recolored mark ------------------------

const mark = readFileSync(new URL("favicon-mark.svg", BRAND));
const markWidth = Number(mark.toString().match(/<svg[^>]* width="(\d+)"/)[1]);

// Render the SVG at the exact target size (librsvg scales via density).
function markPng(size) {
  const density = (72 * size) / markWidth;
  return sharp(mark, { density }).resize(size, size).png();
}

const pngs = [];
for (const size of [16, 32, 48]) {
  pngs.push(await markPng(size).toBuffer());
}
writeFileSync(new URL("favicon.ico", BRAND), await pngToIco(pngs));
console.log("favicon.ico: 16/32/48");

for (const size of [192, 512]) {
  await markPng(size).toFile(fileURLToPath(new URL(`icon-${size}.png`, BRAND)));
  console.log(`icon-${size}.png: transparent`);
}

// Apple touch icon: cream plate, mark centered with breathing room
// (iOS shows the icon on its own tile — transparent pixels turn black).
const APPLE = 180;
const inset = Math.round(APPLE * 0.78);
await sharp({
  create: {
    width: APPLE,
    height: APPLE,
    channels: 4,
    background: CREAM,
  },
})
  .composite([{ input: await markPng(inset).toBuffer(), gravity: "center" }])
  .png()
  .toFile(fileURLToPath(new URL("apple-touch-icon.png", BRAND)));
console.log(`apple-touch-icon.png: ${APPLE}px on cream`);

// --- 4. Sync App Router metadata icon files -------------------------------

const APP = new URL("src/app/", ROOT);
for (const [src, dest] of [
  ["favicon.ico", "favicon.ico"],
  ["favicon-mark.svg", "icon.svg"],
  ["apple-touch-icon.png", "apple-icon.png"],
]) {
  copyFileSync(
    fileURLToPath(new URL(src, BRAND)),
    fileURLToPath(new URL(dest, APP)),
  );
  console.log(`src/app/${dest} <- brand/${src}`);
}
