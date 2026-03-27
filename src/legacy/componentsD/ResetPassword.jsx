import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import { Link, useNavigate, useSearchParams ,useParams} from 'react-router-dom';
import api from '../utils/api.js';
import {
  slugify
} from "../utils/seoSlug";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const { country, region, city: cityParam } = useParams();


  const locCountry = country || localStorage.getItem("user_country") || "in";
  const locRegion = region || localStorage.getItem("user_region") || "ts";
  const locCity = cityParam || localStorage.getItem("user_city") || "Hyderabad";

  const locPrefix = `/${locCountry}/${locRegion}/${slugify(locCity)}`;


  // Form state
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Page status: 'form' | 'success' | 'invalid_token'
  const [status, setStatus] = useState('form');

  // Password strength checks
  const passwordChecks = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
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

  // Validation
  const validateField = (name, value) => {
    switch (name) {
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        return '';
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Re-validate confirm password when password changes
    if (name === 'password' && formData.confirmPassword && touched.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: value !== formData.confirmPassword ? 'Passwords do not match' : ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {
      password: validateField('password', formData.password),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword)
    };

    setErrors(newErrors);
    setTouched({ password: true, confirmPassword: true });

    // Stop if validation errors
    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Single API call - backend validates token AND resets password
      await api.post(`/api/v1/auth/reset-password?token=${token}`, {
        // token,
        password: formData.password
      });

      // Success!
      setStatus('success');

      // Redirect to login after 3 seconds
      setTimeout(() => navigate(`${locPrefix}/login`), 3000);

    } catch (err) {
      console.error('Reset password error:', err);

      const statusCode = err.response?.status;
      const message = err.response?.data?.message || '';

      // Check if token is invalid/expired
      if (
        statusCode === 400 ||
        statusCode === 401 ||
        message.toLowerCase().includes('invalid') ||
        message.toLowerCase().includes('expired') ||
        message.toLowerCase().includes('token')
      ) {
        setStatus('invalid_token');
      } else if (err.code === 'ERR_NETWORK') {
        setErrors({
          form: 'Network error. Please check your connection and try again.'
        });
      } else {
        setErrors({
          form: message || 'Failed to reset password. Please try again.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ========== RENDER STATES ==========

  // 1. No token in URL
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <KeyRound className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Missing Reset Link
            </h1>

            <p className="text-gray-600 mb-8">
              No reset token found. Please click the link in your email or request a new one.
            </p>

            <div className="space-y-3">
              <Link
                to="/forgot-password"
                className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Request New Link
              </Link>

              <Link
                to={`${locPrefix}/login`}
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Invalid/Expired token (after submit attempt)
  if (status === 'invalid_token') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Link Expired or Invalid
            </h1>

            <p className="text-gray-600 mb-8">
              This password reset link has expired or is invalid. Reset links are valid for 1 hour. Please request a new one.
            </p>

            <div className="space-y-3">
              <Link
                to="/forgot-password"
                className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Request New Link
              </Link>

              <Link
                to={`${locPrefix}/login`}
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Success state
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Password Changed!
            </h1>

            <p className="text-gray-600 mb-6">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                <p className="text-sm text-blue-700">Redirecting to login...</p>
              </div>
            </div>

            <Link
              to={`${locPrefix}/login`}
              className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all"
            >
              Sign In Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Main password reset form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Back link */}
          <Link
            to={`${locPrefix}/login`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Set New Password
            </h1>
            <p className="text-gray-600">
              Create a strong password for your account
            </p>
          </div>

          {/* Form error */}
          {errors.form && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm">{errors.form}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Password field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  placeholder="Enter new password"
                  className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-4 ${errors.password && touched.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>

              {/* Password strength */}
              {formData.password && (
                <div className="mt-3 space-y-2">
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

              {errors.password && touched.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm password field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  placeholder="Confirm new password"
                  className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-4 ${errors.confirmPassword && touched.confirmPassword
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : formData.confirmPassword && formData.confirmPassword === formData.password
                        ? 'border-green-300 focus:border-green-500 focus:ring-green-100'
                        : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
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

              {/* Match indicator */}
              {formData.confirmPassword && formData.confirmPassword === formData.password && (
                <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Passwords match!
                </p>
              )}

              {errors.confirmPassword && touched.confirmPassword && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Resetting...
                </span>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        </div>

        {/* Security note */}
        <p className="text-center text-xs text-gray-500 mt-6 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" />
          Your password is encrypted and secure
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;