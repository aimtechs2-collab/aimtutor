import type { Metadata } from "next";
import { slugify } from "@/lib/seoSlug";
import AboutPageContent from "@/components/about/AboutPageContent";
import { COMPANY_INFO, LOCATION } from "@/components/about/aboutConstants";
import { getSiteOrigin, toAbsoluteUrl } from "@/lib/siteUrl";

function cityToTitle(citySlug: string) {
  return citySlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; region: string; city: string }>;
}): Promise<Metadata> {
  const { country, region, city } = await params;
  const cityTitle = cityToTitle(city);
  const citySlug = slugify(city);
  const locPrefix = `/${country}/${region}/${citySlug}`;
  const canonicalUrl = toAbsoluteUrl(`${locPrefix}/about`);
  const pageTitle = `About ${COMPANY_INFO.name} | ${COMPANY_INFO.yearsInBusiness}+ Years of AI & Software Training Excellence`;
  const pageDescription = `${COMPANY_INFO.name} has delivered software and AI training since ${COMPANY_INFO.foundingYear}. Our physical headquarters is in ${LOCATION.address.locality}, ${LOCATION.address.city}, and we serve learners in ${cityTitle} and worldwide through online and hybrid programs.`;
  const ogImageUrl = toAbsoluteUrl("/aimlogo.webp");

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      COMPANY_INFO.name,
      `AI training in ${cityTitle}`,
      `machine learning course in ${cityTitle}`,
      `software training ${LOCATION.address.locality}`,
      "AI and software training institute",
      "AI education India",
      "deep learning training",
      `NLP course in ${cityTitle}`,
      "data science training",
      `Python training in ${cityTitle}`,
      "artificial intelligence course",
      "technology training institute",
      `corporate training for ${cityTitle}`,
      "online AI training",
      "AI certification course",
      "machine learning bootcamp",
      `${LOCATION.address.locality} training institute`,
      `online AI training for ${cityTitle}`,
      "best AI institute India",
      `${COMPANY_INFO.yearsInBusiness} years training excellence`,
      `AI training since ${COMPANY_INFO.foundingYear}`,
      `${COMPANY_INFO.studentsTrained} students trained`,
      `${COMPANY_INFO.corporateClients} corporate clients`,
    ].join(", "),
    authors: [{ name: COMPANY_INFO.name }],
    creator: COMPANY_INFO.name,
    publisher: COMPANY_INFO.name,
    robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: COMPANY_INFO.name,
      locale: "en_IN",
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${COMPANY_INFO.name} - ${COMPANY_INFO.yearsInBusiness}+ Years of AI & Software Training Excellence`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@aimtutor",
      creator: "@aimtutor",
      title: pageTitle,
      description: pageDescription,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: { "en-IN": canonicalUrl, en: canonicalUrl, "x-default": toAbsoluteUrl("/about") },
    },
    other: {
      "geo.region": "IN-TS",
      "geo.placename": `${LOCATION.address.locality}, ${LOCATION.address.city}`,
      "geo.position": `${LOCATION.latitude};${LOCATION.longitude}`,
      ICBM: `${LOCATION.latitude}, ${LOCATION.longitude}`,
      "theme-color": "#1e3a8a",
      "format-detection": "telephone=yes",
      "apple-mobile-web-app-title": COMPANY_INFO.name,
      "business:contact_data:street_address": LOCATION.address.street,
      "business:contact_data:locality": LOCATION.address.locality,
      "business:contact_data:region": LOCATION.address.state,
      "business:contact_data:postal_code": LOCATION.address.pincode,
      "business:contact_data:country_name": LOCATION.address.country,
      "business:contact_data:phone_number": COMPANY_INFO.phone,
      "business:contact_data:email": COMPANY_INFO.email,
      "business:contact_data:website": COMPANY_INFO.website,
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ country: string; region: string; city: string }>;
}) {
  const { country, region, city } = await params;
  const cityTitle = cityToTitle(city);
  const citySlug = slugify(city);
  const locPrefix = `/${country}/${region}/${citySlug}`;
  const absoluteHomeUrl = toAbsoluteUrl(locPrefix);
  const absoluteAboutUrl = toAbsoluteUrl(`${locPrefix}/about`);
  const siteOrigin = getSiteOrigin();

  return (
    <AboutPageContent
      locPrefix={locPrefix}
      cityTitle={cityTitle}
      siteOrigin={siteOrigin}
      absoluteHomeUrl={absoluteHomeUrl}
      absoluteAboutUrl={absoluteAboutUrl}
    />
  );
}
