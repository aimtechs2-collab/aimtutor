import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  const siteOrigin = getSiteOrigin();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/student/",
          "/admin/",
          "/redirect/",
          "/reset-password/",
          "/forgot-password/",
        ],
      },
    ],
    sitemap: `${siteOrigin}/sitemap.xml`,
  };
}

