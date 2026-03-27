import type { Metadata } from "next";
import { slugify } from "@/lib/seoSlug";
import ContactPageContent from "@/components/contact/ContactPageContent";
import { CONTACT_COMPANY_INFO, LOCATION } from "@/components/contact/contactConstants";
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
  const canonicalUrl = toAbsoluteUrl(`${locPrefix}/contact`);
  const C = CONTACT_COMPANY_INFO;
  const pageTitle = `Contact ${C.name} | Admissions and Course Counseling`;
  const pageDescription = `Contact ${C.name} for AI and software training admissions. We operate from our Ameerpet, Hyderabad headquarters and support learners in ${cityTitle} and worldwide through online and hybrid delivery.`;
  const ogImageUrl = toAbsoluteUrl("/aimlogo.webp");

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      `${C.name} contact`,
      `AI training institute Ameerpet ${C.yearsInBusiness} years`,
      "machine learning courses online",
      `contact AI training team for ${cityTitle}`,
      `technology training institute since ${C.foundingYear}`,
      `${C.name} Ameerpet headquarters`,
      "AI course enquiry",
      "corporate AI training contact",
      `data science training in ${cityTitle}`,
      "AI institute contact",
      `${C.studentsPlaced} students placed`,
      `${C.corporateClients} corporate clients`,
      "artificial intelligence training online",
      "ML training with placement",
      "deep learning course online",
      "generative AI training",
      "ChatGPT training online",
      "Python AI course",
    ].join(", "),
    authors: [{ name: C.name }],
    creator: C.name,
    publisher: C.name,
    robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: C.name,
      locale: "en_IN",
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Contact ${C.name} - ${C.yearsInBusiness} Years of AI Training Excellence`,
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
      languages: { "en-IN": canonicalUrl, en: canonicalUrl, "x-default": toAbsoluteUrl("/contact") },
    },
    other: {
      "geo.region": "IN-TS",
      "geo.placename": `${LOCATION.address.locality}, ${LOCATION.address.city}`,
      "geo.position": `${LOCATION.latitude};${LOCATION.longitude}`,
      ICBM: `${LOCATION.latitude}, ${LOCATION.longitude}`,
      "theme-color": "#3B82F6",
      "format-detection": "telephone=yes",
      "apple-mobile-web-app-title": C.name,
      "business:contact_data:street_address": LOCATION.address.street,
      "business:contact_data:locality": LOCATION.address.locality,
      "business:contact_data:region": LOCATION.address.state,
      "business:contact_data:postal_code": LOCATION.address.pincode,
      "business:contact_data:country_name": LOCATION.address.country,
      "business:contact_data:phone_number": "+91-9700187077",
      "business:contact_data:email": "admin@aimtutor.in",
      "business:contact_data:website": C.website,
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ country: string; region: string; city: string }>;
}) {
  const { country, region, city } = await params;
  const cityTitle = cityToTitle(city);
  const citySlug = slugify(city);
  const locPrefix = `/${country}/${region}/${citySlug}`;
  const absoluteHomeUrl = toAbsoluteUrl(locPrefix);
  const canonicalContactUrl = toAbsoluteUrl(`${locPrefix}/contact`);
  const siteOrigin = getSiteOrigin();
  const C = CONTACT_COMPANY_INFO;
  const pageDescription = `Contact ${C.name} for AI and software training admissions. We operate from our Ameerpet, Hyderabad headquarters and support learners in ${cityTitle} and worldwide through online and hybrid delivery.`;

  return (
    <ContactPageContent
      locPrefix={locPrefix}
      cityTitle={cityTitle}
      siteOrigin={siteOrigin}
      absoluteHomeUrl={absoluteHomeUrl}
      canonicalContactUrl={canonicalContactUrl}
      pageDescription={pageDescription}
    />
  );
}
