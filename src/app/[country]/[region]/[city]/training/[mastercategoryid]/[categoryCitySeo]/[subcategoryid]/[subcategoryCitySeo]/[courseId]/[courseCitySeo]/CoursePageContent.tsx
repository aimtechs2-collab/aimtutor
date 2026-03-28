"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { buildCourseCitySeo, parseSeoSlug, slugify } from "@/lib/seoSlug";
import EnrollmentForm from "@/components/EnrollmentForm";
import { ChevronRight } from "lucide-react";
import { t, Translations } from "@/lib/i18n";
import { thumbnailUrl } from "@/lib/staticUrl";
import {
  AccordionItem,
  CheckIcon,
  Divider,
  MobileEnrollmentBar,
  SectionHeading,
  StarRow,
} from "@/components/course/CourseReplicaUI";

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
    short_description?: string;
    thumbnail?: string;
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

function difficultyBadgeClass(level?: string) {
  const d = (level || "").toLowerCase();
  if (d === "beginner") return "bg-green-500 text-white";
  if (d === "intermediate") return "bg-yellow-500 text-gray-900";
  return "bg-red-500 text-white";
}

/** Matches CourseReplicaPage.jsx badge classes (Beginner / Intermediate / everything else → red). */
function prereqDifficultyBadgeClass(levelLabel: string) {
  const d = levelLabel.trim().toLowerCase();
  if (d === "beginner") return "bg-green-100 text-green-700";
  if (d === "intermediate") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

function prereqDifficultyDisplay(level?: string) {
  const raw = (level || "Beginner").trim();
  if (!raw) return "Beginner";
  return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
}

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

  const modules = course.modules ?? [];
  const previewLesson = modules.flatMap((m) => m.lessons ?? []).find((l) => l.video_url);
  const totalLessons = modules.reduce((n, m) => n + (m.lessons?.length ?? 0), 0);
  const totalMinutes = modules.reduce(
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
  const REVIEWS = tt.coursePage.reviews.map((r) => ({ ...r, rating: 5 }));
  const FAQS = tt.coursePage.faqs;

  const heroBlurb = course.short_description || course.description || "";
  const durationDisplayHours = course.duration_hours ?? totalHours;

  const prereqCourses =
    (course as { prerequisites_courses?: Course["prerequisites_courses"]; prerequisitesCourses?: Course["prerequisites_courses"] })
      .prerequisites_courses ??
    (course as { prerequisitesCourses?: Course["prerequisites_courses"] }).prerequisitesCourses ??
    [];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 lg:py-12">
          <nav className="text-xs sm:text-sm text-gray-300 mb-4 sm:mb-6 lg:mb-8" aria-label="Breadcrumb">
            <span className="inline-flex flex-wrap items-center gap-1 sm:gap-2">
              <Link href={locPrefix} className="hover:text-white">
                {tt.coursePage.home}
              </Link>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
              <Link href={`${locPrefix}/training`} className="hover:text-white">
                {tt.coursePage.training}
              </Link>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
              <Link
                href={`${locPrefix}/training/${params.mastercategoryid}/${params.categoryCitySeo}`}
                className="hover:text-white capitalize"
              >
                {categoryName}
              </Link>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
              <Link
                href={`${locPrefix}/training/${params.mastercategoryid}/${params.categoryCitySeo}/${params.subcategoryid}/${params.subcategoryCitySeo}`}
                className="hover:text-white capitalize"
              >
                {subcategoryName}
              </Link>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
              <span className="text-white font-medium">{course.title}</span>
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
            <div className="order-2 lg:order-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6 leading-tight">
                {course.title}
                <span className="block text-lg sm:text-xl md:text-2xl lg:text-5xl mt-1 sm:mt-2">
                  {t(tt.coursePage.trainingInCity, { cityTitle })}
                </span>
              </h1>

              {heroBlurb ? (
                <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 text-gray-300 leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {heroBlurb}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm mb-4 sm:mb-6">
                {course.difficulty_level ? (
                  <span
                    className={`px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 font-semibold rounded-full text-xs sm:text-sm ${difficultyBadgeClass(course.difficulty_level)}`}
                  >
                    {course.difficulty_level}
                  </span>
                ) : null}
                <div className="flex items-center gap-1">
                  <StarRow value={averageRating} size="sm" />
                </div>
                <span className="text-gray-300 text-xs sm:text-sm">({totalRatings.toLocaleString()})</span>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-gray-300">
                {durationDisplayHours ? (
                  <span className="flex items-center gap-1.5 sm:gap-2">
                    <span className="material-icons text-sm sm:text-base">schedule</span>
                    <span>{t(tt.coursePage.hoursTotal, { hours: durationDisplayHours })}</span>
                  </span>
                ) : null}
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <span className="material-icons text-sm sm:text-base">place</span>
                  <span>{cityTitle}</span>
                </span>
                {course.max_students ? (
                  <span className="flex items-center gap-1.5 sm:gap-2">
                    <span className="material-icons text-sm sm:text-base">people</span>
                    <span>{t(tt.coursePage.maxStudents, { count: course.max_students })}</span>
                  </span>
                ) : null}
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <span className="material-icons text-sm sm:text-base">menu_book</span>
                  <span>
                    {totalLessons} {tt.coursePage.lessons}
                  </span>
                </span>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-3 sm:space-y-4 lg:space-y-5">
              <div className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-xl sm:shadow-2xl border border-gray-700 sm:border-2">
                {previewLesson?.video_url ? (
                  <video
                    className="w-full h-auto aspect-video bg-black"
                    controls
                    preload="metadata"
                    poster={course.thumbnail ? thumbnailUrl(course.thumbnail) ?? undefined : undefined}
                    playsInline
                  >
                    <source src={thumbnailUrl(previewLesson.video_url) ?? undefined} type="video/mp4" />
                  </video>
                ) : course.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbnailUrl(course.thumbnail) ?? ""}
                    alt={`${course.title} Course in ${cityTitle}`}
                    className="w-full h-auto aspect-video object-cover"
                    loading="eager"
                  />
                ) : (
                  <div className="w-full aspect-video bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center">
                    <span className="material-icons text-white text-4xl sm:text-5xl lg:text-6xl">
                      play_circle_outline
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-gray-900 px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 group shadow-lg sm:shadow-2xl active:scale-[0.98]"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
                <span>{tt.coursePage.downloadBrochure}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 lg:py-12">
        {/* Flex (not 3-col grid): avoids a tall empty area under the enrollment card on the right */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-10 lg:items-start">
          <div className="min-w-0 flex-1 space-y-6 sm:space-y-8">
            {course.learning_outcomes ? (
              <section className="border rounded-lg sm:rounded-xl p-4 sm:p-6 bg-blue-50 border-blue-200">
                <SectionHeading level={2}>{tt.coursePage.whatYouWillLearn}</SectionHeading>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
                  {course.learning_outcomes
                    .split("\n")
                    .filter(Boolean)
                    .map((item, i) => (
                      <div key={`${item}-${i}`} className="flex gap-2 sm:gap-3">
                        <CheckIcon />
                        <span className="text-sm sm:text-base text-gray-700">
                          {item.replace(/^[•\-*]\s*/, "")}
                        </span>
                      </div>
                    ))}
                </div>
              </section>
            ) : null}

            <section className="border rounded-xl p-6" aria-labelledby="course-includes-heading">
              <h3 id="course-includes-heading" className="font-semibold text-lg mb-4">
                {tt.coursePage.courseIncludes}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <span className="material-icons text-violet-600" aria-hidden="true">
                    play_circle
                  </span>
                  <span>{t(tt.coursePage.onDemandVideo, { hours: totalHours, minutes: remMinutes })}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-icons text-violet-600" aria-hidden="true">
                    article
                  </span>
                  <span>
                    {totalLessons} {tt.coursePage.lessons}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-icons text-violet-600" aria-hidden="true">
                    code
                  </span>
                  <span>{tt.coursePage.handsOnExercises}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-icons text-violet-600" aria-hidden="true">
                    all_inclusive
                  </span>
                  <span>{tt.coursePage.fullLifetimeAccess}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-icons text-violet-600" aria-hidden="true">
                    smartphone
                  </span>
                  <span>{tt.coursePage.accessOnMobile}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-icons text-violet-600" aria-hidden="true">
                    workspace_premium
                  </span>
                  <span>{tt.coursePage.certificateOfCompletion}</span>
                </div>
              </div>
            </section>

            <Divider />

            {modules.length > 0 ? (
              <section>
                <SectionHeading level={2}>{tt.coursePage.courseContent}</SectionHeading>
                <p className="text-sm sm:text-base text-gray-600 mt-2">
                  {modules.length} {tt.coursePage.modules} · {totalLessons} {tt.coursePage.lessons} · {totalHours}h{" "}
                  {remMinutes}m
                </p>

                <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                  {modules.map((module, i) => {
                    const moduleLessons = module.lessons ?? [];
                    const moduleDuration = moduleLessons.reduce((sum, lesson) => sum + (lesson.duration_minutes ?? 0), 0);
                    const moduleHours = Math.floor(moduleDuration / 60);
                    const moduleMinutes = moduleDuration % 60;

                    return (
                      <AccordionItem
                        key={module.id}
                        id={`module-${i}`}
                        title={
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-1">
                            <span className="text-sm sm:text-base font-semibold">{module.title}</span>
                            <span className="text-xs sm:text-sm text-gray-500 font-normal">
                              {moduleLessons.length} {tt.coursePage.lessons} ·{" "}
                              {moduleHours > 0 ? `${moduleHours}h ` : ""}
                              {moduleMinutes}m
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
                              {lesson.duration_minutes ? (
                                <span className="text-xs sm:text-sm text-gray-500 ml-2 flex-shrink-0">
                                  {lesson.duration_minutes}m
                                </span>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      </AccordionItem>
                    );
                  })}
                </div>
              </section>
            ) : null}

            <Divider />

            {prereqCourses.length > 0 || course.prerequisites ? (
              <section>
                <SectionHeading level={2}>{tt.coursePage.prerequisites}</SectionHeading>

                {prereqCourses.length > 0 ? (
                  <>
                    <p className="text-sm sm:text-base text-gray-600 mt-2 mb-4 sm:mb-6">
                      {tt.coursePage.completeBeforeStarting}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {prereqCourses.map((prereqCourse) => {
                        const levelLabel = prereqDifficultyDisplay(prereqCourse.difficulty_level);
                        const href = `${locPrefix}/training/${params.mastercategoryid}/${params.categoryCitySeo}/${params.subcategoryid}/${params.subcategoryCitySeo}/${prereqCourse.id}/${buildCourseCitySeo(prereqCourse.title, cityForHeading)}`;
                        const thumb = prereqCourse.thumbnail ? thumbnailUrl(prereqCourse.thumbnail) : null;
                        return (
                          <Link
                            key={prereqCourse.id}
                            href={href}
                            className="group block border-2 border-amber-200 bg-amber-50 rounded-lg sm:rounded-xl p-3 sm:p-5 hover:shadow-lg transition-all duration-200 hover:border-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
                          >
                            <div className="flex gap-3 sm:gap-4">
                              {thumb ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={thumb}
                                  alt={prereqCourse.title}
                                  className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-lg object-cover border border-amber-200/80 bg-white"
                                />
                              ) : null}
                              <div className="min-w-0 flex-1">
                                <span
                                  className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold mb-2 sm:mb-3 ${prereqDifficultyBadgeClass(levelLabel)}`}
                                >
                                  {levelLabel}
                                </span>
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors line-clamp-2">
                                  {prereqCourse.title}
                                </h3>
                                {prereqCourse.short_description ? (
                                  <p className="text-sm text-gray-600 line-clamp-2 mt-1 leading-snug">
                                    {prereqCourse.short_description}
                                  </p>
                                ) : null}
                                <span className="inline-flex items-center gap-1 sm:gap-2 text-amber-700 group-hover:text-amber-900 font-semibold text-xs sm:text-sm mt-3">
                                  <span>{tt.coursePage.viewDetails}</span>
                                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </span>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </>
                ) : null}

                {course.prerequisites ? (
                  <div
                    className={
                      prereqCourses.length > 0
                        ? "mt-6 sm:mt-8 space-y-2 border-t border-gray-200 pt-6 sm:pt-8"
                        : "mt-3 sm:mt-4 space-y-2"
                    }
                  >
                    {course.prerequisites
                      .split("\n")
                      .filter(Boolean)
                      .map((req, i) => (
                        <div key={`${req}-${i}`} className="flex gap-2 sm:gap-3">
                          <span className="text-gray-600">•</span>
                          <span className="text-sm sm:text-base text-gray-700">{req.replace(/^[•\-*]\s*/, "")}</span>
                        </div>
                      ))}
                  </div>
                ) : null}
              </section>
            ) : null}

            {course.description ? (
              <>
                <Divider />
                <section>
                  <SectionHeading level={2}>{tt.coursePage.description}</SectionHeading>
                  <div className="mt-4 sm:mt-6">
                    <div
                      className={`prose max-w-none text-sm sm:text-base ${!showFullDescription && course.description.length > 300 ? "max-h-48 sm:max-h-96 overflow-hidden relative" : ""}`}
                    >
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{course.description}</p>
                      {!showFullDescription && course.description.length > 300 ? (
                        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-white to-transparent" />
                      ) : null}
                    </div>
                    {course.description.length > 300 ? (
                      <button
                        type="button"
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="mt-3 sm:mt-4 text-violet-600 font-semibold hover:underline flex items-center gap-1 text-sm sm:text-base"
                      >
                        {showFullDescription ? tt.coursePage.showLess : tt.coursePage.showMore}
                        <span className="material-icons text-sm">
                          {showFullDescription ? "expand_less" : "expand_more"}
                        </span>
                      </button>
                    ) : null}
                  </div>
                </section>
              </>
            ) : null}

            <Divider />

            <section>
              <SectionHeading level={2}>{tt.coursePage.studentFeedback}</SectionHeading>

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
                            <div className="h-full bg-yellow-500" style={{ width: `${percent}%` }} />
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

              <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                {REVIEWS.slice(0, visibleReviews).map((review, i) => (
                  <article key={`${review.user}-${i}`} className="border-b pb-4 sm:pb-6">
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

                {visibleReviews < REVIEWS.length ? (
                  <button
                    type="button"
                    onClick={() => setVisibleReviews((v) => v + 3)}
                    className="w-full border-2 border-gray-900 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-colors text-sm sm:text-base"
                  >
                    {tt.coursePage.showMoreReviews}
                  </button>
                ) : null}
              </div>
            </section>

            <Divider />

            <section>
              <SectionHeading level={2}>{tt.coursePage.faqTitle}</SectionHeading>
              <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-4">
                {FAQS.map((faq, i) => (
                  <details key={`${faq.q}-${i}`} className="group border rounded-lg overflow-hidden">
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

            <section className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
                {tt.coursePage.whyChooseThisCourse}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {[
                  { icon: "school" as const, title: tt.coursePage.expertInstructorsTitle, desc: tt.coursePage.expertInstructorsDesc },
                  { icon: "build" as const, title: tt.coursePage.handsOnLabsTitle, desc: tt.coursePage.handsOnLabsDesc },
                  { icon: "workspace_premium" as const, title: tt.coursePage.certificationTitle, desc: tt.coursePage.certificationDesc },
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

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/20">
                {[
                  { value: `${averageRating}★`, label: "Rating", color: "text-yellow-400" },
                  { value: `${totalRatings.toLocaleString()}+`, label: "Students", color: "text-green-400" },
                  { value: String(totalLessons), label: tt.coursePage.lessons, color: "text-blue-300" },
                  { value: `${durationDisplayHours}h`, label: "Duration", color: "text-purple-300" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className={`text-lg sm:text-xl lg:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-[10px] sm:text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside
            id="enrollment-form"
            className="w-full lg:max-w-[400px] lg:shrink-0 min-w-0 lg:sticky lg:top-20 lg:z-20"
          >
            <div className="hidden lg:block w-full">
              <EnrollmentForm
                courseId={Number(params.courseId)}
                courseName={course.title}
                price={course.price != null ? Number(course.price) : 0}
                courseCurrency={course.currency ?? "INR"}
              />
            </div>
            <div className="lg:hidden w-full">
              <EnrollmentForm
                courseId={Number(params.courseId)}
                courseName={course.title}
                price={course.price != null ? Number(course.price) : 0}
                courseCurrency={course.currency ?? "INR"}
              />
            </div>
          </aside>
        </div>
      </div>

      <section className="bg-gradient-to-r from-violet-600 to-purple-600 py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4">
            {t(tt.coursePage.readyToMaster, { courseTitle: course.title })}
          </h2>
          <p className="text-white/90 text-sm sm:text-base lg:text-lg mb-2 max-w-3xl mx-auto">
            {t(tt.coursePage.readyToMasterDesc, {
              count: totalRatings.toLocaleString(),
              rating: averageRating,
            })}
          </p>
          <p className="text-white/90 text-xs sm:text-sm lg:text-lg mb-6 sm:mb-8 max-w-3xl mx-auto">
            ✅ {totalLessons} {tt.coursePage.lessons} • ✅ {durationDisplayHours}+ hours • ✅ {tt.coursePage.fullLifetimeAccess}
          </p>
          <button
            type="button"
            onClick={() => document.getElementById("enrollment-form")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-block bg-white text-violet-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base hover:bg-gray-100 transition-colors shadow-lg"
          >
            {tt.coursePage.enrollNow}
          </button>
        </div>
      </section>

      <MobileEnrollmentBar
        price={course.price != null ? Number(course.price) : 0}
        courseCurrency={course.currency ?? "INR"}
        enrollLabel={tt.coursePage.enrollNow}
      />

      <div className="h-20 lg:hidden" aria-hidden="true" />
    </div>
  );
}
