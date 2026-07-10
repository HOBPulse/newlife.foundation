import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { fixelDisplay, golos, ptSerif } from "@/lib/fonts";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";
import "../globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Common");
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      template: `%s — ${t("siteName")}`,
      default: t("siteName"),
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  // Enables static rendering for all pages under this layout
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${golos.variable} ${fixelDisplay.variable} ${ptSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
          <Header />
          {/* Opaque elevated sheet — scrolls over the pinned footer (reveal) */}
          <main id="main" className="page-sheet flex flex-1 flex-col">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
