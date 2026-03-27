import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
  slugify,
  buildCourseCitySeo
} from '../utils/seoSlug';
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
  ChevronRight
} from 'lucide-react';


function CourseCatalogue() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [allCourses, setAllCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // ✅ Get location from URL or localStorage
  const { country, region, city: cityParam } = useParams();
  const locCountry = country || localStorage.getItem("user_country") || "in";
  const locRegion = region || localStorage.getItem("user_region") || "ts";
  const locCity = cityParam || localStorage.getItem("user_city") || "Hyderabad";
  const locPrefix = `/${locCountry}/${locRegion}/${slugify(locCity)}`;
  const cityForHeading = slugify(locCity);


  // Helper: Get Full Image URL
  const getImageUrl = (thumbnailPath) => {
    if (!thumbnailPath) return null;
    const staticUrl = import.meta.env.VITE_STATIC_URL || 'https://aifa-cloud.onrender.com/static/uploads/';
    const cleanPath = thumbnailPath.replace(/\\/g, '/').replace(/^\/+/, '');
    return `${staticUrl}${cleanPath}`;
  };


  useEffect(() => {
    fetchCourses();
  }, []);


  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);


      const response = await api.post(`/api/v1/public/get-mastercategories?subcategories=true&courses=true`);


      const categoriesData = response.data.categories || [];
      setCategories(categoriesData);


      // ✅ FIXED: Flatten - ONLY 1 COURSE PER SUBCATEGORY
      const flattenedCourses = [];


      categoriesData.forEach(category => {
        category.subcategories?.forEach(subcategory => {
          // ✅ Only take the FIRST course from each subcategory
          if (subcategory.courses && subcategory.courses.length > 0) {
            const course = subcategory.courses[0];
            flattenedCourses.push({
              ...course,
              mastercategoryId: category.id,
              mastercategoryName: category.name,
              subcategoryId: subcategory.id,
              subcategoryName: subcategory.name,
              totalCoursesInSubcategory: subcategory.courses.length,
            });
          }
        });
      });


      setAllCourses(flattenedCourses);


    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch courses');
      console.error('❌ Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };


  // ✅ Build SEO-friendly URL for course
  const buildCourseUrl = (course) => {
    const categoryCitySeo = `${slugify(course.mastercategoryName)}-training-${cityForHeading}`;
    const subcategoryCitySeo = `${slugify(course.subcategoryName)}-training-${cityForHeading}`;
    const courseCitySeo = buildCourseCitySeo(course.title, cityForHeading);


    return `${locPrefix}/training/${course.mastercategoryId}/${categoryCitySeo}/${course.subcategoryId}/${subcategoryCitySeo}/${course.id}/${courseCitySeo}`;
  };


  // ✅ Build SEO-friendly URL for subcategory (to see all courses)
  const buildSubcategoryUrl = (course) => {
    const categoryCitySeo = `${slugify(course.mastercategoryName)}-training-${cityForHeading}`;
    const subcategoryCitySeo = `${slugify(course.subcategoryName)}-training-${cityForHeading}`;


    return `${locPrefix}/training/${course.mastercategoryId}/${categoryCitySeo}/${course.subcategoryId}/${subcategoryCitySeo}`;
  };


  // Filter courses based on search query
  const filteredCourses = allCourses.filter(course => {
    if (!searchQuery) return true;


    const searchLower = searchQuery.toLowerCase();
    return (
      course.title?.toLowerCase().includes(searchLower) ||
      course.short_description?.toLowerCase().includes(searchLower) ||
      course.mastercategoryName?.toLowerCase().includes(searchLower) ||
      course.subcategoryName?.toLowerCase().includes(searchLower)
    );
  });


  // Get difficulty color
  const getDifficultyColor = (level) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-700 border-green-200',
      'Intermediate': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Advanced': 'bg-red-100 text-red-700 border-red-200',
      'Expert': 'bg-purple-100 text-purple-700 border-purple-200',
    };
    return colors[level] || 'bg-gray-100 text-gray-700 border-gray-200';
  };


  // ✅ Calculate total courses across all subcategories
  const totalCoursesCount = categories.reduce((acc, category) => {
    return acc + category.subcategories?.reduce((subAcc, sub) => {
      return subAcc + (sub.courses?.length || 0);
    }, 0);
  }, 0);


  // ✅ Count subcategories with courses
  const subcategoriesWithCourses = categories.reduce((acc, category) => {
    return acc + (category.subcategories?.filter(sub => sub.courses?.length > 0).length || 0);
  }, 0);


  // Loading State
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


  // Error State
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
                onClick={fetchCourses}
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
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#008080] text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            <span>Professional Training</span>
          </div>


          <h1 className="text-4xl md:text-5xl font-bold text-[#001e3c] mb-6">
            Our
            <span className="text-[#c2410c]"> Training Programs</span>
          </h1>


          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Explore {totalCoursesCount}+ comprehensive courses across {subcategoriesWithCourses} specializations designed to accelerate your career growth
          </p>


          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-gradient-to-br from-[#001e3c] to-[#1e3a8a] rounded-2xl p-4 sm:p-6 shadow-lg text-white">
              <div className="text-2xl sm:text-3xl font-bold mb-1">{totalCoursesCount}</div>
              <div className="text-xs sm:text-sm opacity-90">Total Courses</div>
            </div>
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-[#008080]">
              <div className="text-2xl sm:text-3xl font-bold text-[#008080] mb-1">
                {categories.length}
              </div>
              <div className="text-xs sm:text-sm text-gray-700">Categories</div>
            </div>
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-[#1e3a8a]">
              <div className="text-2xl sm:text-3xl font-bold text-[#1e3a8a] mb-1">
                {subcategoriesWithCourses}
              </div>
              <div className="text-xs sm:text-sm text-gray-700">Specializations</div>
            </div>
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-[#c2410c]">
              <div className="text-2xl sm:text-3xl font-bold text-[#c2410c] mb-1">
                {allCourses.length}
              </div>
              <div className="text-xs sm:text-sm text-gray-700">Featured</div>
            </div>
          </div>
        </div>


        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by course name, category, or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#008080] focus:outline-none text-gray-700 transition-all"
            />
          </div>
        </div>


        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-gray-700">
            Showing <span className="font-semibold text-[#001e3c]">{filteredCourses.length}</span> featured course{filteredCourses.length !== 1 ? 's' : ''} (1 per specialization)
            {searchQuery && <span> for "<span className="text-[#008080]">{searchQuery}</span>"</span>}
          </p>
        </div>


        {/* COURSES GRID */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#001e3c] mb-2">No courses found</h3>
            <p className="text-gray-700">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'No courses available yet. Check back soon!'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-6 py-2 bg-[#008080] text-white rounded-lg hover:bg-[#006666] transition"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <div
                key={`${course.id}-${course.subcategoryId}`}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 group bg-white hover:border-blue-300 flex flex-col"
                style={{
                  animation: 'fadeIn 0.5s ease-out',
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'both'
                }}
              >
                {/* Course Thumbnail */}
                <div className="mb-4 rounded-lg overflow-hidden h-40 bg-gradient-to-br from-blue-100 to-purple-100 relative">
                  {course.thumbnail ? (
                    <>
                      <img
                        src={getImageUrl(course.thumbnail)}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const placeholder = e.target.nextElementSibling;
                          if (placeholder) placeholder.style.display = 'flex';
                        }}
                      />
                      <div className="absolute inset-0 items-center justify-center hidden">
                        <BookOpen className="w-16 h-16 text-blue-300" />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-blue-300" />
                    </div>
                  )}


                  {/* ✅ Badge showing more courses available */}
                  {course.totalCoursesInSubcategory > 1 && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      +{course.totalCoursesInSubcategory - 1} more
                    </div>
                  )}
                </div>


                {/* Badges Row */}
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


                {/* Difficulty Badge */}
                {course.difficulty_level && (
                  <div className="mb-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(course.difficulty_level)}`}>
                      {course.difficulty_level}
                    </span>
                  </div>
                )}


                {/* Course Title */}
                <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                  {course.title}
                </h2>


                {/* Description */}
                {course.short_description && (
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3 flex-1">
                    {course.short_description}
                  </p>
                )}


                {/* Course Meta Info */}
                <div className="space-y-2 mb-4 text-sm text-gray-700">
                  {course.duration_hours && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>{course.duration_hours} hours</span>
                    </div>
                  )}
                </div>


                {/* Price & CTAs */}
                <div className="pt-4 border-t border-gray-100 mt-auto space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      {course.price && course.price > 0 ? (
                        <div className="text-2xl font-bold text-blue-600">
                          {course.currency === 'USD' ? '$' : '₹'}
                          {course.price.toLocaleString()}
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-green-600">
                          FREE
                        </div>
                      )}
                    </div>


                    <Link
                      to={buildCourseUrl(course)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      View Course
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>


                  {/* ✅ Link to see all courses in subcategory */}
                  {course.totalCoursesInSubcategory > 1 && (
                    <Link
                      to={buildSubcategoryUrl(course)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      View all {course.totalCoursesInSubcategory} {course.subcategoryName} courses
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}


        {/* Category Statistics */}
        {categories.length > 0 && !searchQuery && (
          <div className="mt-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-[#001e3c] mb-6 text-center">
              Courses by Category
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map(category => {
                const courseCount = category.subcategories?.reduce(
                  (acc, sub) => acc + (sub.courses?.length || 0),
                  0
                ) || 0;


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


        {/* Bottom CTA Section */}
        <div className="mt-10 sm:mt-16 md:mt-20 
                bg-gradient-to-br from-[#001e3c] to-[#1e3a8a] 
                rounded-2xl sm:rounded-3xl 
                p-6 sm:p-8 md:p-12 
                text-center text-white relative overflow-hidden
                mx-4 sm:mx-0">


          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '30px 30px'
            }}></div>
          </div>


          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 
                  bg-gradient-to-br from-orange-500/20 to-transparent 
                  rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 
                  bg-gradient-to-tr from-blue-500/20 to-transparent 
                  rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>


          <div className="relative z-10">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
              Ready to Start Learning?
            </h3>


            <p className="text-sm sm:text-base md:text-xl text-gray-200 mb-6 sm:mb-8 max-w-2xl mx-auto px-2 sm:px-0">
              Explore our complete catalog of {totalCoursesCount}+ training programs or get personalized guidance from our experts
            </p>


            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
              <Link
                to={`${locPrefix}/training`}
                className="group w-full sm:w-auto
       px-5 py-3 sm:px-6 sm:py-3.5 md:px-8 md:py-4 min-h-[44px]
       bg-[#f97316] hover:bg-[#ea580c] 
       text-white rounded-lg sm:rounded-xl 
       font-semibold text-sm sm:text-base
       shadow-xl hover:shadow-2xl 
       transform hover:-translate-y-1 
       transition-all duration-300 
       flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Explore All Training Programs</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>


              <Link
                to={`${locPrefix}/contact`}
                className="group w-full sm:w-auto
       px-5 py-3 sm:px-6 sm:py-3.5 md:px-8 md:py-4 min-h-[44px]
       bg-white hover:bg-gray-50
       text-[#001e3c]
       rounded-lg sm:rounded-xl 
       font-semibold text-sm sm:text-base
       border-2 border-white/50 hover:border-white
       shadow-lg hover:shadow-xl
       transition-all duration-300 
       flex items-center justify-center gap-2"
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


export default CourseCatalogue;
