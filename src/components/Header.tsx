import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { HeartIcon } from "./HeartIcon";
import { Logo } from "./Logo";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const t = useTranslations("Common");

  return (
    <header className="sticky top-0 z-40 border-b border-sage bg-paper">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand: house-and-heart mark (green) + "New Life Foundation" */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-ink"
        >
          <Logo className="h-[44px] w-auto text-brand-green" />
          <span className="hidden min-[420px]:block">{t("siteName")}</span>
        </Link>

        <nav
          aria-label={t("nav.label")}
          className="hidden items-center gap-6 lg:flex"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="text-sm text-ink-soft transition-colors hover:text-pine"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LocaleSwitcher className="hidden lg:flex" />
          <Link
            href="/donate"
            className="btn-press btn-press--nav tap-target hidden items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-gold-ink sm:flex"
          >
            {t("nav.donate")}
            <HeartIcon className="h-4 w-4" />
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
