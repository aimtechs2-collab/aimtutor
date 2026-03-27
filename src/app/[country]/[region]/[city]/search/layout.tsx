import type { Metadata } from "next";
import { slugify } from "@/lib/seoSlug";
import { toAbsoluteUrl } from "@/lib/siteUrl";

function cityToTitle(citySlug: string) {
  return (citySlug || "")
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { country: string; region: string; city: string };
  searchParams?: Record<string, string | string[] | undefined>;
}): Promise<Metadata> {
  const { country, region, city } = params;
  const qRaw = searchParams?.q;
  const q = Array.isArray(qRaw) ? qRaw[0] : qRaw;
  const cityTitle = cityToTitle(slugify(city));
  const locPrefix = `/${country}/${region}/${slugify(city)}`;
  const canonicalUrl = toAbsoluteUrl(`${locPrefix}/search`);

  const searchQuery = q?.trim() ?? "";
  const pageTitle = searchQuery
    ? `Search "${searchQuery}" Courses in ${cityTitle} | Aim Tutor`
    : `Search Technology Training Courses in ${cityTitle} | Aim Tutor`;
  const pageDescription = searchQuery
    ? `Find technology training courses for "${searchQuery}" in ${cityTitle}. Browse curriculum, fees, and enroll with Aim Tutor.`
    : `Browse technology training courses in ${cityTitle}. Filter by difficulty, price, duration, and instructors.`;

  const pageKeywords = [
    "technology training courses",
    cityTitle,
    "AI training",
    "cloud training",
    "data science training",
    "machine learning courses",
    "DevOps training",
    "Aim Tutor",
  ].join(", ");

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords,
    robots: "index, follow",
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: pageTitle,
      description: pageDescription,
    },
    twitter: {
      card: "summary_large_image",
      site: "@aimtutor",
      title: pageTitle,
      description: pageDescription,
    },
  };
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}

