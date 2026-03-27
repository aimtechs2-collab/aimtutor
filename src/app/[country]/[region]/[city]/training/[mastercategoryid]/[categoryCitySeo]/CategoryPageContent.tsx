"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { buildCourseCitySeo, buildSubcategoryCitySeo, parseSeoSlug, slugify } from "@/lib/seoSlug";
import { thumbnailUrl } from "@/lib/staticUrl";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { Translations } from "@/translations/en";
import { t } from "@/lib/i18n";

type Course = {
  id: number;
  title: string;
  short_description?: string;
  description?: string;
  price?: number;
  currency?: string;
  thumbnail?: string;
  duration_hours?: number;
  difficulty_level?: string;
};
type SubCategory = { id: number; name: string; description?: string; courses?: Course[] };
type CategoryData = { id: number; name: string; subcategories?: SubCategory[] };

const FAQS = (categoryName: string, cityTitle: string) => [
  {
    question: `What is ${categoryName} training?`,
    answer: `${categoryName} training provides comprehensive instruction on ${categoryName.toLowerCase()} technologies and best practices. Our courses cover fundamentals to advanced concepts through hands-on labs, real-world projects, and expert-led instruction to help you master ${categoryName.toLowerCase()} skills.`,
  },
  {
    question: `Is ${categoryName} training available online in ${cityTitle}?`,
    answer: `Yes, Aim Tutor offers both online live training and onsite classroom training for ${categoryName} in ${cityTitle}. Our online sessions are interactive with live instructors, hands-on labs, and real-time Q&A support.`,
  },
  {
    question: `What are the prerequisites for ${categoryName} training?`,
    answer: `Prerequisites vary by course level. Beginner courses require only basic computer literacy. Intermediate and advanced courses may require prior experience with related technologies. Detailed prerequisites are listed on each course page.`,
  },
  {
    question: `What is the duration of ${categoryName} training courses?`,
    answer: `Course duration varies from 2-5 days (16-40 hours) depending on the specific program and depth of coverage. We offer flexible scheduling including weekend batches and accelerated programs to fit your schedule.`,
  },
];

export default function CategoryPageContent({
  params,
  translations,
}: {
  params: { country: string; region: string; city: string; mastercategoryid: string; categoryCitySeo: string };
  translations: Translations;
}) {
  const [data, setData] = useState<CategoryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const parsed = parseSeoSlug(params.categoryCitySeo);
  const citySlug = parsed?.city || slugify(params.city);
  const cityTitle = citySlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const locPrefix = `/${params.country}/${params.region}/${slugify(params.city)}`;
  const prefix = `${locPrefix}/training/${params.mastercategoryid}/${params.categoryCitySeo}`;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const masterId = Number(params.mastercategoryid);
        if (!Number.isFinite(masterId) || masterId <= 0) throw new Error("Invalid category id");
        const res = await api.post(`/api/v1/mastercategories/get-mastercategories/${masterId}?courses=True`);
        if (!res.data?.name) throw new Error("Invalid category response");
        if (!cancelled) {
          setData(res.data as CategoryData);
          setError(null);
        }
      } catch (e: unknown) {
        const err = e as { message?: string };
        if (!cancelled) setError(err.message || "Failed to load category");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.mastercategoryid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium text-lg">{t(translations.categoryPage.loading, { cityTitle })}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md px-4">
            <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">{translations.categoryPage.oops}</h1>
            <p className="text-red-600 mb-6 text-lg">{error}</p>
            <button onClick={() => window.location.reload()} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl">
              {translations.categoryPage.tryAgain}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center px-4">
            <h1 className="text-8xl font-bold text-gray-300 mb-4">{translations.categoryPage.notFoundTitle}</h1>
            <h2 className="text-2xl text-gray-600 mb-6">{translations.categoryPage.notFoundDesc}</h2>
            <Link href={locPrefix} className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
              {translations.categoryPage.goHome}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const categoryName = data.name;
  const subcategories = data.subcategories ?? [];
  const allCourses = subcategories.flatMap((s) =>
    (s.courses ?? []).map((course) => ({ ...course, subcategoryId: s.id, subcategoryName: s.name })),
  );
  const totalCourses = allCourses.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-400 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="relative container mx-auto my-10 px-4 py-16 md:py-20">
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link href={locPrefix} className="hover:text-green-600 transition-colors font-medium">{translations.nav.home}</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`${locPrefix}/training`} className="hover:text-green-600 transition-colors font-medium">{translations.nav.training}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-semibold">{categoryName}</span>
          </nav>
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-md mb-6">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" aria-hidden="true"></span>
              <span className="text-sm font-semibold text-gray-700">{translations.categoryPage.liveTrainingAvail}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              <span className="block">{t(translations.categoryPage.trainingTitle, { categoryName })}</span>
              <span className="block text-3xl md:text-4xl lg:text-5xl text-green-600 mt-3">{t(translations.categoryPage.trainingInCity, { cityTitle })}</span>
            </h1>
            <div className="text-base md:text-lg text-gray-700 leading-relaxed mb-8 max-w-4xl mx-auto space-y-4">
              <p dangerouslySetInnerHTML={{ __html: t(translations.categoryPage.heroP1, { categoryName, cityTitle, categoryNameLower: categoryName.toLowerCase() }).replace(/4.8\/5/g, '<span className="text-green-700 font-semibold">4.8/5</span>').replace(new RegExp(`live ${categoryName}`, 'i'), `<strong className="text-green-700">live ${categoryName}</strong>`).replace('hands-on practice', '<span className="font-semibold text-green-700">hands-on practice</span>') }} />
              <p dangerouslySetInnerHTML={{ __html: t(translations.categoryPage.heroP2, { categoryName, cityTitle, categoryNameLower: categoryName.toLowerCase() }).replace(/Aim Tutor/g, '<strong>Aim Tutor</strong>') }} />
              <p className="text-lg font-semibold text-green-700">{translations.categoryPage.heroP3}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <div className="text-center"><p className="text-3xl font-bold text-green-600">{subcategories.length}+</p><p className="text-sm text-gray-600">{translations.categoryPage.statsSpec}</p></div>
              <div className="text-center"><p className="text-3xl font-bold text-green-600">{totalCourses}+</p><p className="text-sm text-gray-600">{translations.categoryPage.statsCourses}</p></div>
              <div className="text-center"><p className="text-3xl font-bold text-green-600">4.8★</p><p className="text-sm text-gray-600">{translations.categoryPage.statsRating}</p></div>
              <div className="text-center"><p className="text-3xl font-bold text-green-600">1000+</p><p className="text-sm text-gray-600">{translations.categoryPage.statsStudents}</p></div>
              <div className="text-center"><p className="text-3xl font-bold text-green-600">100%</p><p className="text-sm text-gray-600">{translations.categoryPage.statsHandsOn}</p></div>
            </div>
          </div>
        </div>
      </div>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{t(translations.categoryPage.exploreSubcategoriesTitle, { categoryName })}</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t(translations.categoryPage.exploreSubcategoriesDesc, { categoryName, cityTitle })}
          </p>
        </div>
        {subcategories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 text-lg">{translations.categoryPage.noSubcategories}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subcategories.map((sub, index) => {
              const subSeo = buildSubcategoryCitySeo(sub.name, citySlug);
              const count = sub.courses?.length ?? 0;
              return (
                <article key={sub.id} className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 group hover:border-blue-500" style={{ animationDelay: `${index * 50}ms` }}>
                  <Link href={`${prefix}/${sub.id}/${subSeo}`} className="block">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <span className="text-3xl text-white font-bold">{sub.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{sub.name}</h3>
                    {sub.description ? <p className="text-sm text-gray-600 mb-4 line-clamp-2">{sub.description}</p> : null}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500 font-medium">{count} {translations.categoryPage.statsCourses.toLowerCase()}</span>
                      <span className="text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-1">{translations.categoryPage.exploreBtn} <ArrowRight className="w-4 h-4" /></span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {totalCourses > 0 ? (
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{t(translations.categoryPage.featuredTitle, { categoryName, cityTitle })}</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t(translations.categoryPage.featuredDesc, { categoryName })}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCourses.map((item) => {
              const img = thumbnailUrl(item.thumbnail);
              const subSeo = buildSubcategoryCitySeo(item.subcategoryName, citySlug);
              const courseSeo = buildCourseCitySeo(item.title, citySlug);
              return (
                <article key={item.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 bg-white hover:border-blue-300">
                  <div className="mb-4 rounded-lg overflow-hidden h-40 bg-gradient-to-br from-blue-100 to-purple-100 relative">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={item.title} className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                  <div className="mb-3 flex items-center gap-2 flex-wrap">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${item.difficulty_level === "Beginner" ? "bg-green-100 text-green-700" : item.difficulty_level === "Intermediate" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                      {item.difficulty_level || translations.categoryPage.allLevels}
                    </span>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                      {item.subcategoryName}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 transition-colors">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 min-h-[4rem]">{item.short_description || item.description || ""}</p>
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    {item.duration_hours ? (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{item.duration_hours} hours</span>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-2xl font-bold text-blue-600">{item.price && item.price > 0 ? `${item.currency ?? "INR"} ${item.price}` : translations.categoryPage.freeCourse}</div>
                    <Link href={`${prefix}/${item.subcategoryId}/${subSeo}/${item.id}/${courseSeo}`} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-md hover:shadow-lg">{translations.categoryPage.viewCourse}</Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      ) : null}

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{t(translations.categoryPage.faqTitle, { categoryName })}</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t(translations.categoryPage.faqDesc, { categoryName, cityTitle })}
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            {FAQS(categoryName, cityTitle).map((faq) => (
              <details key={faq.question} className="bg-white rounded-xl shadow-md mb-4 p-6 group border border-gray-200 hover:shadow-lg transition-shadow">
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

      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t(translations.categoryPage.whyChooseTitle, { categoryName, cityTitle })}</h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">{t(translations.categoryPage.whyChooseDesc, { categoryName })}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{translations.categoryPage.expertInstructorsTitle}</h3>
              <p className="text-white/90">{t(translations.categoryPage.expertInstructorsDesc, { categoryName })}</p>
            </div>
            <div className="text-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{translations.categoryPage.handsOnTitle}</h3>
              <p className="text-white/90">{t(translations.categoryPage.handsOnDesc, { categoryName })}</p>
            </div>
            <div className="text-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{translations.categoryPage.careerSupportTitle}</h3>
              <p className="text-white/90">{t(translations.categoryPage.careerSupportDesc, { categoryName })}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/20">
            <div className="text-center text-white"><div className="text-2xl font-bold text-yellow-400 mb-2">4.8★</div><div className="text-sm">{translations.categoryPage.studentRating}</div></div>
            <div className="text-center text-white"><div className="text-2xl font-bold text-green-400 mb-2">1000+</div><div className="text-sm">{translations.categoryPage.statsStudents}</div></div>
            <div className="text-center text-white"><div className="text-2xl font-bold text-blue-300 mb-2">95%</div><div className="text-sm">{translations.categoryPage.jobPlacement}</div></div>
            <div className="text-center text-white"><div className="text-2xl font-bold text-purple-300 mb-2">24/7</div><div className="text-sm">{translations.categoryPage.support}</div></div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{t(translations.categoryPage.whatStudentsSayTitle, { categoryName })}</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t(translations.categoryPage.whatStudentsSayDesc, { categoryName })}
          </p>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div><p className="text-4xl font-bold mb-2">4.8</p><p className="text-sm opacity-90">{translations.categoryPage.avgRating}</p></div>
            <div><p className="text-4xl font-bold mb-2">1,247</p><p className="text-sm opacity-90">{translations.categoryPage.totalReviews}</p></div>
            <div><p className="text-4xl font-bold mb-2">95%</p><p className="text-sm opacity-90">{translations.categoryPage.satisfactionRate}</p></div>
            <div><p className="text-4xl font-bold mb-2">100%</p><p className="text-sm opacity-90">{translations.categoryPage.wouldRecommend}</p></div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-gray-50 to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{t(translations.categoryPage.upcomingTitle, { categoryName, cityTitle })}</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t(translations.categoryPage.upcomingDesc, { categoryName })}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: `Introduction to ${categoryName}`, description: `Master the basics of ${categoryName.toLowerCase()}, deployment models, and key services with hands-on labs.`, duration: "16 hours (2 days)", location: "Online Live", locationColor: "green", badge: "Beginner" },
              { title: `${categoryName} Security Best Practices`, description: `Learn IAM, encryption, compliance and comprehensive ${categoryName.toLowerCase()} security strategies.`, duration: "24 hours (3 days)", location: cityTitle, locationColor: "blue", badge: "Intermediate" },
              { title: `Advanced ${categoryName} Architecture`, description: `Deep dive into advanced ${categoryName.toLowerCase()} concepts, design patterns and real-world implementations.`, duration: "32 hours (4 days)", location: "Online Live", locationColor: "green", badge: "Advanced" },
              { title: `${categoryName} DevOps Integration`, description: `CI/CD pipelines, automation, monitoring and best practices in ${categoryName.toLowerCase()} DevOps.`, duration: "40 hours (5 days)", location: "Bangalore", locationColor: "yellow", badge: "Intermediate" },
              { title: `${categoryName} Certification Bootcamp`, description: `Intensive preparation for industry-recognized ${categoryName.toLowerCase()} certifications with mock tests.`, duration: "48 hours (6 days)", location: cityTitle, locationColor: "blue", badge: "All Levels" },
              { title: `${categoryName} for Enterprises`, description: `Enterprise-grade ${categoryName.toLowerCase()} solutions, governance, and large-scale implementations.`, duration: "40 hours (5 days)", location: "Online Live", locationColor: "green", badge: "Advanced" },
            ].map((course) => (
              <article key={course.title} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-200">
                <div className="p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{course.badge}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow leading-relaxed">{course.description}</p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${course.locationColor === "green" ? "bg-green-100 text-green-700" : course.locationColor === "blue" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>{course.location}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-green-600 to-teal-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t(translations.categoryPage.readyTitle, { categoryName, cityTitle })}</h2>
          <p className="text-white/90 text-lg mb-2 max-w-3xl mx-auto">
            <span dangerouslySetInnerHTML={{ __html: t(translations.categoryPage.readyDesc1, { categoryName }).replace('4.8', '<strong>4.8</strong>') }} />
          </p>
          <p className="text-white/90 text-lg mb-8 max-w-3xl mx-auto">
            {translations.categoryPage.readyDesc2}
          </p>
          <Link href={`${locPrefix}/contact`} className="px-8 py-4 bg-white text-green-600 rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2">{translations.categoryPage.startJourneyBtn}</Link>
        </div>
      </section>
    </div>
  );
}

