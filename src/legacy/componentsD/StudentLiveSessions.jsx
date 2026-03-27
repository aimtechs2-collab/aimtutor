// components/StudentLiveSessions.jsx
import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  ExternalLink,
  Play,
  Download,
  AlertCircle,
  CheckCircle,
  Copy,
  Eye,
  EyeOff,
  Bell,
  Filter,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw
} from 'lucide-react';
import api from '../utils/api';

export default function StudentLiveSessions() {
  const [liveSessions, setLiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, upcoming, past
  const [expandedSessions, setExpandedSessions] = useState([]);
  const [showPasswords, setShowPasswords] = useState({});
  const [copiedText, setCopiedText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLiveSessions();
    
    // Auto refresh every minute to update countdowns
    const interval = setInterval(() => {
      setLiveSessions(prev => [...prev]); // Force re-render
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Fetch all live sessions
  const fetchLiveSessions = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      // First get enrolled courses
      const dashboardResponse = await api.get('api/v1/users/get-dashboard');
      const courses = dashboardResponse.data.recent_activity || [];
      const enrolledCourses = courses.filter(course => course.enrollment);

      if (enrolledCourses.length === 0) {
        setLiveSessions([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // Fetch live sessions for all enrolled courses
      const sessionPromises = enrolledCourses.map(course =>
        api.get(`/api/v1/live-sessions/get-live-sessions?${course.id}`)
          .then(res => res.data.live_sessions || [])
          .catch(err => {
            console.error(`Error fetching sessions for course ${course.id}:`, err);
            return [];
          })
      );

      const sessionsArrays = await Promise.all(sessionPromises);
      const allSessions = sessionsArrays.flat();
      
      // Sort by scheduled time
      allSessions.sort((a, b) => 
        new Date(a.scheduled_at) - new Date(b.scheduled_at)
      );

      setLiveSessions(allSessions);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch live sessions');
      console.error('Error fetching live sessions:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }),
      fullDate: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      fullDateTime: date
    };
  };

  // Check if session is upcoming, live, or past
  const getSessionStatus = (scheduledAt, durationMinutes) => {
    const now = new Date();
    const sessionStart = new Date(scheduledAt);
    const sessionEnd = new Date(sessionStart.getTime() + durationMinutes * 60000);

    if (now < sessionStart) {
      return 'upcoming';
    } else if (now >= sessionStart && now <= sessionEnd) {
      return 'live';
    } else {
      return 'past';
    }
  };

  // Get time until session starts
  const getTimeUntilSession = (scheduledAt) => {
    const now = new Date();
    const sessionStart = new Date(scheduledAt);
    const diff = sessionStart - now;

    if (diff < 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Toggle session details
  const toggleSession = (sessionId) => {
    setExpandedSessions(prev =>
      prev.includes(sessionId)
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  // Toggle password visibility
  const togglePassword = (sessionId) => {
    setShowPasswords(prev => ({
      ...prev,
      [sessionId]: !prev[sessionId]
    }));
  };

  // Copy to clipboard with feedback
  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (err) {
      // Fallback for mobile devices
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedText(label);
      setTimeout(() => setCopiedText(''), 2000);
    }
  };

  // Join meeting
  const joinMeeting = (meetingUrl) => {
    window.open(meetingUrl, '_blank', 'noopener,noreferrer');
  };

  // Filter sessions
  const getFilteredSessions = () => {
    if (filter === 'all') return liveSessions;
    
    return liveSessions.filter(session => {
      const status = getSessionStatus(session.scheduled_at, session.duration_minutes);
      if (filter === 'upcoming') return status === 'upcoming' || status === 'live';
      if (filter === 'past') return status === 'past';
      return true;
    });
  };

  // Calculate statistics
  const stats = {
    total: liveSessions.length,
    upcoming: liveSessions.filter(s => 
      getSessionStatus(s.scheduled_at, s.duration_minutes) === 'upcoming'
    ).length,
    live: liveSessions.filter(s => 
      getSessionStatus(s.scheduled_at, s.duration_minutes) === 'live'
    ).length,
    past: liveSessions.filter(s => 
      getSessionStatus(s.scheduled_at, s.duration_minutes) === 'past'
    ).length
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      upcoming: (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Clock className="w-3 h-3" />
          <span className="hidden sm:inline">Upcoming</span>
          <span className="sm:hidden">Soon</span>
        </span>
      ),
      live: (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
          <div className="w-2 h-2 bg-red-600 rounded-full"></div>
          Live
        </span>
      ),
      past: (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <CheckCircle className="w-3 h-3" />
          <span className="hidden sm:inline">Completed</span>
          <span className="sm:hidden">Done</span>
        </span>
      )
    };
    return badges[status];
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
          <AlertCircle className="w-12 sm:w-16 h-12 sm:h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Error Loading Live Sessions</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">{error}</p>
          <button
            onClick={() => fetchLiveSessions()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
          >
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
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Live Sessions</h2>
            <button
              onClick={() => fetchLiveSessions(true)}
              disabled={refreshing}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <p className="text-sm sm:text-base text-gray-600">Join upcoming live training sessions and access recordings</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 font-medium">Total</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <Video className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 sm:p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-600 font-medium">Upcoming</p>
                <p className="text-xl sm:text-2xl font-bold text-green-900">{stats.upcoming}</p>
              </div>
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 sm:p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-red-600 font-medium">Live Now</p>
                <p className="text-xl sm:text-2xl font-bold text-red-900">{stats.live}</p>
              </div>
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-600 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 sm:p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 font-medium">Past</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.past}</p>
              </div>
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition ${
              filter === 'upcoming'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="hidden sm:inline">Upcoming & Live</span>
            <span className="sm:hidden">Upcoming</span>
            <span className="ml-1">({stats.upcoming + stats.live})</span>
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition ${
              filter === 'past'
                ? 'bg-gray-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Past ({stats.past})
          </button>
        </div>

        {/* Copy Notification Toast */}
        {copiedText && (
          <div className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg animate-slide-up flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">{copiedText} copied!</span>
          </div>
        )}

        {/* Sessions List */}
        {filteredSessions.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Video className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              {liveSessions.length === 0 ? 'No Live Sessions' : 'No Sessions Found'}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 px-4">
              {liveSessions.length === 0
                ? 'Live sessions will appear here once scheduled by instructors.'
                : 'Try changing the filter to view other sessions.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map(session => {
              const status = getSessionStatus(session.scheduled_at, session.duration_minutes);
              const dateTime = formatDateTime(session.scheduled_at);
              const timeUntil = getTimeUntilSession(session.scheduled_at);
              const isExpanded = expandedSessions.includes(session.id);
              const showPassword = showPasswords[session.id];

              return (
                <div
                  key={session.id}
                  className={`border-2 rounded-xl overflow-hidden transition-all ${
                    status === 'live'
                      ? 'border-red-400 shadow-lg shadow-red-100'
                      : status === 'upcoming'
                      ? 'border-blue-200 hover:border-blue-300'
                      : 'border-gray-200'
                  }`}
                >
                  {/* Session Header */}
                  <div
                    className={`p-4 sm:p-5 cursor-pointer ${
                      status === 'live'
                        ? 'bg-gradient-to-r from-red-50 to-red-100'
                        : status === 'upcoming'
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100'
                        : 'bg-gray-50'
                    }`}
                    onClick={() => toggleSession(session.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <div className={`p-2 rounded-lg flex-shrink-0 ${
                            status === 'live'
                              ? 'bg-red-200'
                              : status === 'upcoming'
                              ? 'bg-blue-200'
                              : 'bg-gray-200'
                          }`}>
                            <Video className={`w-5 h-5 sm:w-6 sm:h-6 ${
                              status === 'live'
                                ? 'text-red-600'
                                : status === 'upcoming'
                                ? 'text-blue-600'
                                : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                              <h3 className="text-base sm:text-lg font-bold text-gray-900 break-words pr-2">{session.title}</h3>
                              <div className="flex-shrink-0">
                                {getStatusBadge(status)}
                              </div>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-700 mb-2 line-clamp-2">{session.description}</p>
                            
                            {/* Course Info */}
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 mb-2">
                              <span className="inline-flex items-center gap-1 font-medium">
                                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="truncate max-w-[150px] sm:max-w-none">{session.course.title}</span>
                              </span>
                              <span className="hidden sm:inline">•</span>
                              <span className="hidden sm:inline">{session.course.instructor_name}</span>
                            </div>

                            {/* Date and Time */}
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                              <span className="inline-flex items-center gap-1 text-gray-700">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="sm:hidden">{dateTime.date}</span>
                                <span className="hidden sm:inline">{dateTime.fullDate}</span>
                              </span>
                              <span className="inline-flex items-center gap-1 text-gray-700">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                {dateTime.time}
                                <span className="hidden sm:inline">({session.duration_minutes} min)</span>
                              </span>
                              {timeUntil && status === 'upcoming' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium">
                                  <Bell className="w-3 h-3" />
                                  {timeUntil}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Button & Expand Icon */}
                      <div className="flex items-center justify-between sm:justify-end gap-2 mt-2 sm:mt-0">
                        {status === 'live' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              joinMeeting(session.meeting_url);
                            }}
                            className="px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm sm:text-base flex items-center gap-2 animate-pulse"
                          >
                            <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                            Join Now
                          </button>
                        )}
                        {status === 'upcoming' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSession(session.id);
                            }}
                            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm sm:text-base flex items-center gap-2"
                          >
                            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">View Details</span>
                            <span className="sm:hidden">Details</span>
                          </button>
                        )}
                        {status === 'past' && session.recording_url && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(session.recording_url, '_blank');
                            }}
                            className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold text-sm sm:text-base flex items-center gap-2"
                          >
                            <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">Watch Recording</span>
                            <span className="sm:hidden">Recording</span>
                          </button>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 bg-white border-t border-gray-200">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        {/* Meeting Details */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                            <Video className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                            Meeting Details
                          </h4>
                          
                          <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <span className="text-xs sm:text-sm text-gray-600">Meeting ID:</span>
                              <div className="flex items-center gap-2">
                                <code className="px-2 py-1 bg-white rounded text-xs sm:text-sm font-mono break-all">
                                  {session.meeting_id.trim()}
                                </code>
                                <button
                                  onClick={() => copyToClipboard(session.meeting_id.trim(), 'Meeting ID')}
                                  className="p-1 hover:bg-gray-200 rounded transition flex-shrink-0"
                                  title="Copy Meeting ID"
                                >
                                  <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                                </button>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <span className="text-xs sm:text-sm text-gray-600">Password:</span>
                              <div className="flex items-center gap-2">
                                <code className="px-2 py-1 bg-white rounded text-xs sm:text-sm font-mono">
                                  {showPassword ? session.meeting_password.trim() : '••••••••'}
                                </code>
                                <button
                                  onClick={() => togglePassword(session.id)}
                                  className="p-1 hover:bg-gray-200 rounded transition flex-shrink-0"
                                  title={showPassword ? "Hide password" : "Show password"}
                                >
                                  {showPassword ? (
                                    <EyeOff className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                                  ) : (
                                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                                  )}
                                </button>
                                <button
                                  onClick={() => copyToClipboard(session.meeting_password.trim(), 'Password')}
                                  className="p-1 hover:bg-gray-200 rounded transition flex-shrink-0"
                                  title="Copy Password"
                                >
                                  <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                                </button>
                              </div>
                            </div>

                            {session.is_recorded && (
                              <div className="pt-3 border-t border-gray-200">
                                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-green-700">
                                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                  Session will be recorded
                                </span>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => joinMeeting(session.meeting_url)}
                            className="w-full px-4 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm sm:text-base flex items-center justify-center gap-2"
                          >
                            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                            Open Meeting Link
                          </button>
                        </div>

                        {/* Course Info */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                            Course Information
                          </h4>

                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4 border border-blue-200">
                            <img
                              src={`https://aifa-cloud.onrender.com/${session.course.thumbnail}`}
                              alt={session.course.title}
                              className="w-full h-24 sm:h-32 object-cover rounded-lg mb-3"
                              loading="lazy"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/400x200?text=Course+Thumbnail';
                              }}
                            />
                            <h5 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base line-clamp-2">{session.course.title}</h5>
                            <p className="text-xs sm:text-sm text-gray-700 mb-2 line-clamp-2">{session.course.short_description}</p>
                            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
                              <span className="px-2 py-1 bg-white rounded text-xs font-medium">
                                {session.course.difficulty_level}
                              </span>
                              <span>•</span>
                              <span>{session.course.duration_hours}h</span>
                              <span>•</span>
                              {/* enrollment_count removed */}
                            </div>
                          </div>

                          {session.recording_url && (
                            <button
                              onClick={() => window.open(session.recording_url, '_blank')}
                              className="w-full px-4 py-2.5 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold text-sm sm:text-base flex items-center justify-center gap-2"
                            >
                              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                              Watch Recording
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}