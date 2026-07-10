# New Life Foundation Website
## What
Charity foundation website. Next.js (App Router), TypeScript, Tailwind CSS, next-intl.
Full spec: technical-brief-final.md — read the sections relevant to the current
task; read it fully only before structural work.
## Why
The foundation helps patients find specialized treatment when regional doctors say
no options remain. Site serves donors and patients/families (slight lean toward donors).
Many visitors are in crisis, on phones — mobile-first, fast loading is critical.
## Hard rules
Nothing in this file should stop you mid-task — note concerns in the end-of-run
report instead of asking. Mandatory stops: deploy and hard-to-reverse actions.
- Never invent patient details, diagnoses, financial figures, registration numbers,
  dates, or transport routes. Use [TO BE PROVIDED] placeholders.
- Note legal/compliance concerns (medical claims, financial disclosure, personal
  data) in the end-of-run report; don't stop work for them.
- Note deviations from the brief's stack/architecture in the report; stop only if
  the deviation is hard to reverse.
- Never deploy without explicit confirmation immediately before the deploy action.
- Copy may be warm, human and emotionally honest — dramatic beats are fine when a
  story earns them. One hard line: never promise or imply medical outcomes.
- Animations: CSS-only, minimal (scroll-reveal, hovers). No framer-motion/GSAP,
  no JS map libraries.
- Entity distinction: the foundation and the affiliated private organization (HOB)
  are separate entities. HOB must not appear on the site except as a possible future
  partner mention. Never blur this line in any copy.
- Owner-approved content (nav items/order, hero copy, story texts, brand marks):
  change it only when a task explicitly names it. If it changes as a side effect,
  FLAG it at the top of the report — never ship it silently.
## Transport routes map (v1 shipped)
- v1 is live: static stylized SVG map — 61 routes / 23 countries, 5 Ukrainian hubs,
  equirectangular projection on a Natural Earth basemap, CSS stroke-dashoffset draw
  animation, plane glyphs on air routes, ground routes as static lines.
- Route data comes from the owner incrementally (country/city pairs). Never invent
  routes.
- Privacy: displayed routes must be aggregated/anonymized — never linkable to a
  specific patient story (e.g. avoid showing a route that matches a published story's
  city + diagnosis). Prefer aggregate stats ("N countries, N transports") + lines.
- Next planned: v2 full rebuild (corridor tree, Europe crop) via its own task.md.
## Conventions
- Next.js 16 differs from training data (e.g. proxy.ts replaces middleware.ts).
  Before writing Next-specific code, read the relevant guide in
  node_modules/next/dist/docs/ and heed deprecation notices. (See AGENTS.md.)
- Server Components by default; add 'use client' only when needed
- TypeScript strict mode; functional components; named exports
- PascalCase components, camelCase functions/variables
- All user-facing content written in Ukrainian first (default locale);
  ru/en are translations of it, never the other way around
- next/image with unoptimized: true (per brief — hosting portability)
## Commands
- npm run dev — dev server (Turbopack) at http://localhost:3000
- npm run build — production build (also runs TypeScript checks)
- npm run start — serve the production build
- npm run lint — ESLint
## How
- A task.md from the owner IS the go-ahead.
- After each task: summarize what changed and what's pending.
- After any significant decision, append ONE terse line to DECISIONS.md (format: date — decision (≤8-word why)). Keep the file lean; never rewrite past entries.
- Languages: UK (default, no prefix), RU (/ru), EN (/en) — all indexed, hreflang required.
