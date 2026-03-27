import React, { useState, useMemo, useEffect, useRef } from "react";
import axios from "axios";
import api from "../utils/api";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { getToken } from "../utils/auth";
import { 
  AlertCircle, 
  Lock, 
  X, 
  LogIn,
  Sparkles,
  CreditCard,
  Clock
} from 'lucide-react';

// Modal Component
const Modal = ({ isOpen, onClose, children, preventClose = false }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={!preventClose ? onClose : undefined}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slide-up">
        {!preventClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default function EnrollmentForm({
  price,
  courseCurrency = "INR",
  courseId,
  courseName = "Course"
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const token = getToken();
  
  // Prevent double submissions
  const isSubmitting = useRef(false);
  const welcomeTimeoutRef = useRef(null);

  const parts = location.pathname.split("/");
  const locCountry = parts[1] || localStorage.getItem("user_country") || "in";
  const locRegion = parts[2] || localStorage.getItem("user_region") || "ts";
  const locCity = parts[3] || localStorage.getItem("user_city") || "hyderabad";
  const locPrefix = `/${locCountry}/${locRegion}/${locCity}`;

  // Modal states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showCancelledModal, setShowCancelledModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form state
  const [form, setForm] = useState(() => {
    const savedForm = localStorage.getItem('enrollment_form_data');
    if (savedForm) {
      try {
        const parsed = JSON.parse(savedForm);
        if (parsed.courseId === courseId) {
          return {
            name: parsed.name || "",
            email: parsed.email || "",
            phone: parsed.phone || "",
          };
        }
      } catch (e) {
        console.error("Error parsing saved form data:", e);
      }
    }
    
    if (isAuthenticated && user) {
      return {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      };
    }

    return { name: "", email: "", phone: "" };
  });

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [submitState, setSubmitState] = useState({
    busy: false,
    message: "",
    type: ""
  });

  const [touchedFields, setTouchedFields] = useState({
    name: false,
    email: false,
    phone: false
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (welcomeTimeoutRef.current) {
        clearTimeout(welcomeTimeoutRef.current);
      }
    };
  }, []);

  // Check if user came back from signup
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('from') === 'signup' && isAuthenticated) {
      const newUrl = location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      welcomeTimeoutRef.current = setTimeout(() => {
        setShowWelcomeModal(true);
      }, 500);
    }
  }, [location, isAuthenticated]);

  // Save form data to localStorage
  useEffect(() => {
    if (form.name || form.email || form.phone) {
      localStorage.setItem('enrollment_form_data', JSON.stringify({
        ...form,
        courseId,
        timestamp: Date.now()
      }));
    }
  }, [form, courseId]);

  // Pre-fill form with user data
  useEffect(() => {
    if (isAuthenticated && user && !form.email) {
      setForm(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [isAuthenticated, user]);

  // Field validation
  const validateField = (field, value) => {
    let error = "";
    
    switch (field) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (value.trim().length < 2) {
          error = "Name must be at least 2 characters";
        }
        break;
        
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
        
      case "phone":
        const cleanPhone = value.replace(/[\s\-\+\(\)]/g, '');
        if (!value.trim()) {
          error = "Phone number is required";
        } else if (cleanPhone.length < 10) {
          error = "Please enter a valid 10-digit phone number";
        } else if (!/^[\d\s\-\+\(\)]+$/.test(value)) {
          error = "Phone number can only contain numbers";
        }
        break;
        
      default:
        break;
    }
    
    return error;
  };

  const handleFieldChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    if (touchedFields[field]) {
      const error = validateField(field, value);
      setFieldErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleFieldBlur = (field) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, form[field]);
    setFieldErrors(prev => ({ ...prev, [field]: error }));
  };

  function currency(amount, code = "INR") {
    try {
      return new Intl.NumberFormat('en-IN', {
        style: "currency",
        currency: code,
      }).format(amount);
    } catch {
      return `${code} ${amount.toFixed(2)}`;
    }
  }

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Submit contact form API
  const submitContactForm = async (authToken) => {
    try {
      await axios.post(
        'https://aifa-cloud.onrender.com/api/v1/contact/contact-forms',
        {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone_number: form.phone.trim()
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );
      return { success: true };
    } catch (error) {
      // Don't block - contact form is secondary
      return { success: false };
    }
  };

  // Retry logic for API calls
  const makeAPICallWithRetry = async (apiCall, maxRetries = 3) => {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i - 1)));
        }
        return await apiCall();
      } catch (error) {
        lastError = error;
        // Don't retry for client errors (4xx)
        if (error.response?.status >= 400 && error.response?.status < 500) {
          throw error;
        }
      }
    }
    throw lastError;
  };

  // Razorpay Payment Handler
  const startRazorpayPayment = async (orderData) => {
    setSubmitState({ 
      busy: true, 
      message: "Loading payment gateway...", 
      type: "info" 
    });

    const scriptLoaded = await loadRazorpayScript();
    
    if (!scriptLoaded) {
      throw new Error('Failed to load payment gateway. Please check your internet connection.');
    }

    return new Promise((resolve, reject) => {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.order_id,
        name: "Aim Tutor",
        description: `Enrollment for ${courseName}`,
        image: "/logo.png",
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { 
          color: "#7C3AED",
          backdrop_color: "rgba(0,0,0,0.5)"
        },
        notes: {
          course_id: String(courseId),
          course_name: courseName
        },
        modal: {
          ondismiss: function() {
            isSubmitting.current = false;
            reject(new Error("PAYMENT_CANCELLED"));
          },
          escape: true,
          animation: true
        },
        handler: async function (response) {
          try {
            setSubmitState({ 
              busy: true, 
              message: "Verifying payment...", 
              type: "info" 
            });

            const currentToken = getToken();
            
            const verifyRes = await makeAPICallWithRetry(async () => {
              return await api.post("/api/v1/payments/verify-payment", {
                payment_id: orderData.payment_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }, {
                headers: {
                  'Authorization': `Bearer ${currentToken}`
                }
              });
            });

            resolve(verifyRes.data);
          } catch (err) {
            reject(err);
          }
        },
        retry: {
          enabled: true,
          max_count: 3
        }
      };

      try {
        const rzp = new window.Razorpay(options);
        
        rzp.on('payment.failed', function (response) {
          isSubmitting.current = false;
          reject(new Error(response.error?.description || "Payment failed"));
        });
        
        rzp.open();
      } catch (error) {
        isSubmitting.current = false;
        reject(new Error("Failed to initialize payment gateway"));
      }
    });
  };

  // Free course enrollment
  const enrollFreeCourse = async (authToken) => {
    // TODO: Update this endpoint based on your backend API
    const response = await makeAPICallWithRetry(async () => {
      return await api.post("/api/v1/enrollments/enroll-free", {
        course_id: Number(courseId)
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
    });
    return response.data;
  };

  // Main enrollment handler
  const handleEnroll = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting.current || submitState.busy) {
      return;
    }
    
    // Validate all fields
    const errors = {
      name: validateField("name", form.name),
      email: validateField("email", form.email),
      phone: validateField("phone", form.phone)
    };
    
    setFieldErrors(errors);
    setTouchedFields({ name: true, email: true, phone: true });
    
    if (Object.values(errors).some(error => error)) {
      setErrorMessage("Please fix the errors in the form before proceeding.");
      setShowErrorModal(true);
      return;
    }

    // Check authentication
    if (!isAuthenticated || !token) {
      localStorage.setItem('enrollment_form_data', JSON.stringify({
        ...form,
        courseId,
        timestamp: Date.now()
      }));
      setShowAuthModal(true);
      return;
    }

    isSubmitting.current = true;

    try {
      const currentToken = getToken();
      
      if (!currentToken) {
        throw new Error("Authentication expired. Please sign in again.");
      }

      // Step 1: Submit contact form FIRST
      setSubmitState({ busy: true, message: "Saving your details...", type: "info" });
      await submitContactForm(currentToken);

      // Step 2: Check if free or paid course
      const isFree = !price || price <= 0;

      if (isFree) {
        // Free course - directly enroll
        setSubmitState({ busy: true, message: "Enrolling you in the course...", type: "info" });
        
        await enrollFreeCourse(currentToken);

        setSubmitState({
          busy: false,
          message: "Enrollment successful! Redirecting...",
          type: "success"
        });

        localStorage.removeItem('enrollment_form_data');
        setForm({ name: "", email: "", phone: "" });

        setTimeout(() => {
          navigate("/student");
        }, 2000);

      } else {
        // Paid course - Create order AFTER contact form
        setSubmitState({ busy: true, message: "Creating order...", type: "info" });

        const orderRes = await makeAPICallWithRetry(async () => {
          return await api.post("/api/v1/payments/create-order", {
            course_id: Number(courseId)
          }, {
            headers: {
              'Authorization': `Bearer ${currentToken}`,
              'Content-Type': 'application/json'
            }
          });
        });

        if (!orderRes.data || !orderRes.data.order_id) {
          throw new Error("Invalid order response from server");
        }

        // Step 3: Start Razorpay Payment
        setSubmitState({ busy: true, message: "Redirecting to payment...", type: "info" });

        await startRazorpayPayment(orderRes.data);

        // Payment successful
        setSubmitState({
          busy: false,
          message: "Payment successful! Redirecting...",
          type: "success"
        });

        localStorage.removeItem('enrollment_form_data');
        setForm({ name: "", email: "", phone: "" });

        setTimeout(() => {
          navigate("/student");
        }, 2500);
      }

    } catch (err) {
      console.error("Enrollment error:", err);
      isSubmitting.current = false;
      
      // Handle payment cancelled - show special modal
      if (err.message === "PAYMENT_CANCELLED") {
        setShowCancelledModal(true);
        setSubmitState({ busy: false, message: "", type: "" });
        return;
      }

      // Handle other errors
      let userMessage = "Something went wrong. Please try again.";
      
      if (err.message?.includes('Network') || err.code === 'ERR_NETWORK') {
        userMessage = "Connection error. Please check your internet and try again.";
      } else if (err.response?.status === 401) {
        userMessage = "Your session has expired. Please sign in again.";
        setTimeout(() => {
          const current = encodeURIComponent(location.pathname);
          navigate(`${locPrefix}/login?redirect=${current}`);
        }, 2000);
      } else if (err.response?.status === 400) {
        userMessage = err.response?.data?.message || "Invalid request. Please check your details.";
      } else if (err.response?.status >= 500) {
        userMessage = "Server error. Please try again in a few moments.";
      } else if (err.message && err.message !== "PAYMENT_CANCELLED") {
        userMessage = err.message;
      }
      
      setErrorMessage(userMessage);
      setShowErrorModal(true);
      setSubmitState({ busy: false, message: "", type: "" });
    }
  };

  // Handle auth redirect
  const handleAuthRedirect = () => {
    const current = encodeURIComponent(location.pathname + "?from=signup");
    navigate(`${locPrefix}/signup?redirect=${current}&from=enrollment`);
  };

  return (
    <>
      {/* Auth Required Modal */}
      <Modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)}>
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h3>
          <p className="text-gray-600 mb-6">
            You need to sign in or create an account to enroll in this course.
            Don't worry, we'll save your information!
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowAuthModal(false)}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAuthRedirect}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              Sign In / Sign Up
            </button>
          </div>
        </div>
      </Modal>

      {/* Welcome Back Modal */}
      <Modal isOpen={showWelcomeModal} onClose={() => setShowWelcomeModal(false)}>
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome! You're All Set!</h3>
          <p className="text-gray-600 mb-6">
            Great! You're now signed in. Let's complete your enrollment for <strong>{courseName}</strong>.
          </p>
          <button
            onClick={() => setShowWelcomeModal(false)}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            Continue to Enrollment
          </button>
        </div>
      </Modal>

      {/* Payment Cancelled Modal */}
      <Modal isOpen={showCancelledModal} onClose={() => setShowCancelledModal(false)}>
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h3>
          <p className="text-gray-600 mb-6">
            No worries! Your details have been saved.<br />
            <strong className="text-amber-600">Our team will contact you within 1 hour.</strong>
          </p>
          <button
            onClick={() => setShowCancelledModal(false)}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-medium hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            Okay, Got It
          </button>
        </div>
      </Modal>

      {/* Error Modal */}
      <Modal isOpen={showErrorModal} onClose={() => setShowErrorModal(false)}>
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <button
            onClick={() => setShowErrorModal(false)}
            className="px-8 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </Modal>

      {/* Main Form */}
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="rounded-xl border shadow-lg overflow-hidden bg-white">

          {/* Price Section */}
          <div className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 border-b">
            <div className="mb-2">
              {price && price > 0 ? (
                <>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900">
                    {currency(price, courseCurrency)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">One-time payment</div>
                </>
              ) : (
                <>
                  <div className="text-3xl md:text-4xl font-bold text-green-600">FREE</div>
                  <div className="text-sm text-gray-600 mt-1">No payment required</div>
                </>
              )}
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleEnroll} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  onBlur={() => handleFieldBlur("name")}
                  disabled={submitState.busy}
                  className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    fieldErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                />
                {fieldErrors.name && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  onBlur={() => handleFieldBlur("email")}
                  disabled={submitState.busy}
                  className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    fieldErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="you@example.com"
                />
                {fieldErrors.email && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                  onBlur={() => handleFieldBlur("phone")}
                  disabled={submitState.busy}
                  className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    fieldErrors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+91 98765 43210"
                />
                {fieldErrors.phone && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitState.busy || Object.values(fieldErrors).some(error => error)}
                className={`w-full py-3.5 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  submitState.busy || Object.values(fieldErrors).some(error => error)
                    ? 'bg-gray-400 cursor-not-allowed opacity-60'
                    : 'bg-violet-600 text-white hover:bg-violet-700 hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
              >
                {submitState.busy ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{submitState.message || "Processing..."}</span>
                  </>
                ) : isAuthenticated ? (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>{price > 0 ? "Proceed to Payment" : "Enroll Now"}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Sign In to Enroll</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Trust Badge */}
          <div className="bg-gray-50 p-4 border-t">
            <div className="flex items-center gap-3 text-sm">
              <Lock className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-semibold">Secure Payment</div>
                <div className="text-gray-600 text-xs">Powered by Razorpay • 100% Secure</div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </>
  );
}