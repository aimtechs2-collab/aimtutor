import React, { useState } from 'react';
import { Mail, ArrowLeft, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api.js';
import {
  slugify
} from "../utils/seoSlug";
import { useParams } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [touched, setTouched] = useState(false);

  const validateEmail = (email) => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const { country, region, city: cityParam } = useParams();

  const locCountry = country || localStorage.getItem("user_country") || "in";
  const locRegion = region || localStorage.getItem("user_region") || "ts";
  const locCity = cityParam || localStorage.getItem("user_city") || "Hyderabad";

  const locPrefix = `/${locCountry}/${locRegion}/${slugify(locCity)}`;

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validateEmail(email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      setTouched(true);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await api.post('api/v1/auth/send-token', { email });
      setIsSuccess(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(
        err.response?.data?.message ||
        'Failed to send reset email. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Success State
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 mt-24 flex items-center justify-center p-3 sm:p-4 lg:p-6">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8 lg:p-10 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full -translate-y-10 translate-x-10 sm:-translate-y-16 sm:translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-green-400/10 to-teal-400/10 rounded-full translate-y-8 -translate-x-8 sm:translate-y-12 sm:-translate-x-12"></div>

            <div className="relative z-10">
              {/* Success Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4 sm:mb-6 shadow-lg">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
                Check Your Email
              </h1>

              <p className="text-sm sm:text-base text-gray-600 mb-2">
                We've sent a password reset link to:
              </p>

              <p className="text-sm sm:text-base font-semibold text-gray-800 mb-4 sm:mb-6 break-all">
                {email}
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-6 sm:mb-8">
                <p className="text-xs sm:text-sm text-blue-700">
                  <strong>Note:</strong> The link will expire in 1 hour. If you don't see the email, check your spam folder.
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail('');
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl text-sm sm:text-base transition-all duration-200"
                >
                  Send to Different Email
                </button>

                <Link
                  to={`${locPrefix}/login`}
                  className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl text-sm sm:text-base transition-all duration-200 text-center shadow-lg hover:shadow-xl"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50  flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-md mx-auto">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-10 translate-x-10 sm:-translate-y-16 sm:translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full translate-y-8 -translate-x-8 sm:translate-y-12 sm:-translate-x-12"></div>

          {/* Back Button */}
          <Link
            to={`${locPrefix}/login`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors mb-4 sm:mb-6 relative z-10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 relative z-10">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg">
              <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Forgot Password?
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              No worries! Enter your email and we'll send you a reset link.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 sm:space-y-6 relative z-10">
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    disabled={isLoading}
                    className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl bg-gray-50/50 text-sm sm:text-base transition-all duration-200 focus:outline-none focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed ${error && touched
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                      } focus:ring-4`}
                    placeholder="Enter your email address"
                    autoComplete="email"
                  />
                  {error && touched && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {error && touched && (
                  <p className="text-xs sm:text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                    {error}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl text-sm sm:text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span className="text-sm sm:text-base">Sending...</span>
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 sm:mt-8 text-center relative z-10">
            <p className="text-gray-600 text-xs sm:text-sm">
              Remember your password?{' '}
              <Link
                to={`${locPrefix}/login`}
                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-4 sm:mt-6 text-center px-4 sm:px-0">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <Lock className="h-3 w-3" />
            We'll never share your email with anyone else
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;