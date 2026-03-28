import type { Metadata } from "next";
import { slugify } from "@/lib/seoSlug";
import TrainingPageContent from "./TrainingPageContent";
import { api } from "@/lib/api";
import { getCountryGeo } from "@/lib/geoData";
import { getTranslations, t } from "@/lib/i18n";
import { toAbsoluteUrl } from "@/lib/siteUrl";

function cityToTitle(citySlug: string) {
  return (citySlug || "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

type ApiCategory = {
  id: number;
  name: string;
  subcategories?: Array<{ id: number; name: string }>;
};

async function getTrainingCategories() {
  try {
    const response = await api.post("/api/v1/public/get-mastercategories?subcategories=all");
    return (response.data?.categories || []) as ApiCategory[];
  } catch {
    return [] as ApiCategory[];
  }
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
  const canonicalUrl = toAbsoluteUrl(`${locPrefix}/training`);
  const pageTitle = t(translations.seo.trainingTitle, { city: cityTitle, count: "200+" });
  const pageDescription = t(translations.seo.trainingDescription, { city: cityTitle, count: "1000+" });

  const pageKeywords = [
    `technology training courses ${cityTitle}`,
    `AI training ${cityTitle}`,
    `machine learning courses ${cityTitle}`,
    `cloud computing training ${cityTitle}`,
    `data science courses ${cityTitle}`,
    `web development training ${cityTitle}`,
    `cybersecurity courses ${cityTitle}`,
    `DevOps training ${cityTitle}`,
    `best IT training institute ${cityTitle}`,
    "AimTutor.ai",
    "expert instructors",
    "hands-on learning",
    "industry certification",
    "placement assistance",
    "online training",
    "classroom training",
  ].join(", ");

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords,
    robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "x-default": canonicalUrl,
        [geo.lang]: canonicalUrl,
      },
    },
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
    other: {
      "theme-color": "#3B82F6",
      "format-detection": "telephone=yes",
    },
  };
}

export default async function TrainingPage({
  params,
}: {
  params: Promise<{ country: string; region: string; city: string }>;
}) {
  const { country } = await params;
  const categories = await getTrainingCategories();
  const translations = await getTranslations(country);

  return <TrainingPageContent initialCategories={categories} tt={translations} />;
}

