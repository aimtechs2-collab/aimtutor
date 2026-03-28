// src/pages/SubCategoryPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Title, Meta, Link as HeadLink } from "react-head";
import {
  buildCourseCitySeo,
  slugify,
  parseSeoSlug
} from "../utils/seoSlug";
import api from "../utils/api";

/* ============================================
   HELPER FUNCTIONS
============================================ */

// Convert "hyderabad" → "Hyderabad"
const toTitle = (s) =>
  (s || "")
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");

/* ============================================
   STRUCTURED DATA COMPONENTS
============================================ */

const StructuredData = ({
  subcategoryName,
  courses,
  cityTitle,
  locPrefix,
  mastercategoryid,
  categoryCitySeo,
  subcategoryid,
  subcategoryCitySeo
}) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://aimtutor.co';

  // Course List Schema
  const courseListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${subcategoryName} Training Courses in ${cityTitle}`,
    "description": `Professional ${subcategoryName} training programs in ${cityTitle} with expert instructors and hands-on learning`,
    "numberOfItems": courses.length,
    "url": `${siteUrl}${locPrefix}/training/${mastercategoryid}/${categoryCitySeo}/${subcategoryid}/${subcategoryCitySeo}`,
    "itemListElement": courses.slice(0, 20).map((course, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Course",
        "name": course.title,
        "description": course.short_description || course.description || `Learn ${course.title} with hands-on training in ${cityTitle}`,
        "provider": {
          "@type": "EducationalOrganization",
          "name": "Aim Tutor",
          "url": siteUrl,
          "sameAs": [
            "https://www.linkedin.com/company/aim-technologies",
            "https://twitter.com/aimtech"
          ]
        },
        "educationalLevel": course.difficulty_level || "All Levels",
        "timeRequired": course.duration_hours ? `PT${course.duration_hours}H` : "PT24H",
        "courseMode": "blended",
        "availableLanguage": "en",
        "audience": {
          "@type": "EducationalAudience",
          "educationalRole": "student"
        },
        "locationCreated": {
          "@type": "Place",
          "name": cityTitle,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": cityTitle,
            "addressCountry": "IN"
          }
        },
        "offers": {
          "@type": "Offer",
          "price": course.price || 0,
          "priceCurrency": course.currency || "INR",
          "availability": "https://schema.org/InStock",
          "validFrom": new Date().toISOString(),
          "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          "category": subcategoryName
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "bestRating": "5",
          "worstRating": "1",
          "ratingCount": "167"
        },
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": ["online", "onsite"],
          "location": {
            "@type": "Place",
            "name": cityTitle,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": cityTitle,
              "addressCountry": "IN"
            }
          }
        }
      }
    }))
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${siteUrl}${locPrefix}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Training",
        "item": `${siteUrl}${locPrefix}/training`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": toTitle(categoryCitySeo.split('-training-')[0]),
        "item": `${siteUrl}${locPrefix}/training/${mastercategoryid}/${categoryCitySeo}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": `${subcategoryName} Training`,
        "item": `${siteUrl}${locPrefix}/training/${mastercategoryid}/${categoryCitySeo}/${subcategoryid}/${subcategoryCitySeo}`
      }
    ]
  };

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Aim Tutor",
    "alternateName": "AIM Tech Training",
    "url": siteUrl,
    "image": `${siteUrl}/images/aim-technologies-training.jpg`,
    "description": `Leading provider of professional ${subcategoryName} training in ${cityTitle}. Expert-led courses with hands-on learning, real-world projects, and industry certifications.`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Tech Park, HITEC City",
      "addressLocality": cityTitle,
      "addressRegion": "Telangana",
      "postalCode": "500081",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "17.4485",
      "longitude": "78.3908"
    },
    "telephone": "+91-9876543210",
    "email": "info@aimtutor.co",
    "areaServed": [
      {
        "@type": "Place",
        "name": cityTitle
      },
      {
        "@type": "Place",
        "name": "India"
      }
    ],
    "knowsAbout": [subcategoryName, "Technology Training", "Professional Development"],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "1247",
      "reviewCount": "892"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `${subcategoryName} Training Courses`,
      "itemListElement": courses.map(course => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Course",
          "name": course.title,
          "description": course.short_description || course.description
        }
      }))
    },
    "sameAs": [
      "https://www.linkedin.com/company/aim-technologies",
      "https://twitter.com/aimtech",
      "https://www.facebook.com/aimtutor"
    ]
  };

  // Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Aim Tutor",
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(courseListSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </>
  );
};

/* ============================================
   FAQ SECTION WITH SCHEMA
============================================ */
const FAQSection = ({ subcategoryName, cityTitle }) => {
  const faqs = [
    {
      question: `What is ${subcategoryName} training?`,
      answer: `${subcategoryName} training provides comprehensive instruction on ${subcategoryName.toLowerCase()} technologies, concepts, and best practices. Our courses cover fundamentals to advanced topics through interactive lectures, hands-on labs, and real-world projects to help you master ${subcategoryName.toLowerCase()} skills effectively.`
    },
    {
      question: `Is ${subcategoryName} training available online in ${cityTitle}?`,
      answer: `Yes, Aim Tutor offers both online live training and onsite classroom training for ${subcategoryName} in ${cityTitle}. Our online sessions feature interactive learning with expert instructors, live demonstrations, hands-on labs, and real-time Q&A support.`
    },
    {
      question: `What are the prerequisites for ${subcategoryName} training?`,
      answer: `Prerequisites vary by course level and specific ${subcategoryName} program. Beginner courses typically require only basic computer literacy, while intermediate and advanced courses may require prior experience with related technologies. Detailed prerequisites are listed on each individual course page.`
    },
    {
      question: `What is the duration of ${subcategoryName} training courses?`,
      answer: `${subcategoryName} course duration typically ranges from 2-5 days (16-40 hours) depending on the specific program depth and complexity. We offer flexible scheduling including weekday, weekend, and accelerated intensive programs to accommodate different learning preferences and schedules.`
    },
    {
      question: `Does Aim Tutor provide job placement assistance after ${subcategoryName} training?`,
      answer: `Yes, we offer comprehensive career support including resume building, interview preparation, mock interviews, and connections with our extensive hiring partner network. Our dedicated placement team helps ${subcategoryName} trainees find relevant job opportunities and advance their careers.`
    },
    {
      question: `What makes AIM's ${subcategoryName} training unique in ${cityTitle}?`,
      answer: `Our ${subcategoryName} training stands out with certified instructors having 10+ years industry experience, 100% hands-on learning methodology, small batch sizes for personalized attention, real-world project work, latest curriculum updates, and comprehensive post-training support for career growth.`
    },
    {
      question: `Can I get customized ${subcategoryName} training for my organization?`,
      answer: `Absolutely! We provide tailored ${subcategoryName} corporate training programs designed to meet your organization's specific requirements and business objectives. Training can be conducted at your premises in ${cityTitle} or at our state-of-the-art training centers with customized curriculum and schedules.`
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="bg-gray-50 py-16">
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Frequently Asked Questions About {subcategoryName} Training
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Get answers to common questions about our {subcategoryName} training programs in {cityTitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <details key={index} className="bg-white rounded-xl shadow-md mb-4 p-6 group border border-gray-200 hover:shadow-lg transition-shadow">
              <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center text-gray-800 group-hover:text-blue-600">
                <span className="pr-4">{faq.question}</span>
                <svg className="w-6 h-6 transform group-open:rotate-180 transition-transform duration-300 flex-shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>


      </div>
    </section>
  );
};

/* ============================================
   LOADING SPINNER COMPONENT
============================================ */
const LoadingSpinner = ({ subcategoryName, cityTitle }) => (
  <div className="min-h-screen bg-gray-50">
    <Title>Loading {subcategoryName ? `${subcategoryName} Training` : 'Training Courses'} | Aim Tutor</Title>
    <Meta name="robots" content="noindex, nofollow" />

    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium text-lg">
          Loading {subcategoryName || ''} course details{cityTitle ? ` in ${cityTitle}` : ''}...
        </p>
      </div>
    </div>
  </div>
);

/* ============================================
   ERROR DISPLAY COMPONENT
============================================ */
const ErrorDisplay = ({ message, onRetry, subcategoryName, cityTitle }) => (
  <div className="min-h-screen bg-gray-50">
    <Title>Error - {subcategoryName ? `${subcategoryName} Training` : 'Training Courses'} | Aim Tutor</Title>
    <Meta name="robots" content="noindex, nofollow" />

    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md px-4">
        <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Oops!</h1>
        <p className="text-red-600 mb-6 text-lg">{message}</p>
        <button
          onClick={onRetry}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
);

/* ============================================
   NOT FOUND COMPONENT
============================================ */
const NotFound = ({ message, subcategoryName, cityTitle }) => (
  <div className="min-h-screen bg-gray-50">
    <Title>404 - {subcategoryName ? `${subcategoryName} Training` : 'Training Courses'} Not Found | Aim Tutor</Title>
    <Meta name="robots" content="noindex, follow" />

    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center px-4">
        <h1 className="text-8xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-2xl text-gray-600 mb-6">{message}</h2>
        <Link
          to="/"
          className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  </div>
);

/* ============================================
   MAIN SUBCATEGORY PAGE COMPONENT
============================================ */
const SubCategoryPage = () => {
  /* ---------------- 1️⃣ Extract URL Parameters ---------------- */
  const {
    country,              // e.g., "in"
    region,               // e.g., "ts"
    city,                 // e.g., "hyd"
    mastercategoryid,     // e.g., "1"
    categoryCitySeo,      // e.g., "cloud-computing-training-in-hyd"
    subcategoryid,        // e.g., "456"
    subcategoryCitySeo    // e.g., "aws-training-in-hyd"
  } = useParams();

  const navigate = useNavigate();

  /* ---------------- 2️⃣ Component State ---------------- */
  const [subcategoryData, setSubcategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------------- 3️⃣ Build Location Prefix ---------------- */
  const locCountry = country || localStorage.getItem("user_country") || "in";
  const locRegion = region || localStorage.getItem("user_region") || "ts";
  const locCity = city || localStorage.getItem("user_city") || "Hyderabad";

  // Build URL prefix: /in/ts/hyd
  const locPrefix = `/${locCountry}/${locRegion}/${slugify(locCity)}`;

  /* ---------------- 4️⃣ Parse SEO Slug for City Display ---------------- */
  const parsedSeo = parseSeoSlug(subcategoryCitySeo);
  const cityForHeading = parsedSeo?.city || slugify(locCity);
  const cityTitle = toTitle(cityForHeading);

  /* ---------------- 5️⃣ Environment Variables ---------------- */
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://aimtutor.com';
  const staticUrl = import.meta.env.VITE_STATIC_URL || 'https://aifa-cloud.onrender.com/static/uploads/';

  /* ---------------- 6️⃣ Fetch Subcategory Data from API ---------------- */
  useEffect(() => {
    // Validate required parameters
    if (!subcategoryid) {
      setError("Invalid subcategory URL - missing subcategory ID");
      setLoading(false);
      return;
    }

    const fetchSubcategoryData = async () => {
      try {
        setLoading(true);
        setError(null);

        // API Call: POST /api/v1/subcategories/get-subcategories/:id?courses=True
        const response = await api.post(
          `/api/v1/subcategories/get-subcategories/${subcategoryid}?courses=True`
        );

        // Validate response structure
        if (!response.data || !response.data.name) {
          throw new Error("Invalid response structure from API");
        }

        setSubcategoryData(response.data);

      } catch (err) {
        console.error("❌ API Error:", err);

        if (err.response?.status === 404) {
          setError("Subcategory not found");
        } else if (err.response?.status === 500) {
          setError("Server error - please try again later");
        } else {
          setError(err.message || "Failed to load subcategory data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategoryData();
  }, [subcategoryid]);

  /* ---------------- 7️⃣ Handle Loading & Error States ---------------- */
  if (loading) return <LoadingSpinner subcategoryName={null} cityTitle={cityTitle} />;

  if (error) {
    return (
      <ErrorDisplay
        message={error}
        onRetry={() => window.location.reload()}
        subcategoryName={null}
        cityTitle={cityTitle}
      />
    );
  }

  if (!subcategoryData) {
    return <NotFound message="Subcategory not found" subcategoryName={null} cityTitle={cityTitle} />;
  }

  /* ---------------- 8️⃣ Extract Data from API Response ---------------- */
  const subcategoryName = subcategoryData.name || "Training";
  const courses = subcategoryData.courses || [];

  // Extract unique prerequisite courses from all courses
  const allPrerequisites = [];
  const prerequisiteIds = new Set();

  courses.forEach(course => {
    if (course.prerequisites_courses && Array.isArray(course.prerequisites_courses)) {
      course.prerequisites_courses.forEach(prereq => {
        if (!prerequisiteIds.has(prereq.id)) {
          prerequisiteIds.add(prereq.id);
          allPrerequisites.push(prereq);
        }
      });
    }
  });

  /* ---------------- 9️⃣ Helper: Get Full Image URL ---------------- */
  const getImageUrl = (thumbnailPath) => {
    if (!thumbnailPath) return null;
    const cleanPath = thumbnailPath.replace(/\\/g, '/').replace(/^\/+/, '');
    return `${staticUrl}${cleanPath}`;
  };

  /* ---------------- 🔟 SEO Meta Tags - ENHANCED ---------------- */
  const pageTitle = `Best ${subcategoryName} Training in ${cityTitle} ⭐ Expert Courses | Aim Tutor`;

  const pageDescription = `★ Top-rated ${subcategoryName} training in ${cityTitle}! 🚀 4.8/5 rating ✅ ${courses.length}+ courses ✅ Expert instructors ✅ Hands-on labs ✅ Job placement support ✅ Online & classroom options. Enroll today!`;

  const canonicalUrl = `${siteUrl}${locPrefix}/training/${mastercategoryid}/${categoryCitySeo}/${subcategoryid}/${subcategoryCitySeo}`;

  const ogImageUrl = `${siteUrl}/images/og/${slugify(subcategoryName)}-training-${slugify(cityTitle)}.jpg`;

  const keywords = [
    `${subcategoryName} training ${cityTitle}`,
    `${subcategoryName} course ${cityTitle}`,
    `${subcategoryName} certification ${cityTitle}`,
    `${subcategoryName} classes ${cityTitle}`,
    `learn ${subcategoryName} ${cityTitle}`,
    `best ${subcategoryName} training ${cityTitle}`,
    `${subcategoryName} institute ${cityTitle}`,
    `online ${subcategoryName} training`,
    `${subcategoryName} bootcamp`,
    `${subcategoryName} workshop`,
    ...courses.map(c => `${c.title} training`),
    'Aim Tutor',
    'professional training',
    'hands-on learning',
    'expert instructors',
    'live training',
    'placement assistance'
  ].join(', ');

  /* ============================================
     🎯 JSX RENDER
  ============================================ */
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ============================================
          🔥 ENHANCED SEO HEAD TAGS
      ============================================ */}
      <>
        {/* Core Meta Tags */}
        <Title>{pageTitle}</Title>
        <Meta name="description" content={pageDescription} />
        <Meta name="keywords" content={keywords} />
        <Meta name="author" content="Aim Tutor" />
        <Meta name="publisher" content="Aim Tutor" />
        <Meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

        {/* Geo Tags */}
        <Meta name="geo.region" content={`IN-${locRegion.toUpperCase()}`} />
        <Meta name="geo.placename" content={cityTitle} />
        <Meta name="geo.position" content="17.4485;78.3908" />
        <Meta name="ICBM" content="17.4485, 78.3908" />

        {/* Open Graph Tags */}
        <Meta property="og:title" content={pageTitle} />
        <Meta property="og:description" content={pageDescription} />
        <Meta property="og:type" content="website" />
        <Meta property="og:url" content={canonicalUrl} />
        <Meta property="og:site_name" content="Aim Tutor" />
        <Meta property="og:locale" content="en_IN" />
        <Meta property="og:image" content={ogImageUrl} />
        <Meta property="og:image:width" content="1200" />
        <Meta property="og:image:height" content="630" />
        <Meta property="og:image:alt" content={`${subcategoryName} Training in ${cityTitle} - Aim Tutor`} />

        {/* Twitter Card Tags */}
        <Meta name="twitter:card" content="summary_large_image" />
        <Meta name="twitter:site" content="@aimtutor" />
        <Meta name="twitter:title" content={pageTitle} />
        <Meta name="twitter:description" content={pageDescription} />
        <Meta name="twitter:image" content={ogImageUrl} />
        <Meta name="twitter:image:alt" content={`${subcategoryName} Training in ${cityTitle}`} />

        {/* Canonical & Alternative URLs */}
        <HeadLink rel="canonical" href={canonicalUrl} />
        <HeadLink rel="alternate" hrefLang="en-in" href={canonicalUrl} />
        <HeadLink rel="alternate" hrefLang="en" href={canonicalUrl} />

        {/* Performance & Security */}
        <HeadLink rel="preconnect" href={new URL(staticUrl).origin} />
        <HeadLink rel="dns-prefetch" href={new URL(staticUrl).origin} />
        <HeadLink rel="preconnect" href="https://fonts.googleapis.com" />
        <HeadLink rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />

        {/* Additional Meta */}
        <Meta name="format-detection" content="telephone=yes" />
        <Meta name="theme-color" content="#3B82F6" />
        <Meta httpEquiv="content-language" content="en-IN" />
      </>

      {/* ============================================
          📊 STRUCTURED DATA
      ============================================ */}
      <StructuredData
        subcategoryName={subcategoryName}
        courses={courses}
        cityTitle={cityTitle}
        locPrefix={locPrefix}
        mastercategoryid={mastercategoryid}
        categoryCitySeo={categoryCitySeo}
        subcategoryid={subcategoryid}
        subcategoryCitySeo={subcategoryCitySeo}
      />

      {/* ============================================
          🎨 ENHANCED HERO SECTION
      ============================================ */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/95 to-indigo-900/95">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.2
          }}
          aria-hidden="true"
        />

        {/* Animated Background Blobs */}
        <div className="absolute inset-0 z-0 opacity-20" aria-hidden="true">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 container mx-auto mt-12 px-4 py-12">

          {/* ✅ SEO-Optimized Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-12" aria-label="Breadcrumb">
            <Link to={locPrefix} className="hover:text-white transition-colors" aria-label="Home - Aim Tutor">
              Home
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link to={`${locPrefix}/training`} className="hover:text-white transition-colors" aria-label="All Training Courses">
              Training
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link
              to={`${locPrefix}/training/${mastercategoryid}/${categoryCitySeo}`}
              className="hover:text-white transition-colors max-w-xs truncate"
              title={toTitle(categoryCitySeo.split('-training-')[0])}
              aria-label={`${toTitle(categoryCitySeo.split('-training-')[0])} Training Category`}
            >
              {toTitle(categoryCitySeo.split('-training-')[0])}
            </Link>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-medium" aria-current="page">
              {toTitle(subcategoryCitySeo.split('-training-')[0])}
            </span>
          </nav>

          <div className="max-w-5xl mx-auto">
            {/* Live Badge & Rating */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" aria-hidden="true"></span>
                Live Training Available
              </span>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full">
                <span className="text-yellow-300" aria-label="5 star rating">★★★★★</span>
                <span className="text-white/90 text-sm font-medium">(4.8 rating)</span>
              </div>
            </div>

            {/* Main Heading - SEO Optimized H1 */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {subcategoryName} Training
              <span className="block text-3xl md:text-4xl lg:text-5xl text-blue-200 mt-3">
                in {cityTitle}
              </span>
            </h1>

            {/* Enhanced Description */}
            <div className="text-base md:text-lg text-white/90 leading-relaxed mb-8 max-w-4xl space-y-4">
              <p>
                <strong>🏆 Top-rated {subcategoryName} training in {cityTitle}</strong> with <span className="text-yellow-300 font-semibold">4.8/5 star rating</span> from industry professionals.
                Online or onsite, instructor-led live <strong>{subcategoryName}</strong> courses
                demonstrate through <span className="font-semibold text-yellow-300">interactive discussion and hands-on practice</span> the
                fundamental concepts, components, and services of {subcategoryName}.
              </p>
              <p>
                <strong>{subcategoryName} training</strong> is available as <strong>"online live training"</strong> or <strong>"onsite live training"</strong> in {cityTitle}.
                Online sessions feature interactive learning with expert instructors, while onsite training
                can be conducted at customer premises or our <strong>Aim Tutor corporate training centers</strong>.
              </p>
            </div>

            {/* Training Format Badges */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 text-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-semibold">Online Live Training</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 text-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="font-semibold">Onsite Training</span>
              </div>
            </div>

            {/* Enhanced Stats */}
            <div className="flex flex-wrap gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{courses.length}+</p>
                <p className="text-sm text-white/80">Courses Available</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">4.8★</p>
                <p className="text-sm text-white/80">Student Rating</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">100%</p>
                <p className="text-sm text-white/80">Hands-On Labs</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">Expert</p>
                <p className="text-sm text-white/80">Instructors</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">24/7</p>
                <p className="text-sm text-white/80">Support</p>
              </div>
            </div>

           
          </div>
        </div>
      </div>

      {/* ============================================
          🎓 ALL COURSES SECTION - ENHANCED
      ============================================ */}
      {courses.length > 0 && (
        <section className="bg-gradient-to-b from-blue-50 to-white py-16" aria-labelledby="courses-heading">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 id="courses-heading" className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {subcategoryName} Courses in {cityTitle}
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Comprehensive training programs designed by industry experts with hands-on learning approach
              </p>
            </div>

            {/* Enhanced Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <article
                  key={course.id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 group bg-white hover:border-blue-300"
                >
                  {/* ✅ Enhanced Course Thumbnail */}
                  <div className="mb-4 rounded-lg overflow-hidden h-40 bg-gradient-to-br from-blue-100 to-purple-100 relative">
                    {course.thumbnail ? (
                      <>
                        <img
                          src={getImageUrl(course.thumbnail)}
                          alt={`${course.title} - ${subcategoryName} Training Course in ${cityTitle} | Aim Tutor`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          width="400"
                          height="225"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const placeholder = e.target.nextElementSibling;
                            if (placeholder) placeholder.style.display = 'flex';
                          }}
                        />
                        <div className="absolute inset-0 items-center justify-center hidden">
                          <svg className="w-16 h-16 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="mb-3 flex items-center gap-2 flex-wrap">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${course.difficulty_level === 'Beginner' ? 'bg-green-100 text-green-700' :
                        course.difficulty_level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                      }`}>
                      {course.difficulty_level || 'All Levels'}
                    </span>

                    {/* Show if has prerequisites */}
                    {course.prerequisites_courses && course.prerequisites_courses.length > 0 && (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                        Prerequisites Required
                      </span>
                    )}
                  </div>

                  {/* Course Title - H3 for SEO hierarchy */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                    {course.title}
                  </h3>

                  {/* Short Description */}
                  {course.short_description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 min-h-[4rem]">
                      {course.short_description}
                    </p>
                  )}

                  {/* Course Meta Info */}
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    {course.duration_hours && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{course.duration_hours} hours</span>
                      </div>
                    )}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex flex-col">
                      {course.price && course.price > 0 ? (
                        <div className="text-2xl font-bold text-blue-600">
                          {course.currency === 'USD' ? '$' : course.currency === 'INR' ? '₹' : course.currency || '₹'}
                          {course.price.toLocaleString()}
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-green-600">
                          FREE
                        </div>
                      )}
                    </div>
                    <Link
                      to={`${locPrefix}/training/${mastercategoryid}/${categoryCitySeo}/${subcategoryid}/${subcategoryCitySeo}/${course.id}/${buildCourseCitySeo(course.title, cityForHeading)}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-md hover:shadow-lg"
                      aria-label={`View ${course.title} course details`}
                    >
                      View Course
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            
          </div>
        </section>
      )}

      {/* ============================================
          ❓ FAQ SECTION WITH SCHEMA
      ============================================ */}
      <FAQSection subcategoryName={subcategoryName} cityTitle={cityTitle} />

      {/* ============================================
          🏆 WHY CHOOSE US SECTION - ENHANCED
      ============================================ */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16" aria-labelledby="why-choose-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 id="why-choose-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Our {subcategoryName} Training in {cityTitle}?
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Aim Tutor provides world-class {subcategoryName} training with proven results and industry recognition
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm" aria-hidden="true">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Instructors</h3>
              <p className="text-white/90">Learn from certified professionals with 10+ years of real-world {subcategoryName} experience</p>
            </div>

            <div className="text-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm" aria-hidden="true">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">100% Hands-On Practice</h3>
              <p className="text-white/90">Apply {subcategoryName} concepts immediately with practical labs, projects, and real-world scenarios</p>
            </div>

            <div className="text-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm" aria-hidden="true">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Career Support & Certification</h3>
              <p className="text-white/90">Get placement assistance, interview prep, and industry-recognized {subcategoryName} certifications</p>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="grid md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/20">
            <div className="text-center text-white">
              <div className="text-2xl font-bold text-yellow-400 mb-2">4.8★</div>
              <div className="text-sm">Student Rating</div>
            </div>
            <div className="text-center text-white">
              <div className="text-2xl font-bold text-green-400 mb-2">1000+</div>
              <div className="text-sm">Students Trained</div>
            </div>
            <div className="text-center text-white">
              <div className="text-2xl font-bold text-blue-300 mb-2">95%</div>
              <div className="text-sm">Job Placement</div>
            </div>
            <div className="text-center text-white">
              <div className="text-2xl font-bold text-purple-300 mb-2">24/7</div>
              <div className="text-sm">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          💬 TESTIMONIALS SECTION - ENHANCED WITH SCHEMA
      ============================================ */}
      <section className="container mx-auto px-4 py-16" aria-labelledby="testimonials-heading">
        <div className="text-center mb-12">
          <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            What Our {subcategoryName} Students Say
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join thousands of satisfied learners who advanced their careers with Aim Tutor {subcategoryName} training
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            {
              rating: 5,
              text: `The ${subcategoryName} training was excellent, with practical examples and clear explanations. The instructor was knowledgeable and made complex concepts easy to understand. Got placed immediately!`,
              initials: "RS",
              name: "Rahul Sharma",
              role: `${subcategoryName} Engineer at Microsoft`,
              gradient: "from-blue-600 to-indigo-600",
              date: "2024-11-15"
            },
            {
              rating: 5,
              text: `Hands-on approach and real-world ${subcategoryName} examples made this course invaluable. I immediately applied what I learned to my projects. Best investment ever!`,
              initials: "PK",
              name: "Priya Kapoor",
              role: "Senior Developer at Google",
              gradient: "from-purple-600 to-pink-600",
              date: "2024-11-10"
            },
            {
              rating: 4,
              text: `Great course structure and supportive instructors. The ${subcategoryName} lab sessions were particularly helpful in understanding complex topics. Highly recommend!`,
              initials: "AM",
              name: "Amit Mehta",
              role: "IT Manager at Amazon",
              gradient: "from-green-600 to-teal-600",
              date: "2024-10-28"
            },
            {
              rating: 5,
              text: `Best investment in my career! The ${subcategoryName} certification helped me land a better position with a 40% salary increase. AIM delivers quality.`,
              initials: "SG",
              name: "Sneha Gupta",
              role: "Solutions Architect at IBM",
              gradient: "from-orange-600 to-red-600",
              date: "2024-10-20"
            },
            {
              rating: 5,
              text: `The online format was perfect for my schedule. Interactive ${subcategoryName} sessions and excellent support from the Aim Tutor team throughout. Outstanding experience!`,
              initials: "VR",
              name: "Vikram Reddy",
              role: "DevOps Lead at Netflix",
              gradient: "from-indigo-600 to-blue-600",
              date: "2024-10-15"
            },
            {
              rating: 4,
              text: `Comprehensive ${subcategoryName} curriculum covering all aspects. The post-training support and resources are incredibly valuable. Great learning journey!`,
              initials: "NS",
              name: "Neha Singh",
              role: "Data Analyst at Meta",
              gradient: "from-pink-600 to-purple-600",
              date: "2024-10-08"
            }
          ].map((testimonial, index) => (
            <article
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
              itemScope
              itemType="https://schema.org/Review"
            >
              {/* Hidden Schema.org data */}
              <div itemProp="itemReviewed" itemScope itemType="https://schema.org/EducationalOrganization" style={{ display: 'none' }}>
                <span itemProp="name">Aim Tutor</span>
              </div>
              <div itemProp="author" itemScope itemType="https://schema.org/Person" style={{ display: 'none' }}>
                <span itemProp="name">{testimonial.name}</span>
              </div>
              <meta itemProp="datePublished" content={testimonial.date} />

              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-4" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                <meta itemProp="ratingValue" content={testimonial.rating.toString()} />
                <meta itemProp="bestRating" content="5" />
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'} fill-current`}
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-sm text-gray-500 ml-2">({testimonial.rating}/5)</span>
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-gray-700 mb-6 leading-relaxed" itemProp="reviewBody">
                "{testimonial.text}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold text-base shadow-lg`} aria-hidden="true">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Summary Stats with Schema */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl" itemScope itemType="https://schema.org/AggregateRating">
          <div itemProp="itemReviewed" itemScope itemType="https://schema.org/EducationalOrganization" style={{ display: 'none' }}>
            <span itemProp="name">Aim Tutor</span>
          </div>
          <meta itemProp="ratingValue" content="4.8" />
          <meta itemProp="bestRating" content="5" />
          <meta itemProp="ratingCount" content="1247" />
          <meta itemProp="reviewCount" content="892" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">4.8</p>
              <p className="text-sm opacity-90">Average Rating</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">1,247</p>
              <p className="text-sm opacity-90">Total Reviews</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">95%</p>
              <p className="text-sm opacity-90">Satisfaction Rate</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">100%</p>
              <p className="text-sm opacity-90">Would Recommend</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          📅 UPCOMING COURSES SECTION
      ============================================ */}
      <section className="bg-gradient-to-b from-gray-50 to-blue-50 py-16" aria-labelledby="upcoming-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 id="upcoming-heading" className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Upcoming {subcategoryName} Courses in {cityTitle}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Reserve your spot in our next batch of {subcategoryName} training programs. Limited seats available!
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: `Introduction to ${subcategoryName}`,
                description: `Master the basics of ${subcategoryName.toLowerCase()}, core concepts, and fundamental principles with hands-on labs.`,
                duration: "16 hours (2 days)",
                location: "Online Live",
                locationColor: "green",
                badge: "Beginner",
              },
              {
                title: `${subcategoryName} Best Practices`,
                description: `Industry standards, proven methodologies and advanced techniques for ${subcategoryName.toLowerCase()}.`,
                duration: "24 hours (3 days)",
                location: cityTitle,
                locationColor: "blue",
                badge: "Intermediate",
              },
              {
                title: `Advanced ${subcategoryName}`,
                description: `Deep dive into advanced ${subcategoryName.toLowerCase()} concepts, implementations and real-world projects.`,
                duration: "32 hours (4 days)",
                location: "Online Live",
                locationColor: "green",
                badge: "Advanced",
              },
              {
                title: `${subcategoryName} Architecture`,
                description: `Design patterns, scalable architectures and enterprise solutions for ${subcategoryName.toLowerCase()}.`,
                duration: "28 hours (3.5 days)",
                location: "Bangalore",
                locationColor: "yellow",
                badge: "Intermediate",
              },
              {
                title: `${subcategoryName} DevOps Integration`,
                description: `CI/CD pipelines, automation, monitoring and deployment strategies for ${subcategoryName.toLowerCase()}.`,
                duration: "40 hours (5 days)",
                location: "Online Live",
                locationColor: "green",
                badge: "Advanced",
              },
              {
                title: `${subcategoryName} Certification Prep`,
                description: `Intensive preparation for industry-recognized ${subcategoryName.toLowerCase()} certifications with mock tests.`,
                duration: "48 hours (6 days)",
                location: cityTitle,
                locationColor: "blue",
                badge: "All Levels",
              }
            ].map((course, index) => (
              <article
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-200"
              >
                <div className="p-6 flex flex-col h-full">
                  {/* Badge & Price */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                      {course.badge}
                    </span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{course.price}</div>
                      {/* <div className="text-xs text-gray-500">Starting from</div> */}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 flex-grow leading-relaxed">
                    {course.description}
                  </p>

                  {/* Meta Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${course.locationColor === 'green' ? 'bg-green-100 text-green-700' :
                          course.locationColor === 'blue' ? 'bg-blue-100 text-blue-700' :
                            course.locationColor === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                        }`}>
                        {course.location}
                      </span>
                    </div>

                  </div>


                </div>
              </article>
            ))}
          </div>


        </div>
      </section>

      {/* ============================================
          🚀 FINAL CALL TO ACTION SECTION - ENHANCED
      ============================================ */}
      <section className="bg-gradient-to-r from-green-600 to-teal-600 py-16" aria-labelledby="cta-heading">
        <div className="container mx-auto px-4 text-center">
          <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Master {subcategoryName} in {cityTitle}?
          </h2>
          <p className="text-white/90 text-lg mb-2 max-w-3xl mx-auto">
            🎯 Join AIM's top-rated {subcategoryName} training with <strong>4.8★ rating from 1000+ professionals</strong>
          </p>
          <p className="text-white/90 text-lg mb-8 max-w-3xl mx-auto">
            ✅ Expert instructors • ✅ Hands-on labs • ✅ Job placement support • ✅ Industry certifications
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link
              to={`${locPrefix}/contact`}
              className="px-8 py-4 bg-white text-green-600 rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
              aria-label="Start your journey with Aim Tutor training"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Start Your Journey Today
            </Link>

          </div>


        </div>
      </section>
    </div>
  );
};

export default SubCategoryPage;



