"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  Video,
  Calendar,
  Clock,
  Users,
  ExternalLink,
  Play,
  AlertCircle,
  CheckCircle,
  Copy,
  Eye,
  EyeOff,
  Bell,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import { thumbnailUrl } from "@/lib/staticUrl";

type LiveSession = {
  id: number;
  title: string;
  description: string;
  scheduled_at: string;
  duration_minutes: number;
  meeting_id: string;
  meeting_password: string;
  meeting_url: string;
  is_recorded?: boolean;
  recording_url?: string;
  course: {
    title: string;
    instructor_name?: string;
    thumbnail?: string;
    short_description?: string;
    difficulty_level?: string;
    duration_hours?: number;
    enrollment_count?: number;
  };
};

export default function StudentLiveSessionsPage() {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const [expandedSessions, setExpandedSessions] = useState<number[]>([]);
  const [showPasswords, setShowPasswords] = useState<Record<number, boolean>>({});
  const [copiedText, setCopiedText] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLiveSessions();
    const interval = setInterval(() => setSessions((prev) => [...prev]), 60000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  async function fetchLiveSessions(isRefresh = false) {
    try {
      if (isRefresh) setRefreshing(true); else setLoading(true);
      const dashboardResponse = await api.get("api/v1/users/get-dashboard");
      const courses = dashboardResponse.data.recent_activity || [];
      const enrolledCourses = courses.filter((course: { enrollment?: unknown }) => course.enrollment);
      if (enrolledCourses.length === 0) {
        setSessions([]);
        return;
      }
      const sessionPromises = enrolledCourses.map((course: { id: number }) =>
        api.get(`/api/v1/live-sessions/get-live-sessions?${course.id}`)
          .then((res) => res.data.live_sessions || [])
          .catch(() => [])
      );
      const sessionsArrays = await Promise.all(sessionPromises);
      const allSessions = sessionsArrays.flat() as LiveSession[];
      allSessions.sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
      setSessions(allSessions);
      setError(null);
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to fetch live sessions");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function formatDateTime(dateString: string) {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      fullDate: date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
  }

  function getSessionStatus(scheduledAt: string, durationMinutes: number) {
    const now = new Date();
    const sessionStart = new Date(scheduledAt);
    const sessionEnd = new Date(sessionStart.getTime() + durationMinutes * 60000);
    if (now < sessionStart) return "upcoming";
    if (now >= sessionStart && now <= sessionEnd) return "live";
    return "past";
  }

  function getTimeUntilSession(scheduledAt: string) {
    const now = new Date();
    const sessionStart = new Date(scheduledAt);
    const diff = sessionStart.getTime() - now.getTime();
    if (diff < 0) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  function toggleSession(sessionId: number) {
    setExpandedSessions((prev) => (prev.includes(sessionId) ? prev.filter((id) => id !== sessionId) : [...prev, sessionId]));
  }

  function togglePassword(sessionId: number) {
    setShowPasswords((prev) => ({ ...prev, [sessionId]: !prev[sessionId] }));
  }

  async function copyToClipboard(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(""), 2000);
    } catch {
      setCopiedText(label);
      setTimeout(() => setCopiedText(""), 2000);
    }
  }

  function joinMeeting(meetingUrl: string) {
    window.open(meetingUrl, "_blank", "noopener,noreferrer");
  }

  function getFilteredSessions() {
    if (filter === "all") return sessions;
    return sessions.filter((session) => {
      const status = getSessionStatus(session.scheduled_at, session.duration_minutes);
      if (filter === "upcoming") return status === "upcoming" || status === "live";
      if (filter === "past") return status === "past";
      return true;
    });
  }

  const stats = {
    total: sessions.length,
    upcoming: sessions.filter((s) => getSessionStatus(s.scheduled_at, s.duration_minutes) === "upcoming").length,
    live: sessions.filter((s) => getSessionStatus(s.scheduled_at, s.duration_minutes) === "live").length,
    past: sessions.filter((s) => getSessionStatus(s.scheduled_at, s.duration_minutes) === "past").length,
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="text-center py-8">
          <XCircle className="w-12 sm:w-16 h-12 sm:h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Error Loading Live Sessions</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">{error}</p>
          <button onClick={() => fetchLiveSessions()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const filteredSessions = getFilteredSessions();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Live Sessions</h2>
            <button onClick={() => fetchLiveSessions(true)} disabled={refreshing} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all" title="Refresh">
              <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
          <p className="text-sm sm:text-base text-gray-600">Join upcoming live training sessions and access recordings</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <MiniStat label="Total" value={stats.total} color="blue" icon={<Video className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />} />
          <MiniStat label="Upcoming" value={stats.upcoming} color="green" icon={<Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />} />
          <MiniStat label="Live Now" value={stats.live} color="red" icon={<div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-600 rounded-full animate-pulse"></div>} />
          <MiniStat label="Past" value={stats.past} color="gray" icon={<CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />} />
        </div>

        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
          <FilterBtn active={filter === "all"} onClick={() => setFilter("all")} text={`All (${stats.total})`} />
          <FilterBtn active={filter === "upcoming"} onClick={() => setFilter("upcoming")} text={`Upcoming (${stats.upcoming + stats.live})`} />
          <FilterBtn active={filter === "past"} onClick={() => setFilter("past")} text={`Past (${stats.past})`} />
        </div>

        {copiedText ? (
          <div className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg animate-slide-up flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">{copiedText} copied!</span>
          </div>
        ) : null}

        {filteredSessions.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Video className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{sessions.length === 0 ? "No Live Sessions" : "No Sessions Found"}</h3>
            <p className="text-sm sm:text-base text-gray-600 px-4">{sessions.length === 0 ? "Live sessions will appear here once scheduled by instructors." : "Try changing the filter to view other sessions."}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session) => {
              const status = getSessionStatus(session.scheduled_at, session.duration_minutes);
              const dateTime = formatDateTime(session.scheduled_at);
              const timeUntil = getTimeUntilSession(session.scheduled_at);
              const isExpanded = expandedSessions.includes(session.id);
              const showPassword = showPasswords[session.id];
              return (
                <div key={session.id} className={`border-2 rounded-xl overflow-hidden transition-all ${status === "live" ? "border-red-400 shadow-lg shadow-red-100" : status === "upcoming" ? "border-blue-200 hover:border-blue-300" : "border-gray-200"}`}>
                  <div className={`p-4 sm:p-5 cursor-pointer ${status === "live" ? "bg-gradient-to-r from-red-50 to-red-100" : status === "upcoming" ? "bg-gradient-to-r from-blue-50 to-blue-100" : "bg-gray-50"}`} onClick={() => toggleSession(session.id)}>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <div className={`p-2 rounded-lg flex-shrink-0 ${status === "live" ? "bg-red-200" : status === "upcoming" ? "bg-blue-200" : "bg-gray-200"}`}>
                            <Video className={`w-5 h-5 sm:w-6 sm:h-6 ${status === "live" ? "text-red-600" : status === "upcoming" ? "text-blue-600" : "text-gray-600"}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                              <h3 className="text-base sm:text-lg font-bold text-gray-900 break-words pr-2">{session.title}</h3>
                              <div className="flex-shrink-0">{status === "live" ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse"><div className="w-2 h-2 bg-red-600 rounded-full"></div>Live</span> : status === "upcoming" ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Clock className="w-3 h-3" />Upcoming</span> : <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><CheckCircle className="w-3 h-3" />Completed</span>}</div>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-700 mb-2 line-clamp-2">{session.description}</p>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 mb-2">
                              <span className="inline-flex items-center gap-1 font-medium"><Users className="w-3 h-3 sm:w-4 sm:h-4" /><span className="truncate max-w-[150px] sm:max-w-none">{session.course.title}</span></span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                              <span className="inline-flex items-center gap-1 text-gray-700"><Calendar className="w-3 h-3 sm:w-4 sm:h-4" />{dateTime.fullDate}</span>
                              <span className="inline-flex items-center gap-1 text-gray-700"><Clock className="w-3 h-3 sm:w-4 sm:h-4" />{dateTime.time} ({session.duration_minutes} min)</span>
                              {timeUntil && status === "upcoming" ? <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium"><Bell className="w-3 h-3" />{timeUntil}</span> : null}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 mt-2 sm:mt-0">
                        {status === "live" ? <button onClick={(e) => { e.stopPropagation(); joinMeeting(session.meeting_url); }} className="px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm sm:text-base flex items-center gap-2 animate-pulse"><Play className="w-4 h-4 sm:w-5 sm:h-5" />Join Now</button> : null}
                        {status === "upcoming" ? <button onClick={(e) => { e.stopPropagation(); toggleSession(session.id); }} className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm sm:text-base flex items-center gap-2"><ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />Details</button> : null}
                        {isExpanded ? <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 flex-shrink-0" />}
                      </div>
                    </div>
                  </div>

                  {isExpanded ? (
                    <div className="p-4 sm:p-5 bg-white border-t border-gray-200">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                            <Video className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                            Meeting Details
                          </h4>
                          <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <span className="text-xs sm:text-sm text-gray-600">Meeting ID:</span>
                              <div className="flex items-center gap-2">
                                <code className="px-2 py-1 bg-white rounded text-xs sm:text-sm font-mono break-all">{session.meeting_id?.trim()}</code>
                                <button onClick={() => copyToClipboard(session.meeting_id?.trim(), "Meeting ID")} className="p-1 hover:bg-gray-200 rounded transition flex-shrink-0"><Copy className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" /></button>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <span className="text-xs sm:text-sm text-gray-600">Password:</span>
                              <div className="flex items-center gap-2">
                                <code className="px-2 py-1 bg-white rounded text-xs sm:text-sm font-mono">{showPassword ? session.meeting_password?.trim() : "••••••••"}</code>
                                <button onClick={() => togglePassword(session.id)} className="p-1 hover:bg-gray-200 rounded transition flex-shrink-0">{showPassword ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />}</button>
                                <button onClick={() => copyToClipboard(session.meeting_password?.trim(), "Password")} className="p-1 hover:bg-gray-200 rounded transition flex-shrink-0"><Copy className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" /></button>
                              </div>
                            </div>
                          </div>
                          <button onClick={() => joinMeeting(session.meeting_url)} className="w-full px-4 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm sm:text-base flex items-center justify-center gap-2"><ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />Open Meeting Link</button>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                            Course Information
                          </h4>
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4 border border-blue-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={thumbnailUrl(session.course.thumbnail) ?? ""}
                              alt={session.course.title}
                              className="w-full h-24 sm:h-32 object-cover rounded-lg mb-3"
                            />
                            <h5 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base line-clamp-2">{session.course.title}</h5>
                            <p className="text-xs sm:text-sm text-gray-700 mb-2 line-clamp-2">{session.course.short_description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  );
}

function MiniStat({ label, value, color, icon }: { label: string; value: number; color: "blue" | "green" | "red" | "gray"; icon: ReactNode }) {
  const tone = color === "blue" ? "from-blue-50 to-blue-100 border-blue-200 text-blue-600 text-blue-900" : color === "green" ? "from-green-50 to-green-100 border-green-200 text-green-600 text-green-900" : color === "red" ? "from-red-50 to-red-100 border-red-200 text-red-600 text-red-900" : "from-gray-50 to-gray-100 border-gray-200 text-gray-600 text-gray-900";
  const [bg, border, text, valueColor] = tone.split(" ");
  return (
    <div className={`bg-gradient-to-br ${bg} ${border} rounded-lg p-3 sm:p-4 border`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-xs ${text} font-medium`}>{label}</p>
          <p className={`text-xl sm:text-2xl font-bold ${valueColor}`}>{value}</p>
        </div>
        {icon}
      </div>
    </div>
  );
}

function FilterBtn({ active, onClick, text }: { active: boolean; onClick: () => void; text: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition ${
        active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {text}
    </button>
  );
}
