import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { StoriesCards } from "@/components/StoriesCards";
import { StoryHoverList } from "@/components/StoryHoverList";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "StoriesPage", "/stories");
}

export default async function StoriesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("StoriesPage");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl font-medium tracking-tight text-ink">
        {t("title")}
      </h1>

      {/* Cards — mobile swipe carousel (<640), grid on tablets; hover-capable
          desktop ≥1024 hides the grid in favour of the hover list below */}
      <StoriesCards
        gridClassName="stories-cards mt-14"
        carouselClassName="mt-14"
      />

      {/* Hover-capable ≥1024px — editorial index with photo reveal */}
      <StoryHoverList />
    </div>
  );
}
