"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { buildCategoryCitySeo, slugify } from "@/lib/seoSlug";
import {
  GraduationCap,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Loader2,
  Clock,
  Brain,
  Sparkles,
  ArrowRight,
  Globe,
} from "lucide-react";
import type { Translations } from "@/translations/en";

type PopularCourse = { id: number; title: string; name: string };

export type GeoFooterProps = {
  locPrefix: string;
  /** City segment from URL (any casing); used for category SEO slugs */
  city: string;
  translations: Translations;
};

export default function GeoFooter({ locPrefix, city, translations: tt }: GeoFooterProps) {
  const cityForHeading = useMemo(() => slugify(city), [city]);

  const [popularCourses, setPopularCourses] = useState<PopularCourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadingCourses(true);
        const response = await api.post("/api/v1/public/get-mastercategories");
        if (cancelled) return;
        const categories = (response.data?.categories ?? []) as { id: number; name: string }[];
        const popularCoursesData = categories.slice(0, 8).map((category) => ({
          id: category.id,
          title: category.name,
          name: category.name,
        }));
        setPopularCourses(popularCoursesData);
      } catch (err) {
        console.error("Error fetching popular courses (footer):", err);
        if (!cancelled) setPopularCourses([]);
      } finally {
        if (!cancelled) setLoadingCourses(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const quickLinks = useMemo(
    () => [
      { title: tt.footer.aboutUs, href: `${locPrefix}/about`, icon: Sparkles },
      { title: tt.nav.contact, href: `${locPrefix}/contact`, icon: Mail },
      { title: tt.footer.allCourses, href: `${locPrefix}/training`, icon: GraduationCap },
    ],
    [locPrefix, tt]
  );

  const officeHours = [
    { day: tt.footer.monFri, time: tt.footer.monFriTime },
    { day: tt.footer.saturday, time: tt.footer.satTime },
    { day: tt.footer.sunday, time: tt.footer.sunTime },
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-gray-300 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-0 w-full h-full opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-40 left-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-10 animate-pulse" />
        <div className="absolute bottom-40 right-20 w-72 h-72 bg-cyan-600 rounded-full blur-3xl opacity-10 animate-pulse delay-700" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <Link href={locPrefix} className="flex items-center gap-3 mb-8 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              </div>
              <div>
                <h3 className="text-white text-2xl font-bold">Aim Tutor</h3>
                <p className="text-xs text-cyan-400 font-medium">The Academy  of AI</p>
              </div>
            </Link>

            <p className="mb-8 text-gray-400 leading-relaxed">
              {tt.footer.empoweringSince}
            </p>

            <div className="space-y-5">
              <div>
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cyan-400" />
                  {tt.footer.callUs}
                </h4>
                <div className="space-y-2 pl-6">
                  <a
                    href="tel:+919700187077"
                    className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-2"
                  >
                    <span className="text-sm">+91 97001 87077</span>
                  </a>
                  <a
                    href="tel:+916300232040"
                    className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-2"
                  >
                    <span className="text-sm">+91 63002 32040</span>
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  {tt.footer.emailUs}
                </h4>
                <div className="space-y-2 pl-6">
                  <a
                    href="mailto:admin@aimtutor.in"
                    className="text-gray-300 hover:text-cyan-400 transition-colors block text-sm"
                  >
                    admin@aimtutor.in
                  </a>
                  <a
                    href="mailto:aimtutor@gmail.com"
                    className="text-gray-300 hover:text-cyan-400 transition-colors block text-sm"
                  >
                    aimtutor@gmail.com
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  {tt.footer.visitUs}
                </h4>
                <p className="text-gray-400 text-sm pl-6 leading-relaxed">
                  #50, Kamala Nivas, Sap Street,
                  <br />
                  Gayatri Nagar, Behind Mytrivanam,
                  <br />
                  Ameerpet, Hyderabad - 500038
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <h3 className="text-white mb-8 text-lg font-bold relative">
              <span className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-cyan-400" />
                {tt.footer.popularCourses}
              </span>
              <span className="absolute -bottom-2 left-0 w-20 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
            </h3>

            {loadingCourses ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading courses...</span>
              </div>
            ) : popularCourses.length === 0 ? (
              <p className="text-gray-500 text-sm">No courses available</p>
            ) : (
              <ul className="space-y-3">
                {popularCourses.map((course) => (
                  <li key={course.id}>
                    <Link
                      href={`${locPrefix}/training/${course.id}/${buildCategoryCitySeo(course.name, cityForHeading)}`}
                      className="text-gray-400 hover:text-cyan-400 transition-all duration-300 flex items-center gap-2 group text-sm cursor-pointer"
                    >
                      <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                      <span>{course.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {!loadingCourses && popularCourses.length > 0 && (
              <Link
                href={`${locPrefix}/training`}
                className="inline-flex items-center gap-2 mt-6 text-cyan-400 hover:text-cyan-300 font-medium text-sm group"
              >
                <span>{tt.footer.viewAllCourses}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          <div className="lg:col-span-1">
            <h3 className="text-white mb-8 text-lg font-bold relative">
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                {tt.footer.quickLinks}
              </span>
              <span className="absolute -bottom-2 left-0 w-20 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-cyan-400 transition-all duration-300 flex items-center gap-3 group"
                  >
                    <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-cyan-500 transition-all">
                      <link.icon className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-sm font-medium">{link.title}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <h3 className="text-white mb-6 text-lg font-bold relative">
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  {tt.footer.officeHours}
                </span>
                <span className="absolute -bottom-2 left-0 w-20 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
              </h3>
              <div className="space-y-3 pl-1">
                {officeHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">{schedule.day}</span>
                    <span className="text-gray-300 font-medium">{schedule.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <h3 className="text-white mb-8 text-lg font-bold relative">
              <span className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                {tt.footer.connectWithUs}
              </span>
              <span className="absolute -bottom-2 left-0 w-20 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
            </h3>

            <div className="mb-8">
              <p className="text-gray-400 mb-6 text-sm">{tt.footer.followUs}</p>
              <div className="grid grid-cols-3 gap-3">
                <a
                  href="https://www.linkedin.com/in/aimtutor/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 bg-slate-800 text-gray-400 flex items-center justify-center rounded-xl transition-all hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white hover:-translate-y-1 border border-slate-700 group duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href="https://x.com/aimtechhyd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 bg-slate-800 text-gray-400 flex items-center justify-center rounded-xl transition-all hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white hover:-translate-y-1 border border-slate-700 group duration-300"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href="https://www.instagram.com/aimtutorameerpet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 bg-slate-800 text-gray-400 flex items-center justify-center rounded-xl transition-all hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white hover:-translate-y-1 border border-slate-700 group duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">20+</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{tt.footer.yearsExcellence}</p>
                  <p className="text-gray-400 text-xs">{tt.footer.studentsTrained}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm mb-2">
                &copy; {new Date().getFullYear()}{" "}
                <span className="text-white font-semibold">Aim Tutor</span> - {tt.footer.allRightsReserved}
              </p>
              <p className="text-gray-500 text-xs">{tt.footer.empoweringSince}</p>
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              <Link href={`${locPrefix}/privacy-policy`} className="text-gray-500 hover:text-cyan-400 transition-colors">
                {tt.footer.privacyPolicy}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
