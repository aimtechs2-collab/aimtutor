"use client";

import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  User,
  Mail,
  Phone,
  Edit3,
  Check,
  Loader2,
  BookOpen,
  Award,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  Shield,
  KeyRound,
  X,
} from "lucide-react";
import { api } from "@/lib/api";
type Student = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  bio: string;
};

type Statistics = {
  total_courses: number;
  completed_courses: number;
  total_certificates: number;
  in_progress_courses: number;
};

export default function StudentProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [student, setStudent] = useState<Student>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    bio: "",
  });

  const [statistics, setStatistics] = useState<Statistics>({
    total_courses: 0,
    completed_courses: 0,
    total_certificates: 0,
    in_progress_courses: 0,
  });

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const passwordChecks = {
    length: passwordData.newPassword.length >= 8,
    uppercase: /[A-Z]/.test(passwordData.newPassword),
    lowercase: /[a-z]/.test(passwordData.newPassword),
    number: /[0-9]/.test(passwordData.newPassword),
  };

  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

  function getStrengthColor() {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-yellow-500";
    if (passwordStrength === 3) return "bg-blue-500";
    return "bg-green-500";
  }

  function getStrengthText() {
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength === 2) return "Fair";
    if (passwordStrength === 3) return "Good";
    return "Strong";
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/api/v1/users/get-dashboard");
      const userData = response.data?.user || {};
      const stats = response.data?.statistics || {};
      setStudent({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        bio: userData.bio || "",
      });
      setStatistics({
        total_courses: stats.total_courses || 0,
        completed_courses: stats.completed_courses || 0,
        total_certificates: stats.total_certificates || 0,
        in_progress_courses: stats.in_progress_courses || 0,
      });
    } catch (err) {
      const e = err as { message?: string };
      setError(e.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit() {
    setIsEditing(!isEditing);
    setSuccessMessage("");
    setError(null);
  }

  async function handleSave() {
    try {
      setSaveLoading(true);
      setError(null);
      setSuccessMessage("");
      if (!student.first_name.trim()) return setError("First name is required");
      if (!student.last_name.trim()) return setError("Last name is required");
      if (!student.email.trim()) return setError("Email is required");
      if (student.phone && !/^\+?[\d\s\-\(\)]{10,15}$/.test(student.phone)) {
        return setError("Please enter a valid phone number");
      }
      await api.put("/api/v1/users/update-profile", {
        first_name: student.first_name.trim(),
        last_name: student.last_name.trim(),
        email: student.email.trim(),
        phone: student.phone.trim(),
        bio: student.bio.trim(),
      });
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");
      await fetchDashboardData();
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      const e = err as { response?: { data?: { message?: string; error?: string; detail?: string } }; message?: string };
      setError(e.response?.data?.message || e.response?.data?.error || e.response?.data?.detail || e.message || "Failed to update profile. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  }

  function handleChange(field: keyof Student, value: string) {
    setStudent((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  }

  function handlePasswordChange(field: "currentPassword" | "newPassword" | "confirmPassword", value: string) {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
    if (passwordError) setPasswordError("");
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    if (!passwordData.currentPassword) return setPasswordError("Current password is required");
    if (!passwordData.newPassword) return setPasswordError("New password is required");
    if (passwordData.newPassword.length < 8) return setPasswordError("New password must be at least 8 characters");
    if (passwordStrength < 3) return setPasswordError("Please create a stronger password");
    if (passwordData.newPassword !== passwordData.confirmPassword) return setPasswordError("Passwords do not match");
    if (passwordData.currentPassword === passwordData.newPassword) return setPasswordError("New password must be different from current password");
    setPasswordLoading(true);
    try {
      await api.put("/api/v1/auth/change-password", {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      });
      setPasswordSuccess("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => {
        setPasswordSuccess("");
        setShowPasswordSection(false);
      }, 3000);
    } catch (err) {
      const e = err as { response?: { status?: number; data?: { message?: string } } };
      const message = e.response?.data?.message || "";
      if (
        e.response?.status === 400 ||
        e.response?.status === 401 ||
        message.toLowerCase().includes("incorrect") ||
        message.toLowerCase().includes("wrong") ||
        message.toLowerCase().includes("invalid")
      ) {
        setPasswordError("Current password is incorrect");
      } else {
        setPasswordError(message || "Failed to change password. Please try again.");
      }
    } finally {
      setPasswordLoading(false);
    }
  }

  function togglePasswordSection() {
    setShowPasswordSection(!showPasswordSection);
    setPasswordError("");
    setPasswordSuccess("");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error && !isEditing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-center">
            <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Profile</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={fetchDashboardData} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 relative overflow-hidden py-6 px-4">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-blue-300 rounded-lg rotate-12"></div>
        <div className="absolute bottom-32 right-20 w-24 h-24 border-2 border-purple-300 rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-6">
        {successMessage ? (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-lg animate-slide-in">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
              <div>
                <p className="font-semibold text-green-900">Success!</p>
                <p className="text-green-700 text-sm">{successMessage}</p>
              </div>
            </div>
          </div>
        ) : null}

        {error && isEditing ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg animate-slide-in">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
              <div>
                <p className="font-semibold text-red-900">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 sm:px-8 py-8 sm:py-10 relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {`${student.first_name} ${student.last_name}`.trim() || "Student"}
                </h2>
                <p className="text-blue-100 text-sm sm:text-base mb-2">{student.email}</p>
                {student.bio ? <p className="text-blue-100 text-sm max-w-md">{student.bio}</p> : null}
                <div className="inline-flex items-center px-3 py-1 mt-3 bg-white bg-opacity-20 rounded-full text-black text-sm font-medium backdrop-blur-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Active Student
                </div>
              </div>

              <button
                onClick={handleEdit}
                disabled={saveLoading}
                className={`flex items-center px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  isEditing ? "bg-red-500 hover:bg-red-600 text-white" : "bg-white text-blue-600 hover:bg-blue-50"
                } shadow-lg`}
              >
                {isEditing ? (
                  <>
                    <X size={16} className="mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit3 size={16} className="mr-2" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Field title="First Name" icon={<User size={16} className="mr-2 text-blue-500" />}>
                {isEditing ? (
                  <input value={student.first_name} onChange={(e) => handleChange("first_name", e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg" />
                ) : (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 rounded-lg border border-blue-100"><p className="text-gray-900 font-medium">{student.first_name || "Not provided"}</p></div>
                )}
              </Field>
              <Field title="Last Name" icon={<User size={16} className="mr-2 text-blue-500" />}>
                {isEditing ? (
                  <input value={student.last_name} onChange={(e) => handleChange("last_name", e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg" />
                ) : (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 rounded-lg border border-blue-100"><p className="text-gray-900 font-medium">{student.last_name || "Not provided"}</p></div>
                )}
              </Field>
              <Field title="Email Address" icon={<Mail size={16} className="mr-2 text-purple-500" />}>
                {isEditing ? (
                  <input type="email" value={student.email} onChange={(e) => handleChange("email", e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg" />
                ) : (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 rounded-lg border border-purple-100"><p className="text-gray-900 font-medium">{student.email}</p></div>
                )}
              </Field>
              <Field title="Phone Number" icon={<Phone size={16} className="mr-2 text-green-500" />}>
                {isEditing ? (
                  <input type="tel" value={student.phone} onChange={(e) => handleChange("phone", e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg" />
                ) : (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 rounded-lg border border-green-100"><p className="text-gray-900 font-medium">{student.phone || "Not provided"}</p></div>
                )}
              </Field>
              <div className="space-y-2 sm:col-span-2">
                <label className="flex items-center text-sm font-medium text-gray-500"><FileText size={16} className="mr-2 text-orange-500" />Bio</label>
                {isEditing ? (
                  <textarea value={student.bio} onChange={(e) => handleChange("bio", e.target.value)} rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none" />
                ) : (
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 px-4 py-3 rounded-lg border border-orange-100 min-h-[100px]"><p className="text-gray-900 font-medium whitespace-pre-wrap">{student.bio || "No bio provided"}</p></div>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="mt-8 flex justify-center">
                <button onClick={handleSave} disabled={saveLoading} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center disabled:opacity-50">
                  {saveLoading ? <><Loader2 size={20} className="mr-2 animate-spin" />Saving...</> : <><Check size={20} className="mr-2" />Save Changes</>}
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <button onClick={togglePasswordSection} className="w-full px-6 sm:px-8 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Change Password</h3>
                <p className="text-sm text-gray-500">Update your account password</p>
              </div>
            </div>
            <div className={`transform transition-transform duration-200 ${showPasswordSection ? "rotate-180" : ""}`}>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </button>

          {showPasswordSection ? (
            <div className="px-6 sm:px-8 pb-6 sm:pb-8 border-t border-gray-100">
              <form onSubmit={handleChangePassword} className="mt-6 space-y-5 max-w-md">
                {passwordSuccess ? <Alert type="success" text={passwordSuccess} /> : null}
                {passwordError ? <Alert type="error" text={passwordError} /> : null}
                <PasswordField label="Current Password" value={passwordData.currentPassword} setValue={(v) => handlePasswordChange("currentPassword", v)} show={showCurrentPassword} setShow={setShowCurrentPassword} icon={<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />} loading={passwordLoading} />
                <PasswordField label="New Password" value={passwordData.newPassword} setValue={(v) => handlePasswordChange("newPassword", v)} show={showNewPassword} setShow={setShowNewPassword} icon={<KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />} loading={passwordLoading} />
                {passwordData.newPassword ? (
                  <div className="space-y-2 mt-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-300 ${getStrengthColor()}`} style={{ width: `${(passwordStrength / 4) * 100}%` }} />
                      </div>
                      <span className="text-xs font-semibold">{getStrengthText()}</span>
                    </div>
                  </div>
                ) : null}
                <PasswordField label="Confirm New Password" value={passwordData.confirmPassword} setValue={(v) => handlePasswordChange("confirmPassword", v)} show={showConfirmPassword} setShow={setShowConfirmPassword} icon={<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />} loading={passwordLoading} />

                <button type="submit" disabled={passwordLoading} className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50">
                  {passwordLoading ? <><Loader2 className="w-5 h-5 animate-spin" />Changing Password...</> : <><Shield className="w-5 h-5" />Change Password</>}
                </button>
              </form>
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard value={statistics.total_courses} label="Total Courses" icon={<BookOpen className="text-white" size={20} />} gradient="from-blue-500 to-indigo-500" />
          <StatCard value={statistics.completed_courses} label="Completed" icon={<Check className="text-white" size={20} />} gradient="from-green-500 to-emerald-500" />
          <StatCard value={statistics.in_progress_courses} label="In Progress" icon={<Clock className="text-white" size={20} />} gradient="from-yellow-500 to-orange-500" />
          <StatCard value={statistics.total_certificates} label="Certificates" icon={<Award className="text-white" size={20} />} gradient="from-purple-500 to-pink-500" />
        </div>
      </div>
      <style jsx>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}

function Field({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-gray-500">{icon}{title}</label>
      {children}
    </div>
  );
}

function PasswordField({
  label, value, setValue, show, setShow, icon, loading,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  show: boolean;
  setShow: (v: boolean) => void;
  icon: ReactNode;
  loading: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        {icon}
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
          className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
        />
        <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
          {show ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

function Alert({ type, text }: { type: "success" | "error"; text: string }) {
  const isSuccess = type === "success";
  return (
    <div className={`${isSuccess ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} border rounded-lg p-4 flex items-center gap-3`}>
      {isSuccess ? <CheckCircle className="w-5 h-5 text-green-500 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />}
      <p className={`text-sm font-medium ${isSuccess ? "text-green-700" : "text-red-700"}`}>{text}</p>
    </div>
  );
}

function StatCard({ value, label, icon, gradient }: { value: number; label: string; icon: ReactNode; gradient: string }) {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-lg mx-auto mb-3 flex items-center justify-center`}>{icon}</div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}
