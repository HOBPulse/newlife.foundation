# Design decisions

<!-- Reverse-chronological. ONE line per decision: YYYY-MM-DD — decision (≤8-word why). No paragraphs. Never rewrite past entries. -->

2026-07-12 — PayPal donate (temp primary): one-time hosted + monthly sub SDKs, per-tab lazy + data-namespace (avoid window.paypal clash); mono/LiqPay stubbed
2026-07-12 — Home donate CTA → /donate#give (jump to widget, keep approved pill)
2026-07-12 — Footer logo h-9→h-[47px] (+30%) (stronger footer brand presence)

2026-07-12 — Contact page → two-column: form left, requisites sidebar panel right (mobile: requisites first)

2026-07-12 — Header logo 38px→44px (+15%) (stronger brand presence)

2026-07-12 — Donate CTA border pine-deep→espresso brown #3d2410 (harmonizes with heart)

2026-07-12 — Hero CTA 1 «Підтримати фонд»→«Стати поруч» → /how-to-help (header already has donate); header «Підтримати» gains shared HeartIcon

2026-07-12 — Forms: Web3Forms removed, all forms use own server action (Telegram bot + SMTP); privacy no longer names Telegram/Web3
2026-07-12 — how-to-help: strip layout default; twocol+photo kept behind ?help_layout=twocol as fallback; team photo lives on /volunteer
2026-07-12 — PLANNED post-launch: targeted child fundraisers — foundation account + payment tag, progress bar (LiqPay API if supported, else manual), surplus over goal → other fundraisers or general fund, needs public offer, not announced at launch
2026-07-12 — PRE-LAUNCH legal checklist: privacy (health data/children/cross-border), public offer + refund terms for LiqPay, expand /contact consent line to cover purpose + transfer to clinics incl. abroad (only to the extent needed) + guardian-acting-for-child clause
2026-07-12 — Payments: LiqPay intended provider; general donation first, targeted fundraisers later
2026-07-12 — strip is the chosen how-to-help layout (twocol kept as ?help_layout fallback); team photo moved to /volunteer header
2026-07-12 — Privacy policy stops naming the delivery channel (Telegram removed): "submissions go directly to the foundation, no third-party service"
2026-07-12 — /volunteer + /partner errors split into validation/delivery keys like /contact (delivery keeps support@ fallback link)
2026-07-12 — How-to-help: layout A removed; strip is default, twocol (?help_layout=twocol) gains team photo bottom-left; still flagged for owner pick
2026-07-12 — Web3Forms dropped entirely; /volunteer + /partner now use the /contact server-action relay (own Telegram bot + SMTP, no third-party)
2026-07-12 — Forms to dedicated /volunteer + /partner pages; how-to-help cards just link (accordions broke row alignment); old relay /partner replaced
2026-07-12 — How-to-help photo + ?help_photo flag removed per owner; layouts now A/twocol/strip behind ?help_layout
2026-07-12 — How-to-help rework: donate-first, forms/share collapse into in-card disclosures; layouts A/split behind ?help_layout (owner picks)
2026-07-12 — How-to-help photo behind ?help_photo=mid flag, A/B for owner pick (same client-Suspense pattern as old hero flag)
2026-07-12 — How-to-help forms: anchor-scroll to always-rendered sections, not inline expand (works without JS)
2026-07-12 — Volunteer/partnership forms post to Web3Forms client-side (per task); /contact + /partner keep server relay
2026-07-12 — Step 03 duo → single park-org.jpg (owner swap); wider accent column kept, convoy-night deleted
2026-07-11 — How-we-work steps get photos (right column, quiet); step 03 duo accent (convoy + UA-plates overlap) — transport is the core
2026-07-11 — Map v2 promoted to the only homepage map (?map= flag + v1 RoutesMap/basemap/generate-basemap.mjs/RoutesMapSwitch removed); facts counter 61→62 (AIR_LINKS Kyiv→Thessaloniki merged into count)
2026-07-11 — About finalized: zigzag-tight is the default /about (flag + AboutW/Strip/Edge/Mix/LayoutSwitch removed); only AboutZigzag + AboutCollage kept
2026-07-11 — About adds ?about=mix: contained in-column vertical pair 1 + edge-bleeding pairs 2/3 (alternating), reusing shared pairs/photos/collage
2026-07-11 — About zigzag(+tight): pairs enlarged (max-w-6xl, photo ~59%), gutter tightened; vertical pair 1 in a centered max-w-5xl band so Lesya reads big and close, not floating
2026-07-11 — About pair 1 (lesya-depot) → vertical portrait exception (near-native 9/16, capped height); edge bleeds it to the wall at full row height; pairs 2/3 stay landscape
2026-07-11 — About pairs get real foundation photos: lesya-depot (pair 1), 3-photo Germany collage (pair 2); Olesya paragraph replaced (owner-final); pair-1 landscape crop kept via object-[center_38%] (no aspect exception)
2026-07-11 — About previews add ?about=edge (edge-bleed) + ?about=zigzag-tight; H1 scroll-mt-20 clears sticky header on all variants
2026-07-11 — About layout previews behind ?about=zigzag|strip; layout W stays default (owner comparison, no copy changes)
2026-07-11 — Kyiv→Thessaloniki air leg (owner) in data; story hover cards use published assets only; quiet flag removed (default 0.32 chosen)
2026-07-11 — Post-launch polish candidates: circular hub-port spacing at ±180°, micro-gaps at branch junctions
2026-07-11 — Polish transit on map — rejected after visual mock (Rzeszów collides with Lviv node at this scale; transit is an operational detail, not a destination)
2026-07-11 — 3 internal UA hub legs (owner-confirmed) in data; v2-only quiet background layer
2026-07-11 — Thessaloniki story marker added (owner confirmed city for story-3)
2026-07-11 — Map v2 (Europe crop + corridor tree) behind ?map=v2; v1 stays default until owner approves
2026-07-11 — v2 corridors hand-authored over ROUTE_GROUPS, build-validated (no invented links)
2026-07-11 — Story marker: only Barcelona (story-1); stories 2–3 name no city
2026-07-10 — FAQ live on home: 5 Q&A (uk/ru/en), showFaq enabled, Q5 → gold donate CTA
2026-07-10 — CTA accent → gold #D69A2D (dark ink); terracotta dropped as accent, logo heart stays terracotta
2026-07-10 — Header mark → house-and-heart SVG (green), recolored via currentColor; footer cream
2026-07-10 — HOB Labs = foundation initiative (IT/crypto/fundraising/community/platform); on-site a foundation partner, not a separate entity [SUPERSEDED 2026-07-10 — HOB Labs off-site entirely until owner re-enables post-launch; see CLAUDE.md HOB rule]
2026-07-10 — Transport: foundation organizes it, public copy high-level (own capacity or partners for air)
2026-07-10 — Director: Olesya Oleksandrivna, emergency-medicine & air-ambulance physician — trust asset for About
2026-07-10 — Funding varies (per-patient fundraiser / grant / reserve when it exists) — so public copy states NO timelines or funding mechanism; just 'contact us, we assess and find a way'
2026-07-10 — PT Serif locked as site heading font, hero 400 / paper 700 (over Fixel)
2026-07-10 — Hero = full-bleed ambulance photo, left scrim (over watermark/card variants)
2026-07-10 — Header: seal + "New Life Foundation", apricot donate always on (donor path always visible)
2026-07-10 — Story pages: pull-quote & margin-labels out, hover-reveal in (simpler, less decorative)
2026-07-10 — Left rail built then removed (fragile, decorative)
2026-07-09 — Identity: NL seal/ligature/emblem, roles in brand README (one source for marks)
2026-07-09 — FAQ behind showFaq flag, awaiting copy (ships nothing until ready)
2026-07-09 — Chatbot deferred post-launch (domain risk)
