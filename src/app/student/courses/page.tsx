"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  BookOpen,
  Clock,
  Signal,
  Monitor,
  Phone,
  Mail,
  ArrowRight,
  Users,
  Calendar,
  FolderOpen,
  Loader2,
  AlertCircle,
  GraduationCap,
  Video,
  Radio,
  Bell,
  MessageCircle,
} from "lucide-react";

type Course = {
  id: number;
  title: string;
  description?: string;
  thumbnail?: string;
  difficulty_level?: string;
  duration_hours?: number;
  instructor?: string;
  enrolled_at?: string;
  status?: string;
};

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const BASE_URL = process.env.NEXT_PUBLIC_STATIC_URL || "https://aifa-cloud.onrender.com/static/uploads";
  const CONTACT_INFO = { phone: "9700187077", email: "support@aimtutor.in" };

  const getFullUrl = (path?: string) => {
    if (!path) return "/placeholder.jpg";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${BASE_URL}/${cleanPath}`;
  };

  const getDifficultyBadge = (level?: string) => {
    const styles: Record<string, string> = {
      Beginner: "bg-green-100 text-green-700 border-green-200",
      Intermediate: "bg-yellow-100 text-yellow-700 border-yellow-200",
      Advanced: "bg-red-100 text-red-700 border-red-200",
      Expert: "bg-purple-100 text-purple-700 border-purple-200",
    };
    return styles[level || ""] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getStatusBadge = (status?: string) => {
    const styles: Record<string, string> = {
      Active: "bg-green-100 text-green-700",
      Completed: "bg-blue-100 text-blue-700",
      "In Progress": "bg-orange-100 text-orange-700",
      Pending: "bg-yellow-100 text-yellow-700",
      Expired: "bg-red-100 text-red-700",
    };
    return styles[status || ""] || "bg-gray-100 text-gray-700";
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/api/v1/enrollments/get-enrollments");
        if (!cancelled) setCourses((res.data.enrollments || []) as Course[]);
      } catch (err) {
        if (!cancelled) {
          const e = err as { message?: string };
          setError(e.message || "Failed to load enrolled courses. Please try again later.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center">
        <Loader2 className="w-12 h-12 text-violet-600 animate-spin mb-4" />
        <p className="text-gray-500 text-lg">Loading your courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 sm:p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-700 mb-2">Oops! Something went wrong</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center px-4">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 sm:p-12 max-w-lg text-center">
          <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-10 h-10 text-violet-600" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">No Courses Yet</h3>
          <p className="text-gray-600 mb-6">You haven&apos;t enrolled in any courses yet. Start your learning journey today!</p>
          <Link href="/courses" className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium">
            <BookOpen className="w-5 h-5" />
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
              <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-violet-600" />
              My Enrolled Courses
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              You have enrolled in <span className="font-semibold text-violet-600">{courses.length}</span> course{courses.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/student/live-sessions" className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto animate-pulse hover:animate-none">
              <Video className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Attend Live Sessions</span>
              <Radio className="w-4 h-4 animate-pulse" />
            </Link>
            <Link href="/student/resources" className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto">
              <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Go to Resources</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
            <div className="relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={getFullUrl(course.thumbnail)} alt={course.title} className="h-36 sm:h-40 lg:h-44 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded-full text-xs font-medium">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                <span>Live</span>
              </div>
              <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(course.status || "Active")}`}>
                {course.status || "Active"}
              </div>
            </div>
            <div className="p-4 sm:p-5 flex-1 flex flex-col">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-violet-600 transition-colors">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">{course.description || "No description available for this course."}</p>
              <div className="space-y-2 mb-4">
                {course.difficulty_level ? (
                  <div className="flex items-center gap-2">
                    <Signal className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Level:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getDifficultyBadge(course.difficulty_level)}`}>{course.difficulty_level}</span>
                  </div>
                ) : null}
                {course.duration_hours ? (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Duration:</span>
                    <span className="text-sm font-medium text-gray-800">{course.duration_hours} {course.duration_hours === 1 ? "Hour" : "Hours"}</span>
                  </div>
                ) : null}
                {course.instructor ? (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Instructor:</span>
                    <span className="text-sm font-medium text-gray-800">{course.instructor}</span>
                  </div>
                ) : null}
                {course.enrolled_at ? (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Enrolled:</span>
                    <span className="text-sm font-medium text-gray-800">
                      {new Date(course.enrolled_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-gray-100">
                <Link href="/student/live-sessions" className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 font-medium text-sm">
                  <Video className="w-4 h-4" />
                  <span>Attend Live Sessions</span>
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                </Link>
                <Link href="/student/resources" className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-violet-600 text-violet-600 rounded-lg hover:bg-violet-50 transition-colors font-medium text-sm">
                  <FolderOpen className="w-4 h-4" />
                  <span>Go to Resources</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 border border-red-200 rounded-xl mt-12 p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-100 rounded-full flex items-center justify-center">
              <Video className="w-6 h-6 sm:w-7 sm:h-7 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-red-800 text-base sm:text-lg flex items-center gap-2 flex-wrap">Live Sessions Available</h3>
              <p className="text-red-600 text-sm sm:text-base mt-1">Join interactive live classes with expert instructors</p>
            </div>
          </div>
          <Link href="/student/live-sessions" className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-lg text-sm sm:text-base w-full lg:w-auto">
            <Video className="w-5 h-5" />
            <span>Attend Live Sessions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="border-t border-red-200/50 my-4 sm:my-5"></div>
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 sm:p-5">
          <h4 className="font-semibold text-gray-800 text-sm sm:text-base mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            How You&apos;ll Be Notified About Live Sessions
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <InfoTile icon={<Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />} title="Executive Call" text="Our executive will call you before each live session" color="green" />
            <InfoTile icon={<Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />} title="Email Alert" text="You&apos;ll receive email notifications with session details" color="blue" />
            <InfoTile icon={<Bell className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />} title="Push Notification" text="Check your notification bell for updates" color="purple" />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-gray-600 text-sm flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span>Don&apos;t miss any updates! Check your notifications regularly.</span>
            </p>
            <Link href="/student/notifications" className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 font-medium text-sm shadow-md w-full sm:w-auto">
              <Bell className="w-4 h-4" />
              <span>Check Notifications</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mt-10 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 sm:p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Need Help with Your Courses?</h3>
            <p className="text-violet-100 text-sm sm:text-base">
              Our support team is here to help you succeed.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={`tel:${CONTACT_INFO.phone}`} className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-violet-600 rounded-xl hover:bg-violet-50 transition-colors font-semibold text-sm sm:text-base">
              <Phone className="w-5 h-5" />
              <span>Call {CONTACT_INFO.phone}</span>
            </a>
            <a href={`mailto:${CONTACT_INFO.email}`} className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-violet-500 text-white rounded-xl hover:bg-violet-400 transition-colors font-semibold text-sm sm:text-base border border-violet-400">
              <Mail className="w-5 h-5" />
              <span>Email Support</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoTile({ icon, title, text, color }: { icon: ReactNode; title: string; text: string; color: "green" | "blue" | "purple" }) {
  const bg = color === "green" ? "bg-green-50 border-green-200" : color === "blue" ? "bg-blue-50 border-blue-200" : "bg-purple-50 border-purple-200";
  const iconBg = color === "green" ? "bg-green-100" : color === "blue" ? "bg-blue-100" : "bg-purple-100";
  const titleColor = color === "green" ? "text-green-800" : color === "blue" ? "text-blue-800" : "text-purple-800";
  const txtColor = color === "green" ? "text-green-600" : color === "blue" ? "text-blue-600" : "text-purple-600";
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${bg}`}>
      <div className={`w-9 h-9 sm:w-10 sm:h-10 ${iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>{icon}</div>
      <div>
        <p className={`font-medium ${titleColor} text-sm`}>{title}</p>
        <p className={`${txtColor} text-xs mt-0.5`}>{text}</p>
      </div>
    </div>
  );
}
