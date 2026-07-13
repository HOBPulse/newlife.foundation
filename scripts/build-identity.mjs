// Builds the NL identity set into public/brand/ and the App Router icons.
//
//   npm install --no-save fontkit wawoff2   (satori/raster helpers; not deps)
//   node scripts/build-identity.mjs
//
// Produces:
//   6a  nl-seal.svg + favicon.ico (16/32/48) + apple-touch-icon.png (180)
//       — "NL" set in Fixel Display inside a ring, letters as vector outlines
//       (self-contained, no font needed downstream). Copied to src/app as
//       favicon.ico / icon.svg / apple-icon.png (replaces the old favicons).
//   6b  nl-ligature.svg (authoritative geometry, reproduced exactly) + PNG
//       exports 512/1024 on transparent and on paper.
//   6c  nl-foundation.svg (inline lockup) + newlife-oversize.svg (two-line).
//
// Colors come from the design tokens in globals.css (brand-green / pine /
// ink / ink-soft / paper). The ligature is the one exception — see the FLAG
// in the report: its two hexes are given verbatim and are NOT tokens.

import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { create } from "fontkit";
import { decompress } from "wawoff2";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const ROOT = new URL("../", import.meta.url);
const BRAND = new URL("public/brand/", ROOT);
const APP = new URL("src/app/", ROOT);
const css = readFileSync(new URL("src/app/globals.css", ROOT), "utf8");

function token(name) {
  const m = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{3,6})`));
  if (!m) throw new Error(`token --color-${name} not found`);
  return m[1];
}
const GREEN = token("brand-green");
const PINE = token("pine");
const INK = token("ink");
const INK_SOFT = token("ink-soft");
const PAPER = token("paper");

const r2 = (n) => Math.round(n * 100) / 100;

async function loadFont(file) {
  const ttf = await decompress(readFileSync(new URL(`src/fonts/${file}`, ROOT)));
  return create(Buffer.from(ttf.buffer.slice(ttf.byteOffset, ttf.byteOffset + ttf.byteLength)));
}

/** Lay out `text` and return positioned glyph outlines as SVG <path>s, with
 *  the baseline at y=0 and the pen starting at x=0. `s` scales font units to
 *  user units and flips the y-axis (font is y-up, SVG is y-down). */
function runPaths(font, text, s, fill, xTracking = 0) {
  const run = font.layout(text);
  let x = 0;
  const parts = [];
  run.glyphs.forEach((g, i) => {
    const d = g.path.toSVG();
    if (d) {
      parts.push(
        `<path transform="translate(${r2(x * s)} 0) scale(${r2(s)} ${r2(-s)})" d="${d}" fill="${fill}"/>`,
      );
    }
    x += run.positions[i].xAdvance + xTracking;
  });
  return { paths: parts.join(""), width: x * s };
}

const fixelSemibold = await loadFont("FixelDisplay-SemiBold.woff2");
const fixelMedium = await loadFont("FixelDisplay-Medium.woff2");
const fixelLight = await loadFont("FixelDisplay-Light.woff2");

// ---- 6a. NL seal ---------------------------------------------------------
// D = 100 units. cap height 35%, ring stroke 3.4% (thinner than the ~4.8%
// letter stems), N–L gap ~8%, pair optically centered (shifted 2% left).
{
  const D = 100;
  const capTarget = 0.35 * D;
  const s = capTarget / fixelSemibold.capHeight; // 700 → 35
  const ringW = 0.034 * D;
  const ringR = D / 2 - ringW / 2;
  const baseline = D / 2 + capTarget / 2; // caps vertically centered

  // Individual glyph metrics (font units)
  const [gN, gL] = fixelSemibold.layout("NL").glyphs;
  const nInkL = gN.bbox.minX * s;
  const nInkR = gN.bbox.maxX * s;
  const lInkL = gL.bbox.minX * s;
  const lInkR = gL.bbox.maxX * s;
  const nInkW = nInkR - nInkL;
  const lInkW = lInkR - lInkL;
  const gap = 0.08 * D;
  const pairW = nInkW + gap + lInkW;
  const pairCenter = D / 2 - 0.02 * D; // 2% optical left shift
  const nOriginX = pairCenter - pairW / 2 - nInkL;
  const lOriginX = nOriginX + nInkL + nInkW + gap - lInkL;

  const glyph = (g, ox) =>
    `<path transform="translate(${r2(ox)} ${r2(baseline)}) scale(${r2(s)} ${r2(-s)})" d="${g.path.toSVG()}" fill="${GREEN}"/>`;

  const seal = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${D} ${D}">
  <circle cx="${D / 2}" cy="${D / 2}" r="${r2(ringR)}" fill="none" stroke="${GREEN}" stroke-width="${r2(ringW)}"/>
  ${glyph(gN, nOriginX)}
  ${glyph(gL, lOriginX)}
</svg>`;
  writeFileSync(new URL("nl-seal.svg", BRAND), seal);
  console.log("nl-seal.svg written");

  const sealBuf = Buffer.from(seal);
  const png = (size) => sharp(sealBuf, { density: (72 * size) / D }).resize(size, size).png();

  const icoPngs = [];
  for (const size of [16, 32, 48]) icoPngs.push(await png(size).toBuffer());
  writeFileSync(new URL("favicon.ico", BRAND), await pngToIco(icoPngs));
  console.log("favicon.ico (16/32/48)");

  // Apple touch icon: 180 seal on a cream plate (iOS turns transparency black)
  const APPLE = 180;
  const inset = Math.round(APPLE * 0.82);
  await sharp({ create: { width: APPLE, height: APPLE, channels: 4, background: PAPER } })
    .composite([{ input: await png(inset).toBuffer(), gravity: "center" }])
    .png()
    .toFile(fileURLToPath(new URL("apple-touch-icon.png", BRAND)));
  console.log("apple-touch-icon.png (180 on paper)");

  // Sync App Router icons — the seal now replaces the old favicons
  writeFileSync(new URL("favicon.ico", APP), readFileSync(new URL("favicon.ico", BRAND)));
  writeFileSync(new URL("icon.svg", APP), seal);
  copyFileSync(fileURLToPath(new URL("apple-touch-icon.png", BRAND)), fileURLToPath(new URL("apple-icon.png", APP)));
  console.log("src/app icons synced to the seal");
}

// ---- 6b. NL ligature -----------------------------------------------------
// Authoritative geometry reproduced verbatim (hexes given, not tokens — see
// report FLAG). Micro join softening only via round caps/joins as specified.
{
  const ligature = `<svg viewBox="0 0 118 96" xmlns="http://www.w3.org/2000/svg">
  <path d="M22,78 L22,22 L54,78 L54,22 M54,78 L78,78" fill="none" stroke="#1F4A3D" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M85,78 L98,78" fill="none" stroke="#C77B54" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="0.5 8"/>
  <circle cx="106" cy="78" r="4.5" fill="#C77B54"/>
</svg>`;
  writeFileSync(new URL("nl-ligature.svg", BRAND), ligature);
  const ligBuf = Buffer.from(ligature);
  for (const size of [512, 1024]) {
    const density = (72 * size) / 118;
    await sharp(ligBuf, { density }).resize({ width: size }).png()
      .toFile(fileURLToPath(new URL(`nl-ligature-${size}.png`, BRAND)));
    // On paper background
    const t = await sharp(ligBuf, { density }).resize({ width: size }).png().toBuffer();
    const meta = await sharp(t).metadata();
    await sharp({ create: { width: size, height: meta.height, channels: 4, background: PAPER } })
      .composite([{ input: t, gravity: "center" }]).png()
      .toFile(fileURLToPath(new URL(`nl-ligature-${size}-paper.png`, BRAND)));
  }
  console.log("nl-ligature.svg + PNG 512/1024 (transparent + paper)");
}

// ---- 6c. Lockups ---------------------------------------------------------
{
  // Inline "NL Foundation": NL medium pine + Foundation light muted.
  const s = 0.05; // cap height 35 in a 100-tall box
  const baseline = 67.5;
  const nl = runPaths(fixelMedium, "NL", s, PINE);
  const spaceW = 0.5 * 35; // visual gap between NL and Foundation
  const found = runPaths(fixelLight, "Foundation", s, INK_SOFT);
  const foundX = nl.width + spaceW;
  const inlineW = foundX + found.width;
  const inline = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r2(inlineW)} 100">
  <g transform="translate(0 ${baseline})">${nl.paths}</g>
  <g transform="translate(${r2(foundX)} ${baseline})">${found.paths}</g>
</svg>`;
  writeFileSync(new URL("nl-foundation.svg", BRAND), inline);
  console.log("nl-foundation.svg (inline lockup)");

  // Oversize "New Life / Foundation" — two lines, no period, ink.
  const cs = 0.09; // larger cap height for the display lockup
  const line1 = runPaths(fixelLight, "New Life", cs, INK);
  const line2 = runPaths(fixelLight, "Foundation", cs, INK);
  const lineH = fixelLight.capHeight * cs * 1.5;
  const w = Math.max(line1.width, line2.width);
  const oversize = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r2(w)} ${r2(lineH * 2)}">
  <g transform="translate(0 ${r2(fixelLight.capHeight * cs)})">${line1.paths}</g>
  <g transform="translate(0 ${r2(lineH + fixelLight.capHeight * cs)})">${line2.paths}</g>
</svg>`;
  writeFileSync(new URL("newlife-oversize.svg", BRAND), oversize);
  console.log("newlife-oversize.svg (two-line lockup)");
}
