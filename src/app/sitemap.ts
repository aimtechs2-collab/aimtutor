import type { MetadataRoute } from "next";
import { CITY_PATHS } from "@/lib/cityPaths";
import { getSiteOrigin } from "@/lib/siteUrl";
import { api } from "@/lib/api";
import { slugify } from "@/lib/seoSlug";

type ApiSubcategory = {
  id: number;
  name: string;
  courses?: Array<{ id: number; title: string }>;
};

type ApiCategory = {
  id: number;
  name: string;
  subcategories?: ApiSubcategory[];
};

async function fetchCategories(): Promise<ApiCategory[]> {
  try {
    const res = await api.post("/api/v1/public/get-mastercategories?subcategories=all&courses=all");
    return (res.data?.categories || []) as ApiCategory[];
  } catch {
    return [];
  }
}

function buildSeoSlug(name: string, city: string): string {
  return `${slugify(name)}-training-in-${slugify(city)}`;
}

function buildCourseSeoSlug(name: string, city: string): string {
  return `${slugify(name)}-course-in-${slugify(city)}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteOrigin = getSiteOrigin();
  const now = new Date();
  const allowedCountries = new Set([
    "in", // India
    "lu", // Luxembourg
    "us", // United States
    "au", // Australia
    "nz", // New Zealand
    "gb", // United Kingdom
    "de", // Germany
    "ca", // Canada
    "kr", // South Korea
    "jp", // Japan
    "cn", // China
    "fr", // France
    "be", // Belgium
    "nl", // Netherlands
    // Arab countries currently supported in routes
    "ae",
    "sa",
    "qa",
    "eg",
    "kw",
    "om",
    "ma",
    "tn",
  ]);

  // Always include root
  const entries: MetadataRoute.Sitemap = [
    { url: `${siteOrigin}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
  ];

  // Fetch categories once (shared across all cities)
  const categories = await fetchCategories();

  // Generate entries only for currently targeted countries/cities.
  for (const loc of CITY_PATHS) {
    if (!allowedCountries.has(loc.country)) continue;
    const prefix = `${siteOrigin}/${loc.country}/${loc.region}/${loc.city}`;

    // City-level pages
    entries.push(
      { url: prefix, lastModified: now, changeFrequency: "daily", priority: 0.9 },
      { url: `${prefix}/training`, lastModified: now, changeFrequency: "daily", priority: 0.85 },
      { url: `${prefix}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
      { url: `${prefix}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    );

    // Category, subcategory, and course pages
    for (const cat of categories) {
      const catSeo = buildSeoSlug(cat.name, loc.city);
      entries.push({
        url: `${prefix}/training/${cat.id}/${catSeo}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });

      for (const sub of cat.subcategories || []) {
        const subSeo = buildSeoSlug(sub.name, loc.city);
        entries.push({
          url: `${prefix}/training/${cat.id}/${catSeo}/${sub.id}/${subSeo}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.75,
        });

        for (const course of sub.courses || []) {
          const courseSeo = buildCourseSeoSlug(course.title, loc.city);
          entries.push({
            url: `${prefix}/training/${cat.id}/${catSeo}/${sub.id}/${subSeo}/${course.id}/${courseSeo}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.7,
          });
        }
      }
    }
  }

  return entries;
}
