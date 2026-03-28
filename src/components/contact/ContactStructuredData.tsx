"use client";

import { useMemo, memo } from "react";
import { CONTACT_COMPANY_INFO, CONTACT_SOCIAL_MEDIA, LOCATION, getContactFaqs } from "./contactConstants";

export type ContactStructuredDataProps = {
  siteOrigin: string;
  absoluteHomeUrl: string;
  canonicalContactUrl: string;
  pageDescription: string;
};

const ContactStructuredDataInner = memo(function ContactStructuredData({
  siteOrigin,
  absoluteHomeUrl,
  canonicalContactUrl,
  pageDescription,
}: ContactStructuredDataProps) {
  const C = CONTACT_COMPANY_INFO;

  const organizationSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "@id": `${siteOrigin}/#organization`,
      name: C.name,
      alternateName: [C.alternateName, "AIM Tech", "Aim Tutor Training Institute"],
      url: C.website,
      description: `${C.name} - ${C.yearsInBusiness} years of excellence in AI and technology training. ${C.studentsPlaced} students trained, ${C.corporateClients} corporate clients. Premier AI training institute in Ameerpet, Hyderabad.`,
      foundingDate: C.foundingYear.toString(),
      numberOfEmployees: {
        "@type": "QuantitativeValue",
        minValue: 50,
        maxValue: 100,
      },
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
        latitude: LOCATION.latitude,
        longitude: LOCATION.longitude,
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+91-9700187077",
          contactType: "customer service",
          areaServed: "IN",
          availableLanguage: ["English", "Hindi", "Telugu"],
          hoursAvailable: [
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
        },
        {
          "@type": "ContactPoint",
          telephone: "+91-6300232040",
          contactType: "sales",
        },
        {
          "@type": "ContactPoint",
          email: "admin@aimtutor.in",
          contactType: "customer service",
        },
      ],
      sameAs: CONTACT_SOCIAL_MEDIA.map((s) => s.link).concat([C.website]),
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: C.rating,
        bestRating: "5",
        worstRating: "1",
        ratingCount: C.totalReviews.replace(",", ""),
        reviewCount: "4523",
      },
      alumni: {
        "@type": "QuantitativeValue",
        value: 50000,
        unitText: "students",
      },
    }),
    [siteOrigin]
  );

  const localBusinessSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "EducationalOrganization", "ProfessionalService"],
      "@id": `${siteOrigin}/#localbusiness`,
      name: C.name,
      description: `Premier AI training institute with ${C.yearsInBusiness} years of excellence. Offering Machine Learning, Deep Learning, Data Science courses with 100% placement assistance.`,
      url: C.website,
      telephone: "+91-9700187077",
      email: "admin@aimtutor.in",
      foundingDate: C.foundingYear.toString(),
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
        latitude: LOCATION.latitude,
        longitude: LOCATION.longitude,
      },
      hasMap: `https://www.google.com/maps?q=${LOCATION.latitude},${LOCATION.longitude}`,
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
      currenciesAccepted: "INR",
      paymentAccepted: ["Cash", "Credit Card", "Debit Card", "UPI", "Bank Transfer", "EMI"],
      areaServed: {
        "@type": "GeoCircle",
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: LOCATION.latitude,
          longitude: LOCATION.longitude,
        },
        geoRadius: "50000",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: C.rating,
        reviewCount: C.totalReviews.replace(",", ""),
      },
      sameAs: CONTACT_SOCIAL_MEDIA.map((s) => s.link),
    }),
    [siteOrigin]
  );

  const contactPageSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: `Contact ${C.name}`,
      description: pageDescription,
      url: canonicalContactUrl,
      mainEntity: {
        "@type": "Organization",
        "@id": `${siteOrigin}/#organization`,
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
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
            name: "Contact Us",
            item: canonicalContactUrl,
          },
        ],
      },
    }),
    [siteOrigin, pageDescription, canonicalContactUrl, absoluteHomeUrl]
  );

  const faqSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: getContactFaqs().map((faq) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
});

ContactStructuredDataInner.displayName = "ContactStructuredData";

export default ContactStructuredDataInner;
