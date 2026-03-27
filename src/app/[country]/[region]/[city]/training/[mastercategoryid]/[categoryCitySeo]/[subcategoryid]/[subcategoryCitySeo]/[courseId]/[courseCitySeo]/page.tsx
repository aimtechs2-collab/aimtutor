import type { Metadata } from "next";
import CoursePageContent from "./CoursePageContent";
import { api } from "@/lib/api";
import { parseSeoSlug, slugify } from "@/lib/seoSlug";
import { toAbsoluteUrl } from "@/lib/siteUrl";
import { getTranslations, t } from "@/lib/i18n";
import { getCountryGeo } from "@/lib/geoData";

type RouteParams = {
  country: string;
  region: string;
  city: string;
  mastercategoryid: string;
  categoryCitySeo: string;
  subcategoryid: string;
  subcategoryCitySeo: string;
  courseId: string;
  courseCitySeo: string;
};

type CourseApiResponse = {
  course?: {
    title?: string;
    short_description?: string;
    description?: string;
  };
};

function toTitle(slug: string) {
  return (slug || "")
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const {
    country,
    region,
    city,
    mastercategoryid,
    categoryCitySeo,
    subcategoryid,
    subcategoryCitySeo,
    courseId,
    courseCitySeo,
  } = await params;

  const parsed = parseSeoSlug(subcategoryCitySeo);
  const citySlug = parsed?.city || slugify(city);
  const cityTitle = toTitle(citySlug);
  const geo = getCountryGeo(country);
  const translations = await getTranslations(country);

  let courseName = toTitle(courseCitySeo.split("-course-")[0] || courseCitySeo.split("-training-")[0] || "Training");

  try {
    const res = await api.post(`/api/v1/public/get-courses/${courseId}?lessons=True`);
    const d = res.data as unknown as CourseApiResponse;
    if (d.course?.title) courseName = d.course.title;
  } catch {
    // Use fallback name from URL slug
  }

  const locPrefix = `/${country}/${region}/${slugify(city)}`;
  const canonicalUrl = toAbsoluteUrl(
    `${locPrefix}/training/${mastercategoryid}/${categoryCitySeo}/${subcategoryid}/${subcategoryCitySeo}/${courseId}/${courseCitySeo}`,
  );
  const ogImageUrl = toAbsoluteUrl("/aimlogo.webp");

  const pageTitle = t(translations.seo.courseTitle, { name: courseName, city: cityTitle });
  const pageDescription = t(translations.seo.courseDescription, { name: courseName, city: cityTitle });

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      `${courseName} course ${cityTitle}`,
      `${courseName} training ${cityTitle}`,
      `${courseName} certification`,
      `learn ${courseName} ${cityTitle}`,
      `best ${courseName} training`,
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
      images: [{ url: ogImageUrl, width: 512, height: 512, alt: `${courseName} Training in ${cityTitle}` }],
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

export default async function CoursePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const resolvedParams = await params;
  const { country, courseId } = resolvedParams;

  const tt = await getTranslations(country);

  let courseTitle = "Professional Training Course";
  let courseDescription =
    "Instructor-led online training with practical projects and career-focused curriculum.";

  try {
    const res = await api.post(`/api/v1/public/get-courses/${courseId}?lessons=True`);
    const d = res.data as unknown as CourseApiResponse;
    if (d.course?.title) courseTitle = d.course.title;
    if (d.course?.short_description || d.course?.description) {
      courseDescription = d.course?.short_description ?? d.course?.description ?? courseDescription;
    }
  } catch {
    // Keep stable fallback schema if API is unreachable.
  }

  const locPrefix = `/${resolvedParams.country}/${resolvedParams.region}/${slugify(resolvedParams.city)}`;
  const canonicalUrl = toAbsoluteUrl(
    `${locPrefix}/training/${resolvedParams.mastercategoryid}/${resolvedParams.categoryCitySeo}/${resolvedParams.subcategoryid}/${resolvedParams.subcategoryCitySeo}/${resolvedParams.courseId}/${resolvedParams.courseCitySeo}`,
  );

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: courseTitle,
    description: courseDescription,
    provider: {
      "@type": "EducationalOrganization",
      name: "Aim Tutor",
      url: toAbsoluteUrl("/"),
    },
    educationalCredentialAwarded: tt.coursePage.certificateOfCompletion,
    inLanguage: country === "us" ? "en" : country,
    url: canonicalUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <CoursePageContent params={resolvedParams} tt={tt} />
    </>
  );
}
