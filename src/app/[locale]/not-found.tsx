import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFoundPage() {
  const t = useTranslations("NotFoundPage");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <p className="tnum font-display text-6xl font-light text-pine">404</p>
      <h1 className="mt-4 font-display text-3xl font-medium tracking-tight text-ink">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-md text-ink-soft">{t("body")}</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-pine px-6 py-3 font-medium text-white transition-colors hover:bg-pine-deep"
      >
        {t("home")}
      </Link>
    </div>
  );
}
