
// src/pages/CategoryPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Title, Meta, Link as HeadLink } from "react-head";
import {
  buildCategoryCitySeo,
  buildSubcategoryCitySeo,
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

// Truncate text with ellipsis
const truncate = (text, maxLength) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + "...";
};

/* ============================================
   STRUCTURED DATA COMPONENTS
============================================ */

const StructuredData = ({ categoryName, subcategories, allCourses, cityTitle, locPrefix, mastercategoryid, categoryCitySeo }) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://aimtutor.co';

  // Course Schema
  const courseListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${categoryName} Training Courses in ${cityTitle}`,
    "description": `Professional ${categoryName} training programs in ${cityTitle} with hands-on learning`,
    "numberOfItems": allCourses.length,
    "url": `${siteUrl}${locPrefix}/training/${mastercategoryid}/${categoryCitySeo}`,
    "itemListElement": allCourses.slice(0, 20).map((course, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Course",
        "name": course.title,
        "description": course.short_description || course.description || `Learn ${course.title} with hands-on training`,
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
          "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "bestRating": "5",
          "worstRating": "1",
          "ratingCount": "156"
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
        "name": `${categoryName} Training`,
        "item": `${siteUrl}${locPrefix}/training/${mastercategoryid}/${categoryCitySeo}`
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
    "description": `Leading provider of professional ${categoryName} training in ${cityTitle}. Expert-led courses with hands-on learning and industry certifications.`,
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
    "knowsAbout": [categoryName, "Technology Training", "Professional Development"],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "1247",
      "reviewCount": "892"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Rahul Sharma"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": `The ${categoryName} training was excellent, with practical examples and clear explanations. The instructor was knowledgeable and made complex concepts easy to understand.`,
        "datePublished": "2024-11-15"
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Priya Kapoor"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": `Hands-on approach and real-world ${categoryName} examples made this course invaluable. I immediately applied what I learned to my projects.`,
        "datePublished": "2024-11-10"
      }
    ],
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
const FAQSection = ({ categoryName, cityTitle }) => {
  const faqs = [
    {
      question: `What is ${categoryName} training?`,
      answer: `${categoryName} training provides comprehensive instruction on ${categoryName.toLowerCase()} technologies and best practices. Our courses cover fundamentals to advanced concepts through hands-on labs, real-world projects, and expert-led instruction to help you master ${categoryName.toLowerCase()} skills.`
    },
    {
      question: `Is ${categoryName} training available online in ${cityTitle}?`,
      answer: `Yes, Aim Tutor offers both online live training and onsite classroom training for ${categoryName} in ${cityTitle}. Our online sessions are interactive with live instructors, hands-on labs, and real-time Q&A support.`
    },
    {
      question: `What are the prerequisites for ${categoryName} training?`,
      answer: `Prerequisites vary by course level. Beginner courses require only basic computer literacy. Intermediate and advanced courses may require prior experience with related technologies. Detailed prerequisites are listed on each course page.`
    },
    {
      question: `What is the duration of ${categoryName} training courses?`,
      answer: `Course duration varies from 2-5 days (16-40 hours) depending on the specific program and depth of coverage. We offer flexible scheduling including weekend batches and accelerated programs to fit your schedule.`
    },
    {
      question: `Does Aim Tutor provide placement assistance after ${categoryName} training?`,
      answer: `Yes, we offer comprehensive placement support including resume building, interview preparation, and connections with our hiring partner network. Our career services help ${categoryName} trainees find relevant job opportunities.`
    },
    {
      question: `What makes Aim Tutor' ${categoryName} training unique?`,
      answer: `Our ${categoryName} training stands out with expert instructors having 10+ years industry experience, 100% hands-on learning approach, small batch sizes for personalized attention, real-world projects, and post-training support for career growth.`
    },
    {
      question: `Can I get customized ${categoryName} training for my organization?`,
      answer: `Absolutely! We provide tailored ${categoryName} corporate training programs designed to meet your organization's specific needs. We can conduct training at your premises or our training centers in ${cityTitle}.`
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
            Frequently Asked Questions About {categoryName} Training
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Get answers to common questions about our {categoryName} training programs in {cityTitle}
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
const LoadingSpinner = ({ categoryName, cityTitle }) => (
  <div className="min-h-screen bg-gray-50">
    {/* SEO-friendly loading state */}
    <Title>Loading {categoryName ? `${categoryName} Training` : 'Training Programs'} | Aim Tutor</Title>
    <Meta name="robots" content="noindex, nofollow" />

    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium text-lg">
          Loading {categoryName || ''} training programs{cityTitle ? ` in ${cityTitle}` : ''}...
        </p>
      </div>
    </div>
  </div>
);

/* ============================================
   ERROR DISPLAY COMPONENT
============================================ */
const ErrorDisplay = ({ message, onRetry, categoryName, cityTitle }) => (
  <div className="min-h-screen bg-gray-50">
    <Title>Error - {categoryName ? `${categoryName} Training` : 'Training'} | Aim Tutor</Title>
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
const NotFound = ({ message, categoryName, cityTitle }) => (
  <div className="min-h-screen bg-gray-50">
    <Title>404 - {categoryName ? `${categoryName} Training` : 'Training'} Not Found | Aim Tutor</Title>
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
   MAIN CATEGORY PAGE COMPONENT
============================================ */
const CategoryPage = () => {
  /* ---------------- 1️⃣ Extract URL Parameters ---------------- */
  const {
    country,           // e.g., "in"
    region,            // e.g., "ts" 
    city,              // e.g., "hyd"
    mastercategoryid,  // e.g., "1"
    categoryCitySeo    // e.g., "cloud-computing-training-in-hyd"
  } = useParams();

  const navigate = useNavigate();

  /* ---------------- 2️⃣ Component State ---------------- */
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------------- 3️⃣ Build Location Prefix ---------------- */
  const locCountry = country || localStorage.getItem("user_country") || "in";
  const locRegion = region || localStorage.getItem("user_region") || "ts";
  const locCity = city || localStorage.getItem("user_city") || "Hyderabad";

  // Build URL prefix: /in/ts/hyd
  const locPrefix = `/${locCountry}/${locRegion}/${slugify(locCity)}`;

  /* ---------------- 4️⃣ Parse SEO Slug for City Display ---------------- */
  const parsedSeo = parseSeoSlug(categoryCitySeo);
  const cityForHeading = parsedSeo?.city || slugify(locCity);
  const cityTitle = toTitle(cityForHeading);

  /* ---------------- 5️⃣ Environment Variables ---------------- */
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://aimtutor.co';
  const staticUrl = import.meta.env.VITE_STATIC_URL || 'https://aifa-cloud.onrender.com/static/uploads/';

  /* ---------------- 6️⃣ Fetch Category Data from API ---------------- */
  useEffect(() => {
    // Validate required parameters
    if (!mastercategoryid) {
      setError("Invalid category URL - missing category ID");
      setLoading(false);
      return;
    }

    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        setError(null);

        // API Call: POST /api/v1/mastercategories/get-mastercategories/:id?courses=True
        const response = await api.post(
          `/api/v1/mastercategories/get-mastercategories/${mastercategoryid}?courses=True`
        );

        // Validate response structure
        if (!response.data || !response.data.name) {
          throw new Error("Invalid response structure from API");
        }

        setCategoryData(response.data);

      } catch (err) {
        console.error("❌ API Error:", err);

        if (err.response?.status === 404) {
          setError("Training category not found");
        } else if (err.response?.status === 500) {
          setError("Server error - please try again later");
        } else {
          setError(err.message || "Failed to load training data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [mastercategoryid]);

  /* ---------------- 7️⃣ Handle Loading & Error States ---------------- */
  if (loading) return <LoadingSpinner categoryName={null} cityTitle={cityTitle} />;

  if (error) {
    return (
      <ErrorDisplay
        message={error}
        onRetry={() => window.location.reload()}
        categoryName={null}
        cityTitle={cityTitle}
      />
    );
  }

  if (!categoryData) {
    return <NotFound message="Training category not found" categoryName={null} cityTitle={cityTitle} />;
  }

  /* ---------------- 8️⃣ Extract Data from API Response ---------------- */
  const categoryName = categoryData.name || "Training";
  const subcategories = categoryData.subcategories || [];

  // ✅ Flatten all courses from all subcategories
  const allCourses = subcategories.flatMap((subcat) =>
    (subcat.courses || []).map(course => ({
      ...course,
      subcategoryId: subcat.id,
      subcategoryName: subcat.name
    }))
  );

  const totalCourses = allCourses.length;

  /* ---------------- 9️⃣ Helper: Get Full Image URL ---------------- */
  const getImageUrl = (thumbnailPath) => {
    if (!thumbnailPath) return null;
    // Clean up backslashes and forward slashes
    const cleanPath = thumbnailPath.replace(/\\/g, '/').replace(/^\/+/, '');
    // Combine base URL with path
    return `${staticUrl}${cleanPath}`;
  };

  /* ---------------- 🔟 SEO Meta Tags - ENHANCED ---------------- */
  const pageTitle = `Best ${categoryName} Training in ${cityTitle} ⭐ Online & Classroom Courses | Aim Tutor`;

  const pageDescription = `★ Top-rated ${categoryName} training in ${cityTitle}! 🚀 4.8/5 rating ✅ ${totalCourses}+ courses ✅ Expert instructors ✅ Hands-on labs ✅ Job assistance. ${subcategories.slice(0, 3).map(s => s.name).join(', ')} & more. Enroll today!`;

  const canonicalUrl = `${siteUrl}${locPrefix}/training/${mastercategoryid}/${categoryCitySeo}`;

  const ogImageUrl = `${siteUrl}/images/og/${slugify(categoryName)}-training-${slugify(cityTitle)}.jpg`;

  const keywords = [
    `${categoryName} training ${cityTitle}`,
    `${categoryName} course ${cityTitle}`,
    `${categoryName} certification ${cityTitle}`,
    `${categoryName} classes ${cityTitle}`,
    `learn ${categoryName} ${cityTitle}`,
    `best ${categoryName} training ${cityTitle}`,
    `${categoryName} institute ${cityTitle}`,
    `online ${categoryName} training`,
    `${categoryName} bootcamp`,
    ...subcategories.map(s => `${s.name} training ${cityTitle}`),
    ...subcategories.map(s => `${s.name} course`),
    'Aim Tutor',
    'professional training',
    'hands-on learning',
    'expert instructors'
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
        <Meta property="og:image:alt" content={`${categoryName} Training in ${cityTitle} - Aim Tutor`} />

        {/* Twitter Card Tags */}
        <Meta name="twitter:card" content="summary_large_image" />
        <Meta name="twitter:site" content="@aimtutor" />
        <Meta name="twitter:title" content={pageTitle} />
        <Meta name="twitter:description" content={pageDescription} />
        <Meta name="twitter:image" content={ogImageUrl} />
        <Meta name="twitter:image:alt" content={`${categoryName} Training in ${cityTitle}`} />

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
        categoryName={categoryName}
        subcategories={subcategories}
        allCourses={allCourses}
        cityTitle={cityTitle}
        locPrefix={locPrefix}
        mastercategoryid={mastercategoryid}
        categoryCitySeo={categoryCitySeo}
      />

      {/* ============================================
          🎨 HERO BANNER SECTION - ENHANCED
      ============================================ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative container mx-auto my-10 px-4 py-16 md:py-20">
          {/* ✅ SEO-Optimized Breadcrumb with Schema */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8" aria-label="Breadcrumb">
            <Link
              to={locPrefix}
              className="hover:text-green-600 transition-colors font-medium"
              aria-label={`Home - Aim Tutor Training`}
            >
              Home
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link
              to={`${locPrefix}/training`}
              className="hover:text-green-600 transition-colors font-medium"
              aria-label="All Training Courses"
            >
              Training
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-semibold" aria-current="page">{categoryName}</span>
          </nav>

          <div className="text-center max-w-5xl mx-auto">
            {/* Live Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-md mb-6">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" aria-hidden="true"></span>
              <span className="text-sm font-semibold text-gray-700">Live Training Available</span>
            </div>

            {/* Main Heading - SEO Optimized with proper H1 */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              <span className="block">{categoryName} Training</span>
              <span className="block text-3xl md:text-4xl lg:text-5xl text-green-600 mt-3">
                in {cityTitle}
              </span>
            </h1>

            {/* Enhanced Description */}
            <div className="text-base md:text-lg text-gray-700 leading-relaxed mb-8 max-w-4xl mx-auto space-y-4">
              <p>
                <strong>🏆 Top-rated {categoryName} training in {cityTitle}</strong> with <span className="text-green-700 font-semibold">4.8/5 star rating</span> from 1000+ students.
                Online or onsite, instructor-led live <strong className="text-green-700">{categoryName}</strong> courses
                demonstrate through <span className="font-semibold text-green-700">hands-on practice</span> the
                fundamentals and advanced concepts of {categoryName.toLowerCase()}.
              </p>
              <p>
                <strong>{categoryName} training</strong> is available as <strong>"online live training"</strong> or <strong>"onsite classroom training"</strong> in {cityTitle}.
                Online sessions feature interactive learning with live instructors, while onsite training
                can be conducted at customer premises or our <strong>Aim Tutor corporate training centers</strong>.
              </p>
              <p className="text-lg font-semibold text-green-700">
                🎯 Aim Tutor — Your Trusted Local Training Provider
              </p>
            </div>

            {/* Enhanced Stats Bar */}
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{subcategories.length}+</p>
                <p className="text-sm text-gray-600">Specializations</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{totalCourses}+</p>
                <p className="text-sm text-gray-600">Courses</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">4.8★</p>
                <p className="text-sm text-gray-600">Rating</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">1000+</p>
                <p className="text-sm text-gray-600">Students</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">100%</p>
                <p className="text-sm text-gray-600">Hands-On</p>
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* ============================================
          📚 SUBCATEGORIES SECTION - ENHANCED
      ============================================ */}
      <section className="container mx-auto px-4 py-16" aria-labelledby="subcategories-heading">
        <div className="text-center mb-12">
          <h2 id="subcategories-heading" className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Explore {categoryName} Sub-Categories
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose from our comprehensive {categoryName} training programs designed to advance your career in {cityTitle}
          </p>
        </div>

        {subcategories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 text-lg">No training programs available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subcategories.map((subcat, index) => (
              <article
                key={subcat.id}
                className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 group hover:border-blue-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Link
                  to={`${locPrefix}/training/${mastercategoryid}/${categoryCitySeo}/${subcat.id}/${buildSubcategoryCitySeo(subcat.name, cityForHeading)}`}
                  className="block"
                  aria-label={`View ${subcat.name} training courses in ${cityTitle}`}
                >
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg" aria-hidden="true">
                    <span className="text-3xl text-white font-bold">
                      {subcat.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Subcategory Name */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {subcat.name}
                  </h3>

                  {/* Description (if available) */}
                  {subcat.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {subcat.description}
                    </p>
                  )}

                  {/* Course Count Badge */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500 font-medium">
                      {subcat.courses?.length || 0} course{(subcat.courses?.length || 0) !== 1 ? 's' : ''}
                    </span>
                    <span className="text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-1">
                      Explore
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ============================================
          🎓 ALL COURSES SECTION - ENHANCED WITH BETTER SEO
      ============================================ */}
      {totalCourses > 0 && (
        <section className="bg-gradient-to-b from-blue-50 to-white py-16" aria-labelledby="courses-heading">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 id="courses-heading" className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Featured {categoryName} Courses in {cityTitle}
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Start learning with our expert-designed {categoryName} courses. All programs include hands-on labs and real-world projects.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCourses.map((course) => (
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
                          alt={`${course.title} - ${categoryName} Training Course in ${cityTitle} | Aim Tutor`}
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

                  {/* Badges Row */}
                  <div className="mb-3 flex items-center gap-2 flex-wrap">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${course.difficulty_level === 'Beginner' ? 'bg-green-100 text-green-700' :
                        course.difficulty_level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                      }`}>
                      {course.difficulty_level || 'All Levels'}
                    </span>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                      {course.subcategoryName}
                    </span>
                  </div>

                  {/* Course Title - H3 for SEO hierarchy */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                    {course.title}
                  </h3>

                  {/* Description */}
                  {(course.short_description || course.description) && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 min-h-[4rem]">
                      {course.short_description || course.description}
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
                      to={`${locPrefix}/training/${mastercategoryid}/${categoryCitySeo}/${course.subcategoryId}/${buildSubcategoryCitySeo(course.subcategoryName, cityForHeading)}/${course.id}/${buildCourseCitySeo(course.title, cityForHeading)}`}
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
      <FAQSection categoryName={categoryName} cityTitle={cityTitle} />

      {/* ============================================
          🏆 WHY CHOOSE US SECTION - ENHANCED
      ============================================ */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16" aria-labelledby="why-choose-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 id="why-choose-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Our {categoryName} Training in {cityTitle}?
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Aim Tutor provides world-class {categoryName} training with proven results and industry recognition
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
              <p className="text-white/90">Learn from certified professionals with 10+ years of real-world {categoryName} experience</p>
            </div>

            <div className="text-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm" aria-hidden="true">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">100% Hands-On Practice</h3>
              <p className="text-white/90">Apply {categoryName} concepts immediately with practical labs, projects, and real-world scenarios</p>
            </div>

            <div className="text-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm" aria-hidden="true">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Career Support & Certification</h3>
              <p className="text-white/90">Get placement assistance, interview prep, and industry-recognized {categoryName} certifications</p>
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
            What Our {categoryName} Students Say
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join thousands of satisfied learners who advanced their careers with Aim Tutor {categoryName} training
          </p>
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
              Upcoming {categoryName} Courses in {cityTitle}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Reserve your spot in our next batch of {categoryName} training programs. Limited seats available!
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: `Introduction to ${categoryName}`,
                description: `Master the basics of ${categoryName.toLowerCase()}, deployment models, and key services with hands-on labs.`,
                duration: "16 hours (2 days)",
                location: "Online Live",
                locationColor: "green",
                badge: "Beginner",
              },
              {
                title: `${categoryName} Security Best Practices`,
                description: `Learn IAM, encryption, compliance and comprehensive ${categoryName.toLowerCase()} security strategies.`,
                duration: "24 hours (3 days)",
                location: cityTitle,
                locationColor: "blue",
                badge: "Intermediate",
              },
              {
                title: `Advanced ${categoryName} Architecture`,
                description: `Deep dive into advanced ${categoryName.toLowerCase()} concepts, design patterns and real-world implementations.`,
                duration: "32 hours (4 days)",
                location: "Online Live",
                locationColor: "green",
                badge: "Advanced",
              },
              {
                title: `${categoryName} DevOps Integration`,
                description: `CI/CD pipelines, automation, monitoring and best practices in ${categoryName.toLowerCase()} DevOps.`,
                duration: "40 hours (5 days)",
                location: "Bangalore",
                locationColor: "yellow",
                badge: "Intermediate",
              },
              {
                title: `${categoryName} Certification Bootcamp`,
                description: `Intensive preparation for industry-recognized ${categoryName.toLowerCase()} certifications with mock tests.`,
                duration: "48 hours (6 days)",
                location: cityTitle,
                locationColor: "blue",
                badge: "All Levels",
              },
              {
                title: `${categoryName} for Enterprises`,
                description: `Enterprise-grade ${categoryName.toLowerCase()} solutions, governance, and large-scale implementations.`,
                duration: "40 hours (5 days)",
                location: "Online Live",
                locationColor: "green",
                badge: "Advanced",
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
            Ready to Master {categoryName} in {cityTitle}?
          </h2>
          <p className="text-white/90 text-lg mb-2 max-w-3xl mx-auto">
            🎯 Join AIM's top-rated {categoryName} training with <strong>4.8★ rating from 1000+ students</strong>
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

export default CategoryPage;