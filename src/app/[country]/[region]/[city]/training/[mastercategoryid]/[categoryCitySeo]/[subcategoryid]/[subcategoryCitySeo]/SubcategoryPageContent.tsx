"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { buildCourseCitySeo, slugify } from "@/lib/seoSlug";
import { thumbnailUrl } from "@/lib/staticUrl";
import { ArrowRight, ChevronRight, Clock3, Search, User } from "lucide-react";
import type { Translations } from "@/translations/en";
import { t } from "@/lib/i18n";
import { getSiteOrigin } from "@/lib/siteUrl";

type Course = {
  id: number;
  title: string;
  short_description?: string;
  description?: string;
  difficulty_level?: string;
  duration_hours?: number;
  price?: number;
  currency?: string;
  thumbnail?: string;
};

type SubCategoryData = {
  id: number;
  name: string;
  courses?: Course[];
};

export default function SubcategoryPageContent({
  data,
  tt,
  params,
}: {
  data: SubCategoryData;
  tt: Translations;
  params: {
    country: string;
    region: string;
    city: string;
    mastercategoryid: string;
    categoryCitySeo: string;
    subcategoryid: string;
    subcategoryCitySeo: string;
  };
}) {
  const [query, setQuery] = useState("");
  const SITE_URL = getSiteOrigin();

  const locPrefix = `/${params.country}/${params.region}/${slugify(params.city)}`;
  const cityTitle = params.city.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const subcategoryName = data.name;
  const courses = data.courses || [];

  const filteredCourses = useMemo(() => {
    return courses.filter((c) =>
      `${c.title} ${c.short_description || ""}`.toLowerCase().includes(query.toLowerCase())
    );
  }, [courses, query]);

  const s = tt.subcategoryPage;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/95 to-indigo-900/95">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.2,
          }}
        />
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 container mx-auto mt-12 px-4 py-12">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-12">
            <Link href={locPrefix} className="hover:text-white transition-colors">
              {tt.nav.home}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`${locPrefix}/training`} className="hover:text-white transition-colors">
              {tt.nav.training}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`${locPrefix}/training/${params.mastercategoryid}/${params.categoryCitySeo}`} className="hover:text-white transition-colors max-w-xs truncate">
              {params.categoryCitySeo.split("-training-")[0].split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">
              {subcategoryName}
            </span>
          </nav>

          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                {s.liveTrainingAvail}
              </span>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full">
                <span className="text-yellow-300">★★★★★</span>
                <span className="text-white/90 text-sm font-medium">
                  {t(s.rating, { rating: "4.8" })}
                </span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {t(s.trainingTitle, { subcategoryName })}
              <span className="block text-3xl md:text-4xl lg:text-5xl text-blue-200 mt-3">
                {t(s.trainingInCity, { cityTitle })}
              </span>
            </h1>

            <div className="text-base md:text-lg text-white/90 leading-relaxed mb-8 max-w-4xl space-y-4">
              <p>{t(s.heroP1, { subcategoryName, cityTitle })}</p>
              <p>{t(s.heroP2, { subcategoryName, cityTitle })}</p>
            </div>

            <div className="flex flex-wrap gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{courses.length}+</p>
                <p className="text-sm text-white/80">{s.statsCourses}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">4.8★</p>
                <p className="text-sm text-white/80">{s.statsRating}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">100%</p>
                <p className="text-sm text-white/80">{s.statsHandsOn}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t(s.coursesInCity, { subcategoryName, cityTitle })}
            </h2>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={s.searchPlaceholder}
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const courseSeo = buildCourseCitySeo(course.title, slugify(params.city));
              const img = thumbnailUrl(course.thumbnail);
              return (
                <article key={course.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 group bg-white hover:border-blue-300">
                  <div className="mb-4 rounded-lg overflow-hidden h-40 bg-gradient-to-br from-blue-100 to-purple-100 relative">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={`${course.title} - ${subcategoryName} ${s.statsCourses} ${t(s.trainingInCity, { cityTitle })} | Aim Tutor`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-blue-300">{s.noImage}</div>
                    )}
                  </div>
                  <div className="mb-3 flex items-center gap-2 flex-wrap">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      course.difficulty_level === "Beginner" ? "bg-green-100 text-green-700" :
                      course.difficulty_level === "Intermediate" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {course.difficulty_level || tt.categoryPage.allLevels}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 min-h-[4rem]">{course.short_description || course.description}</p>
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    {course.duration_hours ? (
                      <div className="flex items-center gap-2">
                        <Clock3 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span>{t(s.hours, { hours: String(course.duration_hours) })}</span>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex flex-col">
                      {course.price && course.price > 0 ? (
                        <div className="text-2xl font-bold text-blue-600">{course.currency || "INR"}{course.price.toLocaleString()}</div>
                      ) : (
                        <div className="text-2xl font-bold text-green-600">{s.free}</div>
                      )}
                    </div>
                    <Link
                      href={`${locPrefix}/training/${params.mastercategoryid}/${params.categoryCitySeo}/${params.subcategoryid}/${params.subcategoryCitySeo}/${course.id}/${courseSeo}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-md hover:shadow-lg"
                    >
                      {s.viewCourse}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredCourses.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center mt-8">
              <User className="w-10 h-10 mx-auto text-slate-400 mb-2" />
              <p className="text-slate-600">{s.noCoursesFound}</p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t(s.whyChooseTitle, { subcategoryName, cityTitle })}
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            {t(s.whyChooseDesc, { subcategoryName, cityTitle })}
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <span className="text-3xl">👨‍🏫</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{s.expertInstructorsTitle}</h3>
              <p className="text-white/90">{t(s.expertInstructorsDesc, { subcategoryName })}</p>
            </div>
            <div className="text-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <span className="text-3xl">🧪</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{s.handsOnTitle}</h3>
              <p className="text-white/90">{t(s.handsOnDesc, { subcategoryName })}</p>
            </div>
            <div className="text-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{s.careerSupportTitle}</h3>
              <p className="text-white/90">{t(s.careerSupportDesc, { subcategoryName })}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/20">
            <div className="text-center text-white">
              <div className="text-2xl font-bold text-yellow-400 mb-2">4.8★</div>
              <div className="text-sm">{s.studentRating}</div>
            </div>
            <div className="text-center text-white">
              <div className="text-2xl font-bold text-green-400 mb-2">1000+</div>
              <div className="text-sm">{s.studentsTrained}</div>
            </div>
            <div className="text-center text-white">
              <div className="text-2xl font-bold text-blue-300 mb-2">95%</div>
              <div className="text-sm">{s.jobPlacement}</div>
            </div>
            <div className="text-center text-white">
              <div className="text-2xl font-bold text-purple-300 mb-2">24/7</div>
              <div className="text-sm">{s.support}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {t(s.whatStudentsSayTitle, { subcategoryName })}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t(s.whatStudentsSayDesc, { subcategoryName })}
          </p>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div><p className="text-4xl font-bold mb-2">4.8</p><p className="text-sm opacity-90">{s.avgRating}</p></div>
            <div><p className="text-4xl font-bold mb-2">1,247</p><p className="text-sm opacity-90">{s.totalReviews}</p></div>
            <div><p className="text-4xl font-bold mb-2">95%</p><p className="text-sm opacity-90">{s.satisfactionRate}</p></div>
            <div><p className="text-4xl font-bold mb-2">100%</p><p className="text-sm opacity-90">{s.wouldRecommend}</p></div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t(s.faqTitle, { subcategoryName })}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t(s.faqDesc, { subcategoryName, cityTitle })}
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            {s.faqQuestions.map((q) => (
              <details key={q} className="bg-white rounded-xl shadow-md mb-4 p-6 group border border-gray-200 hover:shadow-lg transition-shadow">
                <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center text-gray-800 group-hover:text-blue-600">
                  <span className="pr-4">{t(q, { subcategoryName, cityTitle })}</span>
                  <span className="w-6 h-6 flex items-center justify-center text-blue-600">⌄</span>
                </summary>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-gray-700 leading-relaxed">
                    {t(s.faqAnswer, { subcategoryName, cityTitle })}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-green-600 to-teal-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t(s.readyTitle, { subcategoryName, cityTitle })}
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-3xl mx-auto">
            {t(s.readyDesc, { subcategoryName, cityTitle })}
          </p>
          <Link
            href={`${locPrefix}/contact`}
            className="px-8 py-4 bg-white text-green-600 rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
          >
            {s.startJourneyBtn}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
