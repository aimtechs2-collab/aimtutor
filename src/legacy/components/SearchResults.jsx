import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useParams, Link, useNavigate } from 'react-router-dom';
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
  ChevronUp
} from 'lucide-react';
import api from '../utils/api';
import { slugify, buildCourseCitySeo } from '../utils/seoSlug';

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { country, region, city: cityParam } = useParams();
  const navigate = useNavigate();

  // ✅ State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // ✅ Filters State
  const [filters, setFilters] = useState({
    difficulty: [],
    priceRange: 'all',
    minPrice: '',
    maxPrice: '',
    duration: 'all',
    instructors: [],
    sortBy: 'relevance'
  });

  // ✅ Filter Sections Collapse State
  const [expandedSections, setExpandedSections] = useState({
    difficulty: true,
    price: true,
    duration: true,
    instructor: true
  });

  // ✅ Location
  const locCountry = country || localStorage.getItem("user_country") || "in";
  const locRegion = region || localStorage.getItem("user_region") || "ts";
  const locCity = cityParam || localStorage.getItem("user_city") || "Hyderabad";
  const locPrefix = `/${locCountry}/${locRegion}/${slugify(locCity)}`;

  // ✅ OPTIMIZATION: Fetch ALL courses ONCE on component mount
  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ Fetch ALL courses without search query (only once!)
        const response = await api.post('/api/v1/public/get-courses?page=1&per_page=1000');

        setAllCourses(response.data.courses || []);
        // console.log('✅ Fetched all courses:', response.data.courses?.length || 0);

      } catch (err) {
        console.error('❌ Fetch Error:', err);
        setError(err.response?.data?.message || 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchAllCourses();
  }, []); // ✅ Only runs ONCE on mount

  // ✅ Update search query from URL
  useEffect(() => {
    const query = searchParams.get('q');
    setSearchQuery(query || '');
  }, [searchParams]);

  // ✅ CLIENT-SIDE SEARCH & FILTER using useMemo for performance
  const filteredCourses = useMemo(() => {
    let result = [...allCourses];

    // ============================================
    // 1️⃣ CLIENT-SIDE SEARCH (No API call!)
    // ============================================
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      
      result = result.filter(course => {
        // Search in title, description, short_description, instructor name
        const searchableText = [
          course.title,
          course.description,
          course.short_description,
          course.instructor_name,
          course.difficulty_level
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return searchableText.includes(query);
      });
    }

    // ============================================
    // 2️⃣ DIFFICULTY FILTER
    // ============================================
    if (filters.difficulty.length > 0) {
      result = result.filter(course => 
        filters.difficulty.includes(course.difficulty_level)
      );
    }

    // ============================================
    // 3️⃣ PRICE RANGE FILTER
    // ============================================
    if (filters.priceRange === 'free') {
      result = result.filter(course => !course.price || course.price === 0);
    } else if (filters.priceRange === 'paid') {
      result = result.filter(course => course.price && course.price > 0);
    } else if (filters.priceRange === 'custom') {
      result = result.filter(course => {
        const price = course.price || 0;
        const min = parseFloat(filters.minPrice) || 0;
        const max = parseFloat(filters.maxPrice) || Infinity;
        return price >= min && price <= max;
      });
    }

    // ============================================
    // 4️⃣ DURATION FILTER
    // ============================================
    if (filters.duration !== 'all') {
      result = result.filter(course => {
        const hours = course.duration_hours || 0;
        switch (filters.duration) {
          case 'short': return hours <= 10;
          case 'medium': return hours > 10 && hours <= 30;
          case 'long': return hours > 30;
          default: return true;
        }
      });
    }

    // ============================================
    // 5️⃣ INSTRUCTOR FILTER
    // ============================================
    if (filters.instructors.length > 0) {
      result = result.filter(course => 
        filters.instructors.includes(course.instructor_name)
      );
    }

    // ============================================
    // 6️⃣ SORTING
    // ============================================
    switch (filters.sortBy) {
      case 'price_low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price_high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'duration_short':
        result.sort((a, b) => (a.duration_hours || 0) - (b.duration_hours || 0));
        break;
      case 'duration_long':
        result.sort((a, b) => (b.duration_hours || 0) - (a.duration_hours || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'relevance':
      default:
        // Keep original order or implement relevance scoring
        break;
    }

    return result;
  }, [allCourses, searchQuery, filters]); // ✅ Recalculates only when these change

  // ✅ Get Unique Instructors (memoized)
  const uniqueInstructors = useMemo(() => {
    return [...new Set(allCourses.map(c => c.instructor_name).filter(Boolean))];
  }, [allCourses]);

  // ✅ Handle Filter Change
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (filterType === 'difficulty' || filterType === 'instructors') {
        const currentValues = prev[filterType];
        const newValues = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value];
        return { ...prev, [filterType]: newValues };
      }
      return { ...prev, [filterType]: value };
    });
  };

  // ✅ Clear All Filters
  const clearFilters = () => {
    setFilters({
      difficulty: [],
      priceRange: 'all',
      minPrice: '',
      maxPrice: '',
      duration: 'all',
      instructors: [],
      sortBy: 'relevance'
    });
  };

  // ✅ Handle New Search (Updates URL only, no API call!)
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  // ✅ Clear Search (No API call!)
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  // ✅ Format Currency
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // ✅ Difficulty Badge Color
  const getDifficultyColor = (level) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-700',
      'Intermediate': 'bg-yellow-100 text-yellow-700',
      'Advanced': 'bg-red-100 text-red-700'
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  // ✅ Toggle Section
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // ✅ Active Filters Count
  const activeFiltersCount = 
    filters.difficulty.length + 
    filters.instructors.length + 
    (filters.priceRange !== 'all' ? 1 : 0) + 
    (filters.duration !== 'all' ? 1 : 0);

  // ✅ Get Static URL
  const getStaticUrl = (path) => {
    if (!path) return null;
    const staticUrl = import.meta.env.VITE_STATIC_URL || 'https://aifa-cloud.onrender.com/static/uploads/';
    const cleanPath = path.replace(/\\/g, '/').replace(/^\/+/, '');
    return `${staticUrl}${cleanPath}`;
  };

  // ✅ Loading State
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
    <div className="min-h-screen bg-gray-50 pt-16 lg:pt-20">
      
      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDEBAR - FILTERS */}
          <aside className="lg:w-80 flex-shrink-0">
            
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="w-full flex items-center justify-between bg-white border rounded-lg px-4 py-3 hover:bg-gray-50 transition-all duration-300"
              >
                <span className="flex items-center gap-2 font-semibold text-gray-900">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters {activeFiltersCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </span>
                {showMobileFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {/* Filters Container */}
            <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block bg-white rounded-lg border shadow-sm overflow-hidden sticky top-24`}>
              
              {/* Filter Header */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </h3>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Sections */}
              <div className="divide-y max-h-[calc(100vh-12rem)] overflow-y-auto custom-scrollbar">
                
                {/* Sort By */}
                <div className="p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
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

                {/* Difficulty Level */}
                <div className="p-4">
                  <button
                    onClick={() => toggleSection('difficulty')}
                    className="w-full flex items-center justify-between mb-3"
                  >
                    <span className="text-sm font-semibold text-gray-700">
                      Difficulty Level
                    </span>
                    {expandedSections.difficulty ? 
                      <ChevronUp className="w-4 h-4" /> : 
                      <ChevronDown className="w-4 h-4" />
                    }
                  </button>
                  
                  {expandedSections.difficulty && (
                    <div className="space-y-2">
                      {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                        <label key={level} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={filters.difficulty.includes(level)}
                            onChange={() => handleFilterChange('difficulty', level)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-blue-600">
                            {level}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Range */}
                <div className="p-4">
                  <button
                    onClick={() => toggleSection('price')}
                    className="w-full flex items-center justify-between mb-3"
                  >
                    <span className="text-sm font-semibold text-gray-700">
                      Price Range
                    </span>
                    {expandedSections.price ? 
                      <ChevronUp className="w-4 h-4" /> : 
                      <ChevronDown className="w-4 h-4" />
                    }
                  </button>
                  
                  {expandedSections.price && (
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={filters.priceRange === 'all'}
                          onChange={() => handleFilterChange('priceRange', 'all')}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-blue-600">All Courses</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={filters.priceRange === 'free'}
                          onChange={() => handleFilterChange('priceRange', 'free')}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-blue-600">Free</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={filters.priceRange === 'paid'}
                          onChange={() => handleFilterChange('priceRange', 'paid')}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-blue-600">Paid</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={filters.priceRange === 'custom'}
                          onChange={() => handleFilterChange('priceRange', 'custom')}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-blue-600">Custom Range</span>
                      </label>
                      
                      {filters.priceRange === 'custom' && (
                        <div className="mt-3 space-y-2">
                          <input
                            type="number"
                            placeholder="Min Price"
                            value={filters.minPrice}
                            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                            className="w-full border rounded px-3 py-1.5 text-sm"
                          />
                          <input
                            type="number"
                            placeholder="Max Price"
                            value={filters.maxPrice}
                            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                            className="w-full border rounded px-3 py-1.5 text-sm"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Duration */}
                <div className="p-4">
                  <button
                    onClick={() => toggleSection('duration')}
                    className="w-full flex items-center justify-between mb-3"
                  >
                    <span className="text-sm font-semibold text-gray-700">
                      Course Duration
                    </span>
                    {expandedSections.duration ? 
                      <ChevronUp className="w-4 h-4" /> : 
                      <ChevronDown className="w-4 h-4" />
                    }
                  </button>
                  
                  {expandedSections.duration && (
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="duration"
                          checked={filters.duration === 'all'}
                          onChange={() => handleFilterChange('duration', 'all')}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-blue-600">All Durations</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="duration"
                          checked={filters.duration === 'short'}
                          onChange={() => handleFilterChange('duration', 'short')}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-blue-600">Short (≤10 hours)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="duration"
                          checked={filters.duration === 'medium'}
                          onChange={() => handleFilterChange('duration', 'medium')}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-blue-600">Medium (10-30 hours)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="duration"
                          checked={filters.duration === 'long'}
                          onChange={() => handleFilterChange('duration', 'long')}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-blue-600">Long (&gt;30 hours)</span>
                      </label>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </aside>

          {/* RIGHT CONTENT - COURSES */}
          <div className="flex-1 min-w-0">
            
            {/* HEADER WITH SEARCH */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                
                {/* Left: Back Button + Title */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(locPrefix)}
                    className="flex-shrink-0 p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all duration-300"
                    title="Back to Home"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {searchQuery ? `"${searchQuery}"` : 'All Courses'}
                  </h1>
                </div>

                {/* Right: Compact Search Bar */}
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
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="px-2 text-gray-400 hover:text-gray-600"
                        title="Clear search"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Results Count */}
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredCourses.length}</span> of {allCourses.length} courses
              </p>
            </div>

            {/* Error State */}
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

            {/* No Results */}
            {!loading && filteredCourses.length === 0 && (
              <div className="text-center py-16 bg-white rounded-lg border">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No courses found</h2>
                <p className="text-gray-600 mb-6">
                  {searchQuery 
                    ? `No results for "${searchQuery}". Try different keywords or clear filters.`
                    : 'Try adjusting your filters to see more results'
                  }
                </p>
                {(activeFiltersCount > 0 || searchQuery) && (
                  <div className="flex gap-3 justify-center">
                    {searchQuery && (
                      <button
                        onClick={handleClearSearch}
                        className="inline-block bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Clear Search
                      </button>
                    )}
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Course Grid */}
            {filteredCourses.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <Link
                    key={course.id}
                    to={`${locPrefix}/training/${course.master_category_id || 1}/${slugify(course.category_name || 'general')}-training-${slugify(locCity)}/${course.subcategory_id || 1}/${slugify(course.subcategory_name || 'general')}-training-${slugify(locCity)}/${course.id}/${buildCourseCitySeo(course.title, locCity)}`}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-blue-500"
                  >
                    {/* Course Image */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-500 to-cyan-500 overflow-hidden">
                      {course.thumbnail ? (
                        <img
                          src={getStaticUrl(course.thumbnail)}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BarChart3 className="w-16 h-16 text-white/50" />
                        </div>
                      )}
                      
                      {/* Difficulty Badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(course.difficulty_level)}`}>
                          {course.difficulty_level}
                        </span>
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="p-5">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>

                      {/* Short Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {course.short_description}
                      </p>

                      {/* Instructor */}
                      {course.instructor_name && (
                        <p className="text-sm text-gray-500 mb-3">
                          By {course.instructor_name}
                        </p>
                      )}

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        {course.duration_hours && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.duration_hours}h
                          </span>
                        )}
                        {/* enrollment_count removed */}
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          {course.price && course.price > 0 ? (
                            <span className="text-2xl font-bold text-gray-900">
                              {formatCurrency(course.price, course.currency)}
                            </span>
                          ) : (
                            <span className="text-2xl font-bold text-green-600">
                              FREE
                            </span>
                          )}
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold">
                          View Course
                        </button>
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

export default SearchResults;