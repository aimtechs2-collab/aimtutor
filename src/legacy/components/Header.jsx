// src/components/Header.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Code2,
  Briefcase,
  Palette,
  Database,
  TrendingUp,
  Shield,
  Cpu,
  Globe,
  LayoutDashboard,
  LogIn
} from "lucide-react";
import AimTutorLogo from "../../components/brand/AimTutorLogo";
import api from "../utils/api";
import {
  buildCategoryCitySeo,
  buildSubcategoryCitySeo,
  slugify
} from "../utils/seoSlug";
import { getToken } from "../utils/auth"; // Import auth utility
import ChangeLocationButton from "./ChangeLocationButton.jsx";


/* ============================================
   CATEGORY ICON MAPPING
============================================ */
const getCategoryIcon = (categoryName) => {
  const iconMap = {
    development: Code2,
    business: Briefcase,
    design: Palette,
    database: Database,
    marketing: TrendingUp,
    security: Shield,
    technology: Cpu,
    default: Globe,
  };

  const key = Object.keys(iconMap).find(k =>
    categoryName.toLowerCase().includes(k)
  );
  return iconMap[key] || iconMap.default;
};

/* ============================================
   SKELETON LOADER COMPONENT
============================================ */
const SkeletonLoader = ({ count = 3 }) => (
  <div className="grid grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-5">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-100 rounded w-full"></div>
          <div className="h-3 bg-gray-100 rounded w-5/6"></div>
          <div className="h-3 bg-gray-100 rounded w-4/6"></div>
        </div>
      </div>
    ))}
  </div>
);

/* ============================================
   MAIN HEADER COMPONENT
============================================ */
const Header = ({ isHome }) => {
  /* ---------------- URL Parameters & Location ---------------- */
  const { country, region, city: cityParam } = useParams();
  const location = useLocation();

  /* ---------------- Location Prefix ---------------- */
  const locCountry = country || localStorage.getItem("user_country") || "in";
  const locRegion = region || localStorage.getItem("user_region") || "ts";
  const locCity = cityParam || localStorage.getItem("user_city") || "Hyderabad";

  const locPrefix = `/${locCountry}/${locRegion}/${slugify(locCity)}`;
  const city = locCity;

  /* ---------------- Component State ---------------- */
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTrainingOpen, setIsTrainingOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /* ---------------- Refs for Click Outside Detection ---------------- */
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const mobileButtonRef = useRef(null);

  /* ---------------- Check Authentication Status ---------------- */
  useEffect(() => {
    const checkAuth = () => {
      const token = getToken();
      const user = localStorage.getItem('user');
      setIsAuthenticated(!!token || !!user);
    };

    checkAuth();
    // Check auth status when localStorage changes
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [location]); // Also check when location changes

  /* ---------------- Active Link Detection ---------------- */
  const isActiveLink = (path) => {
    if (path === locPrefix) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  /* ---------------- Fetch Categories from API ---------------- */
  useEffect(() => {
    const fetchMasterCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await api.post(
          "/api/v1/public/get-mastercategories?subcategories=all"
        );

        setCategories(data.categories || []);
      } catch (err) {
        console.error("❌ Error fetching categories:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMasterCategories();
  }, []);

  /* ---------------- Scroll Effect ---------------- */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------------- Close Dropdown on Outside Click ---------------- */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsTrainingOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- ESC Key & Scroll Lock for Mobile Menu ---------------- */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsTrainingOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "unset";
      };
    }
  }, [isMobileMenuOpen]);

  /* ---------------- Helper Functions ---------------- */
  const closeAllMenus = useCallback(() => {
    setIsTrainingOpen(false);
    setIsMobileMenuOpen(false);
  }, []);

  const retryFetch = useCallback(() => window.location.reload(), []);

  /* ============================================
     JSX RENDER
  ============================================ */
  return (
    <>
      {/* CSS Styles */}
      <style>
        {`
          @keyframes slide-in {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fade-in-down {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-slide-in {
            animation: slide-in 0.4s ease-out forwards;
          }

          .animate-fade-in-down {
            animation: fade-in-down 0.3s ease-out;
          }

          .bg-size-200 {
            background-size: 200% 100%;
          }

          .bg-pos-0 {
            background-position: 0% 0%;
          }

          .bg-pos-100 {
            background-position: 100% 0%;
          }

          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        `}
      </style>

      {/* ============================================
          HEADER BAR
      ============================================ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isHome && !isScrolled
          ? "bg-transparent text-white shadow-none"
          : "bg-[#001e3c]/98 backdrop-blur-lg text-white shadow-xl border-b border-white/10"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* ---------------- Enhanced Logo with Background ---------------- */}
            <Link
              to={locPrefix}
              className="flex items-center flex-shrink-0 relative z-50 group"
              onClick={closeAllMenus}
            >
              <div className="relative">
                <div className="relative p-2">
                  <AimTutorLogo
                    variant="onDark"
                    size="lg"
                    className="transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
                  />
                </div>
              </div>


            </Link>

            {/* ============================================
                DESKTOP NAVIGATION
            ============================================ */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">

              {/* Home Link */}
              <Link
                to={locPrefix}
                className={`relative px-4 py-2 rounded-lg font-semibold text-base xl:text-lg transition-all duration-300 group ${isActiveLink(locPrefix) && location.pathname === locPrefix
                  ? "text-orange-400"
                  : "text-white hover:text-orange-400"
                  }`}
              >
                Home
                {isActiveLink(locPrefix) && location.pathname === locPrefix && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></span>
                )}
              </Link>

              {/* Training Dropdown Button */}
              <button
                ref={buttonRef}
                onClick={() => setIsTrainingOpen((s) => !s)}
                aria-expanded={isTrainingOpen}
                className={`relative px-4 py-2 rounded-lg font-semibold text-base xl:text-lg transition-all duration-300 flex items-center gap-1 ${isTrainingOpen || location.pathname.includes("/training")
                  ? "text-orange-400 bg-white/10"
                  : "text-white hover:text-orange-400 hover:bg-white/5"
                  }`}
              >
                Training
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${isTrainingOpen ? "rotate-180" : ""
                    }`}
                />
                {location.pathname.includes("/training") && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></span>
                )}
              </button>

              {/* About Link */}
              <Link
                to={`${locPrefix}/about`}
                className={`relative px-4 py-2 rounded-lg font-semibold text-base xl:text-lg transition-all duration-300 ${isActiveLink(`${locPrefix}/about`)
                  ? "text-orange-400"
                  : "text-white hover:text-orange-400"
                  }`}
              >
                About
                {isActiveLink(`${locPrefix}/about`) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></span>
                )}
              </Link>

              {/* Contact Link */}
              <Link
                to={`${locPrefix}/contact`}
                className={`relative px-4 py-2 rounded-lg font-semibold text-base xl:text-lg transition-all duration-300 ${isActiveLink(`${locPrefix}/contact`)
                  ? "text-orange-400"
                  : "text-white hover:text-orange-400"
                  }`}
              >
                Contact
                {isActiveLink(`${locPrefix}/contact`) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></span>
                )}
              </Link>
            </nav>

            {/* ---------------- Auth CTA (Desktop) ---------------- */}
            <div className="hidden lg:flex items-center">
              <Link
                to={isAuthenticated ? `/student/profile` : `${locPrefix}/login`}
                className="relative px-6 xl:px-8 py-2.5 rounded-full font-semibold
                 text-sm xl:text-base bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 
                 bg-pos-0 hover:bg-pos-100 text-white shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 
                 transform hover:scale-105 transition-all duration-500 overflow-hidden group flex items-center gap-2"
              >
                {isAuthenticated ? (
                  <>
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="relative z-10">Dashboard</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span className="relative z-10">Sign In</span>
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
              <ChangeLocationButton />
            </div>

            {/* ---------------- Mobile Menu Button ---------------- */}
            <button
              onClick={() => {
                setIsMobileMenuOpen((s) => !s);
                setIsTrainingOpen(false);
              }}
              className="lg:hidden p-2.5 rounded-xl hover:bg-white/10 transition-all duration-300 active:scale-95"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
              ) : (
                <Menu className="w-6 h-6 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>

        {/* ============================================
            MOBILE MENU
        ============================================ */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="bg-gradient-to-b from-[#001e3c] to-[#002a4d] border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="py-6 space-y-2">

                {/* Mobile Home Link */}
                <Link
                  to={locPrefix}
                  className={`block py-3 px-5 rounded-xl font-semibold transition-all duration-300 ${isActiveLink(locPrefix) && location.pathname === locPrefix
                    ? "bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400 border-l-4 border-orange-400"
                    : "text-white hover:bg-white/10 hover:translate-x-1"
                    }`}
                  onClick={closeAllMenus}
                >
                  Home
                </Link>

                {/* ============================================
                    MOBILE TRAINING DROPDOWN
                ============================================ */}
                <div className="overflow-hidden rounded-xl">
                  <button
                    ref={mobileButtonRef}
                    className={`w-full flex justify-between items-center py-3 px-5 rounded-xl font-semibold transition-all duration-300 ${isTrainingOpen || location.pathname.includes("/training")
                      ? "bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400"
                      : "text-white hover:bg-white/10"
                      }`}
                    onClick={() => setIsTrainingOpen((s) => !s)}
                  >
                    <span>Training</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${isTrainingOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {/* Mobile Training Submenu */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${isTrainingOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                  >
                    <div className="mt-2 ml-2 mr-2 bg-black/20 backdrop-blur-sm rounded-xl p-4 space-y-3 max-h-96 overflow-y-auto custom-scrollbar">

                      {/* Loading State */}
                      {loading && (
                        <div className="space-y-3">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                              <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                              <div className="h-3 bg-white/5 rounded w-full mb-1"></div>
                              <div className="h-3 bg-white/5 rounded w-5/6"></div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Error State */}
                      {error && (
                        <div className="text-center py-6 px-4 bg-red-500/10 rounded-lg border border-red-500/20">
                          <p className="text-red-400 text-sm font-medium mb-3">
                            Failed to load categories
                          </p>
                          <button
                            onClick={retryFetch}
                            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-xs font-semibold transition-all"
                          >
                            Retry
                          </button>
                        </div>
                      )}

                      {/* Categories List */}
                      {!loading &&
                        !error &&
                        categories.map((cat, idx) => (
                          <div
                            key={cat.id}
                            className="pb-3 border-b border-white/10 last:border-0 animate-slide-in"
                            style={{ animationDelay: `${idx * 50}ms` }}
                          >
                            <h4 className="font-bold mb-2.5 text-sm">
                              <Link
                                to={`${locPrefix}/training/${cat.id}/${buildCategoryCitySeo(cat.name, city)}`}
                                onClick={closeAllMenus}
                                className="text-white hover:text-orange-400 transition-colors duration-300 flex items-center gap-2 group"
                              >
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                {cat.name}
                              </Link>
                            </h4>

                            {/* Mobile Subcategory Links - FIXED with closeAllMenus */}
                            <ul className="space-y-2 ml-6">
                              {cat.subcategories?.map((subcat) => (
                                <li key={subcat.id}>
                                  <Link
                                    to={`${locPrefix}/training/${cat.id}/${buildCategoryCitySeo(cat.name, city)}/${subcat.id}/${buildSubcategoryCitySeo(subcat.name, city)}`}
                                    onClick={closeAllMenus}  // ✅ FIXED: Added closeAllMenus here
                                    className="text-sm text-gray-300 hover:text-orange-400 flex items-center gap-2 py-1 transition-all duration-300 group"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500 group-hover:bg-orange-400 transition-colors duration-300"></span>
                                    {subcat.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Mobile About Link */}
                <Link
                  to={`${locPrefix}/about`}
                  className={`block py-3 px-5 rounded-xl font-semibold transition-all duration-300 ${isActiveLink(`${locPrefix}/about`)
                    ? "bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400 border-l-4 border-orange-400"
                    : "text-white hover:bg-white/10 hover:translate-x-1"
                    }`}
                  onClick={closeAllMenus}
                >
                  About
                </Link>

                {/* Mobile Contact Link */}
                <Link
                  to={`${locPrefix}/contact`}
                  className={`block py-3 px-5 rounded-xl font-semibold transition-all duration-300 ${isActiveLink(`${locPrefix}/contact`)
                    ? "bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400 border-l-4 border-orange-400"
                    : "text-white hover:bg-white/10 hover:translate-x-1"
                    }`}
                  onClick={closeAllMenus}
                >
                  Contact
                </Link>

                {/* Mobile Auth CTA */}
                <div className="pt-4">
                  <Link
                    to={isAuthenticated ? `/student/profile` : `${locPrefix}/login`}
                    className="block w-full py-3 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 hover:bg-pos-100 text-white text-center rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02]"
                    onClick={closeAllMenus}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {isAuthenticated ? (
                        <>
                          <LayoutDashboard className="w-5 h-5" />
                          Dashboard
                        </>
                      ) : (
                        <>
                          <LogIn className="w-5 h-5" />
                          Sign In
                        </>
                      )}
                    </div>
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================
          DESKTOP MEGA MENU DROPDOWN
      ============================================ */}
      {isTrainingOpen &&
        typeof window !== "undefined" &&
        window.innerWidth >= 1024 && (
          <div
            ref={dropdownRef}
            className="fixed left-0 right-0 top-16 lg:top-20 z-40 animate-fade-in-down"
          >
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setIsTrainingOpen(false)}
              aria-hidden="true"
            />

            {/* Menu Content */}
            <div className="relative">
              <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 pt-2">
                <div className="bg-white shadow-2xl border border-gray-100 rounded-2xl overflow-hidden">
                  <div className="px-8 py-4">

                    {/* Loading State */}
                    {loading && <SkeletonLoader count={8} />}

                    {/* Error State */}
                    {error && (
                      <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                          <X className="w-8 h-8 text-red-600" />
                        </div>
                        <p className="text-red-600 font-semibold mb-4 text-lg">
                          Failed to load categories
                        </p>
                        <button
                          onClick={retryFetch}
                          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
                        >
                          Try Again
                        </button>
                      </div>
                    )}

                    {/* Categories Grid */}
                    {!loading && !error && categories.length > 0 && (
                      <>
                        <div className="grid grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-4">
                          {categories.map((cat, idx) => {
                            const IconComponent = getCategoryIcon(cat.name);
                            return (
                              <div
                                key={cat.id}
                                className="group animate-slide-in"
                                style={{ animationDelay: `${idx * 30}ms` }}
                              >
                                <h4 className="font-bold text-gray-900 mb-2 pb-1 border-b-2 border-gray-100 group-hover:border-blue-500 transition-all duration-300 text-sm flex items-center gap-2">
                                  <IconComponent className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                                  <Link
                                    to={`${locPrefix}/training/${cat.id}/${buildCategoryCitySeo(cat.name, city)}`}
                                    onClick={closeAllMenus}
                                    className="hover:text-blue-600 transition-colors duration-300"
                                  >
                                    {cat.name}
                                  </Link>
                                </h4>

                                {/* Desktop Subcategory Links - FIXED with closeAllMenus */}
                                <ul className="space-y-1">
                                  {cat.subcategories?.map((subcat) => (
                                    <li key={subcat.id}>
                                      <Link
                                        to={`${locPrefix}/training/${cat.id}/${buildCategoryCitySeo(cat.name, city)}/${subcat.id}/${buildSubcategoryCitySeo(subcat.name, city)}`}
                                        onClick={closeAllMenus}  // ✅ FIXED: Added closeAllMenus here
                                        className="text-xs text-gray-600 hover:text-blue-600 
                                        flex items-center gap-2 py-0.5 transition-all duration-300 group/link"
                                      >
                                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full group-hover/link:bg-blue-600 group-hover/link:scale-150 transition-all duration-300" />
                                        <span className="group-hover/link:translate-x-1 transition-transform duration-300">
                                          {subcat.name}
                                        </span>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            );
                          })}
                        </div>

                        {/* Bottom CTA */}
                        <div className="mt-4 pt-3 border-t border-gray-200 flex justify-center">
                          <Link
                            to={`${locPrefix}/training`}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                            onClick={closeAllMenus}
                          >
                            View All Training Courses
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </>
                    )}

                    {/* Empty State */}
                    {!loading && !error && categories.length === 0 && (
                      <div className="text-center py-12">
                        <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">
                          No categories available
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default Header;

