"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { HEADER_NAV } from "@/lib/nav";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("Common");

  // Close the panel after client-side navigation (state adjusted during render)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  return (
    <div className="relative lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label={t("menu")}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded text-ink"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? (
            <>
              <path d="M4 4l12 12" />
              <path d="M16 4L4 16" />
            </>
          ) : (
            <>
              <path d="M3 5.5h14" />
              <path d="M3 10h14" />
              <path d="M3 14.5h14" />
            </>
          )}
        </svg>
      </button>
      {open && (
        <nav
          aria-label={t("nav.label")}
          className="absolute right-0 top-12 z-50 w-60 rounded-lg border border-sage bg-paper p-2 shadow-lg"
        >
          {/* "Потрібна допомога" leads, per the brief */}
          {HEADER_NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="block rounded px-3 py-2.5 text-ink-soft transition-colors hover:bg-sage-soft hover:text-ink"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
          <div className="mt-1 border-t border-sage px-3 pb-1 pt-3">
            <LocaleSwitcher />
          </div>
        </nav>
      )}
    </div>
  );
}
