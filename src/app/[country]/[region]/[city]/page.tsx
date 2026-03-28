import type { Metadata } from "next";
import { slugify } from "@/lib/seoSlug";
import HomePageContent from "@/components/home/HomePageContent";
import { getCountryGeo } from "@/lib/geoData";
import { getTranslations, t } from "@/lib/i18n";
import { toAbsoluteUrl } from "@/lib/siteUrl";

function cityToTitle(citySlug: string) {
  return citySlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; region: string; city: string }>;
}): Promise<Metadata> {
  const { country, region, city } = await params;
  const cityTitle = cityToTitle(city);
  const geo = getCountryGeo(country);
  const translations = await getTranslations(country);
  const locPrefix = `/${country}/${region}/${slugify(city)}`;
  const canonicalUrl = toAbsoluteUrl(locPrefix);
  const pageTitle = t(translations.seo.homeTitle, { city: cityTitle });
  const pageDescription = t(translations.seo.homeDescription, { city: cityTitle });

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      `technology training ${cityTitle}`,
      `AI training ${cityTitle}`,
      `cloud computing courses ${cityTitle}`,
      `data science training ${cityTitle}`,
      `best IT institute ${cityTitle}`,
      "machine learning courses",
      "DevOps training",
      "AimTutor.ai",
      "placement assistance",
    ].join(", "),
    authors: [{ name: "Aim Tutor" }],
    creator: "Aim Tutor",
    publisher: "Aim Tutor",
    robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: "AimTutor.ai",
      locale: geo.ogLocale,
      title: pageTitle,
      description: pageDescription,
    },
    twitter: {
      card: "summary",
      site: "@aimtutor",
      title: pageTitle,
      description: pageDescription,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "x-default": canonicalUrl,
        [geo.lang]: canonicalUrl,
      },
    },
    other: {
      "geo.region": `${country.toUpperCase()}-${region.toUpperCase()}`,
      "geo.placename": cityTitle,
      "geo.position": `${geo.lat};${geo.lng}`,
      ICBM: `${geo.lat}, ${geo.lng}`,
      "theme-color": "#3B82F6",
      "format-detection": "telephone=yes",
      "apple-mobile-web-app-title": "AimTutor.ai",
      "apple-mobile-web-app-capable": "yes",
    },
  };
}

export default async function GeoHomePage({
  params,
}: {
  params: Promise<{ country: string; region: string; city: string }>;
}) {
  const { country, region, city } = await params;
  const cityTitle = cityToTitle(city);
  const citySlug = slugify(city);
  const locPrefix = `/${country}/${region}/${citySlug}`;
  const translations = await getTranslations(country);

  return (
    <HomePageContent
      country={country}
      region={region}
      city={city}
      cityTitle={cityTitle}
      citySlug={citySlug}
      locPrefix={locPrefix}
      translations={translations}
    />
  );
}
