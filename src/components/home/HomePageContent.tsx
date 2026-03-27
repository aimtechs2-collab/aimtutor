"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/** Same files as Frontend `src/assets/aimvideo2.webm` — copied to `public/assets` (Next/Turbopack serves static files here). */
const HERO_VIDEO = "/assets/aimvideo2.webm";
import {
  Search,
  PlayCircle,
  Building2,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
  Zap,
  Phone,
} from "lucide-react";
import HomeStructuredData from "./HomeStructuredData";
import HomeFAQSection from "./HomeFAQSection";
import CourseCatalogue from "./CourseCatalogue";
import AboutBranch from "./AboutBranch";
import HiringPartnersSlider from "./HiringPartnersSlider";
import type { Translations } from "@/translations/en";
import { t } from "@/lib/i18n";
import { getSiteOrigin } from "@/lib/siteUrl";

export default function HomePageContent({
  country,
  region,
  city,
  cityTitle,
  citySlug,
  locPrefix,
  translations: tt,
}: {
  country: string;
  region: string;
  city: string;
  cityTitle: string;
  citySlug: string;
  locPrefix: string;
  translations: Translations;
}) {
  const SITE_URL = getSiteOrigin();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`${locPrefix}/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div className="font-sans text-text-body leading-relaxed overflow-x-hidden bg-white antialiased">
      <HomeStructuredData cityTitle={cityTitle} />

      <header className="relative h-screen min-h-[600px] md:min-h-[700px] text-white overflow-hidden flex flex-col">
        {/* Video background — same structure as Frontend/src/pages/HomePage.jsx */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
          aria-label="Aim Tutor training showcase video"
          title="Aim Tutor - Transform your career with cutting-edge technology training"
          preload="metadata"
          {...{ loading: "lazy" } as React.VideoHTMLAttributes<HTMLVideoElement>}
        >
          {/* <source src={HERO_VIDEO} type="video/webm; codecs=vp9" /> */}
          <source src={HERO_VIDEO} type="video/mp4" />
          <track kind="captions" srcLang="en" label="English captions" />
        </video>

        {/* Overlay for better text readability */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/95 md:from-slate-900/70 md:via-slate-900/50 md:to-slate-900/90"
          aria-hidden="true"
        />

        <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pb-20 md:pb-35 text-center max-w-7xl mx-auto w-full relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-white/20">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">{t(tt.hero.availableIn, { city: cityTitle })}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-4 sm:mb-6 leading-tight max-w-4xl tracking-tight">
            {tt.hero.headline}
            <span
              className="block text-orange-400 bg-clip-text bg-gradient-to-r from-primary to-cyan-500 mt-2 tracking-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
            >
              {tt.hero.brandName}
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed font-light tracking-wide px-4 sm:px-0">
            {t(tt.hero.subheading, { city: cityTitle })}
          </p>

          <div className="flex flex-wrap justify-center items-center gap-6 mb-8 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-400" />
              <span>{tt.hero.ratedInstitute}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-green-400" />
              <span>{tt.hero.alumni}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>{tt.hero.hiringPartners}</span>
            </div>
          </div>
        </main>

        <section className="absolute bottom-0 left-0 right-0 py-6 sm:py-8 md:py-10 lg:py-38 bg-gradient-to-t from-slate-900/95 via-slate-900/80 to-transparent z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-4 sm:gap-6">
              <div className="w-full max-w-3xl" itemScope itemType="https://schema.org/WebSite">
                <meta itemProp="url" content={SITE_URL} />
                <form
                  onSubmit={handleSearch}
                  role="search"
                  aria-label="Search for courses and training programs"
                  itemProp="potentialAction"
                  itemScope
                  itemType="https://schema.org/SearchAction"
                >
                  <meta itemProp="target" content={`${SITE_URL}/search?q={search_term_string}`} />
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch(e as unknown as React.FormEvent)}
                      placeholder={tt.hero.searchPlaceholder}
                      className="w-full py-4 px-5 pr-14 sm:py-5 sm:px-7 sm:pr-36 text-sm sm:text-base outline-none text-gray-900 placeholder:text-gray-400 font-light tracking-wide bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      aria-label="Search courses and training programs"
                      name="search_term_string"
                      autoComplete="off"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg sm:rounded-xl p-3 sm:px-6 sm:py-3 cursor-pointer font-medium tracking-wide transition-all duration-300 hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
                      aria-label="Search for training courses"
                    >
                      <Search className="w-5 h-5" />
                      <span className="hidden sm:inline">{tt.nav.search}</span>
                    </button>
                  </div>
                </form>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 w-full sm:w-auto">
                <Link
                  href={`${locPrefix}/training`}
                  aria-label="Browse all technology training courses"
                  className="group px-6 py-4 sm:px-8 sm:py-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold tracking-wide shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base min-h-[44px]"
                >
                  <PlayCircle className="w-5 h-5" />
                  {tt.hero.browseCourses}
                </Link>
                <Link
                  href={`${locPrefix}/contact`}
                  aria-label="Book a free demo session"
                  className="group px-6 py-4 sm:px-8 sm:py-5 font-semibold tracking-wide w-full sm:w-auto text-sm sm:text-base inline-flex items-center justify-center gap-2 min-h-[44px] rounded-xl border-2 border-gray-300 hover:border-blue-500 transition-all duration-300"
                >
                  <Phone className="w-5 h-5" />
                  {tt.hero.bookDemo}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </header>

      <CourseCatalogue locPrefix={locPrefix} citySlug={citySlug} />
      <AboutBranch locPrefix={locPrefix} translations={tt} />
      <HiringPartnersSlider />
      <HomeFAQSection cityTitle={cityTitle} translations={tt} />

      <section
        className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden"
        aria-labelledby="corporate-heading"
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-cyan-500 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <article className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                <span className="text-xs sm:text-sm font-medium tracking-wide">{tt.enterprise.trustedBy}</span>
              </div>

              <h2
                id="corporate-heading"
                className="text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 font-light leading-tight tracking-tight"
              >
                {tt.enterprise.title}
                <span className="block font-semibold bg-clip-text bg-gradient-to-r from-primary to-cyan-500 mt-2 text-2xl sm:text-3xl md:text-4xl">
                  {tt.enterprise.solutions}
                </span>
              </h2>

              <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 leading-relaxed font-light tracking-wide">
                {t(tt.enterprise.description, { city: cityTitle })}
              </p>

              <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10" role="list">
                {tt.enterprise.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 sm:gap-3 group">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 group-hover:scale-110 transition-transform flex-shrink-0 mt-0.5" aria-hidden />
                    <span className="text-sm sm:text-base text-gray-100 font-light tracking-wide">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href={`${locPrefix}/training`}
                  aria-label="Explore AI and technology training courses"
                  className="group cursor-pointer font-semibold tracking-wide w-full sm:w-auto text-sm sm:text-base px-6 py-4 min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center justify-center gap-2"
                >
                  {tt.enterprise.ctaPrimary}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={`${locPrefix}/contact`}
                  aria-label="Make an enquiry for corporate training"
                  className="cursor-pointer font-semibold tracking-wide w-full sm:w-auto text-sm sm:text-base px-6 py-4 min-h-[44px] rounded-xl border-2 border-gray-300 hover:border-blue-500 transition-all duration-300 inline-flex items-center justify-center gap-2"
                >
                  {tt.enterprise.ctaSecondary}
                </Link>
              </div>
            </article>

            <aside className="relative order-1 lg:order-2" itemScope itemType="https://schema.org/EducationalOrganization">
              <div className="relative bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-sm border border-white/10">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  {(
                    [
                      { number: "500+", label: tt.enterprise.enterpriseClients, schema: "numberOfEmployees" },
                      { number: "50K+", label: tt.enterprise.employeesTrained, schema: "alumni" },
                      { number: "98%", label: tt.enterprise.satisfactionRate, schema: "aggregateRating" },
                      { number: "24/7", label: tt.enterprise.supportAvailable, schema: "serviceType" },
                    ] as const
                  ).map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-white/20 hover:bg-white/15 transition-colors"
                      itemProp={stat.schema}
                    >
                      <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-1 sm:mb-2 tracking-tight">
                        {stat.number}
                      </div>
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
