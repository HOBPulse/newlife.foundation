// Generates the default Open Graph images (1200x630) for all locales into
// public/og/. Design follows Direction A tokens (see src/app/globals.css):
// paper background, ink tagline in Fixel Display, pine site name, and the
// route-line signature with an apricot destination dot.
//
// Taglines come from each locale's HomePage.hero.title — never hardcoded here.
//
// Usage:  npm install --no-save wawoff2   (satori cannot read woff2 directly)
//         node scripts/generate-og-images.mjs

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { ImageResponse } from "next/og.js";
import { decompress } from "wawoff2";

const COLORS = {
  paper: "#fafbf9",
  ink: "#1c2b28",
  pine: "#2e6e64",
  apricot: "#dfa679",
};

const LOCALES = ["uk", "ru", "en"];

// The brand mark (generated from the tokens by build-brand-assets.mjs) sits
// top-right as a small accent; satori embeds it via a data URI.
const markPng = readFileSync(
  new URL("../public/brand/icon-512.png", import.meta.url),
);
const markSrc = `data:image/png;base64,${markPng.toString("base64")}`;

async function loadFont(file) {
  const woff2 = readFileSync(new URL(`../src/fonts/${file}`, import.meta.url));
  const ttf = await decompress(woff2);
  // Satori reads the raw ArrayBuffer, so it must be exactly the font bytes
  // (a pooled Node Buffer view would hand it garbage).
  return ttf.buffer.slice(ttf.byteOffset, ttf.byteOffset + ttf.byteLength);
}

function ogElement(siteName, tagline) {
  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        backgroundColor: COLORS.paper,
        fontFamily: "Fixel Display",
      },
      children: [
        {
          // Top row: site name left (text untouched), brand mark top-right.
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    fontSize: 40,
                    fontWeight: 500,
                    color: COLORS.pine,
                  },
                  children: siteName,
                },
              },
              {
                type: "img",
                props: { src: markSrc, width: 76, height: 76 },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              maxWidth: 1000,
              fontSize: 66,
              fontWeight: 300,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: COLORS.ink,
            },
            children: tagline,
          },
        },
        {
          // The route-line signature: pine path, apricot destination dot.
          type: "svg",
          props: {
            width: 360,
            height: 16,
            viewBox: "0 0 360 16",
            children: [
              {
                type: "circle",
                props: { cx: 8, cy: 8, r: 5, fill: COLORS.pine },
              },
              {
                type: "line",
                props: {
                  x1: 13,
                  y1: 8,
                  x2: 345,
                  y2: 8,
                  stroke: COLORS.pine,
                  "stroke-width": 3,
                },
              },
              {
                type: "circle",
                props: { cx: 352, cy: 8, r: 7, fill: COLORS.apricot },
              },
            ],
          },
        },
      ],
    },
  };
}

// Sequential on purpose: concurrent wawoff2 (wasm) decompress calls share
// heap memory and corrupt each other's output.
const light = await loadFont("FixelDisplay-Light.woff2");
const medium = await loadFont("FixelDisplay-Medium.woff2");

mkdirSync(new URL("../public/og", import.meta.url), { recursive: true });

for (const locale of LOCALES) {
  const messages = JSON.parse(
    readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8"),
  );
  const siteName = messages.Common.siteName;
  const tagline = messages.HomePage.hero.title;

  const image = new ImageResponse(ogElement(siteName, tagline), {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Fixel Display", data: light, weight: 300, style: "normal" },
      { name: "Fixel Display", data: medium, weight: 500, style: "normal" },
    ],
  });

  const buffer = Buffer.from(await image.arrayBuffer());
  writeFileSync(new URL(`../public/og/og-${locale}.png`, import.meta.url), buffer);
  console.log(`public/og/og-${locale}.png (${buffer.length} bytes)`);
}
