"use client";

import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { CreditCard, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { api } from "@/lib/api";

type Payment = {
  id: number;
  amount?: number;
  currency?: string;
  status?: string;
  created_at?: string;
  course_id?: number;
  payment_method?: string;
};

export default function StudentPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [courses, setCourses] = useState<Array<{ id: number; title: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  async function fetchPayments() {
    try {
      setLoading(true);
      const response = await api.get("/api/v1/users/get-dashboard");
      setPayments((response.data?.payments || []) as Payment[]);
      setCourses((response.data?.recent_activity || []) as Array<{ id: number; title: string }>);
      setError(null);
    } catch (err) {
      const e = err as { message?: string; response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || e.message || "Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  }

  function getCourseName(courseId?: number) {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.title : `Course #${courseId ?? ""}`;
  }

  function formatDate(dateString?: string) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatCurrency(amount?: number, currency?: string) {
    const symbols: Record<string, string> = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };
    return `${symbols[currency || "INR"] || currency || "INR"} ${(amount || 0).toFixed(2)}`;
  }

  function getStatusBadge(status?: string) {
    const key = (status || "pending").toLowerCase();
    const statusConfig: Record<
      string,
      { color: string; icon: ReactElement; text: string }
    > = {
      completed: {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle className="w-4 h-4" />,
        text: "Completed",
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: <Clock className="w-4 h-4" />,
        text: "Pending",
      },
      failed: {
        color: "bg-red-100 text-red-800",
        icon: <XCircle className="w-4 h-4" />,
        text: "Failed",
      },
    };
    const config = statusConfig[key] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        {config.text}
      </span>
    );
  }

  const totalSpent = payments
    .filter((p) => (p.status || "").toLowerCase() === "completed")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-8">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Payments</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={fetchPayments} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
          <p className="text-gray-600 mt-1">Track your course payments and invoices</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4 min-w-[200px]">
          <p className="text-sm opacity-90">Total Spent</p>
          <p className="text-2xl font-bold">{formatCurrency(totalSpent, payments[0]?.currency || "INR")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Payments</p>
              <p className="text-2xl font-bold text-blue-900">{payments.length}</p>
            </div>
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Completed</p>
              <p className="text-2xl font-bold text-green-900">
                {payments.filter((p) => (p.status || "").toLowerCase() === "completed").length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">This Month</p>
              <p className="text-2xl font-bold text-purple-900">
                {
                  payments.filter((p) => {
                    const paymentDate = new Date(p.created_at || "");
                    const now = new Date();
                    return (
                      paymentDate.getMonth() === now.getMonth() &&
                      paymentDate.getFullYear() === now.getFullYear()
                    );
                  }).length
                }
              </p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payments Yet</h3>
          <p className="text-gray-600">Your payment history will appear here once you enroll in courses.</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Payment ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Course</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm text-gray-900">#{payment.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 text-sm">{getCourseName(payment.course_id)}</span>
                        <span className="text-xs text-gray-500">ID: {payment.course_id}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(payment.amount, payment.currency)}
                      </span>
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(payment.status)}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(payment.created_at)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">{payment.payment_method || "N/A"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-mono text-sm text-gray-600">#{payment.id}</p>
                    <p className="font-semibold text-gray-900 mt-1">{getCourseName(payment.course_id)}</p>
                  </div>
                  {getStatusBadge(payment.status)}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(payment.amount, payment.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="text-gray-900">{formatDate(payment.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method:</span>
                    <span className="text-gray-900">{payment.payment_method || "N/A"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
