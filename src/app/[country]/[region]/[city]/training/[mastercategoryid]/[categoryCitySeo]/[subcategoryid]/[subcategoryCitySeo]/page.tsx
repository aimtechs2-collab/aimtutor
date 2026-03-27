import type { Metadata } from "next";
import { api } from "@/lib/api";
import { getTranslations, t } from "@/lib/i18n";
import { parseSeoSlug, slugify } from "@/lib/seoSlug";
import { getCountryGeo } from "@/lib/geoData";
import { toAbsoluteUrl } from "@/lib/siteUrl";
import SubcategoryPageContent from "./SubcategoryPageContent";

function toTitle(slug: string) {
  return (slug || "")
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

type SubcategoryParams = {
  country: string;
  region: string;
  city: string;
  mastercategoryid: string;
  categoryCitySeo: string;
  subcategoryid: string;
  subcategoryCitySeo: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<SubcategoryParams>;
}): Promise<Metadata> {
  const {
    country,
    region,
    city,
    mastercategoryid,
    categoryCitySeo,
    subcategoryid,
    subcategoryCitySeo,
  } = await params;

  const parsed = parseSeoSlug(subcategoryCitySeo);
  const citySlug = parsed?.city || slugify(city);
  const cityTitle = toTitle(citySlug);
  const subcategoryName = parsed?.name ? toTitle(parsed.name) : "Training";
  const geo = getCountryGeo(country);
  const translations = await getTranslations(country);

  const locPrefix = `/${country}/${region}/${slugify(city)}`;
  const canonicalUrl = toAbsoluteUrl(
    `${locPrefix}/training/${mastercategoryid}/${categoryCitySeo}/${subcategoryid}/${subcategoryCitySeo}`,
  );
  const ogImageUrl = toAbsoluteUrl("/aimlogo.webp");

  const pageTitle = t(translations.seo.subcategoryTitle || "Best {{name}} Training in {{city}} | Aim Tutor", {
    name: subcategoryName,
    city: cityTitle,
  });
  const pageDescription = t(
    translations.seo.subcategoryDescription ||
      "Top-rated {{name}} training in {{city}}. Expert instructors, hands-on labs, certification prep. Enroll today!",
    { name: subcategoryName, city: cityTitle },
  );

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      `${subcategoryName} training ${cityTitle}`,
      `${subcategoryName} course ${cityTitle}`,
      `${subcategoryName} certification ${cityTitle}`,
      `learn ${subcategoryName} ${cityTitle}`,
      `best ${subcategoryName} training`,
      "Aim Tutor",
    ].join(", "),
    robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    alternates: {
      canonical: canonicalUrl,
      languages: { "x-default": canonicalUrl, [geo.lang]: canonicalUrl },
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: "Aim Tutor",
      locale: geo.ogLocale,
      title: pageTitle,
      description: pageDescription,
      images: [{ url: ogImageUrl, width: 512, height: 512, alt: `${subcategoryName} Training in ${cityTitle}` }],
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

export default async function SubCategoryPage({
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
}) {
  const resolvedParams = await params;
  const { subcategoryid, country } = resolvedParams;

  let data = null;
  let error = null;

  try {
    const response = await api.post(`/api/v1/subcategories/get-subcategories/${subcategoryid}?courses=True`);
    if (!response.data?.name) {
       error = "Subcategory not found";
    } else {
       data = response.data;
    }
  } catch (err: any) {
    if (err.response?.status === 404) error = "Subcategory not found";
    else if (err.response?.status === 500) error = "Server error - please try again later";
    else error = err.message || "Failed to load subcategory data";
  }

  const translations = await getTranslations(country);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Subcategory not found</p>
      </div>
    );
  }

  return <SubcategoryPageContent data={data} tt={translations} params={resolvedParams} />;
}
