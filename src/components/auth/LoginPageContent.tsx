"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff, Lock, User } from "lucide-react";
import { api } from "@/lib/api";
import { saveRefreshToken, saveToken, saveUser } from "@/lib/auth";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { slugify } from "@/lib/seoSlug";
import type { GeoAuthParams } from "./geoAuthParams";

export function LoginPageContent({ country, region, city }: GeoAuthParams) {
  const router = useRouter();
  const search = useSearchParams();
  const dispatch = useDispatch();
  const redirect = search.get("redirect");

  const locPrefix = `/${country}/${region}/${slugify(city)}`;

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "email":
        if (!value.trim()) return "email is required";
        if (value.length < 3) return "email must be at least 3 characters";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post("/api/v1/auth/login", formData);
      const access_token = response.data?.access_token as string | undefined;
      const refresh_token = response.data?.refresh_token as string | undefined;
      const user = response.data?.user;
      if (!access_token) throw new Error("Missing access_token");
      saveToken(access_token);
      if (refresh_token) saveRefreshToken(refresh_token);
      if (user) {
        saveUser(user);
        dispatch(setUser(user));
      }
      if (redirect) router.replace(decodeURIComponent(redirect));
      else router.replace("/student");
    } catch (error: unknown) {
      console.error("Login failed:", error);
      const ax = error as { response?: { data?: { message?: string; error?: string } } };
      const msg =
        ax.response?.data?.message || ax.response?.data?.error || "Login failed";
      setErrors({ email: msg });
      setTouched((prev) => ({ ...prev, email: true }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 
            flex items-center justify-center p-3 sm:p-4 lg:p-6"
      >
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-10 translate-x-10 sm:-translate-y-16 sm:translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full translate-y-8 -translate-x-8 sm:translate-y-12 sm:-translate-x-12"></div>

            <div className="text-center mb-6 sm:mb-8 relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg">
                <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
              <p className="text-sm sm:text-base text-gray-600">Please sign in to your account</p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="space-y-4 sm:space-y-6 relative z-10">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl bg-gray-50/50 text-sm sm:text-base
                                         transition-all duration-200 focus:outline-none focus:bg-white 
                                         ${
                                           errors.email && touched.email
                                             ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                             : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                                         } focus:ring-4`}
                      placeholder="Enter your email"
                      required
                    />
                    {errors.email && touched.email && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.email && touched.email && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl bg-gray-50/50 text-sm sm:text-base transition-all duration-200 focus:outline-none focus:bg-white ${
                        errors.password && touched.password
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                          : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                      } focus:ring-4`}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-600 transition-colors"
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      ) : (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600
                             hover:from-blue-600 hover:to-purple-700 text-white font-semibold 
                             py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl text-sm sm:text-base transition-all duration-200 transform hover:scale-[1.02]
                              active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed 
                              disabled:transform-none shadow-lg hover:shadow-xl focus:outline-none focus:ring-4
                               focus:ring-blue-200"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm sm:text-base">Signing In...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>
            </form>
            <div className="mt-6 sm:mt-8 text-center space-y-3 sm:space-y-4 relative z-10">
              <Link
                href="/forgot-password"
                className="block text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium transition-colors hover:underline"
              >
                Forgot your password?
              </Link>

              <div className="text-gray-600 text-xs sm:text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href={`${locPrefix}/signup`}
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors hover:underline"
                >
                  Create one here
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 text-center px-4 sm:px-0">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" />
              Your information is secure and encrypted
            </p>
          </div>
          <GoogleLoginButton />
        </div>
      </div>
    </>
  );
}
