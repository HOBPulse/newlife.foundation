# TECHNICAL BRIEF — New Life Foundation Website
**Final version — updated after clarification round**

---

## STACK
- Next.js (App Router), TypeScript, Tailwind CSS
- next-intl for multilingual routing
- Deploy target: Vercel or Netlify for initial testing/preview
- **FINAL hosting: VPS on Ukrainian hosting with Node.js support** (not shared hosting — required for the Contact form's server-side relay and standard Next.js Image handling)
- Build with portability in mind: avoid hard dependency on Vercel/Netlify-specific features (Edge Functions, Vercel-only image optimization), since the site will migrate later
- Mobile-first, fully responsive — many visitors will be in crisis, on phones
- Test on real breakpoints: 360–390px (most common phones), 768px (tablet), 1024px+ (desktop) — not just browser dev tools resize
- **Do NOT deploy without explicit confirmation**

---

## SITE STRUCTURE (sitemap)
1. Home / Головна
2. About Us / Про нас — respecting the entity-distinction rules in project instructions
3. How We Work / Як ми працюємо — the 4–5 step process from project instructions
4. Stories / Історії — 3 real, already-written patient stories (text to be provided)
5. How to Help / Як допомогти
6. Donate / Пожертвувати — static page with active fundraising campaigns + payment button(s)/links to payment providers. No form here.
7. Contact / Контакти — "Request Help" form
8. **Privacy Policy / Політика конфіденційності** — personal data processing disclosure
   *(mandatory: the Contact form collects diagnosis/health data — a special category under Ukrainian data protection law; PayPal also requires a linked privacy policy as a condition of integration)*
9. 404 page

---

## LANGUAGES
- **Ukrainian** = primary/default (no URL prefix, e.g. `/about`)
- **Russian** = secondary (`/ru/...`)
- **English** = tertiary (`/en/...`)
- **All three languages fully indexed for SEO** — no `noindex`, no restrictions
- hreflang tags generated for every page across all three locales (via `generateMetadata`)
- Exactly these 3 languages — no need to architect for additional locales

---

## DESIGN
- Apply frontend-design skill for visual direction — calm, credible, non-sensational tone (per project instructions), NOT a typical dramatic charity/NGO template
- No external component libraries (21st.dev) or pre-made design sets (Stitch) — direction built from scratch based on this brief
- Logo already exists — [attach logo file / point to its location]
- Review and approval of direction required before full build-out

---

## ANIMATIONS
- CSS-only, minimal: scroll-reveal for sections, hover micro-interactions
- No framer-motion, no GSAP, no JS animation libraries — site must load fast on
  low-end phones (visitors in crisis)

---

## FORMS
- "Request Help" form (Contact page) — the only form on the site
- Submissions relay to: **email + Telegram**
  - Placeholder env vars: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `CONTACT_EMAIL` (real values to be added later)
  - **Fallback handling required:** if email or Telegram delivery fails, show a clear success/failure message to the user rather than a silent failure
- Fields:
  - Full name / ФІО
  - Phone or Telegram contact
  - Country/City
  - Diagnosis + brief situation description
  - Consent checkbox (personal data processing) — **must link to the Privacy Policy page**, not stand alone
- No database needed — relay only, no storage/admin panel
- Anti-spam (honeypot/captcha) — **deferred**, not needed for initial launch

---

## PATIENT STORIES
- 3 real, already-approved stories to be provided as text
- Do NOT invent details, names, diagnoses, or outcomes — use placeholders like `[STORY 1 – TO BE ADDED]` until real content is provided
- **Confirmed:** consent for publishing patient names/photos/stories has already been obtained prior to this project

---

## DONATE
- Payment options (v1 — simple external links, no embedded widgets/SDKs):
  - **Monobank Jar** — UAH
  - **LiqPay** — UAH
  - **PayPal** — EUR/USD (for diaspora and international donors)
- Placeholder env vars for links: `NEXT_PUBLIC_MONO_JAR_URL`, `NEXT_PUBLIC_LIQPAY_URL`, `NEXT_PUBLIC_PAYPAL_URL`
- Active campaign info displayed as text/progress (placeholder until real data provided)
- Future consideration (not now): embedded LiqPay widget would require server-side request signing — revisit hosting architecture if/when this is prioritized

---

## TRANSPARENCY / FINANCIAL DISCLOSURE
- Registration number / legal disclosure: **UNDECIDED** — weighing fraud-prevention risk before publishing publicly
- Build the "Transparency" section with a placeholder/flexible structure
- Do not invent or guess any registration numbers, financial figures, or report data

---

## IMAGE HANDLING
- `next/image` set to `unoptimized: true` (compatible with any hosting, no server-side optimization dependency)
- All images (stories, team, logo) manually optimized/compressed (WebP, appropriately sized) during the build preparation step — no external optimization service required

---

## TRANSPORT ROUTES MAP
- v1: static stylized SVG map with route lines, animated on scroll (CSS
  stroke-dashoffset only — no leaflet/mapbox/JS map libraries, consistent with
  the ANIMATIONS section rules)
- Route data: [TO BE PROVIDED] by owner as country/city pairs — never invent routes
- Privacy: displayed routes must be aggregated/anonymized, never linkable to a
  specific published patient story (e.g. avoid a route that matches a story's
  city + diagnosis); prefer aggregate stats ("N countries, N transports") + lines
- v2 (future, not now): interactive map — only after v1 ships and performance allows
- Placement: homepage or How We Work page — decide during design direction step

---

## FLAGS
- Per project instructions: flag any legal/compliance risk (medical claims, financial disclosure wording, patient data/consent) instead of silently writing around it
- HOB Labs: off-site entirely until the owner explicitly re-enables it post-launch — see CLAUDE.md HOB rule
- Open items still requiring a decision:
  - Final VPS provider (Ukrainian hosting with Node.js) — not yet selected
  - Transparency/registration disclosure wording — pending your decision
  - Transport routes data (country/city pairs) — pending from owner
  - Logo file location — pending from owner
