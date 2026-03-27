import React, { useState } from 'react'
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react'
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom'
import api from '../utils/api.js'
import { saveToken } from '../utils/auth.js'
import GoogleLoginButton from "./GoogleLoginButton.jsx"
import { useDispatch } from 'react-redux'
import { setUser } from '../store/slices/authSlice.js'
import {
    slugify
} from "../utils/seoSlug";


function Login() {

    const { country, region, city: cityParam } = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();



    const locCountry = country || localStorage.getItem("user_country") || "in";
    const locRegion = region || localStorage.getItem("user_region") || "ts";
    const locCity = cityParam || localStorage.getItem("user_city") || "Hyderabad";

    // ✅ FIXED: Use slugify for URL, keep original for display/SEO
    const locPrefix = `/${locCountry}/${locRegion}/${slugify(locCity)}`;


    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [touched, setTouched] = useState({})

    const validateField = (name, value) => {
        switch (name) {
            case 'email':
                if (!value.trim()) return 'email is required'
                if (value.length < 3) return 'email must be at least 3 characters'
                return ''
            case 'password':
                if (!value) return 'Password is required'
                if (value.length < 6) return 'Password must be at least 6 characters'
                return ''
            default:
                return ''
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))


        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const handleBlur = (e) => {
        const { name, value } = e.target
        setTouched(prev => ({
            ...prev,
            [name]: true
        }))

        const error = validateField(name, value)
        setErrors(prev => ({
            ...prev,
            [name]: error
        }))
    }


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }


    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post('/api/v1/auth/login', formData);

            const { access_token, user } = response.data;
            saveToken(access_token);
            localStorage.setItem("user", JSON.stringify(user));
            dispatch(setUser(user));

            // ✅ Always go to student dashboard
            navigate("/student");

        } catch (error) {
            console.error("Login failed:", error);
            setErrors({ email: error.response?.data?.message || 'Login failed' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 
            mt-24 flex items-center justify-center p-3 sm:p-4 lg:p-6">
                <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-md mx-auto">
                    {/* Main Card */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
                        {/* Background decoration - responsive sizes */}
                        <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-10 translate-x-10 sm:-translate-y-16 sm:translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full translate-y-8 -translate-x-8 sm:translate-y-12 sm:-translate-x-12"></div>

                        {/* Header */}
                        <div className="text-center mb-6 sm:mb-8 relative z-10">
                            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg">
                                <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                            <p className="text-sm sm:text-base text-gray-600">Please sign in to your account</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleLogin}>
                            <div className="space-y-4 sm:space-y-6 relative z-10">
                                {/* Username Field */}
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
                                         ${errors.email && touched.email
                                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
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

                                {/* Password Field */}
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
                                            className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl bg-gray-50/50 text-sm sm:text-base transition-all duration-200 focus:outline-none focus:bg-white ${errors.password && touched.password
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                                                } focus:ring-4`}
                                            placeholder="Enter your password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
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

                                {/* Submit Button */}
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
                                        'Sign In'
                                    )}
                                </button>
                            </div>
                        </form>
                        {/* Footer Links */}
                        <div className="mt-6 sm:mt-8 text-center space-y-3 sm:space-y-4 relative z-10">
                            <Link
                                to={`/forgot-password`}
                                className="block text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium transition-colors hover:underline"
                            >
                                Forgot your password?
                            </Link>

                            <div className="text-gray-600 text-xs sm:text-sm">
                                Don't have an account?{' '}
                                <Link
                                    to={`${locPrefix}/signup`}
                                    className="text-blue-600 hover:text-blue-800 font-semibold transition-colors hover:underline"
                                >
                                    Create one here
                                </Link>
                            </div>
                        </div>

                    </div>

                    {/* Additional Security Note */}
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
    )
}

export default Login