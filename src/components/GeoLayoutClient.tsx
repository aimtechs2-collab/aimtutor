"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import LegacyHeader from "@/components/LegacyHeader";
import GeoFooter from "@/components/GeoFooter";
import { slugify } from "@/lib/seoSlug";
import { getLanguageForCountry, isRTL, getTranslationsSync } from "@/lib/i18n";
import type { Translations } from "@/translations/en";

export default function GeoLayoutClient({
  children,
  country,
  region,
  city,
  translations,
}: {
  children: React.ReactNode;
  country: string;
  region: string;
  city: string;
  translations: Translations;
}) {
  const pathname = usePathname();
  const locCity = city || "Hyderabad";
  const citySlug = slugify(locCity);
  const locPrefix = `/${country}/${region}/${citySlug}`;
  const expectedHomePath = locPrefix;
  const isHome = pathname === expectedHomePath || pathname === `${expectedHomePath}/`;
  const lang = getLanguageForCountry(country);
  const rtl = isRTL(country);

  // Set <html lang> and dir on mount and country change
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    return () => {
      document.documentElement.lang = "en";
      document.documentElement.dir = "ltr";
    };
  }, [lang, rtl]);

  // Cache translations client-side for child components using getTranslationsSync
  const t = translations ?? getTranslationsSync(country);

  return (
    <div className="min-h-screen flex flex-col">
      <LegacyHeader isHome={isHome} country={country} region={region} city={locCity} translations={t} />
      <main className="flex-1">{children}</main>
      <GeoFooter locPrefix={locPrefix} city={locCity} translations={t} />
    </div>
  );
}
