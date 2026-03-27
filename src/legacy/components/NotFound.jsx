// components/NotFound.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// SVG Icons
const Home = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ArrowLeft = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const Search = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const BookOpen = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const Users = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const Mail = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const TrendingUp = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine context (admin, student, or website)
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isStudentRoute = location.pathname.startsWith('/student');
  const isWebsite = !isAdminRoute && !isStudentRoute;

  // Suggested links based on context
  const getSuggestedLinks = () => {
    if (isAdminRoute) {
      return [
        { label: 'Admin Dashboard', path: '/admin/dashboard', icon: TrendingUp },
        { label: 'Manage Courses', path: '/admin/courses', icon: BookOpen },
        { label: 'Manage Students', path: '/admin/students', icon: Users },
      ];
    } else if (isStudentRoute) {
      return [
        { label: 'My Profile', path: '/student/profile', icon: Users },
        { label: 'My Courses', path: '/student/courses', icon: BookOpen },
        { label: 'Certificates', path: '/student/certificates', icon: TrendingUp },
      ];
    } else {
      return [
        { label: 'Home', path: '/', icon: Home },
        { label: 'Training', path: '/training', icon: BookOpen },
        { label: 'Contact Us', path: '/contact', icon: Mail },
      ];
    }
  };

  const suggestedLinks = getSuggestedLinks();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (isAdminRoute) {
        navigate(`/admin/dashboard?search=${searchQuery}`);
      } else if (isStudentRoute) {
        navigate(`/student/courses?search=${searchQuery}`);
      } else {
        navigate(`/search?q=${searchQuery}`);
      }
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(isAdminRoute ? '/admin/dashboard' : isStudentRoute ? '/student/profile' : '/');
    }
  };

  const handleGoHome = () => {
    navigate(isAdminRoute ? '/admin/dashboard' : isStudentRoute ? '/student/profile' : '/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        {/* Animated Container */}
        <div
          className={`text-center transition-all duration-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* 404 Illustration */}
          <div className="relative mb-8">
            {/* Floating Background Elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
            </div>

            {/* 404 Number */}
            <div className="relative">
              <h1 className="text-[120px] sm:text-[180px] lg:text-[240px] font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none animate-bounce-slow">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 sm:w-48 sm:h-48 border-4 border-dashed border-blue-300 rounded-full animate-spin-slow"></div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-2">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                {location.pathname}
              </span>
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8 max-w-md mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for what you need..."
                className="w-full px-5 py-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300 text-gray-700 placeholder-gray-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={handleGoBack}
              className="group flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Go Back</span>
            </button>

            <button
              onClick={handleGoHome}
              className="group flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-medium">
                {isAdminRoute ? 'Admin Dashboard' : isStudentRoute ? 'Student Dashboard' : 'Go Home'}
              </span>
            </button>
          </div>

          {/* Suggested Links */}
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Maybe you were looking for:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {suggestedLinks.map((link, index) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="group flex items-center gap-3 px-4 py-3 bg-white rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border border-gray-100 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: mounted ? 'slideUp 0.6s ease-out forwards' : 'none',
                  }}
                >
                  <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <link.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-300 text-left">
                    {link.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Help Text */}
          <p className="mt-8 text-sm text-gray-500">
            Need help?{' '}
            <button
              onClick={() => navigate(isWebsite ? '/contact' : isAdminRoute ? '/admin/dashboard' : '/student/profile')}
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              Contact Support
            </button>
          </p>
        </div>
      </div>

      {/* Inline Animations */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}