"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { buildCategoryCitySeo, slugify } from "@/lib/seoSlug";
import {
  Cloud,
  Brain,
  Code,
  Shield,
  GitBranch,
  Smartphone,
  Briefcase,
  Database,
  Network,
  TestTube,
  Search,
  ArrowRight,
  Sparkles,
  Cpu,
  BookOpen,
  Award,
  AlertCircle,
  MessageSquare,
} from "lucide-react";

import type { Translations } from "@/translations/en";
import { t } from "@/lib/i18n";
import { getSiteOrigin } from "@/lib/siteUrl";

type ApiCategory = {
  id: number;
  name: string;
  subcategories?: Array<{ id: number; name: string }>;
};

type UiCategory = {
  id: number;
  title: string;
  description: string;
  link: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  courses: number;
};

type TrainingPageContentProps = {
  initialCategories: ApiCategory[];
  tt: Translations;
};

const categoryConfig: Record<
  string,
  { icon: UiCategory["icon"]; color: string; bgColor: string }
> = {
  "Cloud Computing": { icon: Cloud, color: "from-sky-400 to-blue-600", bgColor: "bg-sky-50" },
  "Data Science": { icon: Brain, color: "from-purple-400 to-pink-600", bgColor: "bg-purple-50" },
  "Web Development": { icon: Code, color: "from-green-400 to-emerald-600", bgColor: "bg-green-50" },
  Cybersecurity: { icon: Shield, color: "from-red-400 to-orange-600", bgColor: "bg-red-50" },
  "Artificial Intelligence": { icon: Brain, color: "from-purple-400 to-pink-600", bgColor: "bg-purple-50" },
  "DevOps & Automation": { icon: GitBranch, color: "from-indigo-400 to-blue-600", bgColor: "bg-indigo-50" },
  "Blockchain & Web3": { icon: Cpu, color: "from-violet-400 to-purple-600", bgColor: "bg-violet-50" },
  "Mobile App Development": { icon: Smartphone, color: "from-violet-400 to-purple-600", bgColor: "bg-violet-50" },
  "Database Technologies": { icon: Database, color: "from-teal-400 to-green-600", bgColor: "bg-teal-50" },
  "Software Engineering & Testing": { icon: TestTube, color: "from-pink-400 to-rose-600", bgColor: "bg-pink-50" },
  "Business & Management": { icon: Briefcase, color: "from-amber-400 to-orange-600", bgColor: "bg-amber-50" },
  Networking: { icon: Network, color: "from-blue-400 to-indigo-600", bgColor: "bg-blue-50" },
};

function FAQSection({
  cityTitle,
  totalStats,
  tt,
}: {
  cityTitle: string;
  totalStats: { totalCourses: number; totalCategories: number; successRate: string };
  tt: Translations;
}) {
  const faqs = tt.trainingPage.faqQuestions.map(q => ({
    question: t(q.question, { cityTitle }),
    answer: t(q.answer, { 
      cityTitle, 
      totalCourses: String(totalStats.totalCourses), 
      totalCategories: String(totalStats.totalCategories),
      successRate: totalStats.successRate 
    })
  }));

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="py-20 bg-gray-50" aria-labelledby="faq-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">{tt.trainingPage.gotQuestions}</span>
          </div>
          <h2 id="faq-heading" className="text-4xl md:text-5xl font-bold mb-4">
            {tt.trainingPage.faqTitle.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{tt.trainingPage.faqTitle.split(" ").slice(-1)}</span>
          </h2>
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
}

export default function TrainingPageContent({ initialCategories, tt }: TrainingPageContentProps) {
  const { country, region, city } = useParams<{ country: string; region: string; city: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isVisible, setIsVisible] = useState(false);

  const locCountry = country || "in";
  const locRegion = region || "ts";
  const locCity = city || "hyderabad";
  const locPrefix = `/${locCountry}/${locRegion}/${slugify(locCity)}`;
  const cityForHeading = slugify(locCity);
  const cityTitle = locCity.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  const SITE_URL = getSiteOrigin();

  const categories: UiCategory[] = useMemo(
    () =>
      initialCategories.map((category) => {
        const config = categoryConfig[category.name] || {
          icon: BookOpen,
          color: "from-gray-400 to-slate-600",
          bgColor: "bg-gray-50",
        };
        return {
          id: category.id,
          title: category.name,
          description: t(tt.trainingPage.categoryDesc, { 
            count: String(category.subcategories?.length || 0), 
            name: category.name 
          }),
          link: `${locPrefix}/training/${category.id}/${buildCategoryCitySeo(category.name, cityForHeading)}`,
          icon: config.icon,
          color: config.color,
          bgColor: config.bgColor,
          courses: category.subcategories?.length || 0,
        };
      }),
    [initialCategories, cityForHeading, locPrefix, tt],
  );

  const totalStats = {
    totalCategories: categories.length,
    totalCourses: categories.reduce((sum, c) => sum + (c.courses || 0), 0),
    totalStudents: "50K+",
    successRate: "95%",
  };

  const organizationSchema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: "Aim Tutor",
      alternateName: "AIM Tech Training Institute",
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo.png`,
      image: `${SITE_URL}/images/aim-technologies-training-courses.jpg`,
      description: `Leading technology training institute in ${cityTitle} offering ${totalStats.totalCourses}+ expert-led courses across ${totalStats.totalCategories} categories including AI, Cloud Computing, Data Science, and more.`,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Tech Park, HITEC City",
        addressLocality: "Ameerpet",
        addressRegion: "Telangana",
        postalCode: "500081",
        addressCountry: "IN",
      },
      areaServed: { "@type": "Place", name: "Worldwide" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Technology Training Courses",
        itemListElement: categories.slice(0, 10).map((category) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Course",
            name: `${category.title} Training`,
            description: category.description,
            provider: { "@type": "EducationalOrganization", name: "Aim Tutor" },
          },
        })),
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        bestRating: "5",
        worstRating: "1",
        ratingCount: "2500",
      },
    };
  }, [SITE_URL, categories, cityTitle, totalStats.totalCategories, totalStats.totalCourses]);

  const courseListSchema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Technology Training Courses in ${cityTitle}`,
      description: "Comprehensive list of technology training programs offered by Aim Tutor in " + cityTitle,
      numberOfItems: categories.length,
      itemListElement: categories.map((category, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Course",
          name: `${category.title} Training`,
          description: category.description,
          provider: { "@type": "EducationalOrganization", name: "Aim Tutor" },
          courseMode: "blended",
          educationalLevel: "All Levels",
          url: `${SITE_URL}${category.link}`,
        },
      })),
    };
  }, [SITE_URL, categories, cityTitle]);

  const breadcrumbSchema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}${locPrefix}` },
        { "@type": "ListItem", position: 2, name: "Training Courses", item: `${SITE_URL}${locPrefix}/training` },
      ],
    };
  }, [SITE_URL, locPrefix]);

  const websiteSchema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Aim Tutor",
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    };
  }, [SITE_URL]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const filteredCategories = useMemo(
    () =>
      categories.filter(
        (cat) =>
          cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.description.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [categories, searchQuery],
  );

  if (!categories.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-20 flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">{tt.trainingPage.noCategoriesTitle}</h3>
          <p className="text-gray-500">{tt.trainingPage.noCategoriesDesc}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <header className="pt-20 lg:pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-70" aria-hidden="true" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply blur-xl opacity-20 animate-blob" aria-hidden="true" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply blur-xl opacity-20 animate-blob animation-delay-2000" aria-hidden="true" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply blur-xl opacity-20 animate-blob animation-delay-4000" aria-hidden="true" />

        <div className="container mx-auto px-4 relative z-10">
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  {t(tt.trainingPage.expertLedPrograms, { 
                    count: String(categories.reduce((sum, c) => sum + c.courses, 0)) 
                  })}
                </span>
              </div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t(tt.trainingPage.title, { cityTitle })}
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              {t(tt.trainingPage.description, { count: String(categories.length) })}
            </p>

            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={tt.trainingPage.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none focus:shadow-lg transition-all duration-300 text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="sticky top-20 z-30 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${selectedFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              {t(tt.trainingPage.allCategories, { count: String(categories.length) })}
            </button>
            <div className="text-sm text-gray-600">
              {t(tt.trainingPage.results, { count: String(filteredCategories.length) })}
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{tt.trainingPage.noResultsTitle}</h3>
            <p className="text-gray-500 mb-6">{tt.trainingPage.noResultsDesc}</p>
            <button onClick={() => setSearchQuery("")} className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
              {tt.trainingPage.clearSearch}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <article
                  key={cat.id}
                  className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} aria-hidden="true" />
                  <div className="relative z-10">
                    <div className={`w-14 h-14 ${cat.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-7 h-7 bg-gradient-to-r ${cat.color} bg-clip-text text-transparent`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                      {cat.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{cat.description}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <BookOpen className="w-4 h-4 mr-1" />
                      <span>{t(tt.footer.studentsTrained, { count: String(cat.courses) })}</span>
                    </div>
                    <Link href={cat.link} className="flex items-center text-blue-600 font-medium group-hover:text-purple-600 transition-colors">
                      <span>{tt.trainingPage.explorePrograms}</span>
                      <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <FAQSection cityTitle={cityTitle} totalStats={totalStats} tt={tt} />

      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90" aria-hidden="true" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <Award className="w-16 h-16 mx-auto mb-6 animate-bounce-slow" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">{tt.trainingPage.cantFindTitle}</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              {tt.trainingPage.cantFindDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`${locPrefix}/contact`} className="bg-white text-blue-600 px-8 py-3 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                {tt.trainingPage.talkToAdvisor}
              </Link>
              <Link href={`${locPrefix}/contact`} className="bg-transparent text-white border-2 border-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-blue-600 transition-all duration-200">
                {tt.trainingPage.requestCustom}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

