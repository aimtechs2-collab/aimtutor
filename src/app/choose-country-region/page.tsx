import type { Metadata } from "next";
import ChooseCountryRegionContent from "./ChooseCountryRegionContent";
import { toAbsoluteUrl } from "@/lib/siteUrl";

export async function generateMetadata(): Promise<Metadata> {
  const canonicalUrl = toAbsoluteUrl("/choose-country-region");
  const pageTitle = "Software Training Courses in 200+ Cities Worldwide | Professional IT Training";
  const pageDescription =
    "Expert-led software training courses in your city. Choose from 200+ locations across Europe, Asia, Americas, and Middle East. Onsite and online IT courses available.";
  const pageKeywords =
    "software training, IT courses, programming courses, corporate training, onsite training, instructor-led courses, Python training, Java courses, cloud computing";

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords,
    robots: "index, follow",
    authors: [{ name: "Your Training Company" }],
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: pageTitle,
      description: pageDescription,
      siteName: "Your Training Company",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      site: "@aimtutor",
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default function ChooseCountryRegionPage() {
  return <ChooseCountryRegionContent />;
}

