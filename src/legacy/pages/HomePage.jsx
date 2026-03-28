import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title, Meta, Link as HeadLink } from "react-head";
import aim from '../assets/aimvideo2.webm';
import {
  Search,
  PlayCircle,
  Building2,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
  Zap,
  Phone
} from 'lucide-react';
import { slugify } from '../utils/seoSlug';
import { Link, useParams } from 'react-router-dom';
import AboutBranch from '../components/AboutBranch';
import CourseCatalogue from '../components/CourseCatalogue';
import HiringPartnersSlider from "../components/HiringPartnersSlider";


/* ============================================
   STRUCTURED DATA COMPONENTS
============================================ */

const StructuredData = ({ cityTitle, locPrefix }) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://aimtutor.co';

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Aim Tutor",
    "alternateName": ["AIM Tech", "AIM Training", "Aim Tutor Training Institute"],
    "url": siteUrl,
    "image": [
      `${siteUrl}/images/aim-technologies-training.jpg`,
      `${siteUrl}/images/aim-tech-campus.jpg`,
      `${siteUrl}/images/aim-training-labs.jpg`
    ],
    "description": "Leading technology training institute providing professional courses in AI, Cloud Computing, Data Science, DevOps, and emerging technologies. Expert-led training with hands-on learning and job placement assistance.",
    "foundingDate": "2015",
    "founder": {
      "@type": "Person",
      "name": "Aim Tutor Founders"
    },
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
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+91-9876543210",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi"]
      },
      {
        "@type": "ContactPoint",
        "email": "info@aimtutor.co",
        "contactType": "customer service"
      }
    ],
    "sameAs": [
      "https://www.linkedin.com/company/aim-technologies",
      "https://twitter.com/aimtech",
      "https://www.facebook.com/aimtutor",
      "https://www.instagram.com/aimtutor",
      "https://www.youtube.com/c/aimtutor"
    ],
    "areaServed": [
      {
        "@type": "Place",
        "name": cityTitle
      },
      {
        "@type": "Place",
        "name": "India"
      },
      {
        "@type": "Place",
        "name": "Global"
      }
    ],
    "serviceType": "Professional Technology Training",
    "knowsAbout": [
      "Artificial Intelligence",
      "Machine Learning",
      "Cloud Computing",
      "Data Science",
      "DevOps",
      "Cybersecurity",
      "Full Stack Development",
      "Digital Marketing",
      "Project Management",
      "Technology Consulting"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Technology Training Courses",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Course",
            "name": "Artificial Intelligence Training",
            "description": "Comprehensive AI training with hands-on projects"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Course",
            "name": "Cloud Computing Training",
            "description": "AWS, Azure, GCP certification training"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Course",
            "name": "Data Science Training",
            "description": "Complete data science bootcamp with real projects"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "2547",
      "reviewCount": "1892"
    },
    "award": [
      "Best IT Training Institute 2024",
      "Excellence in Technology Education",
      "Top Placement Partner Award"
    ]
  };

  // Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Aim Tutor",
    "alternateName": "AIM Tech Training",
    "url": siteUrl,
    "description": "Transform your career with cutting-edge technology training. Expert-led courses in AI, Cloud, Data Science, DevOps with hands-on learning and job placement assistance.",
    "publisher": {
      "@type": "Organization",
      "name": "Aim Tutor",
      "@id": `${siteUrl}/#organization`
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "mainEntity": {
      "@type": "EducationalOrganization",
      "@id": `${siteUrl}/#organization`
    }
  };

  // Service Schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Professional Technology Training",
    "description": "Comprehensive technology training programs including AI, Cloud Computing, Data Science, DevOps, and emerging technologies with expert instructors and hands-on learning.",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Aim Tutor",
      "@id": `${siteUrl}/#organization`
    },
    "serviceType": "Educational Training",
    "areaServed": {
      "@type": "Place",
      "name": cityTitle
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Training Programs",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "EducationalOccupationalProgram",
            "name": "Technology Certification Programs"
          }
        }
      ]
    },
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "student"
    }
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </script>
    </>
  );
};

/* ============================================
   FAQ SECTION WITH SCHEMA
============================================ */
const FAQSection = ({ cityTitle }) => {
  const faqs = [
    {
      question: "What makes Aim Tutor different from other training institutes?",
      answer: `Aim Tutor stands out with our expert instructors having 10+ years industry experience, 100% hands-on learning approach, small batch sizes for personalized attention, real-world project work, latest curriculum aligned with industry trends, and comprehensive placement assistance with 500+ hiring partners.`
    },
    {
      question: `Are Aim Tutor courses available online in ${cityTitle}?`,
      answer: `Yes, we offer both online live training and classroom training in ${cityTitle}. Our online sessions are interactive with live instructors, hands-on labs, real-time doubt clearing, and the same quality as our classroom programs. You can choose the format that best suits your schedule and learning preference.`
    },
    {
      question: "What kind of job placement assistance does Aim Tutor provide?",
      answer: `We provide comprehensive placement support including resume building, interview preparation, mock interviews, soft skills training, and direct connections with our 500+ hiring partners including top MNCs and startups. Our placement team actively helps students secure relevant positions with competitive salaries.`
    },
    {
      question: "Do I get industry-recognized certifications after completing courses?",
      answer: `Yes, you receive industry-recognized certificates upon successful completion of our training programs. We also help you prepare for additional vendor certifications like AWS, Microsoft Azure, Google Cloud, and other professional certifications that enhance your career prospects and earning potential.`
    },
    {
      question: "What is the duration and fee structure of Aim Tutor courses?",
      answer: `Course duration varies from 2-6 months depending on the program complexity and depth. We offer flexible payment options including installments, early bird discounts, and special offers for students and working professionals. Contact us for detailed fee structure and current offers.`
    },
    {
      question: "Can I get customized corporate training for my organization?",
      answer: `Absolutely! We provide tailored corporate training solutions for organizations of all sizes. Our enterprise training includes customized curriculum, flexible delivery options (onsite/online/hybrid), progress tracking, detailed analytics, and ongoing support to meet your specific business objectives and skill requirements.`
    },
    {
      question: "What technologies and tools are covered in Aim Tutor training?",
      answer: `We cover cutting-edge technologies including Artificial Intelligence, Machine Learning, Cloud Computing (AWS, Azure, GCP), Data Science, DevOps, Cybersecurity, Full Stack Development, Digital Marketing, and emerging technologies. Our curriculum is regularly updated to match current industry trends and requirements.`
    },
    {
      question: "Is there any prerequisite or experience required for joining Aim Tutor courses?",
      answer: `Prerequisites vary by course level. We offer programs for complete beginners to advanced professionals. Our beginner courses require only basic computer knowledge, while advanced programs may need specific technical background. Our counselors help you choose the right program based on your current skills and career goals.`
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
    <section className="bg-gray-50 py-16" aria-labelledby="faq-heading">
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Get answers to common questions about Aim Tutor training programs in {cityTitle}
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

function HomePage() {
  const { country, region, city: cityParam } = useParams();
  const navigate = useNavigate();

  // ✅ Search State
  const [searchQuery, setSearchQuery] = useState('');

  const locCountry = country || localStorage.getItem("user_country") || "in";
  const locRegion = region || localStorage.getItem("user_region") || "ts";
  const locCity = cityParam || localStorage.getItem("user_city") || "Hyderabad";
  const locPrefix = `/${locCountry}/${locRegion}/${slugify(locCity)}`;

  // Convert city slug to title case
  const cityTitle = locCity.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  /* ---------------- SEO Meta Tags - ENHANCED ---------------- */
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://aimtutor.co';
  const pageTitle = `Best Technology Training Institute in ${cityTitle} | AI, Cloud, Data Science | Aim Tutor`;
  const pageDescription = `🚀 Transform your career with Aim Tutor! ⭐ #1 rated tech training in ${cityTitle} ✅ AI, Cloud, Data Science courses ✅ Expert instructors ✅ 100% placement assistance ✅ Hands-on learning. Enroll now!`;
  const canonicalUrl = `${siteUrl}${locPrefix}`;
  const ogImageUrl = `${siteUrl}/images/og/aim-technologies-training-${slugify(cityTitle)}.jpg`;

  const keywords = [
    `technology training ${cityTitle}`,
    `AI training ${cityTitle}`,
    `cloud computing courses ${cityTitle}`,
    `data science training ${cityTitle}`,
    `best IT institute ${cityTitle}`,
    `machine learning courses`,
    `DevOps training`,
    `software training institute`,
    `programming courses ${cityTitle}`,
    `professional development`,
    'Aim Tutor',
    'hands-on learning',
    'placement assistance',
    'expert instructors',
    'industry certification',
    'corporate training'
  ].join(', ');

  // ✅ Handle Search Submit
  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery) {
      navigate(`${locPrefix}/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  // ✅ Handle Enter Key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  useEffect(() => {
    // Wait for next tick to ensure react-head has updated DOM
    const timer = setTimeout(() => {
      window.prerenderReady = true;
      if (import.meta.env.DEV) {
        console.log('✅ prerenderReady = true');
      }
    }, 500); // Give react-head time to inject tags

    return () => clearTimeout(timer);
  }, [cityTitle]); // Re-run when city changes

  return (
    <div className='font-sans text-text-body leading-relaxed overflow-x-hidden bg-white antialiased'>

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
        <Meta property="og:image:alt" content={`Aim Tutor - Best Technology Training Institute in ${cityTitle}`} />
        <Meta property="og:video" content={`${siteUrl}/videos/aim-training-overview.mp4`} />

        {/* Twitter Card Tags */}
        <Meta name="twitter:card" content="summary_large_image" />
        <Meta name="twitter:site" content="@aimtutor" />
        <Meta name="twitter:title" content={pageTitle} />
        <Meta name="twitter:description" content={pageDescription} />
        <Meta name="twitter:image" content={ogImageUrl} />
        <Meta name="twitter:image:alt" content={`Technology Training in ${cityTitle}`} />

        {/* Canonical & Alternative URLs */}
        <HeadLink rel="canonical" href={canonicalUrl} />
        <HeadLink rel="alternate" hrefLang="en-in" href={canonicalUrl} />
        <HeadLink rel="alternate" hrefLang="en" href={canonicalUrl} />

        {/* Performance & Security */}
        <HeadLink rel="preconnect" href="https://fonts.googleapis.com" />
        <HeadLink rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <HeadLink rel="dns-prefetch" href="//www.google-analytics.com" />
        <HeadLink rel="dns-prefetch" href="//www.googletagmanager.com" />

        {/* Additional Meta */}
        <Meta name="format-detection" content="telephone=yes" />
        <Meta name="theme-color" content="#3B82F6" />
        <Meta httpEquiv="content-language" content="en-IN" />
        <Meta name="application-name" content="Aim Tutor" />
        <Meta name="apple-mobile-web-app-title" content="Aim Tutor" />
        <Meta name="apple-mobile-web-app-capable" content="yes" />
        <Meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Business/Local SEO */}
        <Meta name="business:contact_data:street_address" content="Tech Park, HITEC City" />
        <Meta name="business:contact_data:locality" content={cityTitle} />
        <Meta name="business:contact_data:region" content="Telangana" />
        <Meta name="business:contact_data:postal_code" content="500081" />
        <Meta name="business:contact_data:country_name" content="India" />
        <Meta name="business:contact_data:phone_number" content="+91-9876543210" />
        <Meta name="business:contact_data:email" content="info@aimtutor.co" />
      </>

      {/* ============================================
          📊 STRUCTURED DATA
      ============================================ */}
      <StructuredData cityTitle={cityTitle} locPrefix={locPrefix} />

      {/* ============================================
          🎯 ENHANCED HERO SECTION WITH SEMANTIC HTML
      ============================================ */}
      <header className="relative h-screen min-h-[600px] md:min-h-[700px] text-white overflow-hidden flex flex-col">

        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
          aria-label="Aim Tutor training showcase video"
          title="Aim Tutor - Transform your career with cutting-edge technology training"
          loading="lazy"
          preload="metadata"
        >
          {/* <source src={aim} type="video/webm; codecs=vp9" /> */}
          <source src={aim} type="video/mp4" />
          <track kind="captions" srcLang="en" label="English captions" />
        </video>

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/95 md:from-slate-900/70 md:via-slate-900/50 md:to-slate-900/90" aria-hidden="true"></div>

        {/* Main Content - RESPONSIVE */}
        <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pb-20 md:pb-35 text-center max-w-7xl mx-auto w-full relative z-10">

          {/* Location Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-white/20">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Now Available in {cityTitle}</span>
          </div>

          {/* Hero Title - RESPONSIVE & SEO OPTIMIZED */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-4 sm:mb-6 leading-tight max-w-4xl tracking-tight">
            Transform Your Career with
            <span className="block text-orange-400 
             bg-clip-text bg-gradient-to-r from-primary to-cyan-500 mt-2 
             tracking-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              Aim Tutor
            </span>
          </h1>

          {/* Hero Description - RESPONSIVE */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed font-light tracking-wide px-4 sm:px-0">
            Master cutting-edge technologies with expert-led courses designed for industry leaders in {cityTitle}
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-8 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-400" />
              <span>4.8★ Rated Institute</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-green-400" />
              <span>50,000+ Alumni</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>500+ Hiring Partners</span>
            </div>
          </div>

        </main>

        {/* Bottom Search & CTA - RESPONSIVE */}
        <section className="absolute bottom-0 left-0 right-0 py-6 sm:py-8 md:py-10 lg:py-38 bg-gradient-to-t from-slate-900/95 via-slate-900/80 to-transparent z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-4 sm:gap-6">

              {/* ✅ ENHANCED SEARCH BAR WITH SCHEMA */}
              <div className="w-full max-w-3xl" itemScope itemType="https://schema.org/WebSite">
                <meta itemProp="url" content={siteUrl} />
                <form
                  onSubmit={handleSearch}
                  itemProp="potentialAction"
                  itemScope
                  itemType="https://schema.org/SearchAction"
                  role="search"
                  aria-label="Search for courses and training programs"
                >
                  <meta itemProp="target" content={`${siteUrl}/search?q={search_term_string}`} />
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Search for courses, certifications, or skills..."
                      className="w-full py-4 px-5 pr-14 sm:py-5 sm:px-7 sm:pr-36 
                         text-sm sm:text-base outline-none text-gray-900 
                         placeholder:text-gray-400 font-light tracking-wide
                         bg-white rounded-xl sm:rounded-2xl 
                         shadow-2xl border border-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-300"
                      aria-label="Search courses and training programs"
                      itemProp="query-input"
                      name="search_term_string"
                      autoComplete="off"
                    />
                    {/* Mobile: Icon only button */}
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2
                         sm:right-2 sm:top-1/2 sm:-translate-y-1/2
                         bg-gradient-to-r from-blue-500 to-cyan-500 
                         text-white rounded-lg sm:rounded-xl
                         p-3 sm:px-6 sm:py-3
                         cursor-pointer font-medium tracking-wide 
                         transition-all duration-300
                         hover:from-blue-600 hover:to-cyan-600 
                         hover:shadow-lg hover:scale-105
                         flex items-center justify-center gap-2"
                      aria-label="Search for training courses"
                    >
                      <Search className="w-5 h-5" />
                      <span className="hidden sm:inline">Search</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* CTA Buttons - RESPONSIVE */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 w-full sm:w-auto">
                <Link
                  to={`${locPrefix}/training`}
                  aria-label="Browse all technology training courses"
                  className="group px-6 py-4 sm:px-8 sm:py-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold tracking-wide shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base min-h-[44px]"
                >
                  <PlayCircle className="w-5 h-5" />
                  Browse All Courses
                </Link>

                <Link
                  to={`${locPrefix}/contact`}
                  aria-label="Book a free demo session"
                  className="group px-6 py-4 sm:px-8 sm:py-5 font-semibold tracking-wide w-full sm:w-auto text-sm sm:text-base inline-flex items-center justify-center gap-2 min-h-[44px] rounded-xl border-2 border-gray-300 hover:border-blue-500 transition-all duration-300"
                >
                  <Phone className="w-5 h-5" />
                  Book Free Demo
                </Link>
              </div>

            </div>
          </div>
        </section>
      </header>

      {/* ============================================
          📚 COURSE CATALOGUE SECTION
      ============================================ */}
      <CourseCatalogue />

      {/* ============================================
          🏢 ABOUT BRANCH SECTION  
      ============================================ */}
      <AboutBranch />

      {/* ============================================
          🤝 HIRING PARTNERS SECTION
      ============================================ */}
      <HiringPartnersSlider />

      {/* ============================================
          ❓ FAQ SECTION WITH SCHEMA
      ============================================ */}
      <FAQSection cityTitle={cityTitle} />

      {/* ============================================
          🏆 CORPORATE TRAINING CTA - ENHANCED WITH SEMANTIC HTML
      ============================================ */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden" aria-labelledby="corporate-heading">
        <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-cyan-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">

            {/* Content - RESPONSIVE */}
            <article className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                <span className="text-xs sm:text-sm font-medium tracking-wide">Trusted by 500+ Companies</span>
              </div>

              <h2 id="corporate-heading" className="text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 font-light leading-tight tracking-tight">
                Enterprise Training
                <span className="block font-semibold bg-clip-text bg-gradient-to-r from-primary to-cyan-500 mt-2 text-2xl sm:text-3xl md:text-4xl">
                  Solutions
                </span>
              </h2>

              <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 leading-relaxed font-light tracking-wide">
                Empower your workforce with customized training programs designed to meet your organization's unique needs in {cityTitle}.
              </p>

              <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10" role="list">
                {[
                  "Customized curriculum aligned with your industry",
                  "Flexible delivery: On-site, remote, or hybrid",
                  "Progress tracking & detailed analytics",
                  "Expert instructors with real-world experience",
                  "Post-training support and mentorship"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 sm:gap-3 group">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 group-hover:scale-110 transition-transform flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-sm sm:text-base text-gray-100 font-light tracking-wide">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Buttons - RESPONSIVE */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  to={`${locPrefix}/training`}
                  aria-label="Explore AI and technology training courses"
                  className="group cursor-pointer font-semibold tracking-wide w-full sm:w-auto text-sm sm:text-base px-6 py-4 min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center justify-center gap-2"
                >
                  Get Ready For AI
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to={`${locPrefix}/contact`}
                  aria-label="Make an enquiry for corporate training"
                  className="cursor-pointer font-semibold tracking-wide w-full sm:w-auto 
                  text-sm sm:text-base px-6 py-4 min-h-[44px] rounded-xl border-2
                   border-gray-300 hover:border-blue-500 
                    transition-all duration-300 inline-flex items-center justify-center gap-2"
                >
                  Make an Enquiry
                </Link>
              </div>

            </article>

            {/* Enhanced Stats Grid with Schema - RESPONSIVE */}
            <aside className="relative order-1 lg:order-2" itemScope itemType="https://schema.org/EducationalOrganization">
              <div className="relative bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-sm border border-white/10">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  {[
                    { number: '500+', label: 'Enterprise Clients', schema: 'numberOfEmployees' },
                    { number: '50K+', label: 'Employees Trained', schema: 'alumni' },
                    { number: '98%', label: 'Satisfaction Rate', schema: 'aggregateRating' },
                    { number: '24/7', label: 'Support Available', schema: 'serviceType' }
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-white/20 hover:bg-white/15 transition-colors"
                      itemProp={stat.schema}
                    >
                      <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-1 sm:mb-2 tracking-tight">{stat.number}</div>
                      <div className="text-xs sm:text-sm text-gray-300 font-light tracking-wide">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;