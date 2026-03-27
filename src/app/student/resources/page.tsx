"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  FileText,
  Video,
  Download,
  File,
  Clock,
  FileImage,
  FileSpreadsheet,
  Music,
  Archive,
  Play,
  Layers,
  GraduationCap,
  X,
  Loader2,
  ExternalLink,
  Search,
  FolderOpen,
  Phone,
  Mail,
  ChevronDown,
  Grid3X3,
  LayoutList,
  Folder,
} from "lucide-react";
import { api } from "@/lib/api";

type Course = {
  id: number;
  title: string;
  thumbnail?: string;
  modules?: Module[];
};
type Module = { id: number; title: string; order?: number; lessons?: Lesson[] };
type Lesson = { id: number; title: string; order?: number; duration_minutes?: number; video_url?: string; resources?: Resource[] };
type Resource = { id: number; title: string; file_type?: string; file_size?: number; file_path?: string };
type SelectedVideo = { title: string; url: string };

export default function StudentResourcesPage() {
  const [coursesWithResources, setCoursesWithResources] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "videos" | "documents">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("all");
  const [selectedVideo, setSelectedVideo] = useState<SelectedVideo | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const BASE_URL = process.env.NEXT_PUBLIC_STATIC_URL || "https://aifa-cloud.onrender.com/static/uploads";
  const CONTACT_INFO = { phone: "9700187077", email: "support@aimtutor.in" };

  useEffect(() => { fetchAllResources(); }, []);
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedVideo) handleCloseVideo();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectedVideo]);

  const getFullUrl = useCallback((path?: string) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${BASE_URL}/${cleanPath}`;
  }, [BASE_URL]);

  async function fetchAllResources() {
    try {
      setLoading(true);
      const response = await api.get("/api/v1/users/get-dashboard");
      const coursesData = response.data.recent_activity || [];
      const enrolled = coursesData.filter((course: { enrollment?: unknown }) => course.enrollment);
      if (enrolled.length === 0) return setLoading(false);
      const coursePromises = enrolled.map((course: { id: number }) =>
        api.post(`/api/v1/courses/get-courses/${course.id}?lessons=True&resources=True`).then((res) => res.data.course).catch(() => null)
      );
      const coursesWithData = (await Promise.all(coursePromises)).filter(Boolean) as Course[];
      setCoursesWithResources(coursesWithData);
      if (coursesWithData.length > 0 && coursesWithData[0].modules?.length) {
        setExpandedModules({ [`${coursesWithData[0].id}-${coursesWithData[0].modules[0].id}`]: true });
      }
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to fetch resources");
    } finally {
      setLoading(false);
    }
  }

  const getFileIcon = (fileType?: string, size = "w-5 h-5") => {
    const icons: Record<string, ReactNode> = {
      pdf: <FileText className={`${size} text-red-500`} />,
      doc: <FileText className={`${size} text-blue-600`} />,
      docx: <FileText className={`${size} text-blue-600`} />,
      xls: <FileSpreadsheet className={`${size} text-green-600`} />,
      xlsx: <FileSpreadsheet className={`${size} text-green-600`} />,
      jpg: <FileImage className={`${size} text-orange-500`} />,
      jpeg: <FileImage className={`${size} text-orange-500`} />,
      png: <FileImage className={`${size} text-orange-500`} />,
      mp3: <Music className={`${size} text-pink-500`} />,
      zip: <Archive className={`${size} text-gray-600`} />,
      rar: <Archive className={`${size} text-gray-600`} />,
    };
    return icons[(fileType || "").toLowerCase()] || <File className={`${size} text-gray-500`} />;
  };

  const getFileColor = (fileType?: string) => {
    const colors: Record<string, string> = {
      pdf: "bg-red-50 border-red-200 hover:border-red-300",
      doc: "bg-blue-50 border-blue-200 hover:border-blue-300",
      docx: "bg-blue-50 border-blue-200 hover:border-blue-300",
      xls: "bg-green-50 border-green-200 hover:border-green-300",
      xlsx: "bg-green-50 border-green-200 hover:border-green-300",
      jpg: "bg-orange-50 border-orange-200 hover:border-orange-300",
      png: "bg-orange-50 border-orange-200 hover:border-orange-300",
      zip: "bg-gray-50 border-gray-200 hover:border-gray-300",
    };
    return colors[(fileType || "").toLowerCase()] || "bg-gray-50 border-gray-200 hover:border-gray-300";
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  const formatDuration = (minutes?: number) => {
    if (!minutes) return "";
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const handleDownload = async (resource: Resource) => {
    setDownloadingId(resource.id);
    try {
      const response = await api.get(`/resources/download/${resource.id}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", resource.file_path?.split("/").pop() || `${resource.title}.${resource.file_type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      if (resource.file_path) window.open(getFullUrl(resource.file_path) || "", "_blank");
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePlayVideo = (video: { title: string; url: string }) =>
    setSelectedVideo({ ...video, url: getFullUrl(video.url) || "" });
  const handleCloseVideo = () => {
    if (videoRef.current) videoRef.current.pause();
    setSelectedVideo(null);
  };
  const toggleModule = (courseId: number, moduleId: number) => {
    const key = `${courseId}-${moduleId}`;
    setExpandedModules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const stats = useMemo(() => {
    let totalVideos = 0, totalResources = 0, totalDuration = 0, totalModules = 0;
    coursesWithResources.forEach((course) => {
      totalModules += course.modules?.length || 0;
      course.modules?.forEach((module) => {
        module.lessons?.forEach((lesson) => {
          if (lesson.video_url) {
            totalVideos++;
            totalDuration += lesson.duration_minutes || 0;
          }
          totalResources += lesson.resources?.length || 0;
        });
      });
    });
    return { totalVideos, totalResources, totalDuration, totalModules, courseCount: coursesWithResources.length };
  }, [coursesWithResources]);

  const filteredCourses = useMemo(() => {
    if (selectedCourseFilter === "all") return coursesWithResources;
    return coursesWithResources.filter((c) => c.id === Number(selectedCourseFilter));
  }, [coursesWithResources, selectedCourseFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {loading ? (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
          <div className="relative mb-4">
            <div className="w-16 h-16 border-4 border-violet-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-violet-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading your resources...</p>
        </div>
      ) : null}

      {error ? (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to Load</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={fetchAllResources} className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium">
              Try Again
            </button>
          </div>
        </div>
      ) : null}

      {!loading && !error ? (
      <>
      {selectedVideo ? (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4" onClick={handleCloseVideo}>
          <div className="bg-gray-900 rounded-xl sm:rounded-2xl w-full max-w-5xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gray-800 text-white p-3 sm:p-4 flex justify-between items-start gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base sm:text-lg truncate">{selectedVideo.title}</h3>
              </div>
              <button onClick={handleCloseVideo} className="p-2 hover:bg-gray-700 rounded-lg transition flex-shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-black">
              <video ref={videoRef} className="w-full max-h-[70vh]" controls autoPlay playsInline src={selectedVideo.url} />
            </div>
            <div className="p-3 bg-gray-800 sm:hidden">
              <a href={selectedVideo.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-violet-400 text-sm font-medium">
                <ExternalLink className="w-4 h-4" />
                Open in full screen
              </a>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FolderOpen className="w-7 h-7 sm:w-8 sm:h-8 text-violet-600" />
          My Resources
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">All your course videos and materials organized by modules</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard label="Courses" value={stats.courseCount} icon={<GraduationCap className="w-6 h-6 sm:w-8 sm:h-8" />} gradient="from-violet-500 to-purple-600" />
        <StatCard label="Modules" value={stats.totalModules} icon={<Folder className="w-6 h-6 sm:w-8 sm:h-8" />} gradient="from-blue-500 to-indigo-600" />
        <StatCard label="Videos" value={stats.totalVideos} icon={<Video className="w-6 h-6 sm:w-8 sm:h-8" />} gradient="from-purple-500 to-pink-600" />
        <StatCard label="Documents" value={stats.totalResources} icon={<FileText className="w-6 h-6 sm:w-8 sm:h-8" />} gradient="from-orange-500 to-red-500" />
        <StatCard label="Duration" value={formatDuration(stats.totalDuration) || "0m"} icon={<Clock className="w-6 h-6 sm:w-8 sm:h-8" />} gradient="from-cyan-500 to-teal-600" className="col-span-2 lg:col-span-1" />
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {[
            { id: "all", label: "All", icon: Layers, count: stats.totalVideos + stats.totalResources },
            { id: "videos", label: "Videos", icon: Video, count: stats.totalVideos, color: "purple" },
            { id: "documents", label: "Documents", icon: FileText, count: stats.totalResources, color: "orange" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "all" | "videos" | "documents")}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium transition border-b-2 -mb-px whitespace-nowrap ${activeTab === tab.id ? "text-violet-600 border-violet-600 bg-violet-50/50" : "text-gray-500 border-transparent hover:text-gray-700"}`}
            >
              <span className="flex items-center justify-center gap-2">
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </span>
            </button>
          ))}
        </div>
        <div className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm" placeholder="Search videos, documents, or modules..." />
          </div>
          <div className="relative">
            <select value={selectedCourseFilter} onChange={(e) => setSelectedCourseFilter(e.target.value)} className="appearance-none w-full sm:w-56 pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm">
              <option value="all">All Courses</option>
              {coursesWithResources.map((course) => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl self-start">
            <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition ${viewMode === "grid" ? "bg-white shadow-sm text-violet-600" : "text-gray-500"}`}>
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition ${viewMode === "list" ? "bg-white shadow-sm text-violet-600" : "text-gray-500"}`}>
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-purple-700 p-4 sm:p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0"><GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                <div>
                  <h2 className="font-bold text-lg sm:text-xl">{course.title}</h2>
                  <p className="text-violet-200 text-sm">{course.modules?.length || 0} modules</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {(course.modules || [])
                .filter((module) => !searchQuery || module.title?.toLowerCase().includes(searchQuery.toLowerCase()) || module.lessons?.some((lesson) => lesson.title?.toLowerCase().includes(searchQuery.toLowerCase())))
                .map((module, moduleIndex) => {
                  const key = `${course.id}-${module.id}`;
                  const isExpanded = expandedModules[key];
                  return (
                    <div key={module.id}>
                      <button onClick={() => toggleModule(course.id, module.id)} className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-gray-50 transition text-left">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">{module.order || moduleIndex + 1}</div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">{module.title}</h3>
                          </div>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                      </button>
                      {isExpanded ? (
                        <div className="px-4 sm:px-5 pb-5 pt-2 bg-gray-50 border-t border-gray-100">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                            {(module.lessons || []).map((lesson) => (
                              <div key={lesson.id} className="bg-white rounded-xl border border-gray-200 p-3">
                                <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2">{lesson.title}</h4>
                                {lesson.video_url && (activeTab === "all" || activeTab === "videos") ? (
                                  <button onClick={() => handlePlayVideo({ title: lesson.title, url: lesson.video_url ?? "" })} className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition text-xs font-medium mb-2">
                                    <Play className="w-3.5 h-3.5" />
                                    Play Video
                                  </button>
                                ) : null}
                                {(lesson.resources || [])
                                  .filter(() => activeTab === "all" || activeTab === "documents")
                                  .map((resource) => (
                                    <button key={resource.id} onClick={() => handleDownload(resource)} className={`w-full mt-2 text-left bg-white rounded-xl border p-3 hover:shadow-md transition flex items-center gap-3 ${getFileColor(resource.file_type)}`}>
                                      <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm border flex-shrink-0">{getFileIcon(resource.file_type, "w-4 h-4")}</div>
                                      <div className="min-w-0 flex-1">
                                        <p className="font-medium text-gray-900 text-xs truncate">{resource.title}</p>
                                        <p className="text-[11px] text-gray-500">{formatFileSize(resource.file_size)}</p>
                                      </div>
                                      {downloadingId === resource.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                    </button>
                                  ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl sm:rounded-2xl p-5 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg mb-1">Need Help?</h3>
            <p className="text-gray-400 text-sm">Having trouble accessing your resources?</p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <a href={`tel:${CONTACT_INFO.phone}`} className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition font-medium text-sm"><Phone className="w-4 h-4" />{CONTACT_INFO.phone}</a>
            <a href={`mailto:${CONTACT_INFO.email}`} className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition font-medium text-sm"><Mail className="w-4 h-4" />Email Support</a>
          </div>
        </div>
      </div>
      </>
      ) : null}
    </div>
  );
}

function StatCard({ label, value, icon, gradient, className = "" }: { label: string; value: number | string; icon: ReactNode; gradient: string; className?: string }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl sm:rounded-2xl p-4 sm:p-5 text-white ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-xs sm:text-sm">{label}</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-0.5">{value}</p>
        </div>
        <div className="text-white/30">{icon}</div>
      </div>
    </div>
  );
}
