import type { Metadata } from "next";
import { parseCourseCitySeo, parseSeoSlug, slugify } from "@/lib/seoSlug";
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
    subcategoryid: string;
    subcategoryCitySeo: string;
    courseId: string;
    courseCitySeo: string;
  }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { country, region, city, mastercategoryid, categoryCitySeo, subcategoryid, subcategoryCitySeo, courseId, courseCitySeo } = resolvedParams;

  const parsed = parseSeoSlug(subcategoryCitySeo);
  const parsedCourse = parseCourseCitySeo(courseCitySeo);
  const citySlug = parsed?.city || slugify(city);
  const cityTitle = toTitle(citySlug);
  const locPrefix = `/${country}/${region}/${slugify(city)}`;
  const canonicalUrl = toAbsoluteUrl(`${locPrefix}/training/${mastercategoryid}/${categoryCitySeo}/${subcategoryid}/${subcategoryCitySeo}/${courseId}/${courseCitySeo}`);

  const courseTitle = parsedCourse?.name ? toTitle(parsedCourse.name) : "Course";
  const totalLessons = 40;
  const totalHours = 30;

  const averageRating = 4.6;
  const totalRatings = 10906;

  const pageTitle = `${courseTitle} Course in ${cityTitle} ⭐ ${averageRating}/5 | AimTutor.ai`;
  const pageDescription = `★ Master ${courseTitle} in ${cityTitle}! 🚀 ${averageRating}/5 rating from ${totalRatings.toLocaleString()}+ students ✅ ${totalLessons} lessons ✅ ${totalHours}+ hours. Enroll today!`;

  return {
    title: pageTitle,
    description: pageDescription,
    robots: "index, follow",
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: pageTitle,
      description: pageDescription,
    },
    twitter: {
      card: "summary",
      site: "@aimtutor",
      title: pageTitle,
      description: pageDescription,
    },
  };
}

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return children;
}

