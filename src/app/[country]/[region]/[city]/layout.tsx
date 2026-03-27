import GeoLayoutClient from "@/components/GeoLayoutClient";
import { CITY_PATHS } from "@/lib/cityPaths";
import { getTranslations } from "@/lib/i18n";

/** Pre-render all 237 city pages at build time (SSG). */
export function generateStaticParams() {
  return CITY_PATHS;
}

/** Allow dynamic params at runtime for cities not in CITY_PATHS. */
export const dynamicParams = true;

export default async function GeoLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ country: string; region: string; city: string }>;
}) {
  const { country, region, city } = await params;

  // Preload translations on the server so they're available client-side
  const translations = await getTranslations(country);

  return (
    <GeoLayoutClient country={country} region={region} city={city} translations={translations}>
      {children}
    </GeoLayoutClient>
  );
}
