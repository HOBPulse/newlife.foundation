# Brand assets — New Life Foundation

Roles of each mark in the identity set:

| File(s) | Role |
| --- | --- |
| `newlife-logo.svg`, `newlife-logo-mono.svg`, `newlife-logo-ondark.svg` | **sign** — the primary logo mark (hero, covers, large contexts) |
| `newlife-oversize.svg` | **oversize** — two-line "New Life / Foundation" lockup for hero / covers |
| `nl-foundation.svg` | **NL Foundation** — inline lockup used in the site header (also the `<WordmarkInline/>` component) |
| `nl-ligature.svg`, `nl-ligature-{512,1024}.png`, `…-paper.png` | **ligature** — compact NL monogram for avatars / document seals |
| `nl-seal.svg`, `favicon.ico`, `apple-touch-icon.png` | **seal** — the favicon family (NL set in Fixel Display inside a ring) |
| `icon-192.png`, `icon-512.png` | PWA / manifest icons (the *sign* mark) |
| `favicon-full.ico` | legacy fallback, left untouched |

## Regenerating

```sh
npm install --no-save fontkit wawoff2   # satori/raster helpers, not deps
node scripts/build-brand-assets.mjs     # recolors the sign SVGs + PWA icons from globals.css tokens
node scripts/build-identity.mjs         # seal favicons, ligature, lockups
```

Run `build-identity.mjs` **after** `build-brand-assets.mjs` so the seal
favicons stay authoritative (build-brand-assets no longer writes them).

## Colors

The seal and lockups derive their colors from the `globals.css` design tokens
(`--color-brand-green`, `--color-pine`, `--color-ink`, `--color-ink-soft`).
The **ligature** is the one exception: its two hexes (`#1F4A3D`, `#C77B54`)
are reproduced verbatim from the supplied authoritative geometry and are *not*
current tokens — flagged for review (near brand-green / brand-terracotta).
