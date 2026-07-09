import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { HEADER_NAV } from "@/lib/nav";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { WordmarkInline } from "./WordmarkInline";

export function Header() {
  const t = useTranslations("Common");

  return (
    <header className="sticky top-0 z-40 border-b border-sage bg-paper">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand: compact mark + inline "NL Foundation" lockup */}
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-6 w-auto" />
          <WordmarkInline className="text-base tracking-tight" />
        </Link>

        <nav
          aria-label={t("nav.label")}
          className="hidden items-center gap-6 lg:flex"
        >
          {HEADER_NAV.map((item) => (
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
            className="header-cta rounded-full bg-brand-terracotta-deep px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-brand-terracotta-deep/90"
          >
            {t("nav.donate")}
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
