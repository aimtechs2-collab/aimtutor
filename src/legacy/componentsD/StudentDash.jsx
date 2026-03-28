import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import Logout from './Logout';
import {
  User,
  BookOpen,
  TrendingUp,
  Award,
  Video,
  DollarSign,
  Bell,
  Search,
  Settings,
  GraduationCap,
  Menu,
  X,
  Book,
  BookOpenText
} from "lucide-react";
import AimTutorLogo from "../../components/brand/AimTutorLogo";


// ✅ UPDATED: Add paths to menu items
const menuItems = [
  { id: 'profile', label: 'Personal Details', icon: User, path: '/student/profile' },
  { id: 'courses', label: 'Enrolled Courses', icon: Book, path: '/student/courses' },
  { id: 'resources', label: 'Resources', icon: BookOpenText, path: '/student/resources' },
  // { id: 'certificates', label: 'Certificates', icon: Award, path: '/student/certificates' },
  { id: 'payments', label: 'Payments History', icon: DollarSign, path: '/student/payments' },
  { id: 'sessions', label: 'Live Sessions', icon: Video, path: '/student/live-sessions' },
];

export default function StudentDash() {
  const location = useLocation();
  const navigate = useNavigate();


  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


  // Mobile resizing (keep as is)
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);

      if (width < 768) {
        setSidebarExpanded(false);
        setMobileMenuOpen(false);
      } else if (width >= 1024) {
        setSidebarExpanded(true);
        setMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when clicking outside (keep as is)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && isMobile) {
        const sidebar = document.querySelector('[data-sidebar]');
        if (sidebar && !sidebar.contains(event.target)) {
          setMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen, isMobile]);

  // ❌ REMOVE: handleSectionChange (no longer needed)
  // const handleSectionChange = (section) => { ... }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleDesktopSidebar = () => {
    if (!isMobile) {
      setSidebarExpanded(!sidebarExpanded);
    }
  };


  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes slideLeft {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes bounce {
        0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
        40%, 43% { transform: translate3d(0, -8px, 0); }
        70% { transform: translate3d(0, -4px, 0); }
        90% { transform: translate3d(0, -2px, 0); }
      }
      
      .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
      .animate-slideUp { animation: slideUp 0.6s ease-out forwards; opacity: 0; }
      .animate-slideLeft { animation: slideLeft 0.5s ease-out forwards; opacity: 0; }
      .animate-bounce { animation: bounce 2s infinite; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        data-sidebar
        className={`
          ${isMobile ? 'fixed' : 'fixed'} 
          ${isMobile ? (mobileMenuOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
          ${sidebarExpanded && !isMobile ? 'w-64 sm:w-72' : 'w-16 sm:w-20'}
          ${isMobile ? 'w-64' : ''}
          top-0 left-0 h-screen transition-all duration-300 ease-in-out
          bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-xl 
          ${isMobile ? 'z-50' : 'z-40'}
          overflow-y-auto
        `}
      >
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3">
            {/* <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"> */}
            {/* <GraduationCap className="w-4 h-4 sm:w-6 sm:h-6 text-white" /> */}
            <AimTutorLogo variant="default" size="sm" className="max-w-[180px]" />
            {/* </div>/ */}
            {(sidebarExpanded || (isMobile && mobileMenuOpen)) && (
              <div className="font-bold text-lg sm:text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                Student Portal
              </div>
            )}
          </div>
        </div>

        {/* ✅ UPDATED: Navigation with Links instead of buttons */}
        <nav className="flex flex-col space-y-1 sm:space-y-2 px-3 sm:px-6 pb-6">
          {menuItems.map(({ id, label, icon: Icon, path }, index) => {
            // ✅ Detect active route
            const isActive = location.pathname === path;
            const isCollapsed = !sidebarExpanded && !isMobile;

            return (
              <Link
                key={id}
                to={path}
                onClick={() => isMobile && setMobileMenuOpen(false)} // ✅ Close mobile menu
                className={`relative flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 group animate-slideLeft ${isActive && !isCollapsed
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-700 hover:bg-white/60 hover:scale-105'
                  }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg transition-all duration-300 flex-shrink-0 ${isActive && !isCollapsed
                    ? 'bg-white/20'
                    : 'bg-gray-100 group-hover:bg-white group-hover:scale-110'
                    }`}
                >
                  <Icon
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300 ${isActive && !isCollapsed
                      ? 'text-white'
                      : 'text-gray-600 group-hover:text-blue-600'
                      }`}
                  />
                </div>
                {(sidebarExpanded || (isMobile && mobileMenuOpen)) && (
                  <span className="font-medium text-sm sm:text-base truncate">{label}</span>
                )}
                {isActive && !isCollapsed && (
                  <div className="absolute right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse flex-shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div
        className={`
          flex-1 flex flex-col min-w-0 transition-all duration-300
          ${!isMobile ? (sidebarExpanded ? 'ml-64 sm:ml-72' : 'ml-16 sm:ml-20') : 'ml-0'}
        `}
      >
        {/* Header */}
        <header className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-6 min-w-0 flex-1">
              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110 md:hidden flex-shrink-0"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {/* Desktop sidebar toggle */}
              <button
                onClick={toggleDesktopSidebar}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110 hidden md:block flex-shrink-0"
              >
                <div className="w-5 h-5 flex flex-col justify-center gap-1">
                  <div
                    className={`h-0.5 bg-gray-600 rounded transition-all duration-300 ${!sidebarExpanded ? 'rotate-45 translate-y-1' : ''
                      }`}
                  ></div>
                  <div
                    className={`h-0.5 bg-gray-600 rounded transition-all duration-300 ${!sidebarExpanded ? 'opacity-0' : ''
                      }`}
                  ></div>
                  <div
                    className={`h-0.5 bg-gray-600 rounded transition-all duration-300 ${!sidebarExpanded ? '-rotate-45 -translate-y-1' : ''
                      }`}
                  ></div>
                </div>
              </button>

              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
                  Welcome back, Student
                </h1>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1 hidden sm:block">
                  Ready to continue your learning journey?
                </p>
              </div>
            </div>

            {/* Search and Notifications */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <button
                className="cursor-pointer border-blue-200 bg-blue-400 px-4 py-2 rounded-full text-white hover:bg-blue-500 transition-colors"
                onClick={() => navigate('/')}
              >
                Go to website
              </button>

              <button
                onClick={() => navigate(`/student/notifications`)}
                className="relative p-2 sm:p-3 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors duration-200 group flex-shrink-0">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
                <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></div>
              </button>

              <Logout />
            </div>
          </div>
        </header>

        {/* ✅ MAIN CHANGE: Replace renderContent() with <Outlet /> */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-visible">
          <Outlet />
        </main>
      </div>
    </div>
  );
}