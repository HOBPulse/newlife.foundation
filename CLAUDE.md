# New Life Foundation Website

## What
Charity foundation website. Next.js (App Router), TypeScript, Tailwind CSS, next-intl.
Full spec: technical-brief-final.md — READ IT FULLY before starting or continuing any work.

## Why
The foundation helps patients find specialized treatment when regional doctors say
no options remain. Site serves donors and patients/families (slight lean toward donors).
Many visitors are in crisis, on phones — mobile-first, fast loading is critical.

## Hard rules
- Never invent patient details, diagnoses, financial figures, registration numbers,
  dates, or transport routes. Use [TO BE PROVIDED] placeholders.
- Flag legal/compliance risks (medical claims, financial disclosure, personal data) —
  don't silently write around them.
- Flag any deviation from the brief's stack/architecture and wait for confirmation.
- Never deploy without explicit confirmation immediately before the deploy action.
- Copy tone: calm, credible, non-sensational. No dramatized illness/death language,
  no overpromising medical outcomes.
- Animations: CSS-only, minimal (scroll-reveal, hovers). No framer-motion/GSAP,
  no JS map libraries.
- Entity distinction: the foundation and the affiliated private organization (HOB)
  are separate entities. HOB must not appear on the site except as a possible future
  partner mention. Never blur this line in any copy.

## Transport routes map (planned feature)
- v1: static stylized SVG map with route lines, animated on scroll via CSS
  stroke-dashoffset only. No leaflet/mapbox/JS map libraries.
- Route data: [TO BE PROVIDED] by owner as country/city pairs. Never invent routes.
- Privacy: displayed routes must be aggregated/anonymized — never linkable to a
  specific patient story (e.g. avoid showing a route that matches a published story's
  city + diagnosis). Prefer aggregate stats ("N countries, N transports") + lines.
- v2 (future, not now): interactive map — only after v1 ships and performance allows.

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
- Before large or hard-to-reverse changes: summarize the plan, wait for go-ahead.
- After each task: summarize what changed and what's pending.
- Languages: UK (default, no prefix), RU (/ru), EN (/en) — all indexed, hreflang required.

## Review & escalation policy

- Before EVERY `git commit` and before ANY `git push`: invoke the `reviewer`
  subagent on the full diff. Do not commit while the verdict is ⛔.
- If the reviewer returns ⛔ ЭСКАЛАЦИЯ: stop, show Boss ONLY the reviewer's
  "Вопросы для Boss" block (in Russian), and wait for an explicit answer.
  Do not proceed on assumptions.
- Never ask Boss about anything on the reviewer's AUTO-OK list. Handle it
  and mention it briefly in the final summary instead.
- If the reviewer was skipped for any reason, say so explicitly in the
  summary — silent skips are not acceptable.
- The reviewer is read-only and advisory on fixes: implementation stays with
  the main agent, decisions on ESCALATE items stay with Boss.
