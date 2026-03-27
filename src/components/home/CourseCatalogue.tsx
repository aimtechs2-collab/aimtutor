"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { slugify, buildCourseCitySeo } from "@/lib/seoSlug";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Loader2,
  AlertCircle,
  Search,
  Calendar,
  Award,
  TrendingUp,
  FolderTree,
  Tag,
  ChevronRight,
} from "lucide-react";

const STATIC_URL = process.env.NEXT_PUBLIC_STATIC_URL ?? "";

function getImageUrl(thumbnailPath: string | null | undefined): string | null {
  if (!thumbnailPath) return null;
  const clean = thumbnailPath.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${STATIC_URL}/${clean}`;
}

type Course = {
  id: number;
  title: string;
  short_description?: string;
  duration_hours?: number;
  price?: number;
  currency?: string;
  thumbnail?: string;
  difficulty_level?: string;
  mastercategoryId: number;
  mastercategoryName: string;
  subcategoryId: number;
  subcategoryName: string;
  totalCoursesInSubcategory: number;
};

type Category = {
  id: number;
  name: string;
  subcategories?: Array<{
    id: number;
    name: string;
    courses?: Array<Record<string, unknown>>;
  }>;
};

export default function CourseCatalogue({ locPrefix, citySlug }: { locPrefix: string; citySlug: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.post<{ categories?: Category[] }>(
          "/api/v1/public/get-mastercategories?subcategories=true&courses=true"
        );
        const categoriesData = response.data.categories ?? [];
        if (cancelled) return;
        setCategories(categoriesData);

        const flattened: Course[] = [];
        categoriesData.forEach((category: Category) => {
          category.subcategories?.forEach((sub) => {
            if (sub.courses && sub.courses.length > 0) {
              const course = sub.courses[0] as Course;
              flattened.push({
                ...course,
                mastercategoryId: category.id,
                mastercategoryName: category.name,
                subcategoryId: sub.id,
                subcategoryName: sub.name,
                totalCoursesInSubcategory: sub.courses.length,
              });
            }
          });
        });
        setAllCourses(flattened);
      } catch (err: unknown) {
        if (cancelled) return;
        const msg = err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string }; status?: number } }).response?.data?.message
          : null;
        setError(msg || (err instanceof Error ? err.message : "Failed to fetch courses"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const buildCourseUrl = (course: Course) => {
    const categoryCitySeo = `${slugify(course.mastercategoryName)}-training-${citySlug}`;
    const subcategoryCitySeo = `${slugify(course.subcategoryName)}-training-${citySlug}`;
    const courseCitySeo = buildCourseCitySeo(course.title, citySlug);
    return `${locPrefix}/training/${course.mastercategoryId}/${categoryCitySeo}/${course.subcategoryId}/${subcategoryCitySeo}/${course.id}/${courseCitySeo}`;
  };

  const buildSubcategoryUrl = (course: Course) => {
    const categoryCitySeo = `${slugify(course.mastercategoryName)}-training-${citySlug}`;
    const subcategoryCitySeo = `${slugify(course.subcategoryName)}-training-${citySlug}`;
    return `${locPrefix}/training/${course.mastercategoryId}/${categoryCitySeo}/${course.subcategoryId}/${subcategoryCitySeo}`;
  };

  const filteredCourses = allCourses.filter((course) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      course.title?.toLowerCase().includes(q) ||
      course.short_description?.toLowerCase().includes(q) ||
      course.mastercategoryName?.toLowerCase().includes(q) ||
      course.subcategoryName?.toLowerCase().includes(q)
    );
  });

  const getDifficultyColor = (level: string) => {
    const colors: Record<string, string> = {
      Beginner: "bg-green-100 text-green-700 border-green-200",
      Intermediate: "bg-yellow-100 text-yellow-700 border-yellow-200",
      Advanced: "bg-red-100 text-red-700 border-red-200",
      Expert: "bg-purple-100 text-purple-700 border-purple-200",
    };
    return colors[level] ?? "bg-gray-100 text-gray-700 border-gray-200";
  };

  const totalCoursesCount = categories.reduce(
    (acc, cat) => acc + (cat.subcategories?.reduce((s, sub) => s + (sub.courses?.length ?? 0), 0) ?? 0),
    0
  );
  const subcategoriesWithCourses = categories.reduce(
    (acc, cat) => acc + (cat.subcategories?.filter((s) => s.courses && s.courses.length > 0).length ?? 0),
    0
  );

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex flex-col items-center justify-center min-h-[500px]">
            <Loader2 className="w-16 h-16 text-[#008080] animate-spin mb-4" />
            <h3 className="text-xl font-semibold text-[#001e3c] mb-2">Loading Training Programs...</h3>
            <p className="text-gray-700">Please wait while we fetch the latest content</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex flex-col items-center justify-center min-h-[500px]">
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#001e3c] mb-2">Failed to Load Courses</h3>
              <p className="text-gray-700 mb-6">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-[#008080] hover:bg-[#006666] text-white rounded-xl font-medium transition-all duration-300 shadow-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#008080] text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            <span>Professional Training</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#001e3c] mb-6">
            Our <span className="text-[#c2410c]"> Training Programs</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Explore {totalCoursesCount}+ comprehensive courses across {subcategoriesWithCourses} specializations
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-gradient-to-br from-[#001e3c] to-[#1e3a8a] rounded-2xl p-4 sm:p-6 shadow-lg text-white">
              <div className="text-2xl sm:text-3xl font-bold mb-1">{totalCoursesCount}</div>
              <div className="text-xs sm:text-sm opacity-90">Total Courses</div>
            </div>
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-[#008080]">
              <div className="text-2xl sm:text-3xl font-bold text-[#008080] mb-1">{categories.length}</div>
              <div className="text-xs sm:text-sm text-gray-700">Categories</div>
            </div>
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-[#1e3a8a]">
              <div className="text-2xl sm:text-3xl font-bold text-[#1e3a8a] mb-1">{subcategoriesWithCourses}</div>
              <div className="text-xs sm:text-sm text-gray-700">Specializations</div>
            </div>
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-[#c2410c]">
              <div className="text-2xl sm:text-3xl font-bold text-[#c2410c] mb-1">{allCourses.length}</div>
              <div className="text-xs sm:text-sm text-gray-700">Featured</div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by course name, category, or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#008080] focus:outline-none text-gray-700 transition-all"
            />
          </div>
        </div>

        <div className="mb-6 text-center">
          <p className="text-gray-700">
            Showing <span className="font-semibold text-[#001e3c]">{filteredCourses.length}</span> featured course
            {filteredCourses.length !== 1 ? "s" : ""}
            {searchQuery && (
              <>
                {" "}
                for &quot;<span className="text-[#008080]">{searchQuery}</span>&quot;
              </>
            )}
          </p>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#001e3c] mb-2">No courses found</h3>
            <p className="text-gray-700">
              {searchQuery ? "Try adjusting your search query" : "No courses available yet. Check back soon!"}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-4 px-6 py-2 bg-[#008080] text-white rounded-lg hover:bg-[#006666] transition"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const imgUrl = getImageUrl(course.thumbnail);
              return (
                <div
                  key={`${course.id}-${course.subcategoryId}`}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 group bg-white hover:border-blue-300 flex flex-col"
                >
                  <div className="mb-4 rounded-lg overflow-hidden h-40 bg-gradient-to-br from-blue-100 to-purple-100 relative">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-blue-300" />
                      </div>
                    )}
                    {course.totalCoursesInSubcategory > 1 && (
                      <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        +{course.totalCoursesInSubcategory - 1} more
                      </div>
                    )}
                  </div>

                  <div className="mb-3 flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                      <FolderTree className="w-3 h-3" />
                      {course.mastercategoryName}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                      <Tag className="w-3 h-3" />
                      {course.subcategoryName}
                    </span>
                  </div>

                  {course.difficulty_level && (
                    <div className="mb-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(course.difficulty_level)}`}
                      >
                        {course.difficulty_level}
                      </span>
                    </div>
                  )}

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                    {course.title}
                  </h3>

                  {course.short_description && (
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3 flex-1">{course.short_description}</p>
                  )}

                  <div className="space-y-2 mb-4 text-sm text-gray-700">
                    {course.duration_hours && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span>{course.duration_hours} hours</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-100 mt-auto space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        {course.price != null && course.price > 0 ? (
                          <div className="text-2xl font-bold text-blue-600">
                            {course.currency === "USD" ? "$" : "₹"}
                            {course.price.toLocaleString()}
                          </div>
                        ) : (
                          <div className="text-2xl font-bold text-green-600">FREE</div>
                        )}
                      </div>
                      <Link
                        href={buildCourseUrl(course)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        View Course
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                    {course.totalCoursesInSubcategory > 1 && (
                      <Link
                        href={buildSubcategoryUrl(course)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        View all {course.totalCoursesInSubcategory} {course.subcategoryName} courses
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {categories.length > 0 && !searchQuery && (
          <div className="mt-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-[#001e3c] mb-6 text-center">Courses by Category</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => {
                const courseCount =
                  category.subcategories?.reduce((acc, sub) => acc + (sub.courses?.length ?? 0), 0) ?? 0;
                if (courseCount === 0) return null;
                return (
                  <div
                    key={category.id}
                    className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <div className="text-2xl font-bold text-blue-600 mb-1">{courseCount}</div>
                    <div className="text-sm text-gray-700 font-medium">{category.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-10 sm:mt-16 md:mt-20 bg-gradient-to-br from-[#001e3c] to-[#1e3a8a] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center text-white relative overflow-hidden mx-4 sm:mx-0">
          <div className="relative z-10">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">Ready to Start Learning?</h3>
            <p className="text-sm sm:text-base md:text-xl text-gray-200 mb-6 sm:mb-8 max-w-2xl mx-auto px-2 sm:px-0">
              Explore our complete catalog of {totalCoursesCount}+ training programs or get personalized guidance
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
              <Link
                href={`${locPrefix}/training`}
                className="group w-full sm:w-auto px-5 py-3 sm:px-6 sm:py-3.5 md:px-8 md:py-4 min-h-[44px] bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Explore All Training Programs</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={`${locPrefix}/contact`}
                className="group w-full sm:w-auto px-5 py-3 sm:px-6 sm:py-3.5 md:px-8 md:py-4 min-h-[44px] bg-white hover:bg-gray-50 text-[#001e3c] rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base border-2 border-white/50 hover:border-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Schedule Consultation</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
