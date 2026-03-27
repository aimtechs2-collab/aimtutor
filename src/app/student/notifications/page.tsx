"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Trash2,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  X,
  Loader,
  RefreshCw,
  Check,
  Search,
  CheckCheck,
  Circle,
  Mail,
} from "lucide-react";
import { api } from "@/lib/api";

type Notification = {
  id: number;
  title?: string;
  message?: string;
  is_read?: boolean;
  created_at?: string;
  type?: string;
  sent_via_email?: boolean;
};

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "read" | "unread">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/api/v1/notifications/get-notifications");
        if (!cancelled) setNotifications((response.data?.notifications ?? response.data ?? []) as Notification[]);
      } catch {
        if (!cancelled) showToast("error", "Failed to load notifications");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    fetchUnreadCount();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  async function fetchNotifications() {
    setIsLoading(true);
    try {
      const response = await api.get("/api/v1/notifications/get-notifications");
      setNotifications((response.data?.notifications ?? response.data ?? []) as Notification[]);
    } catch {
      showToast("error", "Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchUnreadCount() {
    try {
      const response = await api.get("/api/v1/notifications/unread-count");
      setUnreadCount(response.data?.count || response.data?.unread_count || 0);
    } catch {
      setUnreadCount(0);
    }
  }

  async function markAllAsRead() {
    try {
      await api.put("/api/v1/notifications/mark-all-read");
      showToast("success", "All notifications marked as read");
      fetchNotifications();
      fetchUnreadCount();
    } catch {
      showToast("error", "Failed to mark all as read");
    }
  }

  async function markAsRead(notificationId: number) {
    try {
      await api.put(`/api/v1/notifications/${notificationId}/read`);
      showToast("success", "Marked as read");
      fetchNotifications();
      fetchUnreadCount();
    } catch {
      showToast("error", "Failed to mark as read");
    }
  }

  async function deleteNotification(notificationId: number) {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;
    try {
      await api.delete(`/api/v1/notifications/${notificationId}`);
      showToast("success", "Notification deleted");
      fetchNotifications();
      fetchUnreadCount();
    } catch {
      showToast("error", "Failed to delete notification");
    }
  }

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
  }

  function getNotificationIcon(type?: string) {
    switch (type) {
      case "reminder":
        return <Clock className="w-4 h-4" />;
      case "alert":
        return <AlertTriangle className="w-4 h-4" />;
      case "info":
        return <Info className="w-4 h-4" />;
      case "success":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  }

  function getNotificationColor(type?: string) {
    switch (type) {
      case "reminder":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "alert":
        return "bg-red-100 text-red-600 border-red-200";
      case "info":
        return "bg-purple-100 text-purple-600 border-purple-200";
      case "success":
        return "bg-green-100 text-green-600 border-green-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    const title = notification.title ?? "";
    const message = notification.message ?? "";
    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" ? true : filterType === "unread" ? !notification.is_read : !!notification.is_read;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl shadow-lg">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
                <p className="text-xs text-gray-600 mt-0.5">
                  {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            {unreadCount > 0 ? (
              <div className="flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1.5 rounded-full">
                <Bell className="w-4 h-4" />
                <span className="text-sm font-semibold">{unreadCount} Unread</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 pb-4 border-b border-gray-200">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={fetchNotifications}
                disabled={isLoading}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Mark All Read</span>
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            {(["all", "unread", "read"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterType(filter)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filterType === filter
                    ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter === "all" && `All (${notifications.length})`}
                {filter === "unread" && `Unread (${unreadCount})`}
                {filter === "read" && `Read (${notifications.filter((n) => n.is_read).length})`}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">
                {searchTerm ? "No notifications found" : "No notifications yet"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {searchTerm
                  ? "Try a different search term"
                  : "You'll see notifications here when you receive them"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  getNotificationIcon={getNotificationIcon}
                  getNotificationColor={getNotificationColor}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {toast ? <Toast toast={toast} onClose={() => setToast(null)} /> : null}
    </div>
  );
}

function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
  getNotificationIcon,
  getNotificationColor,
}: {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
  getNotificationIcon: (type?: string) => React.ReactNode;
  getNotificationColor: (type?: string) => string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const message = notification.message ?? "";

  return (
    <div
      className={`p-3 rounded-lg border-2 transition-all hover:shadow-md ${
        notification.is_read ? "bg-gray-50 border-gray-200" : "bg-white border-purple-200 shadow-sm"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg border-2 flex-shrink-0 ${getNotificationColor(notification.type)}`}>
          {getNotificationIcon(notification.type)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className={`text-sm font-semibold ${notification.is_read ? "text-gray-600" : "text-gray-800"}`}>
              {notification.title}
            </h3>
            {!notification.is_read ? (
              <Circle className="w-2 h-2 fill-purple-500 text-purple-500 flex-shrink-0 mt-1" />
            ) : null}
          </div>

          <p
            className={`text-xs mb-2 ${notification.is_read ? "text-gray-500" : "text-gray-600"} ${
              !isExpanded && message.length > 100 ? "line-clamp-2" : ""
            }`}
          >
            {message}
          </p>

          {message.length > 100 ? (
            <button
              onClick={() => setIsExpanded((v) => !v)}
              className="text-xs text-purple-600 hover:text-purple-800 font-medium mb-2"
            >
              {isExpanded ? "Show less" : "Show more"}
            </button>
          ) : null}

          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(notification.created_at)}
            </span>
            {notification.sent_via_email ? (
              <span className="flex items-center gap-1 text-blue-600">
                <Mail className="w-3 h-3" />
                Email sent
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex gap-1 flex-shrink-0">
          {!notification.is_read ? (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Mark as read"
            >
              <Check className="w-4 h-4" />
            </button>
          ) : null}
          <button
            onClick={() => onDelete(notification.id)}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Toast({
  toast,
  onClose,
}: {
  toast: { type: "success" | "error"; message: string };
  onClose: () => void;
}) {
  const bgColor = toast.type === "error" ? "bg-red-500" : "bg-green-500";
  const Icon = toast.type === "error" ? AlertCircle : CheckCircle;

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm ${bgColor} text-white p-3 rounded-lg shadow-2xl animate-slide-in flex items-start gap-2`}
    >
      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button onClick={onClose} className="hover:opacity-80 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function formatDate(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}
