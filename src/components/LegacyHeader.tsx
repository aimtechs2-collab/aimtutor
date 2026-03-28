"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Briefcase,
  ChevronDown,
  ChevronRight,
  Code2,
  Cpu,
  Database,
  Globe,
  LayoutDashboard,
  LogIn,
  Menu,
  Palette,
  Shield,
  TrendingUp,
  X,
} from "lucide-react";
import { api } from "@/lib/api";
import {
  buildCategoryCitySeo,
  buildSubcategoryCitySeo,
  slugify,
} from "@/lib/seoSlug";
import { getToken, getUser } from "@/lib/auth";
import ChangeLocationButton from "@/components/ChangeLocationButton";
import AimTutorLogo from "@/components/brand/AimTutorLogo";
import type { Translations } from "@/translations/en";

const getCategoryIcon = (categoryName: string) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    development: Code2,
    business: Briefcase,
    design: Palette,
    database: Database,
    marketing: TrendingUp,
    security: Shield,
    technology: Cpu,
    default: Globe,
  };
  const key = Object.keys(iconMap).find((k) =>
    categoryName.toLowerCase().includes(k)
  );
  return iconMap[key || "default"] || iconMap.default;
};

const SkeletonLoader = ({ count = 3 }: { count?: number }) => (
  <div className="grid grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-5">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-5/6" />
          <div className="h-3 bg-gray-100 rounded w-4/6" />
        </div>
      </div>
    ))}
  </div>
);

type Category = {
  id: number;
  name: string;
  subcategories?: Array<{ id: number; name: string }>;
};

export default function LegacyHeader({
  isHome,
  country,
  region,
  city,
  translations: tt,
}: {
  isHome: boolean;
  country: string;
  region: string;
  city: string;
  translations: Translations;
}) {
  const pathname = usePathname();

  const locCountry = (country || "in").toLowerCase();
  const locRegion = (region || "ts").toLowerCase();
  const locCity = city || "Hyderabad";
  const locPrefix = `/${locCountry}/${locRegion}/${slugify(locCity)}`;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTrainingOpen, setIsTrainingOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const mobileButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = getToken();
      const user = getUser();
      setIsAuthenticated(!!token || !!user);
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [pathname]);

  const isActiveLink = (path: string) => {
    if (path === locPrefix) return pathname === path;
    return pathname.startsWith(path);
  };

  useEffect(() => {
    const fetchMasterCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.post(
          "/api/v1/public/get-mastercategories?subcategories=all"
        );
        setCategories((data.categories || []) as Category[]);
      } catch (err: unknown) {
        const e = err as { message?: string };
        setError(e?.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    fetchMasterCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const t = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(t) &&
        buttonRef.current &&
        !buttonRef.current.contains(t)
      ) {
        setIsTrainingOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  const closeAllMenus = useCallback(() => {
    setIsTrainingOpen(false);
    setIsMobileMenuOpen(false);
  }, []);

  const retryFetch = useCallback(() => window.location.reload(), []);

  return (
    <>
      <style>{`
        @keyframes slide-in { from { opacity: 0; transform: translateY(-10px);} to {opacity: 1; transform: translateY(0);} }
        @keyframes fade-in-down { from {opacity: 0; transform: translateY(-20px);} to {opacity:1; transform: translateY(0);} }
        .animate-slide-in { animation: slide-in 0.4s ease-out forwards; }
        .animate-fade-in-down { animation: fade-in-down 0.3s ease-out; }
        .bg-size-200 { background-size: 200% 100%; }
        .bg-pos-0 { background-position: 0% 0%; }
        .bg-pos-100 { background-position: 100% 0%; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
      `}</style>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out text-white border-b border-white/10 overflow-hidden ${
          isHome && !isScrolled
            ? "bg-[#0a0e1a]/92 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
            : "bg-[#0d1528]/96 backdrop-blur-xl shadow-xl"
        }`}
      >
        {/* Subtle network / mesh accent (matches home hero treatment) */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          aria-hidden="true"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(56, 189, 248, 0.85) 1px, transparent 0)`,
            backgroundSize: "36px 36px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 lg:h-20 gap-2 sm:gap-4">
            <div className="flex-1 flex justify-start min-w-0">
              <Link
                href={locPrefix}
                className="flex items-center flex-shrink-0 relative z-50 group"
                onClick={closeAllMenus}
              >
                <div className="relative p-1 sm:p-2">
                  <AimTutorLogo
                    variant="onDark"
                    size="lg"
                    className="transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
                  />
                </div>
              </Link>
            </div>

            <nav className="hidden lg:flex flex-none items-center justify-center gap-0 xl:gap-1 px-2">
              <Link
                href={locPrefix}
                className={`relative px-5 py-2 rounded-lg font-semibold text-base xl:text-lg transition-all duration-300 group ${
                  isActiveLink(locPrefix) && pathname === locPrefix
                    ? "text-orange-400"
                    : "text-white hover:text-orange-400"
                }`}
              >
                {tt.nav.home}
                {isActiveLink(locPrefix) && pathname === locPrefix && (
                  <span
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-11 h-1.5 rounded-sm bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.65)]"
                    aria-hidden="true"
                  />
                )}
              </Link>

              <button
                ref={buttonRef}
                type="button"
                onClick={() => setIsTrainingOpen((s) => !s)}
                aria-expanded={isTrainingOpen}
                className={`relative px-5 py-2 rounded-lg font-semibold text-base xl:text-lg transition-all duration-300 flex items-center gap-1 ${
                  isTrainingOpen || pathname.includes("/training")
                    ? "text-orange-400 bg-white/10"
                    : "text-white hover:text-orange-400 hover:bg-white/5"
                }`}
              >
                {tt.nav.training}
                <ChevronDown
                  className={`w-4 h-4 opacity-90 transition-transform duration-300 ${
                    isTrainingOpen ? "rotate-180" : ""
                  }`}
                />
                {pathname.includes("/training") && (
                  <span
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-11 h-1.5 rounded-sm bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.65)]"
                    aria-hidden="true"
                  />
                )}
              </button>

              <Link
                href={`${locPrefix}/about`}
                className={`relative px-5 py-2 rounded-lg font-semibold text-base xl:text-lg transition-all duration-300 ${
                  isActiveLink(`${locPrefix}/about`)
                    ? "text-orange-400"
                    : "text-white hover:text-orange-400"
                }`}
              >
                {tt.nav.about}
                {isActiveLink(`${locPrefix}/about`) && (
                  <span
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-11 h-1.5 rounded-sm bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.65)]"
                    aria-hidden="true"
                  />
                )}
              </Link>

              <Link
                href={`${locPrefix}/contact`}
                className={`relative px-5 py-2 rounded-lg font-semibold text-base xl:text-lg transition-all duration-300 ${
                  isActiveLink(`${locPrefix}/contact`)
                    ? "text-orange-400"
                    : "text-white hover:text-orange-400"
                }`}
              >
                {tt.nav.contact}
                {isActiveLink(`${locPrefix}/contact`) && (
                  <span
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-11 h-1.5 rounded-sm bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.65)]"
                    aria-hidden="true"
                  />
                )}
              </Link>
            </nav>

            <div className="flex-1 flex justify-end items-center gap-0 min-w-0">
              <div className="hidden lg:flex items-center gap-1">
                <Link
                  href={isAuthenticated ? "/student/profile" : `${locPrefix}/login`}
                  className="relative px-6 xl:px-7 py-2.5 rounded-full font-semibold text-sm xl:text-base whitespace-nowrap bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/40 transform hover:scale-[1.03] transition-all duration-500 overflow-hidden group flex items-center gap-2"
                >
                  {isAuthenticated ? (
                    <>
                      <LayoutDashboard className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">{tt.nav.dashboard}</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">{tt.nav.signIn}</span>
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
                <ChangeLocationButton city={locCity} />
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen((s) => !s);
                  setIsTrainingOpen(false);
                }}
                className="lg:hidden p-2.5 rounded-xl hover:bg-white/10 transition-all duration-300 active:scale-95 ml-auto"
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
        </div>

        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-gradient-to-b from-[#001e3c] to-[#002a4d] border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="py-6 space-y-2">
                <Link
                  href={locPrefix}
                  className={`block py-3 px-5 rounded-xl font-semibold transition-all duration-300 ${
                    isActiveLink(locPrefix) && pathname === locPrefix
                      ? "bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400 border-l-4 border-orange-400"
                      : "text-white hover:bg-white/10 hover:translate-x-1"
                  }`}
                  onClick={closeAllMenus}
                >
                  {tt.nav.home}
                </Link>

                <div className="overflow-hidden rounded-xl">
                  <button
                    ref={mobileButtonRef}
                    className={`w-full flex justify-between items-center py-3 px-5 rounded-xl font-semibold transition-all duration-300 ${
                      isTrainingOpen || pathname.includes("/training")
                        ? "bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400"
                        : "text-white hover:bg-white/10"
                    }`}
                    onClick={() => setIsTrainingOpen((s) => !s)}
                  >
                    <span>{tt.nav.training}</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isTrainingOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isTrainingOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="mt-2 ml-2 mr-2 bg-black/20 backdrop-blur-sm rounded-xl p-4 space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                      {loading && (
                        <div className="space-y-3">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                              <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                              <div className="h-3 bg-white/5 rounded w-full mb-1" />
                              <div className="h-3 bg-white/5 rounded w-5/6" />
                            </div>
                          ))}
                        </div>
                      )}

                      {error && (
                        <div className="text-center py-6 px-4 bg-red-500/10 rounded-lg border border-red-500/20">
                          <p className="text-red-400 text-sm font-medium mb-3">
                            {tt.nav.failedToLoad}
                          </p>
                          <button
                            onClick={retryFetch}
                            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-xs font-semibold transition-all"
                          >
                            {tt.nav.retry}
                          </button>
                        </div>
                      )}

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
                                href={`${locPrefix}/training/${cat.id}/${buildCategoryCitySeo(
                                  cat.name,
                                  locCity
                                )}`}
                                onClick={closeAllMenus}
                                className="text-white hover:text-orange-400 transition-colors duration-300 flex items-center gap-2 group"
                              >
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                {cat.name}
                              </Link>
                            </h4>

                            <ul className="space-y-2 ml-6">
                              {cat.subcategories?.map((subcat) => (
                                <li key={subcat.id}>
                                  <Link
                                    href={`${locPrefix}/training/${cat.id}/${buildCategoryCitySeo(
                                      cat.name,
                                      locCity
                                    )}/${subcat.id}/${buildSubcategoryCitySeo(
                                      subcat.name,
                                      locCity
                                    )}`}
                                    onClick={closeAllMenus}
                                    className="text-sm text-gray-300 hover:text-orange-400 flex items-center gap-2 py-1 transition-all duration-300 group"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500 group-hover:bg-orange-400 transition-colors duration-300" />
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

                <Link
                  href={`${locPrefix}/about`}
                  className={`block py-3 px-5 rounded-xl font-semibold transition-all duration-300 ${
                    isActiveLink(`${locPrefix}/about`)
                      ? "bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400 border-l-4 border-orange-400"
                      : "text-white hover:bg-white/10 hover:translate-x-1"
                  }`}
                  onClick={closeAllMenus}
                >
                  {tt.nav.about}
                </Link>

                <Link
                  href={`${locPrefix}/contact`}
                  className={`block py-3 px-5 rounded-xl font-semibold transition-all duration-300 ${
                    isActiveLink(`${locPrefix}/contact`)
                      ? "bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400 border-l-4 border-orange-400"
                      : "text-white hover:bg-white/10 hover:translate-x-1"
                  }`}
                  onClick={closeAllMenus}
                >
                  {tt.nav.contact}
                </Link>

                <div className="pt-4 space-y-3">
                  <Link
                    href={isAuthenticated ? "/student/profile" : `${locPrefix}/login`}
                    className="block w-full py-3 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-size-200 hover:bg-pos-100 text-white text-center rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02]"
                    onClick={closeAllMenus}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {isAuthenticated ? (
                        <>
                          <LayoutDashboard className="w-5 h-5" />
                          {tt.nav.dashboard}
                        </>
                      ) : (
                        <>
                          <LogIn className="w-5 h-5" />
                          {tt.nav.signIn}
                        </>
                      )}
                    </div>
                  </Link>
                  <ChangeLocationButton
                    city={locCity}
                    onPress={closeAllMenus}
                    className="w-full justify-center py-3 px-6 rounded-xl bg-white/10 hover:bg-white/15 border-0 ml-0 pl-0 font-semibold"
                  />
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {isTrainingOpen && typeof window !== "undefined" && window.innerWidth >= 1024 && (
        <div ref={dropdownRef} className="fixed left-0 right-0 top-16 lg:top-20 z-40 animate-fade-in-down">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsTrainingOpen(false)}
            aria-hidden="true"
          />

          <div className="relative">
            <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 pt-2">
              <div className="bg-white shadow-2xl border border-gray-100 rounded-2xl overflow-hidden">
                <div className="px-8 py-4">
                  {loading && <SkeletonLoader count={8} />}

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
                        {tt.nav.retry}
                      </button>
                    </div>
                  )}

                  {!loading && !error && categories.length > 0 && (
                    <>
                      <div className="grid grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-4">
                        {categories.map((cat, idx) => {
                          const Icon = getCategoryIcon(cat.name);
                          return (
                            <div
                              key={cat.id}
                              className="group animate-slide-in"
                              style={{ animationDelay: `${idx * 30}ms` }}
                            >
                              <h4 className="font-bold text-gray-900 mb-2 pb-1 border-b-2 border-gray-100 group-hover:border-blue-500 transition-all duration-300 text-sm flex items-center gap-2">
                                <Icon className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                                <Link
                                  href={`${locPrefix}/training/${cat.id}/${buildCategoryCitySeo(
                                    cat.name,
                                    locCity
                                  )}`}
                                  onClick={closeAllMenus}
                                  className="hover:text-blue-600 transition-colors duration-300"
                                >
                                  {cat.name}
                                </Link>
                              </h4>
                              <ul className="space-y-1">
                                {cat.subcategories?.map((subcat) => (
                                  <li key={subcat.id}>
                                    <Link
                                      href={`${locPrefix}/training/${cat.id}/${buildCategoryCitySeo(
                                        cat.name,
                                        locCity
                                      )}/${subcat.id}/${buildSubcategoryCitySeo(
                                        subcat.name,
                                        locCity
                                      )}`}
                                      onClick={closeAllMenus}
                                      className="text-xs text-gray-600 hover:text-blue-600 flex items-center gap-2 py-0.5 transition-all duration-300 group/link"
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
                      <div className="mt-4 pt-3 border-t border-gray-200 flex justify-center">
                        <Link
                          href={`${locPrefix}/training`}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                          onClick={closeAllMenus}
                        >
                          {tt.nav.viewAllCourses}
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </>
                  )}

                  {!loading && !error && categories.length === 0 && (
                    <div className="text-center py-12">
                      <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">
                        {tt.nav.noCategories}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="h-16 lg:h-20" />
    </>
  );
}

