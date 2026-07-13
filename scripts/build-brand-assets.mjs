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
// 2. Rasterizes favicon-mark.svg into the PWA icons icon-192.png /
//    icon-512.png (transparent, referenced by app/manifest.ts).
//
// The browser favicons (favicon.ico + app/{favicon.ico,icon.svg,apple-icon})
// are NOT produced here — they are the NL seal, owned by build-identity.mjs
// ("seal = favicon"). This heart mark stays the primary "sign". Run
// build-identity.mjs after this script so the seal favicons are authoritative.
// favicon-full.ico is left untouched.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

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

// --- 3. Rasterize the PWA icons from the recolored mark -------------------

const mark = readFileSync(new URL("favicon-mark.svg", BRAND));
const markWidth = Number(mark.toString().match(/<svg[^>]* width="(\d+)"/)[1]);

// Render the SVG at the exact target size (librsvg scales via density).
function markPng(size) {
  const density = (72 * size) / markWidth;
  return sharp(mark, { density }).resize(size, size).png();
}

for (const size of [192, 512]) {
  await markPng(size).toFile(fileURLToPath(new URL(`icon-${size}.png`, BRAND)));
  console.log(`icon-${size}.png: transparent (PWA / manifest)`);
}
