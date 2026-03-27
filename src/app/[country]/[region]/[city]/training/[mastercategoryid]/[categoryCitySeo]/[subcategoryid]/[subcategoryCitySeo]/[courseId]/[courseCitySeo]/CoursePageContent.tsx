"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { buildCourseCitySeo, parseSeoSlug, slugify } from "@/lib/seoSlug";
import EnrollmentForm from "@/components/EnrollmentForm";
import { ChevronRight } from "lucide-react";
import { t, Translations } from "@/lib/i18n";

type RouteParams = {
  country: string;
  region: string;
  city: string;
  mastercategoryid: string;
  categoryCitySeo: string;
  subcategoryid: string;
  subcategoryCitySeo: string;
  courseId: string;
  courseCitySeo: string;
};

type Course = {
  id: number;
  title: string;
  short_description?: string;
  description?: string;
  thumbnail?: string;
  price?: number;
  currency?: string;
  duration_hours?: number;
  difficulty_level?: string;
  prerequisites?: string;
  learning_outcomes?: string;
  max_students?: number;
  status?: string;
  prerequisites_courses?: Array<{
    id: number;
    title: string;
    difficulty_level?: string;
  }>;
  modules?: Array<{
    id: number;
    title: string;
    lessons?: Array<{
      id: number;
      title: string;
      video_url?: string;
      duration_minutes?: number;
    }>;
  }>;
};

export default function CoursePageContent({
  params,
  tt,
}: {
  params: RouteParams;
  tt: Translations;
}) {
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [showFullDescription, setShowFullDescription] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(3);

  const parsed = parseSeoSlug(params.subcategoryCitySeo);
  const cityForHeading = parsed?.city || slugify(params.city);
  const cityTitle = cityForHeading
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setError(null);
        setLoading(true);
        const res = await api.post(`/api/v1/public/get-courses/${params.courseId}?lessons=True`);
        const c = res.data?.course as Course | undefined;
        if (!c?.title) throw new Error("Invalid course response");
        if (!cancelled) setCourse(c);
      } catch (e: unknown) {
        const err = e as { response?: { status?: number }; message?: string };
        if (!cancelled) {
          setError(
            err.response?.status === 404
              ? tt.coursePage.notFound
              : err.message || tt.coursePage.notFound,
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [params.courseId]);

  if (loading)
    return <div className="mx-auto max-w-4xl px-4 py-10">{tt.coursePage.loading}</div>;
  if (error || !course)
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 text-red-700">
        {error || tt.coursePage.notFound}
      </div>
    );

  const previewLesson = (course.modules ?? [])
    .flatMap((m) => m.lessons ?? [])
    .find((l) => l.video_url);
  const totalLessons = (course.modules ?? []).reduce((n, m) => n + (m.lessons?.length ?? 0), 0);
  const totalMinutes = (course.modules ?? []).reduce(
    (n, m) => n + (m.lessons ?? []).reduce((x, l) => x + (l.duration_minutes ?? 0), 0),
    0,
  );
  const totalHours = Math.floor(totalMinutes / 60);
  const remMinutes = totalMinutes % 60;
  const locPrefix = `/${params.country}/${params.region}/${slugify(params.city)}`;
  const categoryName = params.categoryCitySeo.split("-training-")[0].replace(/-/g, " ").trim();
  const subcategoryName = params.subcategoryCitySeo
    .split("-training-")[0]
    .replace(/-/g, " ")
    .trim();
  const averageRating = 4.6;
  const totalRatings = 10906;
  const staticUrl =
    process.env.NEXT_PUBLIC_STATIC_URL || "https://aifa-cloud.onrender.com/static/uploads/";

  const getStaticUrl = (path?: string) => {
    if (!path) return null;
    const cleanPath = path.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${staticUrl}${cleanPath}`;
  };

  const REVIEWS = tt.coursePage.reviews.map((r) => ({ ...r, rating: 5 }));
  const FAQS = tt.coursePage.faqs;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
          <nav className="text-sm text-gray-300 mb-8">
            <span className="inline-flex items-center gap-2">
              <Link href={locPrefix} className="hover:text-white">
                {tt.coursePage.home}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href={`${locPrefix}/training`} className="hover:text-white">
                {tt.coursePage.training}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link
                href={`${locPrefix}/training/${params.mastercategoryid}/${params.categoryCitySeo}`}
                className="hover:text-white capitalize"
              >
                {categoryName}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link
                href={`${locPrefix}/training/${params.mastercategoryid}/${params.categoryCitySeo}/${params.subcategoryid}/${params.subcategoryCitySeo}`}
                className="hover:text-white capitalize"
              >
                {subcategoryName}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">{course.title}</span>
            </span>
          </nav>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                {course.title}
                <span className="block text-2xl md:text-4xl mt-2">
                  {t(tt.coursePage.trainingInCity, { cityTitle })}
                </span>
              </h1>
              <p className="text-lg text-gray-300 max-w-3xl">
                {course.short_description || course.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <span className="px-3 py-1 rounded-full bg-green-500 text-white">
                  {course.difficulty_level || "beginner"}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/20">★★★★★ ({averageRating})</span>
                <span className="px-3 py-1 rounded-full bg-white/20">
                  {totalRatings.toLocaleString()} {tt.coursePage.ratings}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-300">
                <span>
                  {t(tt.coursePage.hoursTotal, { hours: course.duration_hours ?? totalHours })}
                </span>
                <span>
                  {totalLessons} {tt.coursePage.lessons}
                </span>
                <span>{cityTitle}</span>
                {course.max_students ? (
                  <span>{t(tt.coursePage.maxStudents, { count: course.max_students })}</span>
                ) : null}
              </div>
            </div>
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
                {previewLesson?.video_url ? (
                  <video
                    className="w-full aspect-video bg-black"
                    controls
                    preload="metadata"
                    poster={
                      course.thumbnail ? getStaticUrl(course.thumbnail) ?? undefined : undefined
                    }
                  >
                    <source src={getStaticUrl(previewLesson.video_url) ?? undefined} type="video/mp4" />
                  </video>
                ) : course.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getStaticUrl(course.thumbnail) ?? ""}
                    alt={course.title}
                    className="w-full aspect-video object-cover"
                  />
                ) : (
                  <div className="w-full aspect-video bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center">
                    <span className="material-icons text-white text-6xl">play_circle_outline</span>
                  </div>
                )}
              </div>
              <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 px-6 py-4 rounded-xl font-bold text-lg">
                {tt.coursePage.downloadBrochure}
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="border rounded-xl p-6 bg-blue-50 border-blue-200">
              <h2 className="text-2xl font-bold mb-4">{tt.coursePage.whatYouWillLearn}</h2>
              {course.learning_outcomes ? (
                <div className="grid md:grid-cols-2 gap-3 text-gray-700">
                  {course.learning_outcomes
                    .split("\n")
                    .filter(Boolean)
                    .map((line, i) => (
                      <div key={`${line}-${i}`} className="flex gap-2">
                        <span className="text-green-600">✓</span>
                        <span>{line.replace(/^[•\-*]\s*/, "")}</span>
                      </div>
                    ))}
                </div>
              ) : null}
            </section>

            <section className="border rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">{tt.coursePage.courseIncludes}</h2>
              <div className="grid md:grid-cols-2 gap-3 text-gray-700">
                <div>{t(tt.coursePage.onDemandVideo, { hours: totalHours, minutes: remMinutes })}</div>
                <div>
                  {totalLessons} {tt.coursePage.lessons}
                </div>
                <div>{tt.coursePage.handsOnExercises}</div>
                <div>{tt.coursePage.certificateOfCompletion}</div>
                <div>{tt.coursePage.fullLifetimeAccess}</div>
                <div>{tt.coursePage.accessOnMobile}</div>
              </div>
            </section>

            <section className="border rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-2">{tt.coursePage.courseContent}</h2>
              <p className="text-gray-600 mb-4">
                {(course.modules ?? []).length} {tt.coursePage.modules} · {totalLessons}{" "}
                {tt.coursePage.lessons}
              </p>
              <div className="space-y-3">
                {(course.modules ?? []).map((m, idx) => (
                  <details key={m.id} className="border rounded-lg overflow-hidden" open={idx === 0}>
                    <summary className="cursor-pointer list-none p-4 bg-gray-50 flex items-center justify-between font-semibold">
                      <span>{m.title}</span>
                      <span className="text-sm text-gray-500">
                        {(m.lessons ?? []).length} {tt.coursePage.lessons}
                      </span>
                    </summary>
                    <ul className="p-4 space-y-2">
                      {(m.lessons ?? []).map((l) => (
                        <li
                          key={l.id}
                          className="flex items-center justify-between text-sm border-b pb-2 last:border-b-0"
                        >
                          <span className="flex items-center gap-2">
                            <span className="material-icons text-sm text-gray-500">
                              {l.video_url ? "play_circle_outline" : "description"}
                            </span>
                            {l.title}
                          </span>
                          <span className="text-gray-500">{l.duration_minutes ?? 0}m</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </section>

            {course.prerequisites ? (
              <section>
                <h2 className="text-2xl font-bold mb-3">{tt.coursePage.prerequisites}</h2>
                <div className="space-y-2 text-gray-700">
                  {course.prerequisites
                    .split("\n")
                    .filter(Boolean)
                    .map((line, i) => (
                      <div key={`${line}-${i}`} className="flex gap-2">
                        <span>•</span>
                        <span>{line.replace(/^[•\-*]\s*/, "")}</span>
                      </div>
                    ))}
                </div>
              </section>
            ) : null}

            {course.prerequisites_courses?.length ? (
              <section>
                <h2 className="text-2xl font-bold mb-2">{tt.coursePage.recommendedPrerequisites}</h2>
                <p className="text-gray-600 mb-4">{tt.coursePage.completeBeforeStarting}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {course.prerequisites_courses.map((pr) => (
                    <article
                      key={pr.id}
                      className="border-2 border-amber-200 bg-amber-50 rounded-xl p-5"
                    >
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-yellow-100 text-yellow-700">
                        {pr.difficulty_level || "beginner"}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{pr.title}</h3>
                      <Link
                        href={`${locPrefix}/training/${params.mastercategoryid}/${
                          params.categoryCitySeo
                        }/${params.subcategoryid}/${
                          params.subcategoryCitySeo
                        }/${pr.id}/${buildCourseCitySeo(pr.title, cityForHeading)}`}
                        className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-900 font-semibold text-sm"
                      >
                        {tt.coursePage.viewDetails}
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {course.description ? (
              <section>
                <h2 className="text-2xl font-bold mb-3">{tt.coursePage.description}</h2>
                <div className={`${!showFullDescription ? "max-h-96 overflow-hidden relative" : ""}`}>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {course.description}
                  </p>
                  {!showFullDescription && course.description.length > 300 ? (
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
                  ) : null}
                </div>
                {course.description.length > 300 ? (
                  <button
                    onClick={() => setShowFullDescription((s) => !s)}
                    className="mt-4 text-violet-600 font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    {showFullDescription ? tt.coursePage.showLess : tt.coursePage.showMore}
                  </button>
                ) : null}
              </section>
            ) : null}

            <section className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4 text-center">
                {tt.coursePage.whyChooseThisCourse}
              </h2>
              <div className="grid sm:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="font-semibold">{tt.coursePage.expertInstructorsTitle}</div>
                  <div className="text-sm text-white/90">{tt.coursePage.expertInstructorsDesc}</div>
                </div>
                <div>
                  <div className="font-semibold">{tt.coursePage.handsOnLabsTitle}</div>
                  <div className="text-sm text-white/90">{tt.coursePage.handsOnLabsDesc}</div>
                </div>
                <div>
                  <div className="font-semibold">{tt.coursePage.certificationTitle}</div>
                  <div className="text-sm text-white/90">{tt.coursePage.certificationDesc}</div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">{tt.coursePage.studentFeedback}</h2>
              <div className="mt-2 mb-6 flex items-center gap-2 text-gray-600">
                <span className="text-5xl font-bold text-gray-900">{averageRating}</span>
                <span>★★★★★</span>
                <span>
                  ({totalRatings.toLocaleString()} {tt.coursePage.ratings})
                </span>
              </div>
              <div className="space-y-6">
                {REVIEWS.slice(0, visibleReviews).map((review, i: number) => (
                  <article key={`${review.user}-${i}`} className="border-b pb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-violet-600 text-white flex items-center justify-center font-semibold">
                        {review.user.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold">{review.user}</h4>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <div className="text-yellow-500">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </div>
                        <p className="mt-2 text-gray-700">{review.text}</p>
                      </div>
                    </div>
                  </article>
                ))}
                {visibleReviews < REVIEWS.length ? (
                  <button
                    onClick={() => setVisibleReviews((v) => v + 3)}
                    className="w-full border-2 border-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-colors"
                  >
                    {tt.coursePage.showMoreReviews}
                  </button>
                ) : null}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">{tt.coursePage.faqTitle}</h2>
              <div className="space-y-3">
                {FAQS.map((faq, i: number) => (
                  <details key={`${faq.q}-${i}`} className="group border rounded-lg overflow-hidden">
                    <summary className="cursor-pointer list-none p-4 hover:bg-gray-50 font-semibold flex items-center justify-between">
                      <span className="pr-4">{faq.q}</span>
                      <span className="material-icons group-open:rotate-180 transition-transform">
                        expand_more
                      </span>
                    </summary>
                    <div className="p-4 pt-0 bg-gray-50 text-gray-700">{faq.a}</div>
                  </details>
                ))}
              </div>
            </section>
          </div>

          <aside id="enroll-form-anchor" className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <p className="text-sm text-slate-500">{tt.coursePage.courseFee}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {course.price && course.price > 0
                  ? `${course.currency ?? "INR"} ${course.price}`
                  : tt.coursePage.free}
              </p>
              <p className="text-sm text-slate-500 mt-2">4.8 average rating</p>
            </div>
            <EnrollmentForm
              courseId={Number(params.courseId)}
              courseName={course.title}
              price={course.price != null ? Number(course.price) : 0}
              courseCurrency={course.currency ?? "INR"}
            />
          </aside>
        </div>
      </main>

      <section className="bg-gradient-to-r from-violet-600 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t(tt.coursePage.readyToMaster, { courseTitle: course.title })}
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-3xl mx-auto">
            {t(tt.coursePage.readyToMasterDesc, {
              count: totalRatings.toLocaleString(),
              rating: averageRating,
            })}
          </p>
          <button
            onClick={() =>
              document.getElementById("enroll-form-anchor")?.scrollIntoView({ behavior: "smooth" })
            }
            className="inline-block bg-white text-violet-600 px-8 py-3 rounded-lg font-bold text-base hover:bg-gray-100 transition-colors shadow-lg"
          >
            {tt.coursePage.enrollNow}
          </button>
        </div>
      </section>
    </div>
  );
}

