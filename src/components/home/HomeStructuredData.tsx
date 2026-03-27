import { getSiteOrigin } from "@/lib/siteUrl";

export default function HomeStructuredData({
  cityTitle,
}: {
  cityTitle: string;
}) {
  const SITE_URL = getSiteOrigin();
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Aim Tutor",
    alternateName: ["AIM Tech", "AIM Training", "Aim Tutor Training Institute"],
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    image: [
      `${SITE_URL}/images/aim-technologies-training.jpg`,
      `${SITE_URL}/images/aim-tech-campus.jpg`,
      `${SITE_URL}/images/aim-training-labs.jpg`,
    ],
    description:
      "Leading technology training institute providing professional courses in AI, Cloud Computing, Data Science, DevOps, and emerging technologies.",
    foundingDate: "2015",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Tech Park, HITEC City",
      addressLocality: "Ameerpet",
      addressRegion: "Telangana",
      postalCode: "500081",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "17.4485",
      longitude: "78.3908",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "2547",
      reviewCount: "1892",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Aim Tutor",
    alternateName: "AIM Tech Training",
    url: SITE_URL,
    description:
      "Transform your career with cutting-edge technology training. Expert-led courses in AI, Cloud, Data Science, DevOps.",
    publisher: { "@type": "Organization", name: "Aim Tutor", "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Professional Technology Training",
    description:
      `Comprehensive technology training programs including AI, Cloud Computing, Data Science, DevOps for learners in ${cityTitle} and worldwide online.`,
    provider: { "@type": "EducationalOrganization", name: "Aim Tutor", "@id": `${SITE_URL}/#organization` },
    serviceType: "Educational Training",
    areaServed: { "@type": "Place", name: "Worldwide" },
    audience: { "@type": "EducationalAudience", educationalRole: "student" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </>
  );
}
