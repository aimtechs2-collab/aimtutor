import React, { useMemo, useEffect, useCallback } from 'react';
import { Title, Meta, Link as HeadLink } from "react-head";
import {
  Target,
  Lightbulb,
  Users,
  Award,
  TrendingUp,
  Heart,
  Shield,
  Zap,
  Globe,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Star,
  BookOpen,
  Briefcase,
  GraduationCap,
  Clock,
  MapPin,
  Mail,
  Phone,
  Sparkles,
  Brain,
  Trophy,
  Cpu,
  Network,
  Building2,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { slugify } from '../utils/seoSlug';

/* ============================================
   CONSTANTS & CONFIGURATION
   🎯 Dynamic Year Calculation - Auto-updates every year!
============================================ */

// Location Coordinates - Aim Tutor Ameerpet Campus
const LOCATION = {
  latitude: 17.438253044319286,
  longitude: 78.4452963483808,
  address: {
    street: "#50, Kamala Nivas, Sap Street, Gayatri Nagar, Behind Mytrivanam",
    locality: "Ameerpet",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500038",
    country: "India",
    countryCode: "IN"
  }
};

// Company Info - Dynamic Year Calculation Strategy
// 🎯 yearsInBusiness automatically updates every new year!
const COMPANY_INFO = {
  name: "Aim Tutor",
  alternateName: "The School of Artificial Intelligence",
  tagline: "One Stop Upskill Center for Modern Technologies",
  foundingYear: 2007,
  yearsInBusiness: new Date().getFullYear() - 2007, // Dynamic: Always current!
  studentsPlaced: "50,000+",
  studentsTrained: "100,000+",
  corporateClients: "500+",
  coursesOffered: "25+",
  industryExperts: "100+",
  successRate: "98%",
  countriesReached: "35+",
  rating: "4.9",
  totalReviews: "15,000",
  website: "https://www.aimtutor.in",
  email: "admin@aimtutor.in",
  phone: "+91-9700187077",
  phoneSecondary: "+91-6300232040"
};

// Social Media Links
const SOCIAL_MEDIA = {
  linkedin: "https://www.linkedin.com/in/aimtutorameerpet/",
  facebook: "https://www.facebook.com/aimtutorameerpet",
  twitter: "https://x.com/aimtechhyd",
  instagram: "https://www.instagram.com/aimtutorameerpet/",
  youtube: "https://www.youtube.com/@aimtutor8983"
};

// Stats for Hero Section - Dynamic
const getStats = () => [
  { number: `${COMPANY_INFO.yearsInBusiness}+`, label: 'Years of Excellence', icon: Clock },
  { number: COMPANY_INFO.studentsTrained, label: 'Students Trained', icon: GraduationCap },
  { number: COMPANY_INFO.corporateClients, label: 'Corporate Clients', icon: Briefcase },
  { number: COMPANY_INFO.successRate, label: 'Success Rate', icon: TrendingUp },
];

// Core Values
const CORE_VALUES = [
  {
    icon: Brain,
    title: 'AI-First Approach',
    description: 'Leading the revolution in artificial intelligence education with cutting-edge curriculum and industry-relevant training.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Constantly evolving our programs to match the rapidly changing AI landscape and emerging technologies.',
    color: 'from-cyan-500 to-teal-500',
  },
  {
    icon: Heart,
    title: 'Student-Centric',
    description: `Your success is our legacy. ${new Date().getFullYear() - 2007} years of experience in personalized mentorship and career guidance.`,
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Globe,
    title: 'Global Vision',
    description: 'Expanding from Hyderabad to the world, making quality AI education accessible internationally.',
    color: 'from-orange-500 to-red-500',
  },
];

// Milestones - Dynamic
const getMilestones = () => [
  {
    year: COMPANY_INFO.foundingYear.toString(),
    title: 'The Foundation',
    description: `Established in ${LOCATION.address.locality}, ${LOCATION.address.city} as a premier software training institute, building the foundation of excellence.`,
    isHighlight: true,
    highlightColor: 'orange'
  },
  {
    year: '2013',
    title: 'Regional Leader',
    description: `Became ${LOCATION.address.city}'s most trusted name in software training, with 50+ corporate partnerships.`,
    isHighlight: false
  },
  {
    year: '2022',
    title: 'AI Transformation',
    description: 'Recognized the AI revolution and began restructuring curriculum to focus on artificial intelligence and machine learning.',
    isHighlight: false
  },
  {
    year: '2026',
    title: 'Global Expansion',
    description: `Launching global initiatives to bring ${COMPANY_INFO.yearsInBusiness} years of training expertise to the international market with AI-focused education.`,
    isHighlight: true,
    highlightColor: 'blue'
  },
];

// Why Choose Us - Dynamic
const getWhyChooseUs = () => [
  `${COMPANY_INFO.yearsInBusiness} years of proven software training excellence`,
  'AI-focused curriculum designed by industry experts',
  'Hands-on projects with real-world AI applications',
  `Located in ${LOCATION.address.locality} - ${LOCATION.address.city}'s IT training hub`,
  'International certification programs',
  'Job placement assistance with global companies',
  'Flexible learning: Online, Offline & Hybrid modes',
  'Small batch sizes for personalized AI mentorship',
  'Lifetime access to AI course materials and updates',
  'State-of-the-art AI labs and infrastructure',
];

// Global Reach Stats - Dynamic
const getGlobalReach = () => [
  { icon: Users, number: COMPANY_INFO.studentsTrained, label: 'Alumni Worldwide' },
  { icon: Globe, number: COMPANY_INFO.countriesReached, label: 'Countries Reached' },
  { icon: Award, number: '10+', label: 'Industry Awards' },
  { icon: Star, number: `${COMPANY_INFO.rating}/5`, label: 'Student Rating' },
];

// AI Specializations
const AI_SPECIALIZATIONS = [
  {
    icon: Brain,
    title: 'Machine Learning & AI',
    description: 'Deep dive into ML algorithms, neural networks, and practical AI applications that drive modern technology.',
  },
  {
    icon: Cpu,
    title: 'Deep Learning & NLP',
    description: 'Master advanced deep learning techniques, transformers, and natural language processing for cutting-edge AI solutions.',
  },
  {
    icon: Network,
    title: 'AI for Business',
    description: 'Learn to implement AI strategies, automation, and intelligent systems that transform business operations.',
  },
];

// FAQs - Dynamic
const getFaqs = () => [
  {
    question: `How long has ${COMPANY_INFO.name} been in operation?`,
    answer: `${COMPANY_INFO.name} was established in ${COMPANY_INFO.foundingYear} in ${LOCATION.address.locality}, ${LOCATION.address.city}. We have over ${COMPANY_INFO.yearsInBusiness} years of experience in software and technology training, making us one of the most experienced training institutes in India.`
  },
  {
    question: `What courses does ${COMPANY_INFO.name} offer?`,
    answer: `${COMPANY_INFO.name} specializes in AI and Machine Learning courses, Deep Learning & NLP, AI for Business, Data Science, Python Programming, and various other technology training programs. We offer ${COMPANY_INFO.coursesOffered} courses in both online and offline training modes.`
  },
  {
    question: `Where is ${COMPANY_INFO.name} located?`,
    answer: `Our headquarters is located in ${LOCATION.address.locality}, ${LOCATION.address.city}, ${LOCATION.address.state} - India's largest IT training hub. We also offer online training programs accessible worldwide to students in ${COMPANY_INFO.countriesReached} countries.`
  },
  {
    question: `What is ${COMPANY_INFO.name}'s success rate?`,
    answer: `${COMPANY_INFO.name} has a ${COMPANY_INFO.successRate} success rate with over ${COMPANY_INFO.studentsTrained} students trained and ${COMPANY_INFO.corporateClients} corporate clients. Our alumni work in top companies across ${COMPANY_INFO.countriesReached} countries worldwide.`
  },
  {
    question: `Does ${COMPANY_INFO.name} offer placement assistance?`,
    answer: `Yes, ${COMPANY_INFO.name} provides comprehensive job placement assistance including resume building, interview preparation, and connections with our network of ${COMPANY_INFO.corporateClients} corporate partners globally. We've successfully placed ${COMPANY_INFO.studentsPlaced} students over ${COMPANY_INFO.yearsInBusiness} years.`
  }
];

/* ============================================
   STRUCTURED DATA COMPONENT
   Uses dynamic COMPANY_INFO values
============================================ */
const StructuredData = React.memo(({ siteUrl }) => {
  // Organization Schema - Dynamic
  const organizationSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${siteUrl}/#organization`,
    "name": COMPANY_INFO.name,
    "alternateName": [COMPANY_INFO.alternateName, "AIM Tech", "Aim Tutor Training Institute"],
    "url": COMPANY_INFO.website,
    "description": `${COMPANY_INFO.name} is a premier AI and software training institute with ${COMPANY_INFO.yearsInBusiness}+ years of excellence since ${COMPANY_INFO.foundingYear}. Located in ${LOCATION.address.locality}, ${LOCATION.address.city}, we offer world-class AI, Machine Learning, and technology training programs globally.`,
    "foundingDate": COMPANY_INFO.foundingYear.toString(),
    "foundingLocation": {
      "@type": "Place",
      "name": `${LOCATION.address.locality}, ${LOCATION.address.city}`
    },
    "slogan": COMPANY_INFO.tagline,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": LOCATION.address.street,
      "addressLocality": LOCATION.address.locality,
      "addressRegion": LOCATION.address.state,
      "postalCode": LOCATION.address.pincode,
      "addressCountry": LOCATION.address.countryCode
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": LOCATION.latitude.toString(),
      "longitude": LOCATION.longitude.toString()
    },
    "telephone": COMPANY_INFO.phone,
    "email": COMPANY_INFO.email,
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": COMPANY_INFO.phone,
        "contactType": "customer service",
        "areaServed": ["IN", "US", "GB", "AE", "SG"],
        "availableLanguage": ["English", "Hindi", "Telugu"]
      },
      {
        "@type": "ContactPoint",
        "telephone": COMPANY_INFO.phoneSecondary,
        "contactType": "sales",
        "areaServed": "Worldwide"
      }
    ],
    "areaServed": [
      { "@type": "Country", "name": "India" },
      { "@type": "Country", "name": "United States" },
      { "@type": "Country", "name": "United Kingdom" },
      { "@type": "Country", "name": "United Arab Emirates" },
      { "@type": "Country", "name": "Singapore" },
      { "@type": "Place", "name": "Worldwide" }
    ],
    "knowsAbout": [
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
      "Technology Education"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "AI & Technology Training Courses",
      "itemListElement": [
        { "@type": "OfferCatalog", "name": "AI & Machine Learning Courses" },
        { "@type": "OfferCatalog", "name": "Deep Learning & NLP Courses" },
        { "@type": "OfferCatalog", "name": "Generative AI & LLM Courses" },
        { "@type": "OfferCatalog", "name": "AI for Business Programs" }
      ]
    },
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "minValue": 50,
      "maxValue": 100
    },
    "alumni": {
      "@type": "QuantitativeValue",
      "value": parseInt(COMPANY_INFO.studentsTrained.replace(/\D/g, '')) * 1000,
      "unitText": "students"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": COMPANY_INFO.rating,
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": COMPANY_INFO.totalReviews.replace(',', ''),
      "reviewCount": "12500"
    },
    "award": [
      `Best IT Training Institute ${LOCATION.address.city} 2023`,
      "Excellence in AI Education 2024",
      "Top 10 Technology Training Providers India"
    ],
    "sameAs": Object.values(SOCIAL_MEDIA)
  }), [siteUrl]);

  // AboutPage Schema - Dynamic
  const aboutPageSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${siteUrl}/about#webpage`,
    "url": `${siteUrl}/about`,
    "name": `About ${COMPANY_INFO.name} - ${COMPANY_INFO.yearsInBusiness}+ Years of AI & Software Training Excellence`,
    "description": `Learn about ${COMPANY_INFO.name}, ${LOCATION.address.city}'s premier AI training institute with ${COMPANY_INFO.yearsInBusiness}+ years of excellence. ${COMPANY_INFO.studentsTrained} students trained, ${COMPANY_INFO.corporateClients} corporate clients, ${COMPANY_INFO.successRate} success rate.`,
    "isPartOf": { "@id": `${siteUrl}/#website` },
    "about": { "@id": `${siteUrl}/#organization` },
    "mainEntity": { "@id": `${siteUrl}/#organization` },
    "breadcrumb": { "@id": `${siteUrl}/about#breadcrumb` },
    "inLanguage": "en-IN",
    "datePublished": `${COMPANY_INFO.foundingYear}-01-01`,
    "dateModified": new Date().toISOString()
  }), [siteUrl]);

  // Breadcrumb Schema
  const breadcrumbSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${siteUrl}/about#breadcrumb`,
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
      { "@type": "ListItem", "position": 2, "name": "About Us", "item": `${siteUrl}/about` }
    ]
  }), [siteUrl]);

  // WebSite Schema
  const websiteSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    "url": siteUrl,
    "name": COMPANY_INFO.name,
    "description": `Premier AI & Software Training Institute with ${COMPANY_INFO.yearsInBusiness}+ years of excellence`,
    "publisher": { "@id": `${siteUrl}/#organization` },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "en-IN"
  }), [siteUrl]);

  // LocalBusiness Schema - Dynamic
  const localBusinessSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "EducationalOrganization", "ProfessionalService"],
    "name": `${COMPANY_INFO.name} - ${LOCATION.address.locality}`,
    "image": `${siteUrl}/images/aim-technologies-campus.jpg`,
    "description": `Premier AI training institute with ${COMPANY_INFO.yearsInBusiness} years of excellence. ${COMPANY_INFO.studentsTrained} students trained since ${COMPANY_INFO.foundingYear}.`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": LOCATION.address.street,
      "addressLocality": LOCATION.address.locality,
      "addressRegion": LOCATION.address.state,
      "postalCode": LOCATION.address.pincode,
      "addressCountry": LOCATION.address.countryCode
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": LOCATION.latitude.toString(),
      "longitude": LOCATION.longitude.toString()
    },
    "url": COMPANY_INFO.website,
    "telephone": COMPANY_INFO.phone,
    "email": COMPANY_INFO.email,
    "foundingDate": COMPANY_INFO.foundingYear.toString(),
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "19:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "17:00"
      }
    ],
    "priceRange": "₹₹",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": COMPANY_INFO.rating,
      "reviewCount": COMPANY_INFO.totalReviews.replace(',', '')
    },
    "sameAs": Object.values(SOCIAL_MEDIA)
  }), [siteUrl]);

  // FAQ Schema - Dynamic
  const faqSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": getFaqs().map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }), []);

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(aboutPageSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </>
  );
});

StructuredData.displayName = 'StructuredData';

/* ============================================
   MAIN COMPONENT
============================================ */
function AboutPage() {
  // Environment variables
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://www.aimtutor.in';

  const { country, region, city: cityParam } = useParams();

  // Helper function for localStorage
  const getStoredValue = useCallback((key, fallback) => {
    if (typeof window === 'undefined') return fallback;
    try {
      return localStorage.getItem(key) || fallback;
    } catch {
      return fallback;
    }
  }, []);

  // Memoized location data
  const locCountry = country || getStoredValue("user_country", "in");
  const locRegion = region || getStoredValue("user_region", "ts");
  const locCity = cityParam || getStoredValue("user_city", "Hyderabad");

  const locPrefix = useMemo(() => 
    `/${locCountry}/${locRegion}/${slugify(locCity)}`,
    [locCountry, locRegion, locCity]
  );

  const cityTitle = useMemo(() => 
    locCity.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    [locCity]
  );

  // Memoized dynamic data
  const stats = useMemo(() => getStats(), []);
  const milestones = useMemo(() => getMilestones(), []);
  const whyChooseUs = useMemo(() => getWhyChooseUs(), []);
  const globalReach = useMemo(() => getGlobalReach(), []);
  const faqs = useMemo(() => getFaqs(), []);

  // Memoized SEO Configuration - Dynamic
  const seoConfig = useMemo(() => ({
    pageTitle: `About ${COMPANY_INFO.name} ⭐ ${COMPANY_INFO.yearsInBusiness}+ Years of AI & Software Training Excellence | ${cityTitle}`,
    pageDescription: `★ Discover ${COMPANY_INFO.name} - ${cityTitle}'s #1 AI training institute since ${COMPANY_INFO.foundingYear}! 🎯 ${COMPANY_INFO.yearsInBusiness}+ years excellence ✅ ${COMPANY_INFO.studentsTrained} students ✅ ${COMPANY_INFO.corporateClients} corporate clients ✅ ${COMPANY_INFO.successRate} success rate ✅ ${COMPANY_INFO.rating}/5 rating. Located in ${LOCATION.address.locality}, now going global with AI Training education.`,
    canonicalUrl: `${siteUrl}${locPrefix}/about`,
    ogImageUrl: `${siteUrl}/images/og/about-aim-technologies.jpg`,
    keywords: [
      COMPANY_INFO.name,
      `AI training ${cityTitle}`,
      `machine learning course ${cityTitle}`,
      `software training ${LOCATION.address.locality}`,
      `best IT training institute ${cityTitle}`,
      "AI education India",
      "deep learning training",
      `NLP course ${cityTitle}`,
      "data science training",
      `Python training ${cityTitle}`,
      "artificial intelligence course",
      "technology training institute",
      `corporate training ${cityTitle}`,
      "online AI training",
      "AI certification course",
      "machine learning bootcamp",
      `${LOCATION.address.locality} training institute`,
      `IT training hub ${cityTitle}`,
      "best AI institute India",
      `${COMPANY_INFO.yearsInBusiness} years training excellence`,
      `AI training since ${COMPANY_INFO.foundingYear}`,
      `${COMPANY_INFO.studentsTrained} students trained`,
      `${COMPANY_INFO.corporateClients} corporate clients`
    ].join(', ')
  }), [cityTitle, locPrefix, siteUrl]);

  return (
    <div className="font-sans text-gray-900 leading-relaxed overflow-x-hidden bg-white">

      {/* ============================================
          🔥 ENHANCED SEO HEAD TAGS - DYNAMIC
      ============================================ */}
      <>
        {/* Core Meta Tags */}
        <Title>{seoConfig.pageTitle}</Title>
        <Meta name="description" content={seoConfig.pageDescription} />
        <Meta name="keywords" content={seoConfig.keywords} />
        <Meta name="author" content={COMPANY_INFO.name} />
        <Meta name="publisher" content={COMPANY_INFO.name} />
        <Meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <Meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <Meta name="bingbot" content="index, follow" />

        {/* Geo Tags for Local SEO */}
        <Meta name="geo.region" content="IN-TS" />
        <Meta name="geo.placename" content={`${LOCATION.address.locality}, ${LOCATION.address.city}`} />
        <Meta name="geo.position" content={`${LOCATION.latitude};${LOCATION.longitude}`} />
        <Meta name="ICBM" content={`${LOCATION.latitude}, ${LOCATION.longitude}`} />

        {/* Open Graph Tags */}
        <Meta property="og:title" content={seoConfig.pageTitle} />
        <Meta property="og:description" content={seoConfig.pageDescription} />
        <Meta property="og:type" content="website" />
        <Meta property="og:url" content={seoConfig.canonicalUrl} />
        <Meta property="og:site_name" content={COMPANY_INFO.name} />
        <Meta property="og:locale" content="en_IN" />
        <Meta property="og:image" content={seoConfig.ogImageUrl} />
        <Meta property="og:image:secure_url" content={seoConfig.ogImageUrl} />
        <Meta property="og:image:width" content="1200" />
        <Meta property="og:image:height" content="630" />
        <Meta property="og:image:alt" content={`${COMPANY_INFO.name} - ${COMPANY_INFO.yearsInBusiness}+ Years of AI & Software Training Excellence`} />
        <Meta property="og:phone_number" content={COMPANY_INFO.phone} />
        <Meta property="og:email" content={COMPANY_INFO.email} />
        <Meta property="article:publisher" content={SOCIAL_MEDIA.facebook} />

        {/* Twitter Card Tags */}
        <Meta name="twitter:card" content="summary_large_image" />
        <Meta name="twitter:site" content="@aimtutor" />
        <Meta name="twitter:creator" content="@aimtutor" />
        <Meta name="twitter:title" content={seoConfig.pageTitle} />
        <Meta name="twitter:description" content={seoConfig.pageDescription} />
        <Meta name="twitter:image" content={seoConfig.ogImageUrl} />
        <Meta name="twitter:image:alt" content={`${COMPANY_INFO.name} - AI Training Excellence`} />

        {/* Canonical & Alternative URLs */}
        <HeadLink rel="canonical" href={seoConfig.canonicalUrl} />
        <HeadLink rel="alternate" hrefLang="en-in" href={seoConfig.canonicalUrl} />
        <HeadLink rel="alternate" hrefLang="en" href={seoConfig.canonicalUrl} />
        <HeadLink rel="alternate" hrefLang="x-default" href={`${siteUrl}/about`} />

        {/* Performance & Security */}
        <HeadLink rel="preconnect" href="https://fonts.googleapis.com" />
        <HeadLink rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <HeadLink rel="dns-prefetch" href="//www.google-analytics.com" />
        <HeadLink rel="dns-prefetch" href="//www.googletagmanager.com" />

        {/* Additional Meta */}
        <Meta name="format-detection" content="telephone=yes" />
        <Meta name="theme-color" content="#1e3a8a" />
        <Meta httpEquiv="content-language" content="en-IN" />
        <Meta name="application-name" content={COMPANY_INFO.name} />
        <Meta name="apple-mobile-web-app-title" content={COMPANY_INFO.name} />
        <Meta name="classification" content="Education, Training, AI, Technology" />
        <Meta name="rating" content="General" />
        <Meta name="revisit-after" content="3 days" />
        <Meta name="distribution" content="global" />
        <Meta name="coverage" content="Worldwide" />

        {/* Business Meta */}
        <Meta name="business:contact_data:street_address" content={LOCATION.address.street} />
        <Meta name="business:contact_data:locality" content={LOCATION.address.locality} />
        <Meta name="business:contact_data:region" content={LOCATION.address.state} />
        <Meta name="business:contact_data:postal_code" content={LOCATION.address.pincode} />
        <Meta name="business:contact_data:country_name" content={LOCATION.address.country} />
        <Meta name="business:contact_data:phone_number" content={COMPANY_INFO.phone} />
        <Meta name="business:contact_data:email" content={COMPANY_INFO.email} />
        <Meta name="business:contact_data:website" content={COMPANY_INFO.website} />
      </>

      {/* ============================================
          📊 STRUCTURED DATA
      ============================================ */}
      <StructuredData siteUrl={siteUrl} />

      {/* ============================================
          🎯 HERO SECTION - DYNAMIC
      ============================================ */}
      <section className="relative min-h-[500px] md:min-h-[600px] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden flex items-center" aria-labelledby="hero-heading">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 bg-cyan-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 mt-8 sm:px-5 py-16 sm:py-20 relative z-10">
          {/* Breadcrumb Navigation */}
          <nav 
            className="flex gap-2 text-sm text-gray-400 mb-6" 
            aria-label="Breadcrumb"
            itemScope 
            itemType="https://schema.org/BreadcrumbList"
          >
            <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link to="/" className="hover:text-white transition-colors" itemProp="item">
                <span itemProp="name">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span className="text-white font-medium" itemProp="name" aria-current="page">About Us</span>
              <meta itemProp="position" content="2" />
            </span>
          </nav>

          <div className="max-w-4xl mx-auto text-center">
            {/* Badge - Dynamic */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-4 sm:mb-6 border border-yellow-500/30">
              <Award className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400" aria-hidden="true" />
              <span className="text-sm sm:text-base font-bold text-yellow-300">
                {COMPANY_INFO.yearsInBusiness}+ Years of Excellence Since {COMPANY_INFO.foundingYear}
              </span>
              <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-400" aria-hidden="true" />
            </div>

            {/* Brand Identity */}
            <div className="mb-4 sm:mb-6">
              <h1 id="hero-heading" className="text-4xl sm:text-6xl md:text-8xl mb-2 sm:mb-3">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  {COMPANY_INFO.name}
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-cyan-400 font-medium">
                {COMPANY_INFO.tagline}
              </p>
            </div>

            {/* Description - Dynamic */}
            <p className="text-base sm:text-xl md:text-2xl text-gray-200 mb-4 sm:mb-6 leading-relaxed px-4 sm:px-0">
              <strong>{COMPANY_INFO.yearsInBusiness} years</strong> of software training excellence, 
              now leading the AI education revolution from {LOCATION.address.city} to the world.
            </p>

            {/* Location Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm px-4 sm:px-5 py-2 sm:py-3 rounded-full border border-orange-400/30 mb-6 sm:mb-8">
              <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-orange-400" aria-hidden="true" />
              <span className="text-sm sm:text-base font-medium">
                {LOCATION.address.locality}, {LOCATION.address.city} | Going Global
              </span>
            </div>

            {/* Quick Stats - Dynamic */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mt-8 sm:mt-12" role="list" aria-label="Key Statistics">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1"
                  role="listitem"
                >
                  <stat.icon className="w-6 sm:w-8 h-6 sm:h-8 text-cyan-400 mx-auto mb-2 sm:mb-3" aria-hidden="true" />
                  <div className="text-xl sm:text-3xl font-bold text-cyan-400 mb-1 sm:mb-2">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          📖 OUR STORY SECTION - DYNAMIC
      ============================================ */}
      <section className="py-12 sm:py-20 bg-white" aria-labelledby="story-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-5">
          <div className="text-center mb-8 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
              <Rocket className="w-3 sm:w-4 h-3 sm:h-4 text-blue-600" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-medium text-blue-600">Our Evolution</span>
            </div>
            <h2 id="story-heading" className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                {COMPANY_INFO.name}
              </span>
              {' '}Journey
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
              For <strong>{COMPANY_INFO.yearsInBusiness} years</strong>, <strong>{COMPANY_INFO.name}</strong> has been 
              the cornerstone of software training in {LOCATION.address.locality}, {LOCATION.address.city}. 
              Now, we're embarking on our most ambitious journey yet—bringing world-class AI education globally.
            </p>
          </div>

          {/* Two Column Story - Dynamic */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-12 mb-8 sm:mb-16">
            {/* Legacy */}
            <article className="group">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl sm:rounded-3xl p-6 sm:p-10 h-full border border-orange-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="inline-flex items-center justify-center w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform" aria-hidden="true">
                  <Building2 className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-900">
                  Our Legacy
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-orange-600 mb-3 sm:mb-4">
                  Est. {COMPANY_INFO.foundingYear} | {LOCATION.address.locality}, {LOCATION.address.city}
                </p>
                <p className="text-sm sm:text-lg text-gray-700 leading-relaxed mb-3 sm:mb-4">
                  {COMPANY_INFO.name} has been the trusted name in software training for over {COMPANY_INFO.yearsInBusiness} years. 
                  Located in {LOCATION.address.locality}—India's largest IT training hub—we've trained over {COMPANY_INFO.studentsTrained} students 
                  in cutting-edge technologies.
                </p>
                <ul className="space-y-2 sm:space-y-3" role="list">
                  {[
                    `${COMPANY_INFO.yearsInBusiness}+ years of training excellence`,
                    `${COMPANY_INFO.corporateClients} corporate partnerships`,
                    `Leaders in ${LOCATION.address.city} IT education`,
                    'Foundation of quality & trust'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm sm:text-base text-gray-700">
                      <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-orange-500 flex-shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            {/* Vision */}
            <article className="group">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl sm:rounded-3xl p-6 sm:p-10 h-full border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="inline-flex items-center justify-center w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform" aria-hidden="true">
                  <Brain className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-900">
                  AI-First Future
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-blue-600 mb-3 sm:mb-4">
                  Leading AI Education Globally
                </p>
                <p className="text-sm sm:text-lg text-gray-700 leading-relaxed mb-3 sm:mb-4">
                  Building on our {COMPANY_INFO.yearsInBusiness}-year legacy, we're taking proven training methodologies 
                  and combining them with AI curriculum to dominate the international education market.
                </p>
                <ul className="space-y-2 sm:space-y-3" role="list">
                  {[
                    'AI & Machine Learning specialization',
                    `${COMPANY_INFO.coursesOffered} comprehensive programs`,
                    'International market focus',
                    'Next-gen learning platform'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm sm:text-base text-gray-700">
                      <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-blue-500 flex-shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ============================================
          📅 TIMELINE SECTION - DYNAMIC
      ============================================ */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-gray-50 to-white" aria-labelledby="timeline-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-5">
          <div className="text-center mb-8 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
              <Clock className="w-3 sm:w-4 h-3 sm:h-4 text-purple-600" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-medium text-purple-600">Our Journey</span>
            </div>
            <h2 id="timeline-heading" className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              {COMPANY_INFO.yearsInBusiness} Years of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Innovation
              </span>
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
              From a local training institute to a global AI education powerhouse—here's our story since {COMPANY_INFO.foundingYear}.
            </p>
          </div>

          {/* Timeline - Mobile Optimized */}
          <div className="relative" role="list" aria-label="Company Milestones">
            {/* Center Line - Desktop Only */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-orange-500 via-blue-500 to-cyan-500" aria-hidden="true"></div>

            <div className="space-y-6 sm:space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row gap-4 sm:gap-8 items-center ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                  role="listitem"
                >
                  {/* Content */}
                  <div className="flex-1 w-full">
                    <article
                      className={`bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border-2 ${
                        milestone.highlightColor === 'blue'
                          ? 'border-blue-400 shadow-blue-200' 
                          : milestone.highlightColor === 'orange'
                          ? 'border-orange-400 shadow-orange-200' 
                          : 'border-gray-200'
                      } hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                        index % 2 === 0 ? 'md:text-right' : ''
                      }`}
                    >
                      <div className={`inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold mb-3 sm:mb-4 ${
                        milestone.highlightColor === 'blue'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                          : milestone.highlightColor === 'orange'
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        <time dateTime={milestone.year}>{milestone.year}</time>
                        {milestone.isHighlight && <Sparkles className="inline-block w-3 sm:w-4 h-3 sm:h-4 ml-1 sm:ml-2" aria-hidden="true" />}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-900">
                        {milestone.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        {milestone.description}
                      </p>
                    </article>
                  </div>

                  {/* Center Dot - Desktop Only */}
                  <div className="hidden md:block relative" aria-hidden="true">
                    <div className={`w-6 h-6 rounded-full border-4 border-white shadow-lg ${
                      milestone.highlightColor === 'blue'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                        : milestone.highlightColor === 'orange'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500'
                        : 'bg-gray-400'
                    }`}></div>
                  </div>

                  {/* Spacer - Desktop Only */}
                  <div className="hidden md:block flex-1" aria-hidden="true"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          🎯 MISSION & VISION - DYNAMIC
      ============================================ */}
      <section className="py-12 sm:py-20 bg-white" aria-labelledby="mission-vision-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-5">
          <h2 id="mission-vision-heading" className="sr-only">Our Mission and Vision</h2>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-12">
            {/* Mission */}
            <article className="group">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl sm:rounded-3xl p-6 sm:p-10 h-full border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="inline-flex items-center justify-center w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform" aria-hidden="true">
                  <Target className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-900">
                  Our Mission
                </h3>
                <p className="text-sm sm:text-lg text-gray-700 leading-relaxed">
                  To leverage our <strong>{COMPANY_INFO.yearsInBusiness} years</strong> of training excellence and make world-class AI education accessible globally. 
                  We aim to bridge the gap between traditional software training and the AI-driven future, 
                  empowering individuals and organizations to thrive in the age of artificial intelligence.
                </p>
              </div>
            </article>

            {/* Vision */}
            <article className="group">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl sm:rounded-3xl p-6 sm:p-10 h-full border border-purple-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="inline-flex items-center justify-center w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform" aria-hidden="true">
                  <Rocket className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-900">
                  Our Vision
                </h3>
                <p className="text-sm sm:text-lg text-gray-700 leading-relaxed">
                  To become the world's most trusted AI education brand, expanding {COMPANY_INFO.name}'s reach from {LOCATION.address.city} to every corner of the globe. 
                  We envision a future where quality AI training is not a privilege but a right, 
                  creating a global community of AI-skilled professionals across {COMPANY_INFO.countriesReached} countries and beyond.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ============================================
          💎 CORE VALUES - DYNAMIC
      ============================================ */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-gray-50 to-white" aria-labelledby="values-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-5">
          <div className="text-center mb-8 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-cyan-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
              <Heart className="w-3 sm:w-4 h-3 sm:h-4 text-cyan-600" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-medium text-cyan-600">What Drives Us</span>
            </div>
            <h2 id="values-heading" className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Our Core{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
                Values
              </span>
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
              The principles that have guided us for {COMPANY_INFO.yearsInBusiness} years and will lead us into the AI future.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8" role="list" aria-label="Core Values">
            {CORE_VALUES.map((value, index) => (
              <article
                key={index}
                className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                role="listitem"
              >
                {/* Gradient Border on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${value.color} rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity -z-10`} aria-hidden="true"></div>
                <div className="absolute inset-[2px] bg-white rounded-2xl sm:rounded-3xl -z-10" aria-hidden="true"></div>

                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-r ${value.color} rounded-xl sm:rounded-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform`} aria-hidden="true">
                  <value.icon className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">
                  {value.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          🤖 AI SPECIALIZATIONS
      ============================================ */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden" aria-labelledby="ai-specializations-heading">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 bg-cyan-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-5 relative z-10">
          <div className="text-center mb-8 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
              <Brain className="w-3 sm:w-4 h-3 sm:h-4 text-cyan-400" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-medium">AI Education Excellence</span>
            </div>
            <h2 id="ai-specializations-heading" className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              What Makes Us
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mt-1 sm:mt-2">
                AI Training Experts
              </span>
            </h2>
            <p className="text-base sm:text-xl text-gray-200 max-w-3xl mx-auto px-4 sm:px-0">
              We don't just teach AI—we live it. With <strong>{COMPANY_INFO.yearsInBusiness} years</strong> of training expertise, 
              our entire philosophy, curriculum, and approach is built around artificial intelligence.
            </p>
          </div>

          {/* AI Focus Areas */}
          <div className="grid md:grid-cols-3 gap-4 sm:gap-8" role="list" aria-label="AI Specializations">
            {AI_SPECIALIZATIONS.map((item, index) => (
              <article
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2"
                role="listitem"
              >
                <div className="inline-flex items-center justify-center w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg sm:rounded-xl mb-4 sm:mb-6" aria-hidden="true">
                  <item.icon className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{item.title}</h3>
                <p className="text-sm sm:text-base text-gray-200 leading-relaxed">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          ✅ WHY CHOOSE US - DYNAMIC
      ============================================ */}
      <section className="py-12 sm:py-20 bg-white" aria-labelledby="why-choose-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-5">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
                <Trophy className="w-3 sm:w-4 h-3 sm:h-4 text-orange-600" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-medium text-orange-600">Why {COMPANY_INFO.name}?</span>
              </div>

              <h2 id="why-choose-heading" className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                The Perfect Blend of{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-blue-600">
                  Legacy & Innovation
                </span>
              </h2>

              <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                We combine <strong>{COMPANY_INFO.yearsInBusiness} years</strong> of proven training methodologies with cutting-edge AI curriculum. 
                When you choose {COMPANY_INFO.name}, you're choosing experience, innovation, and a global vision.
              </p>

              {/* Features List - Dynamic */}
              <ul className="space-y-3 sm:space-y-4" role="list" aria-label={`Why choose ${COMPANY_INFO.name}`}>
                {whyChooseUs.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 sm:gap-4 group"
                  >
                    <div className="mt-0.5 sm:mt-1 flex-shrink-0" aria-hidden="true">
                      <div className="w-5 sm:w-6 h-5 sm:h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                      </div>
                    </div>
                    <span className="text-sm sm:text-lg text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  to={`${locPrefix}/training`}
                  className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg sm:rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                  aria-label={`Explore AI Courses at ${COMPANY_INFO.name}`}
                >
                  <span>Explore AI Courses</span>
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
                <a
                  href={`https://maps.google.com/?q=${LOCATION.latitude},${LOCATION.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
                  aria-label={`Visit ${COMPANY_INFO.name} Campus in ${LOCATION.address.locality}`}
                >
                  <MapPin className="w-4 sm:w-5 h-4 sm:h-5" aria-hidden="true" />
                  <span>Visit Our Campus</span>
                </a>
              </div>
            </div>

            {/* Stats Grid - Dynamic */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4 sm:gap-6" role="list" aria-label="Global Reach Statistics">
                {globalReach.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-lg border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                    role="listitem"
                  >
                    <div className="inline-flex items-center justify-center w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg sm:rounded-xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">
                      <stat.icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mb-1 sm:mb-2">
                      {stat.number}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Floating decoration - Hidden on mobile */}
              <div className="hidden sm:block absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse" aria-hidden="true"></div>
              <div className="hidden sm:block absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 animate-pulse delay-700" aria-hidden="true"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          📍 LOCATION & HERITAGE - DYNAMIC
      ============================================ */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-gray-50 to-white" aria-labelledby="location-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-5">
          <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" aria-hidden="true">
              <div className="absolute top-5 sm:top-10 left-5 sm:left-10 w-32 sm:w-64 h-32 sm:h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-5 sm:bottom-10 right-5 sm:right-10 w-40 sm:w-80 h-40 sm:h-80 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
                  <MapPin className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-300" aria-hidden="true" />
                  <span className="text-xs sm:text-sm font-medium">Our Home Since {COMPANY_INFO.foundingYear}</span>
                </div>

                <h2 id="location-heading" className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                  Rooted in {LOCATION.address.locality}, <br />Reaching the World
                </h2>
                <p className="text-base sm:text-xl text-orange-100 mb-4 sm:mb-6 leading-relaxed">
                  <strong>{LOCATION.address.locality}, {LOCATION.address.city}</strong> is India's largest IT training hub, 
                  and it's been our home for <strong>{COMPANY_INFO.yearsInBusiness} years</strong>. 
                  We've trained generations of tech professionals here.
                </p>
                <p className="text-base sm:text-xl text-orange-100 mb-6 sm:mb-8 leading-relaxed">
                  Now, we're taking this legacy global—bringing the quality and dedication 
                  that made us {LOCATION.address.city}'s #1 choice to students in {COMPANY_INFO.countriesReached} countries worldwide.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link
                    to={`${locPrefix}/contact`}
                    className="group px-6 sm:px-8 py-3 sm:py-4 bg-white text-orange-600 rounded-lg sm:rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center justify-center gap-2"
                    aria-label={`Contact ${COMPANY_INFO.name}`}
                  >
                    <Building2 className="w-4 sm:w-5 h-4 sm:h-5" aria-hidden="true" />
                    <span>Contact Our Office</span>
                    <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6" role="list" aria-label="Location Details">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20" role="listitem">
                  <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">🏢 {COMPANY_INFO.name} Headquarters</h4>
                  <address className="text-sm sm:text-base text-orange-100 not-italic">
                    {LOCATION.address.locality}, {LOCATION.address.city}, {LOCATION.address.state}
                  </address>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20" role="listitem">
                  <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">🎓 {COMPANY_INFO.yearsInBusiness} Years of Excellence</h4>
                  <p className="text-sm sm:text-base text-orange-100">Since {COMPANY_INFO.foundingYear} | {COMPANY_INFO.studentsTrained} Students Trained</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20" role="listitem">
                  <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">🌍 Global Expansion</h4>
                  <p className="text-sm sm:text-base text-orange-100">Online & Hybrid AI Training in {COMPANY_INFO.countriesReached} Countries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          🚀 FINAL CTA - DYNAMIC
      ============================================ */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden" aria-labelledby="cta-heading">
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 bg-cyan-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-5 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-4 sm:mb-6 border border-yellow-500/30">
            <Award className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400" aria-hidden="true" />
            <span className="text-sm sm:text-base font-bold text-yellow-300">
              {COMPANY_INFO.yearsInBusiness}+ Years of Trusted Excellence
            </span>
            <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-400" aria-hidden="true" />
          </div>

          <h2 id="cta-heading" className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            Ready to Begin Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mt-1 sm:mt-2">
              AI Journey?
            </span>
          </h2>

          <p className="text-base sm:text-xl text-gray-200 mb-8 sm:mb-10 leading-relaxed px-4 sm:px-0">
            Join <strong>{COMPANY_INFO.studentsTrained}</strong> successful professionals who've trusted {COMPANY_INFO.name}. 
            Experience <strong>{COMPANY_INFO.yearsInBusiness} years</strong> of training excellence, now powered by AI-first education.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to={`${locPrefix}/training`}
              className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg sm:rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center justify-center gap-2"
              aria-label={`Browse AI Courses at ${COMPANY_INFO.name}`}
            >
              <Brain className="w-4 sm:w-5 h-4 sm:h-5" aria-hidden="true" />
              <span>Browse AI Courses</span>
              <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
            <Link
              to={`${locPrefix}/contact`}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg sm:rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 inline-flex items-center justify-center gap-2"
              aria-label={`Contact ${COMPANY_INFO.name}`}
            >
              <Mail className="w-4 sm:w-5 h-4 sm:h-5" aria-hidden="true" />
              <span>Contact Us</span>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 sm:mt-12 pt-8 border-t border-white/10">
            <p className="text-gray-400 text-sm mb-4">Trusted by leading organizations worldwide</p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" aria-hidden="true" />
                <span className="text-sm">{COMPANY_INFO.studentsPlaced} Placed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" aria-hidden="true" />
                <span className="text-sm">{COMPANY_INFO.corporateClients} Clients</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" aria-hidden="true" />
                <span className="text-sm">{COMPANY_INFO.successRate} Success</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" aria-hidden="true" />
                <span className="text-sm">{COMPANY_INFO.rating}/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;