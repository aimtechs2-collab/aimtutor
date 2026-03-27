import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Edit3,
  Save,
  X,
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
  KeyRound
} from "lucide-react";
import api from "../utils/api";

const ProfileUpdate = () => {
  // Profile states
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [student, setStudent] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    bio: "",
  });

  const [statistics, setStatistics] = useState({
    total_courses: 0,
    completed_courses: 0,
    total_certificates: 0,
    in_progress_courses: 0
  });

  // Change Password states
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
    confirmPassword: ""
  });

  // Password strength checks
  const passwordChecks = {
    length: passwordData.newPassword.length >= 8,
    uppercase: /[A-Z]/.test(passwordData.newPassword),
    lowercase: /[a-z]/.test(passwordData.newPassword),
    number: /[0-9]/.test(passwordData.newPassword),
  };

  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-yellow-500';
    if (passwordStrength === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    return 'Strong';
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/v1/users/get-dashboard');

      const userData = response.data.user;
      const stats = response.data.statistics;

      setStudent({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email,
        phone: userData.phone || "",
        bio: userData.bio || "",
      });

      setStatistics(stats);
    } catch (err) {
      setError(err.message || "Failed to fetch dashboard data");
      console.error("Error fetching dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
    setSuccessMessage("");
    setError(null);
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      setError(null);
      setSuccessMessage("");

      if (!student.first_name?.trim()) {
        setError("First name is required");
        setSaveLoading(false);
        return;
      }

      if (!student.last_name?.trim()) {
        setError("Last name is required");
        setSaveLoading(false);
        return;
      }

      if (!student.email?.trim()) {
        setError("Email is required");
        setSaveLoading(false);
        return;
      }

      if (student.phone && !/^\+?[\d\s\-\(\)]{10,15}$/.test(student.phone)) {
        setError("Please enter a valid phone number");
        setSaveLoading(false);
        return;
      }

      const payload = {
        first_name: student.first_name.trim(),
        last_name: student.last_name.trim(),
        email: student.email.trim(),
        phone: student.phone.trim(),
        bio: student.bio.trim(),
      };

      const response = await api.put('/api/v1/users/update-profile', payload);

      console.log('✅ Profile updated successfully:', response.data);

      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");

      await fetchDashboardData();

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

    } catch (err) {
      console.error("❌ Error saving profile:", err);

      const errorMessage = err.response?.data?.message
        || err.response?.data?.error
        || err.response?.data?.detail
        || err.message
        || "Failed to update profile. Please try again.";

      setError(errorMessage);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setStudent(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError(null);
  };

  // Password change handlers
  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    if (passwordError) setPasswordError("");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    // Validation
    if (!passwordData.currentPassword) {
      setPasswordError("Current password is required");
      return;
    }

    if (!passwordData.newPassword) {
      setPasswordError("New password is required");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }

    if (passwordStrength < 3) {
      setPasswordError("Please create a stronger password");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError("New password must be different from current password");
      return;
    }

    setPasswordLoading(true);

    try {
      await api.put('/api/v1/auth/change-password', {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword
      });

      setPasswordSuccess("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      // Hide success message and close section after 3 seconds
      setTimeout(() => {
        setPasswordSuccess("");
        setShowPasswordSection(false);
      }, 3000);

    } catch (err) {
      console.error("Error changing password:", err);

      const message = err.response?.data?.message || "";

      if (
        err.response?.status === 400 ||
        err.response?.status === 401 ||
        message.toLowerCase().includes('incorrect') ||
        message.toLowerCase().includes('wrong') ||
        message.toLowerCase().includes('invalid')
      ) {
        setPasswordError("Current password is incorrect");
      } else {
        setPasswordError(message || "Failed to change password. Please try again.");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const togglePasswordSection = () => {
    setShowPasswordSection(!showPasswordSection);
    setPasswordError("");
    setPasswordSuccess("");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

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
            <button
              onClick={fetchDashboardData}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 relative overflow-hidden py-6 px-4">

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-blue-300 rounded-lg rotate-12"></div>
        <div className="absolute bottom-32 right-20 w-24 h-24 border-2 border-purple-300 rounded-full"></div>
        <div className="absolute top-1/3 right-10 w-16 h-16 border-2 border-indigo-300 rounded-lg -rotate-12"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-6">

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-lg animate-slide-in">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
              <div>
                <p className="font-semibold text-green-900">Success!</p>
                <p className="text-green-700 text-sm">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && isEditing && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg animate-slide-in">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
              <div>
                <p className="font-semibold text-red-900">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 sm:px-8 py-8 sm:py-10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 border border-white rounded-full transform translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 border border-white rounded-lg transform -translate-x-12 translate-y-12 rotate-45"></div>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {`${student.first_name} ${student.last_name}`.trim() || "Student"}
                </h2>
                <p className="text-blue-100 text-sm sm:text-base mb-2">
                  {student.email}
                </p>
                {student.bio && (
                  <p className="text-blue-100 text-sm max-w-md">
                    {student.bio}
                  </p>
                )}
                <div className="inline-flex items-center px-3 py-1 mt-3 bg-white bg-opacity-20 rounded-full text-black text-sm font-medium backdrop-blur-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Active Student
                </div>
              </div>

              <button
                onClick={handleEdit}
                disabled={saveLoading}
                className={`flex items-center px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${isEditing
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                  } shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
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

          {/* Profile Information */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              {/* First Name */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-500">
                  <User size={16} className="mr-2 text-blue-500" />
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={student.first_name}
                    onChange={(e) => handleChange('first_name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 font-medium"
                    placeholder="John"
                  />
                ) : (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 rounded-lg border border-blue-100">
                    <p className="text-gray-900 font-medium">{student.first_name || "Not provided"}</p>
                  </div>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-500">
                  <User size={16} className="mr-2 text-blue-500" />
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={student.last_name}
                    onChange={(e) => handleChange('last_name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 font-medium"
                    placeholder="Doe"
                  />
                ) : (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 rounded-lg border border-blue-100">
                    <p className="text-gray-900 font-medium">{student.last_name || "Not provided"}</p>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-500">
                  <Mail size={16} className="mr-2 text-purple-500" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={student.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 font-medium"
                  />
                ) : (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 rounded-lg border border-purple-100">
                    <p className="text-gray-900 font-medium">{student.email}</p>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-500">
                  <Phone size={16} className="mr-2 text-green-500" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={student.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900 font-medium"
                    placeholder="+919876543210"
                  />
                ) : (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 rounded-lg border border-green-100">
                    <p className="text-gray-900 font-medium">{student.phone || "Not provided"}</p>
                  </div>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-2 sm:col-span-2">
                <label className="flex items-center text-sm font-medium text-gray-500">
                  <FileText size={16} className="mr-2 text-orange-500" />
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={student.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900 font-medium resize-none"
                  />
                ) : (
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 px-4 py-3 rounded-lg border border-orange-100 min-h-[100px]">
                    <p className="text-gray-900 font-medium whitespace-pre-wrap">
                      {student.bio || "No bio provided"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleSave}
                  disabled={saveLoading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {saveLoading ? (
                    <>
                      <Loader2 size={20} className="mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={20} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ========== CHANGE PASSWORD SECTION ========== */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header - Always visible */}
          <button
            onClick={togglePasswordSection}
            className="w-full px-6 sm:px-8 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Change Password</h3>
                <p className="text-sm text-gray-500">Update your account password</p>
              </div>
            </div>
            <div className={`transform transition-transform duration-200 ${showPasswordSection ? 'rotate-180' : ''}`}>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {/* Expandable Content */}
          {showPasswordSection && (
            <div className="px-6 sm:px-8 pb-6 sm:pb-8 border-t border-gray-100">
              <form onSubmit={handleChangePassword} className="mt-6 space-y-5 max-w-md">

                {/* Password Success Message */}
                {passwordSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    <p className="text-sm text-green-700 font-medium">{passwordSuccess}</p>
                  </div>
                )}

                {/* Password Error Message */}
                {passwordError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <p className="text-sm text-red-700 font-medium">{passwordError}</p>
                  </div>
                )}

                {/* Current Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      disabled={passwordLoading}
                      placeholder="Enter current password"
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showCurrentPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      disabled={passwordLoading}
                      placeholder="Enter new password"
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showNewPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {passwordData.newPassword && (
                    <div className="space-y-2 mt-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                            style={{ width: `${(passwordStrength / 4) * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs font-semibold ${passwordStrength <= 1 ? 'text-red-600' :
                            passwordStrength === 2 ? 'text-yellow-600' :
                              passwordStrength === 3 ? 'text-blue-600' : 'text-green-600'
                          }`}>
                          {getStrengthText()}
                        </span>
                      </div>

                      {/* Password Requirements */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries({
                          length: '8+ characters',
                          uppercase: 'Uppercase (A-Z)',
                          lowercase: 'Lowercase (a-z)',
                          number: 'Number (0-9)'
                        }).map(([key, label]) => (
                          <div
                            key={key}
                            className={`flex items-center gap-1.5 ${passwordChecks[key] ? 'text-green-600' : 'text-gray-400'
                              }`}
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      disabled={passwordLoading}
                      placeholder="Confirm new password"
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all disabled:opacity-50 ${passwordData.confirmPassword && passwordData.confirmPassword === passwordData.newPassword
                          ? 'border-green-300 focus:ring-green-500'
                          : 'border-gray-200 focus:ring-blue-500'
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Match Indicator */}
                  {passwordData.confirmPassword && passwordData.confirmPassword === passwordData.newPassword && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Passwords match!
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg flex items-center justify-center gap-2"
                >
                  {passwordLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Changing Password...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Change Password
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

          {/* Total Courses */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <BookOpen className="text-white" size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {statistics.total_courses}
            </div>
            <div className="text-sm text-gray-600">Total Courses</div>
          </div>

          {/* Completed Courses */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <Check className="text-white" size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {statistics.completed_courses}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>

          {/* In Progress */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <Clock className="text-white" size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {statistics.in_progress_courses}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>

          {/* Certificates */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <Award className="text-white" size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {statistics.total_certificates}
            </div>
            <div className="text-sm text-gray-600">Certificates</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
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
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProfileUpdate;