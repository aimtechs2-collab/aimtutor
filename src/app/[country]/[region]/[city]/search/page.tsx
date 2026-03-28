"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Clock,
  BarChart3,
  Users,
  AlertCircle,
  ArrowLeft,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { api } from "@/lib/api";
import { buildCourseCitySeo, slugify } from "@/lib/seoSlug";
import { thumbnailUrl } from "@/lib/staticUrl";
import { toAbsoluteUrl } from "@/lib/siteUrl";

type Course = {
  id: number;
  title: string;
  description?: string;
  short_description?: string;
  instructor_name?: string;
  difficulty_level?: string;
  price?: number;
  currency?: string;
  duration_hours?: number;
  enrollment_count?: number;
  thumbnail?: string;
  created_at?: string;
  master_category_id?: number;
  category_name?: string;
  subcategory_id?: number;
  subcategory_name?: string;
};

type Filters = {
  difficulty: string[];
  priceRange: "all" | "free" | "paid" | "custom";
  minPrice: string;
  maxPrice: string;
  duration: "all" | "short" | "medium" | "long";
  instructors: string[];
  sortBy: "relevance" | "newest" | "price_low" | "price_high" | "duration_short" | "duration_long";
};

function SearchPageInner() {
  const params = useParams<{ country: string; region: string; city: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    difficulty: [],
    priceRange: "all",
    minPrice: "",
    maxPrice: "",
    duration: "all",
    instructors: [],
    sortBy: "relevance",
  });

  const [expandedSections, setExpandedSections] = useState({
    difficulty: true,
    price: true,
    duration: true,
    instructor: true,
  });

  const locCountry = params.country || "in";
  const locRegion = params.region || "ts";
  const locCity = params.city || "hyderabad";
  const locPrefix = `/${locCountry}/${locRegion}/${slugify(locCity)}`;

  const cityTitle = locCity
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const canonicalUrl = toAbsoluteUrl(`${locPrefix}/search`);
  const pageTitle = searchQuery?.trim()
    ? `Search "${searchQuery.trim()}" Courses in ${cityTitle} | Aim Tutor`
    : `Search Technology Training Courses in ${cityTitle} | Aim Tutor`;
  const pageDescription = searchQuery?.trim()
    ? `Find technology training courses for "${searchQuery.trim()}" in ${cityTitle}. Browse curriculum, fees, and enroll with Aim Tutor.`
    : `Browse technology training courses in ${cityTitle}. Filter by difficulty, price, duration, and instructors.`;
  const pageKeywords = [
    "technology training courses",
    cityTitle,
    "AI training",
    "cloud training",
    "data science training",
    "machine learning courses",
    "DevOps training",
    "Aim Tutor",
  ].join(", ");

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.post("/api/v1/public/get-courses?page=1&per_page=1000");
        setAllCourses(response.data?.courses || []);
      } catch (err: unknown) {
        const ax = err as { response?: { data?: { message?: string } } };
        setError(ax.response?.data?.message || "Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };
    void fetchAllCourses();
  }, []);

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const filteredCourses = useMemo(() => {
    const result = [...allCourses];
    let out = result;

    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      out = out.filter((course) => {
        const searchableText = [
          course.title,
          course.description,
          course.short_description,
          course.instructor_name,
          course.difficulty_level,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchableText.includes(query);
      });
    }

    if (filters.difficulty.length > 0) {
      out = out.filter((course) => !!course.difficulty_level && filters.difficulty.includes(course.difficulty_level));
    }

    if (filters.priceRange === "free") {
      out = out.filter((course) => !course.price || course.price === 0);
    } else if (filters.priceRange === "paid") {
      out = out.filter((course) => !!course.price && course.price > 0);
    } else if (filters.priceRange === "custom") {
      out = out.filter((course) => {
        const price = course.price || 0;
        const min = Number.parseFloat(filters.minPrice) || 0;
        const max = Number.parseFloat(filters.maxPrice) || Number.POSITIVE_INFINITY;
        return price >= min && price <= max;
      });
    }

    if (filters.duration !== "all") {
      out = out.filter((course) => {
        const hours = course.duration_hours || 0;
        switch (filters.duration) {
          case "short":
            return hours <= 10;
          case "medium":
            return hours > 10 && hours <= 30;
          case "long":
            return hours > 30;
          default:
            return true;
        }
      });
    }

    if (filters.instructors.length > 0) {
      out = out.filter((course) => !!course.instructor_name && filters.instructors.includes(course.instructor_name));
    }

    switch (filters.sortBy) {
      case "price_low":
        out.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price_high":
        out.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "duration_short":
        out.sort((a, b) => (a.duration_hours || 0) - (b.duration_hours || 0));
        break;
      case "duration_long":
        out.sort((a, b) => (b.duration_hours || 0) - (a.duration_hours || 0));
        break;
      case "newest":
        out.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        break;
      default:
        break;
    }

    return out;
  }, [allCourses, searchQuery, filters]);

  const uniqueInstructors = useMemo(
    () => [...new Set(allCourses.map((c) => c.instructor_name).filter(Boolean))] as string[],
    [allCourses],
  );

  const handleFilterChange = (filterType: keyof Filters, value: string) => {
    setFilters((prev) => {
      if (filterType === "difficulty" || filterType === "instructors") {
        const currentValues = prev[filterType];
        const newValues = currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value];
        return { ...prev, [filterType]: newValues };
      }
      return { ...prev, [filterType]: value };
    });
  };

  const clearFilters = () => {
    setFilters({
      difficulty: [],
      priceRange: "all",
      minPrice: "",
      maxPrice: "",
      duration: "all",
      instructors: [],
      sortBy: "relevance",
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.replace(`${pathname}?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.replace(pathname);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    router.replace(pathname);
  };

  const formatCurrency = (amount: number, currency = "USD") =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);

  const getDifficultyColor = (level?: string) => {
    const colors: Record<string, string> = {
      Beginner: "bg-green-100 text-green-700",
      Intermediate: "bg-yellow-100 text-yellow-700",
      Advanced: "bg-red-100 text-red-700",
    };
    return colors[level || ""] || "bg-gray-100 text-gray-700";
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const activeFiltersCount =
    filters.difficulty.length +
    filters.instructors.length +
    (filters.priceRange !== "all" ? 1 : 0) +
    (filters.duration !== "all" ? 1 : 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80 flex-shrink-0">
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="w-full flex items-center justify-between bg-white border rounded-lg px-4 py-3 hover:bg-gray-50 transition-all duration-300"
              >
                <span className="flex items-center gap-2 font-semibold text-gray-900">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters{" "}
                  {activeFiltersCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">{activeFiltersCount}</span>
                  )}
                </span>
                {showMobileFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            <div className={`${showMobileFilters ? "block" : "hidden"} lg:block bg-white rounded-lg border shadow-sm overflow-hidden sticky top-24`}>
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </h3>
                  {activeFiltersCount > 0 && (
                    <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              <div className="divide-y max-h-[calc(100vh-12rem)] overflow-y-auto custom-scrollbar">
                <div className="p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="relevance">Most Relevant</option>
                    <option value="newest">Newest First</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="duration_short">Duration: Short to Long</option>
                    <option value="duration_long">Duration: Long to Short</option>
                  </select>
                </div>

                <div className="p-4">
                  <button onClick={() => toggleSection("difficulty")} className="w-full flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">Difficulty Level</span>
                    {expandedSections.difficulty ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expandedSections.difficulty && (
                    <div className="space-y-2">
                      {["Beginner", "Intermediate", "Advanced"].map((level) => (
                        <label key={level} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={filters.difficulty.includes(level)}
                            onChange={() => handleFilterChange("difficulty", level)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-blue-600">{level}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <button onClick={() => toggleSection("price")} className="w-full flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">Price Range</span>
                    {expandedSections.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expandedSections.price && (
                    <div className="space-y-2">
                      {[
                        { k: "all", label: "All Courses" },
                        { k: "free", label: "Free" },
                        { k: "paid", label: "Paid" },
                        { k: "custom", label: "Custom Range" },
                      ].map((opt) => (
                        <label key={opt.k} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="priceRange"
                            checked={filters.priceRange === opt.k}
                            onChange={() => handleFilterChange("priceRange", opt.k)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-blue-600">{opt.label}</span>
                        </label>
                      ))}
                      {filters.priceRange === "custom" && (
                        <div className="mt-3 space-y-2">
                          <input
                            type="number"
                            placeholder="Min Price"
                            value={filters.minPrice}
                            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                            className="w-full border rounded px-3 py-1.5 text-sm"
                          />
                          <input
                            type="number"
                            placeholder="Max Price"
                            value={filters.maxPrice}
                            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                            className="w-full border rounded px-3 py-1.5 text-sm"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <button onClick={() => toggleSection("duration")} className="w-full flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">Course Duration</span>
                    {expandedSections.duration ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expandedSections.duration && (
                    <div className="space-y-2">
                      {[
                        { k: "all", label: "All Durations" },
                        { k: "short", label: "Short (≤10 hours)" },
                        { k: "medium", label: "Medium (10-30 hours)" },
                        { k: "long", label: "Long (>30 hours)" },
                      ].map((opt) => (
                        <label key={opt.k} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="duration"
                            checked={filters.duration === opt.k}
                            onChange={() => handleFilterChange("duration", opt.k)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-blue-600">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <button onClick={() => toggleSection("instructor")} className="w-full flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">Instructor</span>
                    {expandedSections.instructor ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expandedSections.instructor && (
                    <div className="space-y-2 max-h-44 overflow-y-auto custom-scrollbar pr-1">
                      {uniqueInstructors.map((name) => (
                        <label key={name} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={filters.instructors.includes(name)}
                            onChange={() => handleFilterChange("instructors", name)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-blue-600 line-clamp-1">{name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.push(locPrefix)}
                    className="flex-shrink-0 p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all duration-300"
                    title="Back to Home"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{searchQuery ? `"${searchQuery}"` : "All Courses"}</h1>
                </div>

                <form onSubmit={handleSearch} className="flex-shrink-0 w-full md:w-auto">
                  <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden border-2 border-transparent focus-within:border-blue-500 transition-all duration-300">
                    <Search className="w-4 h-4 text-gray-400 ml-3" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search courses..."
                      className="bg-transparent px-3 py-2 outline-none text-gray-900 text-sm w-full md:w-64"
                    />
                    {searchQuery && (
                      <button type="button" onClick={handleClearSearch} className="px-2 text-gray-400 hover:text-gray-600" title="Clear search">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors">
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>

              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredCourses.length}</span> of {allCourses.length} courses
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <div>
                    <h3 className="font-semibold text-red-900">Error</h3>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {!loading && filteredCourses.length === 0 && (
              <div className="text-center py-16 bg-white rounded-lg border">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No courses found</h2>
                <p className="text-gray-600 mb-6">
                  {searchQuery ? `No results for "${searchQuery}". Try different keywords or clear filters.` : "Try adjusting your filters to see more results"}
                </p>
                {(activeFiltersCount > 0 || searchQuery) && (
                  <div className="flex gap-3 justify-center">
                    {searchQuery && (
                      <button onClick={handleClearSearch} className="inline-block bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                        Clear Search
                      </button>
                    )}
                    {activeFiltersCount > 0 && (
                      <button onClick={clearFilters} className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Clear Filters
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {filteredCourses.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`${locPrefix}/training/${course.master_category_id || 1}/${slugify(course.category_name || "general")}-training-${slugify(locCity)}/${course.subcategory_id || 1}/${slugify(course.subcategory_name || "general")}-training-${slugify(locCity)}/${course.id}/${buildCourseCitySeo(course.title, locCity)}`}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-blue-500"
                  >
                    <div className="relative h-48 bg-gradient-to-br from-blue-500 to-cyan-500 overflow-hidden">
                      {course.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={thumbnailUrl(course.thumbnail) ?? ""}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BarChart3 className="w-16 h-16 text-white/50" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(course.difficulty_level)}`}>
                          {course.difficulty_level}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.short_description}</p>
                      {course.instructor_name && <p className="text-sm text-gray-500 mb-3">By {course.instructor_name}</p>}

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        {course.duration_hours && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.duration_hours}h
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          {course.price && course.price > 0 ? (
                            <span className="text-2xl font-bold text-gray-900">{formatCurrency(course.price, course.currency || "USD")}</span>
                          ) : (
                            <span className="text-2xl font-bold text-green-600">FREE</span>
                          )}
                        </div>
                        <span className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">View Course</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center text-zinc-500">
          Loading search…
        </div>
      }
    >
      <SearchPageInner />
    </Suspense>
  );
}
