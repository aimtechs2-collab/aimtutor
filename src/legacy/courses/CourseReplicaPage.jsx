import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Title, Meta, Link as HeadLink } from "react-head";
import {
  buildCourseCitySeo,
  slugify,
  parseSeoSlug
} from "../utils/seoSlug";
import api from "../utils/api";
import EnrollmentForm from "./EnrollmentForm.jsx";

/* ============================================
   HELPER FUNCTIONS
============================================ */

const toTitle = (s) =>
  (s || "")
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");

/* ============================================
   STRUCTURED DATA COMPONENTS (unchanged)
============================================ */

const StructuredData = ({
  courseData,
  cityTitle,
  locPrefix,
  mastercategoryid,
  categoryCitySeo,
  subcategoryid,
  subcategoryCitySeo,
  courseId,
  averageRating,
  totalRatings,
  totalLessons,
  totalHours,
  totalMinutes,
  modules
}) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://aimtutor.co';
  const canonicalUrl = `${siteUrl}${locPrefix}/training/${mastercategoryid}/${categoryCitySeo}/${subcategoryid}/${subcategoryCitySeo}/${courseId}/${buildCourseCitySeo(courseData.title, cityTitle.toLowerCase())}`;

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": courseData.title,
    "description": courseData.short_description || courseData.description || `Learn ${courseData.title} with hands-on training`,
    "url": canonicalUrl,
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Aim Tutor",
      "url": siteUrl,
    },
    "educationalLevel": courseData.difficulty_level || "All Levels",
    "timeRequired": `PT${courseData.duration_hours || 24}H`,
    "numberOfCredits": totalLessons,
    "courseMode": "blended",
    "availableLanguage": "en",
    "inLanguage": "en",
    "isAccessibleForFree": courseData.price === 0 || !courseData.price,
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": `PT${courseData.duration_hours || 24}H`,
    },
    "offers": {
      "@type": "Offer",
      "price": courseData.price || 0,
      "priceCurrency": courseData.currency || "INR",
      "availability": "https://schema.org/InStock",
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": averageRating.toString(),
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": totalRatings.toString(),
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${siteUrl}${locPrefix}` },
      { "@type": "ListItem", "position": 2, "name": "Training", "item": `${siteUrl}${locPrefix}/training` },
      { "@type": "ListItem", "position": 3, "name": courseData.title, "item": canonicalUrl }
    ]
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(courseSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
    </>
  );
};

const FAQSchema = ({ faqs, courseTitle }) => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a }
    }))
  };
  return <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>;
};

const ReviewSchema = ({ reviews, courseTitle, averageRating, totalRatings }) => {
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": courseTitle,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": averageRating.toString(),
      "bestRating": "5",
      "ratingCount": totalRatings.toString(),
    },
    "review": reviews.map(review => ({
      "@type": "Review",
      "author": { "@type": "Person", "name": review.user },
      "reviewRating": { "@type": "Rating", "ratingValue": review.rating.toString(), "bestRating": "5" },
      "reviewBody": review.text
    }))
  };
  return <script type="application/ld+json">{JSON.stringify(reviewSchema)}</script>;
};

/* ============================================
   UI COMPONENTS - RESPONSIVE UPDATES
============================================ */

function StarRow({ value, showNumber = true, size = "sm" }) {
  const whole = Math.round(value);
  const sizeClasses = {
    sm: "text-xs sm:text-sm",
    md: "text-sm sm:text-base",
    lg: "text-base sm:text-lg"
  };
  return (
    <div className="flex items-center gap-0.5 sm:gap-1" aria-label={`Rating ${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`material-icons ${sizeClasses[size]} ${i < whole ? "text-yellow-500" : "text-gray-300"}`}
        >
          star
        </span>
      ))}
      {showNumber && (
        <span className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}

function SectionHeading({ children, level = 2 }) {
  const Tag = `h${level}`;
  const classes = {
    1: "text-2xl sm:text-3xl font-bold",
    2: "text-xl sm:text-2xl font-bold",
    3: "text-lg sm:text-xl font-semibold",
  };
  return <Tag className={classes[level] || classes[2]}>{children}</Tag>;
}

function Divider() {
  return <hr className="my-6 sm:my-8 border-gray-200" />;
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function AccordionItem({ id, title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        id={`${id}-button`}
        aria-controls={`${id}-panel`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-sm sm:text-base lg:text-lg pr-2">{title}</span>
        <span className={`material-icons transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : "rotate-0"}`}>
          expand_more
        </span>
      </button>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        className={`transition-all duration-300 ease-in-out ${open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
      >
        <div className="p-4 sm:p-6 pt-0 bg-gray-50">{children}</div>
      </div>
    </div>
  );
}

/* ============================================
   LOADING & ERROR COMPONENTS
============================================ */

const LoadingSpinner = ({ cityTitle }) => (
  <div className="min-h-screen bg-gray-50">
    <Title>Loading Course | Aim Tutor</Title>
    <Meta name="robots" content="noindex, nofollow" />
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-violet-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium text-base sm:text-lg">
          Loading course details{cityTitle ? ` for ${cityTitle}` : ''}...
        </p>
      </div>
    </div>
  </div>
);

const ErrorDisplay = ({ message, onRetry }) => (
  <div className="min-h-screen bg-gray-50">
    <Title>Error | Aim Tutor</Title>
    <Meta name="robots" content="noindex, nofollow" />
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="text-center max-w-md">
        <div className="bg-red-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">Oops!</h2>
        <p className="text-red-600 mb-4 sm:mb-6 text-base sm:text-lg">{message}</p>
        <button
          onClick={onRetry}
          className="px-6 sm:px-8 py-2.5 sm:py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
);

const NotFound = ({ message }) => (
  <div className="min-h-screen bg-gray-50">
    <Title>404 - Not Found | Aim Tutor</Title>
    <Meta name="robots" content="noindex, follow" />
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="text-center">
        <h1 className="text-6xl sm:text-8xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-xl sm:text-2xl text-gray-600 mb-4 sm:mb-6">{message}</h2>
        <Link to="/" className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold transition-colors">
          Go Home
        </Link>
      </div>
    </div>
  </div>
);

/* ============================================
   MOBILE ENROLLMENT BAR COMPONENT
============================================ */

const MobileEnrollmentBar = ({ price, courseCurrency, courseId }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-3 sm:p-4 z-50 lg:hidden shadow-lg">
      <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
        <div>
          <div className="text-lg sm:text-xl font-bold text-gray-900">
            {price ? `${courseCurrency || '₹'}${price.toLocaleString()}` : 'Free'}
          </div>
          {price > 0 && (
            <div className="text-xs text-gray-500 line-through">
              {courseCurrency || '₹'}{Math.round(price * 1.5).toLocaleString()}
            </div>
          )}
        </div>
        <button
          onClick={() => document.getElementById('enrollment-form')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex-1 max-w-xs bg-violet-600 hover:bg-violet-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base"
        >
          Enroll Now
        </button>
      </div>
    </div>
  );
};

/* ============================================
   RESPONSIVE BREADCRUMB COMPONENT
============================================ */

const ResponsiveBreadcrumb = ({ locPrefix, mastercategoryid, categoryCitySeo, subcategoryid, subcategoryCitySeo, title, categoryName, subcategoryName }) => {
  const [showFull, setShowFull] = useState(false);

  return (
    <nav className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6 lg:mb-8" aria-label="Breadcrumb">
      {/* Mobile Breadcrumb - Collapsed */}
      <div className="flex items-center gap-1 sm:gap-2 md:hidden flex-wrap">
        <Link to={locPrefix} className="hover:text-white transition-colors">Home</Link>
        <span className="text-gray-500">›</span>

        {!showFull ? (
          <>
            <button
              onClick={() => setShowFull(true)}
              className="text-gray-400 hover:text-white"
            >
              ...
            </button>
            <span className="text-gray-500">›</span>
          </>
        ) : (
          <>
            <Link to={`${locPrefix}/training`} className="hover:text-white transition-colors">Training</Link>
            <span className="text-gray-500">›</span>
            <Link
              to={`${locPrefix}/training/${mastercategoryid}/${categoryCitySeo}`}
              className="hover:text-white transition-colors truncate max-w-[80px]"
            >
              {categoryName}
            </Link>
            <span className="text-gray-500">›</span>
          </>
        )}
        <span className="text-white font-medium truncate max-w-[120px]">{title}</span>
      </div>

      {/* Desktop Breadcrumb - Full */}
      <div className="hidden md:flex items-center gap-2 flex-wrap">
        <Link to={locPrefix} className="hover:text-white transition-colors">Home</Link>
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link to={`${locPrefix}/training`} className="hover:text-white transition-colors">Training</Link>
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link
          to={`${locPrefix}/training/${mastercategoryid}/${categoryCitySeo}`}
          className="hover:text-white transition-colors max-w-[150px] lg:max-w-xs truncate"
          title={categoryName}
        >
          {categoryName}
        </Link>
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link
          to={`${locPrefix}/training/${mastercategoryid}/${categoryCitySeo}/${subcategoryid}/${subcategoryCitySeo}`}
          className="hover:text-white transition-colors max-w-[150px] lg:max-w-xs truncate"
          title={subcategoryName}
        >
          {subcategoryName}
        </Link>
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-white font-medium truncate max-w-[200px]">{title}</span>
      </div>
    </nav>
  );
};

/* ============================================
   HARDCODED DATA
============================================ */

const HARDCODED_REVIEWS = [
  { user: "Amelia Chen", rating: 5, date: "2 days ago", text: "Absolutely fantastic course! The structure is perfect—each module builds on the last. I went from zero knowledge to building my own applications in 6 weeks." },
  { user: "Ravi Patel", rating: 5, date: "1 week ago", text: "Best course I've taken. Good pace, excellent projects. Already applied these skills in my job and got a promotion!" },
  { user: "Sofia Rodriguez", rating: 4, date: "2 weeks ago", text: "Really comprehensive course. Covers everything from basics to advanced topics. Exceptional value." },
  { user: "James Wilson", rating: 5, date: "3 weeks ago", text: "This course is a game-changer. Clear explanations, practical labs, and real-world applications. Highly recommend!" },
  { user: "Yuki Tanaka", rating: 5, date: "1 month ago", text: "Exactly what I needed to advance my career. The support and community are great bonuses. Worth every penny." },
  { user: "Mohammed Al-Said", rating: 4, date: "1 month ago", text: "Very well structured and comprehensive. Great investment in my career." },
];

const HARDCODED_FAQS = [
  { q: "What are the technical requirements?", a: "A standard laptop or desktop with internet connection. All tools are free and open-source." },
  { q: "Is there a certificate?", a: "Yes, you'll receive a verified certificate of completion for LinkedIn and resume." },
  { q: "How long do I have access?", a: "Lifetime access to all materials, including future updates." },
  { q: "What if I don't have programming experience?", a: "Course is designed for all levels. We start from fundamentals and build up step by step." },
];

/* ============================================
   MAIN COMPONENT
============================================ */

export default function CourseReplicaPage() {
  const {
    country, region, city,
    mastercategoryid, categoryCitySeo,
    subcategoryid, subcategoryCitySeo,
    courseId, courseCitySeo
  } = useParams();

  const navigate = useNavigate();

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(3);

  const locCountry = country || localStorage.getItem("user_country") || "in";
  const locRegion = region || localStorage.getItem("user_region") || "ts";
  const locCity = city || localStorage.getItem("user_city") || "Hyderabad";
  const locPrefix = `/${locCountry}/${locRegion}/${slugify(locCity)}`;

  const parsedSeo = parseSeoSlug(subcategoryCitySeo);
  const cityForHeading = parsedSeo?.city || slugify(locCity);
  const cityTitle = toTitle(cityForHeading);

  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://aimtutor.co';
  const staticUrl = import.meta.env.VITE_STATIC_URL || 'https://aifa-cloud.onrender.com/static/uploads/';

  const getStaticUrl = (path) => {
    if (!path) return null;
    const cleanPath = path.replace(/\\/g, '/').replace(/^\/+/, '');
    return `${staticUrl}${cleanPath}`;
  };

  useEffect(() => {
    if (!courseId) {
      setError("Invalid course URL - missing course ID");
      setLoading(false);
      return;
    }

    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.post(`/api/v1/public/get-courses/${courseId}?lessons=True`);
        const course = response.data.course;
        if (!course || !course.title) throw new Error("Invalid response structure");
        setCourseData(course);
      } catch (err) {
        console.error("❌ API Error:", err);
        if (err.response?.status === 404) setError("Course not found");
        else if (err.response?.status === 500) setError("Server error - please try again later");
        else setError(err.message || "Failed to load course data");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  if (loading) return <LoadingSpinner cityTitle={cityTitle} />;
  if (error) return <ErrorDisplay message={error} onRetry={() => window.location.reload()} />;
  if (!courseData) return <NotFound message="Course not found" />;

  const {
    title, short_description, description, thumbnail,
    duration_hours, difficulty_level, price,
    currency: courseCurrency, prerequisites,
    prerequisites_courses = [], learning_outcomes,
    modules = [], max_students, status
  } = courseData;

  const previewLesson = modules.flatMap(mod => mod.lessons || []).find(lesson => lesson.video_url);
  const totalLessons = modules.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0);
  const totalDuration = modules.reduce((acc, mod) => {
    const modDuration = (mod.lessons || []).reduce((sum, lesson) => sum + (lesson.duration_minutes || 0), 0);
    return acc + modDuration;
  }, 0);
  const totalHours = Math.floor(totalDuration / 60);
  const totalMinutes = totalDuration % 60;

  const averageRating = 4.6;
  const totalRatings = 10906;

  const pageTitle = `${title} Course in ${cityTitle} ⭐ ${averageRating}/5 | Aim Tutor`;
  const pageDescription = `★ Master ${title} in ${cityTitle}! 🚀 ${averageRating}/5 rating from ${totalRatings.toLocaleString()}+ students ✅ ${totalLessons} lessons ✅ ${duration_hours || totalHours}+ hours. Enroll today!`;
  const canonicalUrl = `${siteUrl}${locPrefix}/training/${mastercategoryid}/${categoryCitySeo}/${subcategoryid}/${subcategoryCitySeo}/${courseId}/${buildCourseCitySeo(title, cityForHeading)}`;
  const categoryName = toTitle(categoryCitySeo.split('-training-')[0]);
  const subcategoryName = toTitle(subcategoryCitySeo.split('-training-')[0]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

      {/* SEO Head Tags */}
      <>
        <Title>{pageTitle}</Title>
        <Meta name="description" content={pageDescription} />
        <Meta name="robots" content="index, follow" />
        <Meta property="og:title" content={pageTitle} />
        <Meta property="og:description" content={pageDescription} />
        <Meta property="og:type" content="website" />
        <Meta property="og:url" content={canonicalUrl} />
        <Meta name="twitter:card" content="summary_large_image" />
        <Meta name="twitter:title" content={pageTitle} />
        <HeadLink rel="canonical" href={canonicalUrl} />
        <Meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </>

      {/* Structured Data */}
      <StructuredData
        courseData={courseData} cityTitle={cityTitle} locPrefix={locPrefix}
        mastercategoryid={mastercategoryid} categoryCitySeo={categoryCitySeo}
        subcategoryid={subcategoryid} subcategoryCitySeo={subcategoryCitySeo}
        courseId={courseId} averageRating={averageRating} totalRatings={totalRatings}
        totalLessons={totalLessons} totalHours={totalHours} totalMinutes={totalMinutes}
        modules={modules}
      />
      <FAQSchema faqs={HARDCODED_FAQS} courseTitle={title} />
      <ReviewSchema reviews={HARDCODED_REVIEWS} courseTitle={title} averageRating={averageRating} totalRatings={totalRatings} />

      {/* ============================================
          RESPONSIVE HEADER
      ============================================ */}
      <header className="border-b sticky top-0 bg-white z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-4">
          <Link to={locPrefix} className="text-lg sm:text-xl font-bold text-violet-600">
            AIFA Training
          </Link>
          <div className="flex-1"></div>
          <nav className="hidden sm:flex items-center gap-4 sm:gap-6 text-sm font-medium">
            <Link to={`${locPrefix}/training`} className="hover:text-violet-600 transition-colors">
              Courses
            </Link>
            <Link to={`${locPrefix}/contact`} className="hover:text-violet-600 transition-colors">
              Contact
            </Link>
          </nav>
          {/* Mobile Menu Button */}
          <button className="sm:hidden p-2 hover:bg-gray-100 rounded-lg">
            <span className="material-icons">menu</span>
          </button>
        </div>
      </header>

      {/* ============================================
          RESPONSIVE HERO SECTION
      ============================================ */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 lg:py-12">

          {/* Responsive Breadcrumb */}
          <ResponsiveBreadcrumb
            locPrefix={locPrefix}
            mastercategoryid={mastercategoryid}
            categoryCitySeo={categoryCitySeo}
            subcategoryid={subcategoryid}
            subcategoryCitySeo={subcategoryCitySeo}
            title={title}
            categoryName={categoryName}
            subcategoryName={subcategoryName}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">

            {/* Left Column - Content */}
            <div className="order-2 lg:order-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6 leading-tight">
                {title}
                <span className="block text-lg sm:text-xl md:text-2xl lg:text-5xl mt-1 sm:mt-2">
                  Training in {cityTitle}
                </span>
              </h1>

              {short_description && (
                <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 text-gray-300 leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {short_description}
                </p>
              )}

              {/* Metadata - Responsive */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm mb-4 sm:mb-6">
                {difficulty_level && (
                  <span className={`px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 font-semibold rounded-full text-xs sm:text-sm ${difficulty_level === 'Beginner' ? 'bg-green-500 text-white' :
                    difficulty_level === 'Intermediate' ? 'bg-yellow-500 text-gray-900' :
                      'bg-red-500 text-white'
                    }`}>
                    {difficulty_level}
                  </span>
                )}
                <div className="flex items-center gap-1">
                  <StarRow value={averageRating} size="sm" />
                </div>
                <span className="text-gray-300 text-xs sm:text-sm">
                  ({totalRatings.toLocaleString()})
                </span>
              </div>

              {/* Course Meta - Responsive Grid */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-gray-300">
                {duration_hours && (
                  <span className="flex items-center gap-1.5 sm:gap-2">
                    <span className="material-icons text-sm sm:text-base">schedule</span>
                    <span>{duration_hours}h total</span>
                  </span>
                )}
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <span className="material-icons text-sm sm:text-base">place</span>
                  <span>{cityTitle}</span>
                </span>
                {max_students && (
                  <span className="flex items-center gap-1.5 sm:gap-2">
                    <span className="material-icons text-sm sm:text-base">people</span>
                    <span>Max {max_students}</span>
                  </span>
                )}
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <span className="material-icons text-sm sm:text-base">menu_book</span>
                  <span>{totalLessons} lessons</span>
                </span>
              </div>
            </div>

            {/* Right Column - Video/Image */}
            <div className="order-1 lg:order-2 space-y-3 sm:space-y-4 lg:space-y-5">
              <div className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-xl sm:shadow-2xl border border-gray-700 sm:border-2">
                {previewLesson && previewLesson.video_url ? (
                  <video
                    className="w-full h-auto aspect-video bg-black"
                    controls
                    preload="metadata"
                    poster={thumbnail ? getStaticUrl(thumbnail) : undefined}
                    playsInline
                  >
                    <source src={getStaticUrl(previewLesson.video_url)} type="video/mp4" />
                  </video>
                ) : thumbnail ? (
                  <img
                    src={getStaticUrl(thumbnail)}
                    alt={`${title} Course in ${cityTitle}`}
                    className="w-full h-auto aspect-video object-cover"
                    loading="eager"
                  />
                ) : (
                  <div className="w-full aspect-video bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center">
                    <span className="material-icons text-white text-4xl sm:text-5xl lg:text-6xl">play_circle_outline</span>
                  </div>
                )}
              </div>

              {/* Download Brochure Button */}
              <button
                onClick={() => console.log('Download brochure:', title)}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-gray-900 px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 group shadow-lg sm:shadow-2xl active:scale-[0.98]"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <span>Download Brochure</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================
          RESPONSIVE MAIN CONTENT
      ============================================ */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

          {/* Left Column - Course Details */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">

            {/* What You'll Learn */}
            {learning_outcomes && (
              <section className="border rounded-lg sm:rounded-xl p-4 sm:p-6 bg-blue-50 border-blue-200">
                <SectionHeading level={2}>What you'll learn</SectionHeading>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
                  {learning_outcomes.split('\n').filter(Boolean).map((item, i) => (
                    <div key={i} className="flex gap-2 sm:gap-3">
                      <CheckIcon />
                      <span className="text-sm sm:text-base text-gray-700">{item.replace(/^[•\-*]\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}


            {/* Course Includes */}
            <section className="border rounded-xl p-6" aria-labelledby="course-includes-heading">
              <h3 id="course-includes-heading" className="font-semibold text-lg mb-4">This course includes:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <span className="material-icons text-violet-600" aria-hidden="true">play_circle</span>
                  <span>{totalHours}h {totalMinutes}m on-demand video</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-icons text-violet-600" aria-hidden="true">article</span>
                  <span>{totalLessons} lessons</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-icons text-violet-600" aria-hidden="true">code</span>
                  <span>Hands-on exercises</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-icons text-violet-600" aria-hidden="true">all_inclusive</span>
                  <span>Full lifetime access</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-icons text-violet-600" aria-hidden="true">smartphone</span>
                  <span>Access on mobile</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-icons text-violet-600" aria-hidden="true">workspace_premium</span>
                  <span>Certificate of completion</span>
                </div>
              </div>
            </section>


            <Divider />

            {/* Course Content - Responsive Accordion */}
            {modules.length > 0 && (
              <section>
                <SectionHeading level={2}>Course content</SectionHeading>
                <p className="text-sm sm:text-base text-gray-600 mt-2">
                  {modules.length} modules • {totalLessons} lessons • {totalHours}h {totalMinutes}m
                </p>

                <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                  {modules.map((module, i) => {
                    const moduleLessons = module.lessons || [];
                    const moduleDuration = moduleLessons.reduce((sum, lesson) => sum + (lesson.duration_minutes || 0), 0);
                    const moduleHours = Math.floor(moduleDuration / 60);
                    const moduleMinutes = moduleDuration % 60;

                    return (
                      <AccordionItem
                        key={module.id}
                        id={`module-${i}`}
                        title={
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full pr-6 sm:pr-8 gap-1">
                            <span className="text-sm sm:text-base">{module.title}</span>
                            <span className="text-xs sm:text-sm text-gray-500">
                              {moduleLessons.length} lessons • {moduleHours > 0 ? `${moduleHours}h ` : ''}{moduleMinutes}m
                            </span>
                          </div>
                        }
                        defaultOpen={i === 0}
                      >
                        <ul className="space-y-1 sm:space-y-2">
                          {moduleLessons.map((lesson) => (
                            <li
                              key={lesson.id}
                              className="flex items-center justify-between py-1.5 sm:py-2 hover:bg-white px-2 sm:px-3 rounded text-sm sm:text-base"
                            >
                              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                <span className="material-icons text-xs sm:text-sm text-gray-600 flex-shrink-0">
                                  {lesson.video_url ? "play_circle_outline" : "description"}
                                </span>
                                <span className="text-gray-700 truncate">{lesson.title}</span>
                              </div>
                              {lesson.duration_minutes && (
                                <span className="text-xs sm:text-sm text-gray-500 ml-2 flex-shrink-0">
                                  {lesson.duration_minutes}m
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </AccordionItem>
                    );
                  })}
                </div>
              </section>
            )}

            <Divider />

            {/* Prerequisites */}
            {prerequisites && (
              <section>
                <SectionHeading level={2}>Prerequisites</SectionHeading>
                <div className="mt-3 sm:mt-4 space-y-2">
                  {prerequisites.split('\n').filter(Boolean).map((req, i) => (
                    <div key={i} className="flex gap-2 sm:gap-3">
                      <span className="text-gray-600">•</span>
                      <span className="text-sm sm:text-base text-gray-700">{req.replace(/^[•\-*]\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Prerequisite Courses */}
            {prerequisites_courses && prerequisites_courses.length > 0 && (
              <>
                <Divider />
                <section>
                  <SectionHeading level={2}>Recommended Prerequisites</SectionHeading>
                  <p className="text-sm sm:text-base text-gray-600 mt-2 mb-4 sm:mb-6">
                    Complete these courses before starting
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {prerequisites_courses.map((prereqCourse) => (
                      <article
                        key={prereqCourse.id}
                        className="border-2 border-amber-200 bg-amber-50 rounded-lg sm:rounded-xl p-3 sm:p-5 hover:shadow-lg transition-all group hover:border-amber-400"
                      >
                        <span className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold mb-2 sm:mb-3 ${prereqCourse.difficulty_level === 'Beginner' ? 'bg-green-100 text-green-700' :
                          prereqCourse.difficulty_level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                          {prereqCourse.difficulty_level}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">
                          {prereqCourse.title}
                        </h3>
                        <Link
                          to={`${locPrefix}/training/${mastercategoryid}/${categoryCitySeo}/${subcategoryid}/${subcategoryCitySeo}/${prereqCourse.id}/${buildCourseCitySeo(prereqCourse.title, cityForHeading)}`}
                          className="inline-flex items-center gap-1 sm:gap-2 text-amber-700 hover:text-amber-900 font-semibold text-xs sm:text-sm"
                        >
                          <span>View Details</span>
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </article>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* Description */}
            {description && (
              <>
                <Divider />
                <section>
                  <SectionHeading level={2}>Description</SectionHeading>
                  <div className="mt-4 sm:mt-6">
                    <div className={`prose max-w-none text-sm sm:text-base ${!showFullDescription ? "max-h-48 sm:max-h-96 overflow-hidden relative" : ""}`}>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{description}</p>
                      {!showFullDescription && description.length > 300 && (
                        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-white to-transparent"></div>
                      )}
                    </div>
                    {description.length > 300 && (
                      <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="mt-3 sm:mt-4 text-violet-600 font-semibold hover:underline flex items-center gap-1 text-sm sm:text-base"
                      >
                        {showFullDescription ? "Show less" : "Show more"}
                        <span className="material-icons text-sm">{showFullDescription ? "expand_less" : "expand_more"}</span>
                      </button>
                    )}
                  </div>
                </section>
              </>
            )}

            <Divider />

            {/* Student Feedback - Responsive */}
            <section>
              <SectionHeading level={2}>Student feedback</SectionHeading>

              {/* Rating Overview - Responsive */}
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 bg-gray-50 rounded-lg border">
                <div className="text-center flex-shrink-0">
                  <div className="text-4xl sm:text-5xl font-bold text-gray-900">{averageRating}</div>
                  <StarRow value={averageRating} showNumber={false} size="md" />
                  <div className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Course Rating</div>
                </div>

                <div className="w-full sm:flex-1">
                  <div className="space-y-1.5 sm:space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const percent = star === 5 ? 75 : star === 4 ? 20 : star === 3 ? 3 : 2;
                      return (
                        <div key={star} className="flex items-center gap-2 sm:gap-3">
                          <div className="w-full sm:w-32 h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500" style={{ width: `${percent}%` }}></div>
                          </div>
                          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 w-8">
                            <span className="material-icons text-[10px] sm:text-xs">star</span>
                            <span>{star}</span>
                          </div>
                          <span className="text-xs sm:text-sm text-gray-600 w-10 text-right">{percent}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                {HARDCODED_REVIEWS.slice(0, visibleReviews).map((review, i) => (
                  <article key={i} className="border-b pb-4 sm:pb-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-violet-600 text-white flex items-center justify-center font-semibold text-sm sm:text-base flex-shrink-0">
                        {review.user.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1 sm:mb-2">
                          <h4 className="font-semibold text-sm sm:text-base truncate">{review.user}</h4>
                          <span className="text-xs sm:text-sm text-gray-500">{review.date}</span>
                        </div>
                        <StarRow value={review.rating} size="sm" />
                        <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-700 leading-relaxed">{review.text}</p>
                      </div>
                    </div>
                  </article>
                ))}

                {visibleReviews < HARDCODED_REVIEWS.length && (
                  <button
                    onClick={() => setVisibleReviews(v => v + 3)}
                    className="w-full border-2 border-gray-900 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-colors text-sm sm:text-base"
                  >
                    Show more reviews
                  </button>
                )}
              </div>
            </section>

            <Divider />

            {/* FAQs - Responsive */}
            <section>
              <SectionHeading level={2}>Frequently Asked Questions</SectionHeading>
              <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-4">
                {HARDCODED_FAQS.map((faq, i) => (
                  <details key={i} className="group border rounded-lg overflow-hidden">
                    <summary className="cursor-pointer list-none p-3 sm:p-4 hover:bg-gray-50 font-semibold flex items-center justify-between text-sm sm:text-base">
                      <span className="pr-4">{faq.q}</span>
                      <span className="material-icons group-open:rotate-180 transition-transform flex-shrink-0 text-lg sm:text-xl">
                        expand_more
                      </span>
                    </summary>
                    <div className="p-3 sm:p-4 pt-0 bg-gray-50 text-sm sm:text-base text-gray-700 leading-relaxed">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>

            <Divider />

            {/* Why Choose Section - Responsive */}
            <section className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
                Why Choose This {title} Course?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {[
                  { icon: "school", title: "Expert Instructors", desc: "Learn from certified professionals with 10+ years experience" },
                  { icon: "build", title: "Hands-On Practice", desc: "Apply concepts with practical labs and real-world projects" },
                  { icon: "workspace_premium", title: "Certification", desc: "Get a recognized certificate to boost your career" },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                      <span className="material-icons text-2xl sm:text-3xl">{item.icon}</span>
                    </div>
                    <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-white/90">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Stats - Responsive Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/20">
                {[
                  { value: `${averageRating}★`, label: "Rating", color: "text-yellow-400" },
                  { value: `${totalRatings.toLocaleString()}+`, label: "Students", color: "text-green-400" },
                  { value: totalLessons, label: "Lessons", color: "text-blue-300" },
                  { value: `${duration_hours || totalHours}h`, label: "Duration", color: "text-purple-300" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className={`text-lg sm:text-xl lg:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-[10px] sm:text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* ============================================
              RIGHT COLUMN - ENROLLMENT CARD
          ============================================ */}
          <aside id="enrollment-form" className="lg:col-span-1">
            {/* Desktop: Sticky sidebar */}
            <div className="hidden lg:block sticky top-20">
              <EnrollmentForm
                price={price}
                courseCurrency={courseCurrency}
                courseId={courseId}
              />
            </div>

            {/* Mobile/Tablet: Normal flow */}
            <div className="lg:hidden">
              <EnrollmentForm
                price={price}
                courseCurrency={courseCurrency}
                courseId={courseId}
              />
            </div>
          </aside>

        </div>
      </main>

      {/* ============================================
          RESPONSIVE CTA SECTION
      ============================================ */}
      <section className="bg-gradient-to-r from-violet-600 to-purple-600 py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4">
            Ready to Master {title}?
          </h2>
          <p className="text-white/90 text-sm sm:text-base lg:text-lg mb-2 max-w-3xl mx-auto">
            🎯 Join {totalRatings.toLocaleString()}+ students who rated this course <strong>{averageRating}★</strong>
          </p>
          <p className="text-white/90 text-xs sm:text-sm lg:text-lg mb-6 sm:mb-8 max-w-3xl mx-auto">
            ✅ {totalLessons} lessons • ✅ {duration_hours || totalHours}+ hours • ✅ Lifetime access
          </p>
          <button
            onClick={() => document.getElementById('enrollment-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-block bg-white text-violet-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base hover:bg-gray-100 transition-colors shadow-lg"
          >
            Enroll Now
          </button>
        </div>
      </section>

      {/* ============================================
          MOBILE STICKY ENROLLMENT BAR
      ============================================ */}
      <MobileEnrollmentBar
        price={price}
        courseCurrency={courseCurrency}
        courseId={courseId}
      />

      {/* Bottom padding for mobile sticky bar */}
      <div className="h-20 lg:hidden"></div>
    </div>
  );
}