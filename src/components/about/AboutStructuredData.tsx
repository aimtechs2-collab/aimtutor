"use client";

import { useMemo, memo } from "react";
import {
  COMPANY_INFO,
  LOCATION,
  SOCIAL_MEDIA,
  getAboutFaqs,
} from "./aboutConstants";

export type AboutStructuredDataProps = {
  siteOrigin: string;
  absoluteHomeUrl: string;
  absoluteAboutUrl: string;
};

const AboutStructuredDataInner = memo(function AboutStructuredData({
  siteOrigin,
  absoluteHomeUrl,
  absoluteAboutUrl,
}: AboutStructuredDataProps) {
  const organizationSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "@id": `${siteOrigin}/#organization`,
      name: COMPANY_INFO.name,
      alternateName: [
        COMPANY_INFO.alternateName,
        "AIM Tech",
        "Aim Tutor Training Institute",
      ],
      url: COMPANY_INFO.website,
      description: `${COMPANY_INFO.name} is a premier AI and software training institute with ${COMPANY_INFO.yearsInBusiness}+ years of excellence since ${COMPANY_INFO.foundingYear}. Located in ${LOCATION.address.locality}, ${LOCATION.address.city}, we offer world-class AI, Machine Learning, and technology training programs globally.`,
      foundingDate: COMPANY_INFO.foundingYear.toString(),
      foundingLocation: {
        "@type": "Place",
        name: `${LOCATION.address.locality}, ${LOCATION.address.city}`,
      },
      slogan: COMPANY_INFO.tagline,
      address: {
        "@type": "PostalAddress",
        streetAddress: LOCATION.address.street,
        addressLocality: LOCATION.address.locality,
        addressRegion: LOCATION.address.state,
        postalCode: LOCATION.address.pincode,
        addressCountry: LOCATION.address.countryCode,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: LOCATION.latitude.toString(),
        longitude: LOCATION.longitude.toString(),
      },
      telephone: COMPANY_INFO.phone,
      email: COMPANY_INFO.email,
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: COMPANY_INFO.phone,
          contactType: "customer service",
          areaServed: ["IN", "US", "GB", "AE", "SG"],
          availableLanguage: ["English", "Hindi", "Telugu"],
        },
        {
          "@type": "ContactPoint",
          telephone: COMPANY_INFO.phoneSecondary,
          contactType: "sales",
          areaServed: "Worldwide",
        },
      ],
      areaServed: [
        { "@type": "Country", name: "India" },
        { "@type": "Country", name: "United States" },
        { "@type": "Country", name: "United Kingdom" },
        { "@type": "Country", name: "United Arab Emirates" },
        { "@type": "Country", name: "Singapore" },
        { "@type": "Place", name: "Worldwide" },
      ],
      knowsAbout: [
        "Artificial Intelligence",
        "Machine Learning",
        "Deep Learning",
        "Natural Language Processing",
        "Data Science",
        "Python Programming",
        "TensorFlow",
        "PyTorch",
        "Computer Vision",
        "Generative AI",
        "LLMs",
        "AI for Business",
        "Software Training",
        "Technology Education",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "AI & Technology Training Courses",
        itemListElement: [
          { "@type": "OfferCatalog", name: "AI & Machine Learning Courses" },
          { "@type": "OfferCatalog", name: "Deep Learning & NLP Courses" },
          { "@type": "OfferCatalog", name: "Generative AI & LLM Courses" },
          { "@type": "OfferCatalog", name: "AI for Business Programs" },
        ],
      },
      numberOfEmployees: {
        "@type": "QuantitativeValue",
        minValue: 50,
        maxValue: 100,
      },
      alumni: {
        "@type": "QuantitativeValue",
        value: parseInt(COMPANY_INFO.studentsTrained.replace(/\D/g, ""), 10) * 1000,
        unitText: "students",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: COMPANY_INFO.rating,
        bestRating: "5",
        worstRating: "1",
        ratingCount: COMPANY_INFO.totalReviews.replace(",", ""),
        reviewCount: "12500",
      },
      award: [
        `Best IT Training Institute ${LOCATION.address.city} 2023`,
        "Excellence in AI Education 2024",
        "Top 10 Technology Training Providers India",
      ],
      sameAs: Object.values(SOCIAL_MEDIA),
    }),
    [siteOrigin]
  );

  const aboutPageSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "@id": `${absoluteAboutUrl}#webpage`,
      url: absoluteAboutUrl,
      name: `About ${COMPANY_INFO.name} - ${COMPANY_INFO.yearsInBusiness}+ Years of AI & Software Training Excellence`,
      description: `Learn about ${COMPANY_INFO.name}, ${LOCATION.address.city}'s premier AI training institute with ${COMPANY_INFO.yearsInBusiness}+ years of excellence. ${COMPANY_INFO.studentsTrained} students trained, ${COMPANY_INFO.corporateClients} corporate clients, ${COMPANY_INFO.successRate} success rate.`,
      isPartOf: { "@id": `${siteOrigin}/#website` },
      about: { "@id": `${siteOrigin}/#organization` },
      mainEntity: { "@id": `${siteOrigin}/#organization` },
      breadcrumb: { "@id": `${absoluteAboutUrl}#breadcrumb` },
      inLanguage: "en-IN",
      datePublished: `${COMPANY_INFO.foundingYear}-01-01`,
      dateModified: new Date().toISOString(),
    }),
    [siteOrigin, absoluteAboutUrl]
  );

  const breadcrumbSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${absoluteAboutUrl}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: absoluteHomeUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "About Us",
          item: absoluteAboutUrl,
        },
      ],
    }),
    [absoluteHomeUrl, absoluteAboutUrl]
  );

  const websiteSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteOrigin}/#website`,
      url: siteOrigin,
      name: COMPANY_INFO.name,
      description: `Premier AI & Software Training Institute with ${COMPANY_INFO.yearsInBusiness}+ years of excellence`,
      publisher: { "@id": `${siteOrigin}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteOrigin}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      inLanguage: "en-IN",
    }),
    [siteOrigin]
  );

  const localBusinessSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "EducationalOrganization", "ProfessionalService"],
      name: `${COMPANY_INFO.name} - ${LOCATION.address.locality}`,
      description: `Premier AI training institute with ${COMPANY_INFO.yearsInBusiness} years of excellence. ${COMPANY_INFO.studentsTrained} students trained since ${COMPANY_INFO.foundingYear}.`,
      address: {
        "@type": "PostalAddress",
        streetAddress: LOCATION.address.street,
        addressLocality: LOCATION.address.locality,
        addressRegion: LOCATION.address.state,
        postalCode: LOCATION.address.pincode,
        addressCountry: LOCATION.address.countryCode,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: LOCATION.latitude.toString(),
        longitude: LOCATION.longitude.toString(),
      },
      url: COMPANY_INFO.website,
      telephone: COMPANY_INFO.phone,
      email: COMPANY_INFO.email,
      foundingDate: COMPANY_INFO.foundingYear.toString(),
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "19:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: "09:00",
          closes: "17:00",
        },
      ],
      priceRange: "₹₹",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: COMPANY_INFO.rating,
        reviewCount: COMPANY_INFO.totalReviews.replace(",", ""),
      },
      sameAs: Object.values(SOCIAL_MEDIA),
    }),
    [siteOrigin]
  );

  const faqSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: getAboutFaqs().map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    }),
    []
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
});

AboutStructuredDataInner.displayName = "AboutStructuredData";

export default AboutStructuredDataInner;
