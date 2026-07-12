import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { VolunteerForm } from "@/components/VolunteerForm";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "VolunteerPage", "/volunteer");
}

export default async function VolunteerPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("VolunteerPage");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl font-medium tracking-tight text-ink">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
        {t("lead")}
      </p>

      <figure className="mt-10">
        <Image
          src="/photos/samu-flag.jpg"
          alt={t("photoAlt")}
          width={1050}
          height={700}
          sizes="(min-width: 1024px) 48rem, 100vw"
          className="aspect-[3/2] w-full max-w-3xl rounded-xl object-cover"
        />
      </figure>

      <div className="mt-12">
        <VolunteerForm />
      </div>
    </div>
  );
}
