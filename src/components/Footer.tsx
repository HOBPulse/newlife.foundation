import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { Logo } from "./Logo";

export function Footer() {
  const t = useTranslations("Common");
  const year = new Date().getFullYear();

  return (
    <footer className="footer-dark footer-reveal border-t border-paper/15 bg-pine-deepest">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              {/* On-dark mark: line art overridden to cream */}
              <Logo className="h-9 w-auto [--logo-line:var(--color-brand-cream)]" />
              <p className="font-display text-lg font-semibold text-paper">
                {t("siteName")}
              </p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-sage/80">
              {t("footer.mission")}
            </p>
          </div>
          <nav
            aria-label={t("nav.label")}
            className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-sage/80 transition-colors hover:text-paper"
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
            <Link
              href="/donate"
              className="text-sage/80 transition-colors hover:text-paper"
            >
              {t("nav.donate")}
            </Link>
            <Link
              href="/privacy"
              className="text-sage/80 transition-colors hover:text-paper"
            >
              {t("nav.privacy")}
            </Link>
          </nav>
        </div>
        <p className="mt-10 text-xs text-sage/60">
          © {year} {t("siteName")}. {t("footer.legalNote")}
        </p>
      </div>
    </footer>
  );
}
