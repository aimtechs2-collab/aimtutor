import type { Metadata } from "next";
import { parseSeoSlug, slugify } from "@/lib/seoSlug";
import CategoryPageContent from "./CategoryPageContent";
import { toAbsoluteUrl } from "@/lib/siteUrl";

function toTitle(citySlug: string) {
  return (citySlug || "")
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    country: string;
    region: string;
    city: string;
    mastercategoryid: string;
    categoryCitySeo: string;
  }>;
}): Promise<Metadata> {
  const { country, region, city, mastercategoryid, categoryCitySeo } = await params;

  const parsed = parseSeoSlug(categoryCitySeo);
  const citySlug = parsed?.city || slugify(city);
  const cityTitle = toTitle(citySlug);
  const locPrefix = `/${country}/${region}/${slugify(city)}`;
  const canonicalUrl = toAbsoluteUrl(`${locPrefix}/training/${mastercategoryid}/${categoryCitySeo}`);

  let categoryName = parsed?.name ? toTitle(parsed.name) : "Training";
  const totalCoursesLabel = "100+";
  const ogImageUrl = toAbsoluteUrl("/aimlogo.webp");
  const pageTitle = `Best ${categoryName} Training in ${cityTitle} ⭐ Online & Classroom Courses | Aim Tutor`;
  const pageDescription = `★ Top-rated ${categoryName} training in ${cityTitle}! 🚀 4.8/5 rating ✅ ${totalCoursesLabel} courses ✅ Expert instructors ✅ Hands-on labs ✅ Job assistance. Enroll today!`;
  const keywords = [
    `${categoryName} training ${cityTitle}`,
    `${categoryName} course ${cityTitle}`,
    `${categoryName} certification ${cityTitle}`,
    `${categoryName} classes ${cityTitle}`,
    `learn ${categoryName} ${cityTitle}`,
    `best ${categoryName} training ${cityTitle}`,
    `${categoryName} institute ${cityTitle}`,
    `online ${categoryName} training`,
    `${categoryName} bootcamp`,
    "Aim Tutor",
    "professional training",
    "hands-on learning",
    "expert instructors",
  ].join(", ");

  return {
    title: pageTitle,
    description: pageDescription,
    keywords,
    robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: "Aim Tutor",
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${categoryName} Training in ${cityTitle} - Aim Tutor`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@aimtutor",
      title: pageTitle,
      description: pageDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{
    country: string;
    region: string;
    city: string;
    mastercategoryid: string;
    categoryCitySeo: string;
  }>;
}) {
  const resolvedParams = await params;
  const { getTranslations } = await import("@/lib/i18n");
  const translations = await getTranslations(resolvedParams.country);
  return <CategoryPageContent params={resolvedParams} translations={translations} />;
}

