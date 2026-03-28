// src/pages/TrainingPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Title, Meta, Link as HeadLink } from "react-head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../utils/api";
import { buildCategoryCitySeo, slugify } from "../utils/seoSlug";
import {
  Cloud, Brain, Code, Shield, GitBranch, Globe,
  Smartphone, Briefcase, Database, Network, TestTube,
  Users, Search, Filter, ArrowRight, Sparkles,
  Cpu, Layers, BarChart, Zap, BookOpen, Award,
  Loader2, AlertCircle, TrendingUp, MessageSquare,
  CheckCircle2, GraduationCap, Clock, Star,
  Building2, MapPin, Phone
} from "lucide-react";

/* ============================================
   STRUCTURED DATA COMPONENTS
============================================ */

const StructuredData = ({ categories, cityTitle, locPrefix, totalStats }) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://aimtutor.co';

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Aim Tutor",
    "alternateName": "AIM Tech Training Institute",
    "url": siteUrl,
    "image": `${siteUrl}/images/aim-technologies-training-courses.jpg`,
    "description": `Leading technology training institute in ${cityTitle} offering ${totalStats.totalCourses}+ expert-led courses across ${totalStats.totalCategories} categories including AI, Cloud Computing, Data Science, and more.`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Tech Park, HITEC City",
      "addressLocality": cityTitle,
      "addressRegion": "Telangana",
      "postalCode": "500081",
      "addressCountry": "IN"
    },
    "areaServed": {
      "@type": "Place",
      "name": cityTitle
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Technology Training Courses",
      "itemListElement": categories.slice(0, 10).map(category => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Course",
          "name": `${category.title} Training`,
          "description": category.description,
          "provider": {
            "@type": "EducationalOrganization",
            "name": "Aim Tutor"
          }
        }
      }))
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "2500"
    }
  };

  // Course List Schema
  const courseListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Technology Training Courses in ${cityTitle}`,
    "description": `Comprehensive list of technology training programs offered by Aim Tutor in ${cityTitle}`,
    "numberOfItems": categories.length,
    "itemListElement": categories.map((category, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Course",
        "name": `${category.title} Training`,
        "description": category.description,
        "provider": {
          "@type": "EducationalOrganization",
          "name": "Aim Tutor"
        },
        "courseMode": "blended",
        "educationalLevel": "All Levels",
        "url": `${siteUrl}${category.link}`
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
        "name": "Training Courses",
        "item": `${siteUrl}${locPrefix}/training`
      }
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
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(courseListSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
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
const FAQSection = ({ cityTitle, totalStats }) => {
  const faqs = [
    {
      question: `What training courses are available at Aim Tutor in ${cityTitle}?`,
      answer: `Aim Tutor offers ${totalStats.totalCourses}+ technology training courses across ${totalStats.totalCategories} categories including Artificial Intelligence, Machine Learning, Cloud Computing, Data Science, Cybersecurity, Web Development, DevOps, and more. All courses feature expert instructors and hands-on learning.`
    },
    {
      question: `Are the training courses available online and offline in ${cityTitle}?`,
      answer: `Yes, we offer flexible learning modes including online live training, offline classroom training, and hybrid programs. Our online sessions are interactive with live instructors, while offline classes are conducted at our state-of-the-art facility in ${cityTitle}.`
    },
    {
      question: `What is the duration and fee structure for training courses?`,
      answer: `Course duration varies from 2-6 months depending on the program complexity. We offer flexible payment options including installments and early bird discounts. Contact our counselors for detailed fee structure and current offers for specific courses.`
    },
    {
      question: `Do you provide placement assistance after course completion?`,
      answer: `Absolutely! Aim Tutor has a dedicated placement cell with partnerships with 500+ companies. We provide comprehensive placement support including resume building, interview preparation, mock interviews, and direct job referrals with competitive salary packages.`
    },
    {
      question: `What are the prerequisites for joining technology training courses?`,
      answer: `Prerequisites vary by course and level. Beginner courses typically require only basic computer literacy, while advanced programs may need specific technical background. Our counselors help you choose the right program based on your current skills and career goals.`
    },
    {
      question: `Are industry certifications provided after training completion?`,
      answer: `Yes, you receive industry-recognized certificates upon successful completion of our training programs. We also help you prepare for additional vendor certifications like AWS, Microsoft Azure, Google Cloud, and other professional certifications.`
    },
    {
      question: `Can I get customized corporate training for my organization?`,
      answer: `Yes! We provide tailored corporate training solutions for organizations. Our enterprise training includes customized curriculum, flexible delivery options, progress tracking, and ongoing support to meet your specific business objectives.`
    },
    {
      question: `What makes Aim Tutor different from other training institutes?`,
      answer: `Aim Tutor stands out with expert instructors having 10+ years industry experience, small batch sizes, 100% hands-on learning, real-world projects, latest curriculum, comprehensive placement assistance, and ${totalStats.successRate} success rate.`
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
    <section className="py-20 bg-gray-50" aria-labelledby="faq-heading">
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Got Questions?</span>
          </div>
          <h2 id="faq-heading" className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Questions
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Get answers to common questions about our training programs and services
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

// ✅ Category Configuration (Icons & Colors)
const categoryConfig = {
  'Cloud Computing': {
    icon: Cloud,
    color: "from-sky-400 to-blue-600",
    bgColor: "bg-sky-50",
  },
  'Data Science': {
    icon: Brain,
    color: "from-purple-400 to-pink-600",
    bgColor: "bg-purple-50",
  },
  'Web Development': {
    icon: Code,
    color: "from-green-400 to-emerald-600",
    bgColor: "bg-green-50",
  },
  'Cybersecurity': {
    icon: Shield,
    color: "from-red-400 to-orange-600",
    bgColor: "bg-red-50",
  },
  'Artificial Intelligence': {
    icon: Brain,
    color: "from-purple-400 to-pink-600",
    bgColor: "bg-purple-50",
  },
  'DevOps & Automation': {
    icon: GitBranch,
    color: "from-indigo-400 to-blue-600",
    bgColor: "bg-indigo-50",
  },
  'Blockchain & Web3': {
    icon: Cpu,
    color: "from-violet-400 to-purple-600",
    bgColor: "bg-violet-50",
  },
  'Mobile App Development': {
    icon: Smartphone,
    color: "from-violet-400 to-purple-600",
    bgColor: "bg-violet-50",
  },
  'Database Technologies': {
    icon: Database,
    color: "from-teal-400 to-green-600",
    bgColor: "bg-teal-50",
  },
  'Software Engineering & Testing': {
    icon: TestTube,
    color: "from-pink-400 to-rose-600",
    bgColor: "bg-pink-50",
  },
  'Business & Management': {
    icon: Briefcase,
    color: "from-amber-400 to-orange-600",
    bgColor: "bg-amber-50",
  },
  'Networking': {
    icon: Network,
    color: "from-blue-400 to-indigo-600",
    bgColor: "bg-blue-50",
  },
};

const TrainingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isVisible, setIsVisible] = useState(false);
  
  // ✅ API State
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Get Location Context
  const { country, region, city } = useParams();
  const locCountry = country || localStorage.getItem("user_country") || "in";
  const locRegion = region || localStorage.getItem("user_region") || "ts";
  const locCity = city || localStorage.getItem("user_city") || "Hyderabad";
  const locPrefix = `/${locCountry}/${locRegion}/${slugify(locCity)}`;
  const cityForHeading = slugify(locCity);

  // Convert city to title case
  const cityTitle = locCity.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  // ✅ Fetch Categories from API
  useEffect(() => {
    fetchCategories();
    setIsVisible(true);
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch master categories with subcategories
      const response = await api.post('/api/v1/public/get-mastercategories?subcategories=all');
      
      const categoriesData = response.data.categories || [];

      // Transform API data to match component structure
      const transformedCategories = categoriesData.map(category => {
        const config = categoryConfig[category.name] || {
          icon: BookOpen,
          color: "from-gray-400 to-slate-600",
          bgColor: "bg-gray-50",
        };

        // Calculate total courses across all subcategories
        const totalCourses = (category.subcategories || []).length;

        return {
          id: category.id,
          title: category.name,
          description: `Explore ${category.subcategories?.length || 0} specialized ${category.name.toLowerCase()} training programs with expert instructors`,
          link: `${locPrefix}/training/${category.id}/${buildCategoryCitySeo(category.name, cityForHeading)}`,
          icon: config.icon,
          color: config.color,
          bgColor: config.bgColor,
          students: "Coming Soon", // Can be added to API later
          courses: category.subcategories?.length || 0,
          subcategories: category.subcategories || []
        };
      });

      setCategories(transformedCategories);

    } catch (err) {
      console.error("❌ API Error:", err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch training categories');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filter Categories
  const filteredCategories = categories.filter(cat =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Calculate Total Stats
  const totalStats = {
    totalCourses: categories.reduce((sum, cat) => sum + cat.courses, 0),
    totalCategories: categories.length,
    totalStudents: "50K+", // Mock data - can be added to API
    successRate: "95%"
  };

  /* ---------------- SEO Meta Tags - ENHANCED ---------------- */
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://aimtutor.co';
  const pageTitle = `Best Technology Training Courses in ${cityTitle} | ${totalStats.totalCategories} Categories | Aim Tutor`;
  const pageDescription = `🚀 Explore ${totalStats.totalCourses}+ technology training courses in ${cityTitle}! ⭐ AI, Cloud, Data Science, Web Development ✅ Expert instructors ✅ Hands-on learning ✅ Placement assistance ✅ Industry certifications. Enroll now!`;
  const canonicalUrl = `${siteUrl}${locPrefix}/training`;
  const ogImageUrl = `${siteUrl}/images/og/aim-technologies-training-courses-${slugify(cityTitle)}.jpg`;

  const keywords = [
    `technology training courses ${cityTitle}`,
    `AI training ${cityTitle}`,
    `machine learning courses ${cityTitle}`,
    `cloud computing training ${cityTitle}`,
    `data science courses ${cityTitle}`,
    `web development training ${cityTitle}`,
    `cybersecurity courses ${cityTitle}`,
    `DevOps training ${cityTitle}`,
    `best IT training institute ${cityTitle}`,
    `professional development courses`,
    `programming courses ${cityTitle}`,
    'Aim Tutor',
    'expert instructors',
    'hands-on learning',
    'industry certification',
    'placement assistance',
    'online training',
    'classroom training'
  ].join(', ');

  // ✅ Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Title>Loading Training Courses | Aim Tutor</Title>
        <Meta name="robots" content="noindex, nofollow" />
        
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[600px]">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Training Categories...</h3>
            <p className="text-gray-500">Please wait while we fetch the latest courses</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ✅ Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Title>Error - Training Courses | Aim Tutor</Title>
        <Meta name="robots" content="noindex, nofollow" />
        
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[600px]">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Categories</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchCategories}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      
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
        <Meta property="og:image:alt" content={`Technology Training Courses in ${cityTitle} - Aim Tutor`} />

        {/* Twitter Card Tags */}
        <Meta name="twitter:card" content="summary_large_image" />
        <Meta name="twitter:site" content="@aimtutor" />
        <Meta name="twitter:title" content={pageTitle} />
        <Meta name="twitter:description" content={pageDescription} />
        <Meta name="twitter:image" content={ogImageUrl} />
        <Meta name="twitter:image:alt" content={`Training Courses in ${cityTitle}`} />

        {/* Canonical & Alternative URLs */}
        <HeadLink rel="canonical" href={canonicalUrl} />
        <HeadLink rel="alternate" hrefLang="en-in" href={canonicalUrl} />
        <HeadLink rel="alternate" hrefLang="en" href={canonicalUrl} />

        {/* Performance & Security */}
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
        categories={categories}
        cityTitle={cityTitle}
        locPrefix={locPrefix}
        totalStats={totalStats}
      />

      <Header />

      {/* ============================================
          🎯 ENHANCED HERO SECTION WITH BREADCRUMBS
      ============================================ */}
      <header className="pt-20 lg:pt-24 pb-16 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-70" aria-hidden="true" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" aria-hidden="true" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" aria-hidden="true" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" aria-hidden="true" />

        <div className="container mx-auto px-4 relative z-10">
          {/* ✅ SEO-Optimized Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-gray-600">
              <li>
                <Link 
                  to={locPrefix} 
                  className="hover:text-blue-600 transition-colors font-medium"
                  aria-label="Home - Aim Tutor"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li>
                <span className="text-gray-900 font-semibold" aria-current="page">Training Courses</span>
              </li>
            </ol>
          </nav>

          <div className={`text-center transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  {totalStats.totalCourses}+ Expert-Led Programs
                </span>
              </div>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Technology Training Courses in {cityTitle}
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Master the skills that matter most in today's tech industry. Choose from {totalStats.totalCategories} comprehensive categories
              of professional training courses designed by industry experts with hands-on learning approach.
            </p>

            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative group">
                <label htmlFor="course-search" className="sr-only">Search for courses, topics, or skills</label>
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="course-search"
                  type="text"
                  placeholder="Search for courses, topics, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none focus:shadow-lg transition-all duration-300 text-lg"
                  aria-describedby="search-help"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-300 transition-all duration-200"
                    aria-label="Clear search"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Enhanced Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl shadow-md">
                <p className="text-3xl font-bold text-gray-900">{totalStats.totalStudents}</p>
                <p className="text-gray-600">Active Students</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl shadow-md">
                <p className="text-3xl font-bold text-gray-900">{totalStats.totalCourses}+</p>
                <p className="text-gray-600">Expert Courses</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl shadow-md">
                <p className="text-3xl font-bold text-gray-900">{totalStats.totalCategories}</p>
                <p className="text-gray-600">Categories</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl shadow-md">
                <p className="text-3xl font-bold text-gray-900">{totalStats.successRate}</p>
                <p className="text-gray-600">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================
          🔍 ENHANCED FILTER SECTION
      ============================================ */}
      <section className="sticky top-20 z-30 bg-white/95 backdrop-blur-md shadow-sm" aria-labelledby="filter-heading">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 overflow-x-auto">
              <button
                onClick={() => setSelectedFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                aria-pressed={selectedFilter === "all"}
              >
                All Categories ({categories.length})
              </button>
            </div>
            <div className="text-sm text-gray-600" aria-live="polite">
              {filteredCategories.length} result{filteredCategories.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          📚 ENHANCED CATEGORIES GRID
      ============================================ */}
      <main className="container mx-auto px-4 py-12" aria-labelledby="courses-heading">
        <h2 id="courses-heading" className="sr-only">Training Course Categories</h2>
        
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16" role="status" aria-live="polite">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No categories found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search query or browse all categories</p>
            <button 
              onClick={() => setSearchQuery("")}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <article
                  key={cat.id}
                  className={`group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl 
                    transition-all duration-300 transform hover:-translate-y-2 overflow-hidden 
                    animate-fade-in-up`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} aria-hidden="true" />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-14 h-14 ${cat.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`} aria-hidden="true">
                      <Icon className={`w-7 h-7 bg-gradient-to-r ${cat.color} bg-clip-text text-transparent`} />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                      {cat.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {cat.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-gray-500">
                          <BookOpen className="w-4 h-4 mr-1" />
                          <span>{cat.courses} programs</span>
                        </div>
                      </div>
                    </div>

                    {/* CTA Link */}
                    <Link
                      to={cat.link}
                      className="flex items-center text-blue-600 font-medium group-hover:text-purple-600 transition-colors"
                      aria-label={`Explore ${cat.title} training programs`}
                    >
                      <span>Explore Programs</span>
                      <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" aria-hidden="true" />
                  <div className="absolute -top-2 -left-2 w-16 h-16 bg-gradient-to-br from-pink-100 to-yellow-100 rounded-full opacity-30 group-hover:scale-150 transition-transform duration-500" aria-hidden="true" />
                </article>
              );
            })}
          </div>
        )}

        {/* Refresh Button */}
        <div className="text-center mt-12">
          <button 
            onClick={fetchCategories}
            className="group inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-full font-medium border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            aria-label="Refresh training categories"
          >
            <span>Refresh Categories</span>
            <Zap className="w-4 h-4 ml-2 group-hover:animate-pulse" />
          </button>
        </div>
      </main>

      {/* ============================================
          ❓ FAQ SECTION WITH SCHEMA
      ============================================ */}
      <FAQSection cityTitle={cityTitle} totalStats={totalStats} />

      {/* ============================================
          🎯 ENHANCED CTA SECTION
      ============================================ */}
      <section className="py-16 relative overflow-hidden" aria-labelledby="cta-heading">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90" aria-hidden="true" />
        <div className="absolute inset-0 bg-pattern opacity-10" aria-hidden="true" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <Award className="w-16 h-16 mx-auto mb-6 animate-bounce-slow" aria-hidden="true" />
            <h2 id="cta-heading" className="text-3xl lg:text-4xl font-bold mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Contact our expert training advisors for personalized course recommendations
              tailored to your career goals and industry requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={`${locPrefix}/contact`}
                className="bg-white text-blue-600 px-8 py-3 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                aria-label="Talk to a training advisor"
              >
                Talk to an Advisor
              </Link>
              <Link 
                to={`${locPrefix}/contact`}
                className="bg-transparent text-white border-2 border-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-blue-600 transition-all duration-200"
                aria-label="Request custom training program"
              >
                Request Custom Training
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default TrainingPage;