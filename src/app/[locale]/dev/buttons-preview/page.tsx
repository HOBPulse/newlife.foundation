import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HeartIcon } from "@/components/HeartIcon";
import { Logo } from "@/components/Logo";

/* THROWAWAY dev preview — button family comparison (task: button family
 * decision). Three rows: A gel / B letterpress / C current, each with the
 * real header + mobile-hero + donate-band context and real labels.
 * Dev-only: 404s in production, noindex, not in the sitemap allowlist.
 * DELETE this directory before merge. No production component is modified;
 * mockups replicate their markup with hardcoded uk labels. */

export const metadata: Metadata = {
  title: "Buttons preview (dev)",
  robots: { index: false, follow: false },
};

const NAV_LABELS = [
  "Про нас",
  "Як ми працюємо",
  "Історії",
  "Як допомогти",
  "Контакти",
];

type Variant = "gel" | "press" | "current";

const HEADER_PILL: Record<Variant, string> = {
  gel: "bp-gel bp-gel--nav flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-gold-ink",
  press:
    "bp-press bp-press--nav flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-gold-ink",
  current:
    "flex cursor-pointer items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-medium text-gold-ink transition-colors hover:bg-gold/90",
};

const HERO_PRIMARY: Record<Variant, string> = {
  gel: "hero-donate-cta relative inline-flex cursor-pointer items-center rounded-full bg-gold px-7 py-3 text-base font-semibold text-gold-ink",
  press:
    "bp-press relative inline-flex cursor-pointer items-center rounded-full px-7 py-3 text-base font-semibold text-gold-ink",
  current:
    "hero-donate-cta relative inline-flex cursor-pointer items-center rounded-full bg-gold px-7 py-3 text-base font-semibold text-gold-ink",
};

const DONATE_CTA: Record<Variant, string> = {
  gel: "bp-gel inline-flex cursor-pointer items-center gap-2 rounded-full px-8 py-3 font-medium text-gold-ink",
  press:
    "bp-press inline-flex cursor-pointer items-center gap-2 rounded-full px-8 py-3 font-medium text-gold-ink",
  current:
    "donate-cta inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-[#3d2410] bg-gold px-8 py-3 font-medium text-gold-ink",
};

const FORM_SUBMIT: Record<Variant, string> = {
  gel: "bp-gel-pine cursor-pointer rounded-full px-6 py-3 font-medium text-white",
  press:
    "bp-press bp-press--pine cursor-pointer rounded-full px-6 py-3 font-medium text-white",
  current:
    "cursor-pointer rounded-full bg-pine px-6 py-3 font-medium text-white transition-colors hover:bg-pine-deep",
};

function HeartSvg() {
  return (
    <svg
      className="donate-heart h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

/** Real header bar layout (Header.tsx replica, links inert). */
function HeaderMockup({ variant }: { variant: Variant }) {
  return (
    <div className="border-b border-sage bg-paper">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <span className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-ink">
          <Logo className="h-[44px] w-auto text-brand-green" />
          <span>New Life Foundation</span>
        </span>
        <span className="hidden items-center gap-6 lg:flex">
          {NAV_LABELS.map((label) => (
            <span key={label} className="text-sm text-ink-soft">
              {label}
            </span>
          ))}
        </span>
        <span className="flex items-center gap-3">
          <span className="hidden text-sm text-ink-soft lg:block">UA</span>
          <button type="button" className={HEADER_PILL[variant]}>
            Підтримати
            <HeartIcon className="h-4 w-4" />
          </button>
        </span>
      </div>
    </div>
  );
}

/** Real mobile hero (HeroMobile.tsx replica) in a phone frame. */
function HeroMockup({ variant }: { variant: Variant }) {
  return (
    <div className="w-[375px] shrink-0 overflow-hidden rounded-3xl border border-sage bg-sage-soft shadow-sm">
      <div className="relative h-[560px] w-full overflow-hidden">
        <Image
          src="/photos/hero-transport.jpg"
          alt=""
          fill
          sizes="375px"
          className="object-cover"
        />
        <div className="hero-m-scrim absolute inset-0" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 px-4 pt-9">
          <h1 className="max-w-sm text-balance font-display text-[2.5rem] font-normal leading-[1.08] tracking-tight text-paper">
            Ми шукаємо не диво.
            <br />
            Ми шукаємо можливість
          </h1>
          <p className="mt-4 max-w-[36ch] text-base leading-relaxed text-paper/90">
            Фонд допомагає пацієнтам та їхнім родинам знайти спеціалізоване
            лікування і дістатися до нього, коли можливості за місцем
            проживання вичерпано.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="button" className={HERO_PRIMARY[variant]}>
              {variant !== "press" && (
                <span className="hero-donate-glow" aria-hidden="true" />
              )}
              <span className="relative z-10">Підтримати фонд</span>
            </button>
            <button
              type="button"
              className="hero-cta-secondary cursor-pointer rounded-full border border-paper/80 px-5 py-3 text-sm font-medium text-paper"
            >
              Звернутися по допомогу
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Donate band strip (homepage donate section replica) + form submit sample. */
function BandMockup({ variant }: { variant: Variant }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4">
      <div className="rounded-3xl bg-[#9a5b12] px-6 py-10 text-center">
        <h3 className="font-display text-2xl font-medium tracking-tight text-paper">
          Підтримати роботу фонду
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-paper/80">
          Пожертви дають фонду змогу продовжувати пошук лікування та супровід
          пацієнтів.
        </p>
        <div className="mt-6">
          <button type="button" className={DONATE_CTA[variant]}>
            Пожертвувати
            <HeartSvg />
          </button>
        </div>
      </div>
      <div className="rounded-3xl border border-sage px-6 py-6">
        <p className="text-xs uppercase tracking-widest text-ink-soft">
          form submit — family extension
        </p>
        <div className="mt-3">
          <button type="button" className={FORM_SUBMIT[variant]}>
            Надіслати звернення
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({
  id,
  title,
  tradeoff,
  variant,
}: {
  id: string;
  title: string;
  tradeoff: string;
  variant: Variant;
}) {
  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-sage bg-paper shadow-sm">
      <div className="border-b border-sage bg-sage-soft px-6 py-4">
        <h2 className="font-display text-xl font-medium text-ink">
          {id} — {title}
        </h2>
        <p className="mt-1 text-sm text-ink-soft">{tradeoff}</p>
      </div>
      <HeaderMockup variant={variant} />
      <div className="flex flex-wrap items-start gap-6 p-6">
        <HeroMockup variant={variant} />
        <BandMockup variant={variant} />
      </div>
    </section>
  );
}

export default function ButtonsPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  return (
    <div className="bg-[#e9e6de] px-4 py-10 sm:px-6">
      {/* Throwaway styles for the two candidate directions (bp- prefix) +
          hide the real site chrome so mockup rows are the only context */}
      <style>{`
        body > header, .footer-reveal { display: none; }

        /* ROW A — gel DNA (btn13): vertical gloss, inner top light, darker
           rim, ink-tinted drop. Press flattens the gloss and settles 1px. */
        .bp-gel {
          background: linear-gradient(to bottom, #e3ad46 0%, var(--color-gold) 52%, #c18a22 100%);
          box-shadow:
            inset 0 1px 0 rgb(255 255 255 / 0.38),
            inset 0 -2px 3px rgb(58 42 8 / 0.16),
            0 2px 6px -2px rgb(58 42 8 / 0.35);
        }
        .bp-gel:active {
          background: linear-gradient(to bottom, #cd9930 0%, #c18a22 100%);
          translate: 0 1px;
          box-shadow:
            inset 0 1px 2px rgb(58 42 8 / 0.22),
            0 1px 2px -1px rgb(58 42 8 / 0.3);
        }
        /* navbar = quietest of the family: softer gloss, tighter shadow */
        .bp-gel--nav {
          box-shadow:
            inset 0 1px 0 rgb(255 255 255 / 0.3),
            inset 0 -1px 2px rgb(58 42 8 / 0.14),
            0 1px 3px -1px rgb(58 42 8 / 0.3);
        }
        /* pine gel — the form submit in a full gel family */
        .bp-gel-pine {
          background: linear-gradient(to bottom, #398273 0%, var(--color-pine) 52%, #1e4d45 100%);
          box-shadow:
            inset 0 1px 0 rgb(255 255 255 / 0.2),
            inset 0 -2px 3px rgb(10 25 22 / 0.28),
            0 2px 6px -2px rgb(46 110 100 / 0.45);
        }
        .bp-gel-pine:active {
          background: linear-gradient(to bottom, #276258 0%, #1e4d45 100%);
          translate: 0 1px;
          box-shadow:
            inset 0 1px 2px rgb(10 25 22 / 0.3),
            0 1px 2px -1px rgb(10 25 22 / 0.3);
        }

        /* ROW B — letterpress («штамп»): matte fill, hairline rim, hard 2px
           ledge in the button's own pigment + soft ~24% ambient tint. Hover
           lifts 1px off the paper; press collapses the ledge and settles
           the button into the page. */
        .bp-press {
          --bp-ledge: color-mix(in srgb, var(--color-gold) 58%, var(--color-gold-ink));
          --bp-rim: rgb(58 42 8 / 0.18);
          --bp-tint: rgb(214 154 45 / 0.24);
          background: var(--color-gold);
          box-shadow:
            inset 0 0 0 1px var(--bp-rim),
            0 2px 0 0 var(--bp-ledge),
            0 8px 14px -8px var(--bp-tint);
        }
        .bp-press:active {
          translate: 0 2px;
          box-shadow:
            inset 0 0 0 1px var(--bp-rim),
            inset 0 2px 3px rgb(58 42 8 / 0.22),
            0 0 0 0 var(--bp-ledge);
        }
        .bp-press--pine {
          --bp-ledge: var(--color-pine-deep);
          --bp-rim: rgb(28 43 40 / 0.25);
          --bp-tint: rgb(46 110 100 / 0.24);
          background: var(--color-pine);
        }
        /* navbar = quietest: the ledge sleeps until hover */
        .bp-press--nav {
          box-shadow: inset 0 0 0 1px var(--bp-rim);
        }
        .bp-press--nav:active {
          translate: 0 1px;
          box-shadow:
            inset 0 0 0 1px var(--bp-rim),
            inset 0 1px 2px rgb(58 42 8 / 0.2);
        }

        @media (hover: hover) {
          .bp-press:hover:not(:active) {
            translate: 0 -1px;
            box-shadow:
              inset 0 0 0 1px var(--bp-rim),
              0 3px 0 0 var(--bp-ledge),
              0 10px 16px -8px var(--bp-tint);
          }
          .bp-press--nav:hover:not(:active) {
            translate: 0 0;
            box-shadow:
              inset 0 0 0 1px var(--bp-rim),
              0 2px 0 0 var(--bp-ledge),
              0 8px 14px -8px var(--bp-tint);
          }
        }

        @media (prefers-reduced-motion: no-preference) {
          .bp-gel, .bp-gel-pine, .bp-press {
            transition:
              translate 0.12s ease,
              box-shadow 0.12s ease,
              background-color 0.15s ease;
          }
        }
      `}</style>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header>
          <h1 className="font-display text-3xl font-medium tracking-tight text-ink">
            Button family — comparison
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-soft">
            Dev-only preview (404s in production, noindex, not in sitemap).
            Buttons are live — hover and press them. Secondary outline CTA is
            identical in every row (hierarchy is carried by color, not shape).
            Deleted before merge.
          </p>
        </header>

        <Row
          id="A"
          title="Gel family (btn13 DNA on every donate CTA)"
          tradeoff="Tradeoff: one unmistakable glossy voice for donation everywhere — strongest emphasis, but gloss in the quiet header risks tipping calm toward flashy."
          variant="gel"
        />
        <Row
          id="B"
          title="Letterpress / «штамп» (matte fill, own-pigment ledge, press-in)"
          tradeoff="Tradeoff: tactile and print-editorial — fits the paper-and-hairlines identity and stays matte, but it is quieter than gel, so donation emphasis leans on gold alone; hero loses its halo."
          variant="press"
        />
        <Row
          id="C"
          title="Current state (as shipped — gel stays a hero one-off)"
          tradeoff="Tradeoff: zero risk and already coherent, but the family is consistent by convention only — the hero gel stays a soloist, and only the mechanics pack (press, focus, loading, touch targets) gets added."
          variant="current"
        />
      </div>
    </div>
  );
}
