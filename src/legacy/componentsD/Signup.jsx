import React, { useState, useEffect, useRef } from 'react'
import { Eye, EyeOff, Lock, User, Mail, Phone, AlertCircle, UserPlus, FileText, ChevronDown, Loader, Shield, CheckCircle } from 'lucide-react'
import api from '../utils/api.js'
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom'
import GoogleLoginButton from './GoogleLoginButton.jsx'
import { saveToken } from '../utils/auth.js'
import { slugify } from '../utils/seoSlug.js';
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice";



function Signup() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect");

    const { country, region, city: cityParam } = useParams();

    const locCountry = country || localStorage.getItem("user_country") || "in";
    const locRegion = region || localStorage.getItem("user_region") || "ts";
    const locCity = cityParam || localStorage.getItem("user_city") || "Hyderabad";

    // ✅ FIXED: Use slugify for URL, keep original for display/SEO
    const locPrefix = `/${locCountry}/${locRegion}/${slugify(locCity)}`;
    const city = locCity; // For buildCategoryCitySeo() and display
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        countryCode: '+91',
        phone: '',
        bio: '',
        password: '',
        confirmPassword: '',
        role: "student",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [showCountryDropdown, setShowCountryDropdown] = useState(false)
    const [countrySearch, setCountrySearch] = useState('')
    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [apiError, setApiError] = useState('')

    // OTP Verification States
    const [showOtpModal, setShowOtpModal] = useState(false)
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [otpError, setOtpError] = useState('')
    const [isVerifying, setIsVerifying] = useState(false)
    const [resendTimer, setResendTimer] = useState(60)
    const [canResend, setCanResend] = useState(false)
    const otpInputRefs = useRef([])

    // State for country codes from API
    const [countryCodes, setCountryCodes] = useState([])
    const [loadingCountries, setLoadingCountries] = useState(true)
    const [countryError, setCountryError] = useState(null)

    // Fetch countries from REST Countries API
    useEffect(() => {
        fetchCountries()
    }, [])

    // OTP Resend Timer
    useEffect(() => {
        let timer
        if (showOtpModal && resendTimer > 0) {
            timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
        } else if (resendTimer === 0) {
            setCanResend(true)
        }
        return () => clearTimeout(timer)
    }, [showOtpModal, resendTimer])

    const fetchCountries = async () => {
        try {
            setLoadingCountries(true)
            setCountryError(null)

            const fields = 'name,cca2,idd'
            const response = await fetch(`https://restcountries.com/v3.1/all?fields=${fields}`)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()

            const formattedCountries = data
                .map(country => {
                    const root = country.idd?.root || ''
                    const suffixes = country.idd?.suffixes || []
                    const code = root + (suffixes[0] || '')

                    return {
                        code: code,
                        country: country.cca2,
                        name: country.name.common,
                        flag: getFlagEmoji(country.cca2),
                    }
                })
                .filter(country => country.code)
                .sort((a, b) => a.name.localeCompare(b.name))

            setCountryCodes(formattedCountries)
            setLoadingCountries(false)
        } catch (error) {
            console.error('Error fetching countries:', error)
            setCountryError('Failed to load countries. Using default list.')
            setLoadingCountries(false)

            setCountryCodes([
                { code: '+1', country: 'US', flag: '🇺🇸', name: 'United States' },
                { code: '+44', country: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
                { code: '+91', country: 'IN', flag: '🇮🇳', name: 'India' },
                { code: '+86', country: 'CN', flag: '🇨🇳', name: 'China' },
                { code: '+81', country: 'JP', flag: '🇯🇵', name: 'Japan' },
                { code: '+49', country: 'DE', flag: '🇩🇪', name: 'Germany' },
                { code: '+33', country: 'FR', flag: '🇫🇷', name: 'France' },
                { code: '+61', country: 'AU', flag: '🇦🇺', name: 'Australia' },
                { code: '+971', country: 'AE', flag: '🇦🇪', name: 'UAE' },
                { code: '+966', country: 'SA', flag: '🇸🇦', name: 'Saudi Arabia' },
            ])
        }
    }

    // Helper function to generate flag emoji
    const getFlagEmoji = (countryCode) => {
        if (!countryCode) return '🏳️'
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt(0))
        return String.fromCodePoint(...codePoints)
    }

    const filteredCountries = countryCodes.filter(country =>
        country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
        country.code.includes(countrySearch) ||
        country.country.toLowerCase().includes(countrySearch.toLowerCase())
    )

    const validateField = (name, value) => {
        switch (name) {
            case 'first_name':
                if (!value.trim()) return 'First name is required'
                if (value.length < 2) return 'First name must be at least 2 characters long'
                if (!/^[a-zA-Z\s]+$/.test(value)) return 'First name can only contain letters and spaces'
                return ''
            case 'last_name':
                if (!value.trim()) return 'Last name is required'
                if (value.length < 2) return 'Last name must be at least 2 characters long'
                if (!/^[a-zA-Z\s]+$/.test(value)) return 'Last name can only contain letters and spaces'
                return ''
            case 'email':
                if (!value.trim()) return 'Email is required'
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format'
                return ''
            case 'phone':
                if (!value.trim()) return 'Phone number is required'
                if (!/^\d{7,15}$/.test(value)) return 'Phone number must be 7-15 digits'
                return ''
            case 'bio':
                if (value && value.length > 500) return 'Bio must be less than 500 characters'
                return ''
            case 'password':
                if (!value) return 'Password is required'
                if (value.length < 8) return 'Password must be at least 8 characters long'
                if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter'
                if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter'
                if (!/[0-9]/.test(value)) return 'Password must contain at least one number'
                if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'Password must contain at least one special character';
                return ''
            case 'confirmPassword':
                if (!value) return 'Please confirm your password'
                if (value !== formData.password) return 'Passwords do not match'
                return ''
            default:
                return ''
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Clear API error when user starts typing
        if (apiError) {
            setApiError('')
        }

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }

        if (name === 'password' && formData.confirmPassword && touched.confirmPassword) {
            const confirmError = validateField('confirmPassword', formData.confirmPassword)
            setErrors(prev => ({
                ...prev,
                confirmPassword: confirmError
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

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    const handleCountryCodeSelect = (code) => {
        setFormData(prev => ({ ...prev, countryCode: code }))
        setShowCountryDropdown(false)
        setCountrySearch('')
    }

    // OTP Input Handlers
    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return // Only allow digits

        const newOtp = [...otp]
        newOtp[index] = value.slice(-1) // Take only last digit
        setOtp(newOtp)
        setOtpError('')

        // Auto-focus next input
        if (value && index < 5) {
            otpInputRefs.current[index + 1]?.focus()
        }
    }

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus()
        }
    }

    const handleOtpPaste = (e) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').slice(0, 6)
        if (!/^\d+$/.test(pastedData)) return

        const newOtp = [...otp]
        pastedData.split('').forEach((digit, index) => {
            if (index < 6) newOtp[index] = digit
        })
        setOtp(newOtp)
        setOtpError('')

        // Focus last filled input or last input
        const lastIndex = Math.min(pastedData.length, 5)
        otpInputRefs.current[lastIndex]?.focus()
    }

    const handleVerifyOtp = async () => {
        const otpValue = otp.join('');

        if (otpValue.length !== 6) {
            setOtpError('Please enter all 6 digits');
            return;
        }

        setIsVerifying(true);
        setOtpError('');

        try {
            const res = await api.post('/api/v1/auth/verify-otp', { otp: String(otpValue) });

            // ✅ Extract response data
            const { access_token, user } = res.data || {};


            // console.log("[Signup → handleVerifyOtp]");
            // console.log("Response data:", res.data);

            if (!access_token || !user) {
                throw new Error("Missing authentication data from server");
            }

            saveToken(access_token);
            // localStorage.setItem("refresh_token", refresh_token);
            localStorage.setItem("user", JSON.stringify(user));

            
    // console.log("After saving → accessToken:", localStorage.getItem("accessToken"));
    // console.log("After saving → user:", localStorage.getItem("user"));

            dispatch(setUser(user));

                // console.log("Dispatched setUser(user). Waiting 300ms before navigation...");

            setTimeout(() => {
                if (redirect) navigate(redirect);
                else navigate("/student");
            }, 300);


        } catch (error) {
            console.error('OTP verification error:', error);
            setOtpError(
                error.response?.data?.message ||
                error.message ||
                'Invalid OTP. Please try again.'
            );
            setOtp(['', '', '', '', '', '']);
            otpInputRefs.current[0]?.focus();
        } finally {
            setIsVerifying(false);
        }
    };


    const handleResendOtp = async () => {
        if (!canResend) return

        setCanResend(false)
        setResendTimer(60)
        setOtpError('')

        try {
            // Call your resend OTP endpoint
            await api.post('/api/v1/auth/resend-otp')
            // You can show a success message here
        } catch (error) {
            console.error('Resend OTP error:', error)
            setOtpError('Failed to resend OTP. Please try again.')
            setCanResend(true)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const fieldsToValidate = ['first_name', 'last_name', 'email', 'phone', 'bio', 'password', 'confirmPassword']
        const validationErrors = {}

        fieldsToValidate.forEach(field => {
            const error = validateField(field, formData[field])
            if (error) {
                validationErrors[field] = error
            }
        })

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            setTouched({
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                bio: true,
                password: true,
                confirmPassword: true,
            })
            return
        }

        const apiData = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: `${formData.countryCode}${formData.phone}`,
            bio: formData.bio,
            password: formData.password,
            role: formData.role
        }

        setIsLoading(true)
        setApiError('') // Clear previous errors

        api.post('/api/v1/auth/register', apiData)
            .then(response => {
                setIsLoading(false)
                setShowOtpModal(true)
                setOtp(['', '', '', '', '', ''])
                setResendTimer(60)
                setCanResend(false)

                if (response.data.access_token) {
                    saveToken(response.data.access_token)
                }
            })
            .catch(error => {
                console.error('Error registering user:', error)
                setIsLoading(false)

                // Extract error message from different possible response formats
                const errorMessage = error.response?.data?.error ||
                    error.response?.data?.message ||
                    error.message ||
                    'Registration failed. Please try again.'

                setApiError(errorMessage)

                // If it's an email-related error, also highlight the email field
                if (errorMessage.toLowerCase().includes('email')) {
                    setErrors(prev => ({
                        ...prev,
                        email: errorMessage
                    }))
                    setTouched(prev => ({
                        ...prev,
                        email: true
                    }))
                }

                // Scroll to top to show error message
                window.scrollTo({ top: 0, behavior: 'smooth' })
            })
    }

    const selectedCountry = countryCodes.find(c => c.code === formData.countryCode) ||
        { code: '+91', flag: '🇮🇳', name: 'India' }

    // ... (keep all imports and initial code the same until the return statement)

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 
        flex items-center justify-center p-4 py-8">
                <div className="w-full max-w-lg"> {/* Changed from max-w-md */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border
             border-white/20 p-6 lg:p-8 relative overflow-hidden"> {/* Reduced padding, added responsive */}

                        {/* Decorative elements - reduced size */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-blue-400/10 
                    rounded-full -translate-y-12 translate-x-12"></div>
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-400/10 to-pink-400/10
                     rounded-full translate-y-10 -translate-x-10"></div>

                        {/* Header - more compact */}
                        <div className="text-center mb-6 relative z-10">
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl mb-3 shadow-lg">
                                <UserPlus className="w-7 h-7 text-white" />
                            </div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">Create Account</h1>
                            <p className="text-sm text-gray-600">Join us today and get started</p>
                        </div>

                        {/* API Error Alert - ADD THIS */}
                        {apiError && (
                            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg relative z-10 animate-shake">
                                <div className="flex items-start">
                                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                    <div className="ml-3 flex-1">
                                        <h3 className="text-sm font-semibold text-red-800">Registration Failed</h3>
                                        <p className="text-sm text-red-700 mt-1">{apiError}</p>
                                    </div>
                                    <button
                                        onClick={() => setApiError('')}
                                        className="ml-3 text-red-500 hover:text-red-700 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={handleSubmit}> {/* Reduced from space-y-6 */}
                            <div className="space-y-3 relative z-10"> {/* Reduced from space-y-4 */}

                                {/* First Name and Last Name Fields - more compact */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label htmlFor="first_name" className="block text-xs font-semibold text-gray-700">
                                            First Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                id="first_name"
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleInputChange}
                                                onBlur={handleBlur}
                                                className={`w-full pl-9 pr-4 py-2.5 text-sm border-2 rounded-xl bg-gray-50/50 transition-all duration-200 focus:outline-none focus:bg-white ${errors.first_name && touched.first_name
                                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                                    : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
                                                    } focus:ring-2`}
                                                placeholder="First name"
                                                required
                                            />
                                            {errors.first_name && touched.first_name && (
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                                </div>
                                            )}
                                        </div>
                                        {errors.first_name && touched.first_name && (
                                            <p className="text-xs text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.first_name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="last_name" className="block text-xs font-semibold text-gray-700">
                                            Last Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                id="last_name"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleInputChange}
                                                onBlur={handleBlur}
                                                className={`w-full pl-9 pr-4 py-2.5 text-sm border-2 rounded-xl bg-gray-50/50 transition-all duration-200 focus:outline-none focus:bg-white ${errors.last_name && touched.last_name
                                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                                    : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
                                                    } focus:ring-2`}
                                                placeholder="Last name"
                                                required
                                            />
                                            {errors.last_name && touched.last_name && (
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                                </div>
                                            )}
                                        </div>
                                        {errors.last_name && touched.last_name && (
                                            <p className="text-xs text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.last_name}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Email Field - more compact */}
                                <div className="space-y-1.5">
                                    <label htmlFor="email" className="block text-xs font-semibold text-gray-700">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            className={`w-full pl-9 pr-4 py-2.5 text-sm border-2 rounded-xl bg-gray-50/50 transition-all duration-200 focus:outline-none focus:bg-white ${errors.email && touched.email
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                                : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
                                                } focus:ring-2`}
                                            placeholder="Enter your email"
                                            required
                                        />
                                        {errors.email && touched.email && (
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                <AlertCircle className="h-4 w-4 text-red-500" />
                                            </div>
                                        )}
                                    </div>
                                    {errors.email && touched.email && (
                                        <p className="text-xs text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Phone Field - more compact */}
                                <div className="space-y-1.5">
                                    <label htmlFor="phone" className="block text-xs font-semibold text-gray-700">
                                        Phone Number
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="relative w-28">
                                            <button
                                                type="button"
                                                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                                disabled={loadingCountries}
                                                className={`w-full px-2.5 py-2.5 text-sm border-2 rounded-xl bg-gray-50/50 transition-all duration-200 focus:outline-none focus:bg-white flex items-center justify-between ${errors.phone && touched.phone
                                                    ? 'border-red-300'
                                                    : 'border-gray-200 hover:border-purple-300'
                                                    } ${loadingCountries ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {loadingCountries ? (
                                                    <Loader className="h-4 w-4 animate-spin text-gray-400" />
                                                ) : (
                                                    <span className="flex items-center gap-1 text-xs font-medium">
                                                        <span className="text-base">{selectedCountry.flag}</span>
                                                        <span className="truncate">{selectedCountry.code}</span>
                                                    </span>
                                                )}
                                                <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                                            </button>

                                            {showCountryDropdown && !loadingCountries && (
                                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-60 overflow-hidden z-50 w-80">
                                                    {countryError && (
                                                        <div className="p-2 bg-yellow-50 border-b border-yellow-200">
                                                            <p className="text-xs text-yellow-700 flex items-center gap-1">
                                                                <AlertCircle className="h-3 w-3" />
                                                                {countryError}
                                                            </p>
                                                        </div>
                                                    )}

                                                    <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                                                        <input
                                                            type="text"
                                                            placeholder="Search country..."
                                                            value={countrySearch}
                                                            onChange={(e) => setCountrySearch(e.target.value)}
                                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-purple-500"
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </div>

                                                    <div className="overflow-y-auto max-h-48 custom-scrollbar">
                                                        {filteredCountries.map((country) => (
                                                            <button
                                                                key={`${country.code}-${country.country}`}
                                                                type="button"
                                                                onClick={() => handleCountryCodeSelect(country.code)}
                                                                className={`w-full px-3 py-2 text-left hover:bg-purple-50 flex items-center gap-2 transition-colors ${formData.countryCode === country.code ? 'bg-purple-100' : ''
                                                                    }`}
                                                            >
                                                                <span className="text-base flex-shrink-0">{country.flag}</span>
                                                                <span className="text-xs font-medium text-gray-700 flex-shrink-0 w-12">{country.code}</span>
                                                                <span className="text-xs text-gray-500 truncate flex-1">{country.name}</span>
                                                            </button>
                                                        ))}
                                                        {filteredCountries.length === 0 && (
                                                            <div className="px-3 py-6 text-center text-xs text-gray-500">
                                                                No countries found
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="relative flex-1">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Phone className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                onBlur={handleBlur}
                                                className={`w-full pl-9 pr-4 py-2.5 text-sm border-2 rounded-xl bg-gray-50/50 transition-all duration-200 focus:outline-none focus:bg-white ${errors.phone && touched.phone
                                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                                    : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
                                                    } focus:ring-2`}
                                                placeholder="Phone number"
                                                required
                                            />
                                            {errors.phone && touched.phone && (
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {errors.phone && touched.phone && (
                                        <p className="text-xs text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>

                                {/* Bio Field - more compact */}
                                <div className="space-y-1.5">
                                    <label htmlFor="bio" className="block text-xs font-semibold text-gray-700">
                                        Bio <span className="text-gray-500 font-normal">(Optional)</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute top-2.5 left-0 pl-3 flex items-start pointer-events-none">
                                            <FileText className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <textarea
                                            id="bio"
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            rows={2}
                                            className={`w-full pl-9 pr-4 py-2.5 text-sm border-2 rounded-xl bg-gray-50/50 transition-all duration-200 focus:outline-none focus:bg-white resize-none ${errors.bio && touched.bio
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                                : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
                                                } focus:ring-2`}
                                            placeholder="Tell us a bit about yourself (optional)"
                                        />
                                        {errors.bio && touched.bio && (
                                            <div className="absolute top-2.5 right-0 pr-3 flex items-start">
                                                <AlertCircle className="h-4 w-4 text-red-500" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        {errors.bio && touched.bio && (
                                            <p className="text-xs text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.bio}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500 ml-auto">
                                            {formData.bio.length}/500
                                        </p>
                                    </div>
                                </div>

                                {/* Password Fields - more compact */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label htmlFor="password" className="block text-xs font-semibold text-gray-700">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                onBlur={handleBlur}
                                                className={`w-full pl-9 pr-10 py-2.5 text-sm border-2 rounded-xl bg-gray-50/50 transition-all duration-200 focus:outline-none focus:bg-white ${errors.password && touched.password
                                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                                    : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
                                                    } focus:ring-2`}
                                                placeholder="Password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={togglePasswordVisibility}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-purple-600 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <Eye className="h-4 w-4 text-gray-400" />
                                                ) : (
                                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && touched.password && (
                                            <p className="text-xs text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-700">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                onBlur={handleBlur}
                                                className={`w-full pl-9 pr-10 py-2.5 text-sm border-2 rounded-xl bg-gray-50/50 transition-all duration-200 focus:outline-none focus:bg-white ${errors.confirmPassword && touched.confirmPassword
                                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                                    : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
                                                    } focus:ring-2`}
                                                placeholder="Confirm"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={toggleConfirmPasswordVisibility}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-purple-600 transition-colors"
                                            >
                                                {showConfirmPassword ? (
                                                    <Eye className="h-4 w-4 text-gray-400" />
                                                ) : (
                                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && touched.confirmPassword && (
                                            <p className="text-xs text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.confirmPassword}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Button - more compact */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-purple-500 to-blue-600
                         hover:from-purple-600 hover:to-blue-700 text-white font-semibold 
                         py-2.5 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] 
                         active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed 
                         disabled:transform-none shadow-lg hover:shadow-xl focus:outline-none 
                         focus:ring-2 focus:ring-purple-200 mt-4 text-sm"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Creating Account...
                                        </div>
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-4 text-center relative z-10">
                            <div className="text-gray-600 text-xs">
                                Already have an account?{' '}
                                <Link
                                    to={`${locPrefix}/login`}
                                    className="text-purple-600 hover:text-purple-800 font-semibold transition-colors hover:underline"
                                >
                                    Sign in here
                                </Link>
                            </div>
                        </div>
                    </div>

                    <GoogleLoginButton />

                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                            <Lock className="h-3 w-3" />
                            By creating an account, you agree to our Terms of Service
                        </p>
                    </div>
                </div>
            </div>


            {/* OTP Verification Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-scale-in">
                        {/* Success Icon */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-4 shadow-lg">
                                <Shield className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
                            <p className="text-gray-600 text-sm">
                                We've sent a 6-digit code to<br />
                                <span className="font-semibold text-purple-600">{formData.phone}</span>
                            </p>
                        </div>

                        {/* OTP Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                                Enter Verification Code
                            </label>
                            <div className="flex gap-2 justify-center">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={el => otpInputRefs.current[index] = el}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        onPaste={index === 0 ? handleOtpPaste : undefined}
                                        className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl 
                                        focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 
                                        transition-all duration-200 bg-gray-50"
                                        disabled={isVerifying}
                                    />
                                ))}
                            </div>
                            {otpError && (
                                <p className="text-sm text-red-600 text-center mt-3 flex items-center justify-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    {otpError}
                                </p>
                            )}
                        </div>

                        {/* Verify Button */}
                        <button
                            onClick={handleVerifyOtp}
                            disabled={isVerifying || otp.join('').length !== 6}
                            className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 
                            hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all 
                            duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 
                            disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl 
                            focus:outline-none focus:ring-4 focus:ring-purple-200"
                        >
                            {isVerifying ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Verifying...
                                </div>
                            ) : (
                                'Verify Code'
                            )}
                        </button>

                        {/* Resend Code */}
                        
                        <div className="text-center mt-6">
                            {canResend ? (
                                <button
                                    onClick={handleResendOtp}
                                    className="text-purple-600 hover:text-purple-800 font-semibold text-sm transition-colors hover:underline"
                                >
                                    Resend Code
                                </button>
                            ) : (
                                <p className="text-gray-500 text-sm">
                                    Resend code in <span className="font-semibold text-purple-600">{resendTimer}s</span>
                                </p>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </>
    )
}

export default Signup