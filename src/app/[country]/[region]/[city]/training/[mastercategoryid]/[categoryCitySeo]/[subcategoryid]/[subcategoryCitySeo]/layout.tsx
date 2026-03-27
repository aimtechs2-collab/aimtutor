import type { Metadata } from "next";
import { parseSeoSlug, slugify } from "@/lib/seoSlug";
import { toAbsoluteUrl } from "@/lib/siteUrl";

function toTitle(input: string) {
  return (input || "")
    .split(/-+/)
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
    subcategoryid: string;
    subcategoryCitySeo: string;
  }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { country, region, city, mastercategoryid, categoryCitySeo, subcategoryid, subcategoryCitySeo } = resolvedParams;

  const locPrefix = `/${country}/${region}/${slugify(city)}`;
  const parsed = parseSeoSlug(subcategoryCitySeo);
  const citySlug = parsed?.city || slugify(city);
  const cityTitle = toTitle(citySlug);

  const canonicalUrl = toAbsoluteUrl(`${locPrefix}/training/${mastercategoryid}/${categoryCitySeo}/${subcategoryid}/${subcategoryCitySeo}`);
  let subcategoryName = parsed?.name ? toTitle(parsed.name) : "Training";
  const totalCoursesLabel = "50+";
  const ogImageUrl = toAbsoluteUrl("/aimlogo.webp");
  const pageTitle = `Best ${subcategoryName} Training in ${cityTitle} ⭐ Expert Courses | Aim Tutor`;
  const pageDescription = `★ Top-rated ${subcategoryName} training in ${cityTitle}! 🚀 4.8/5 rating ✅ ${totalCoursesLabel} courses ✅ Expert instructors ✅ Hands-on labs ✅ Job placement support ✅ Online & classroom options. Enroll today!`;
  const keywords = [
    `${subcategoryName} training ${cityTitle}`,
    `${subcategoryName} course ${cityTitle}`,
    `${subcategoryName} certification ${cityTitle}`,
    `${subcategoryName} classes ${cityTitle}`,
    `learn ${subcategoryName} ${cityTitle}`,
    `best ${subcategoryName} training ${cityTitle}`,
    `${subcategoryName} institute ${cityTitle}`,
    `online ${subcategoryName} training`,
    `${subcategoryName} bootcamp`,
    "Aim Tutor",
    "professional training",
    "hands-on learning",
    "expert instructors",
    "live training",
    "placement assistance",
  ].join(", ");

  return {
    title: pageTitle,
    description: pageDescription,
    keywords,
    robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    alternates: { canonical: canonicalUrl },
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
          alt: `${subcategoryName} Training in ${cityTitle} - Aim Tutor`,
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
    other: {
      "theme-color": "#3B82F6",
      "format-detection": "telephone=yes",
    },
  };
}

export default function SubCategoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}

