// components/pages/AboutPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  BookOpen,
  Globe,
  Award,
  Target,
  Zap,
  TrendingUp,
  Heart,
  Shield,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Building2,
  GraduationCap,
  Lightbulb,
  PlayCircle,
  Phone,
} from 'lucide-react';
import {
  slugify
} from '../utils/seoSlug';
import { Link, useParams } from 'react-router-dom';

// Custom hook for counting animation
const useCountAnimation = (end, duration = 2000, isInView = false) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!isInView) return;

    const startTime = Date.now();
    const endValue = parseInt(end.replace(/[^0-9]/g, ''));

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * endValue);

      setCount(currentCount);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(updateCount);
      } else {
        setCount(endValue);
      }
    };

    rafRef.current = requestAnimationFrame(updateCount);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [end, duration, isInView]);

  return count;
};

// Custom hook for intersection observer
const useInView = (threshold = 0.3) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, isInView]);

  return [ref, isInView];
};

function AboutPage() {
  const [statsRef, statsInView] = useInView(0.3);

  const { country, region, city: cityParam } = useParams();
  const locCountry = country || localStorage.getItem("user_country") || "in";
  const locRegion = region || localStorage.getItem("user_region") || "ts";
  const locCity = cityParam || localStorage.getItem("user_city") || "Hyderabad";
  const locPrefix = `/${locCountry}/${locRegion}/${slugify(locCity)}`;

  const stats = [
    {
      number: "10000",
      suffix: "+",
      label: "Students Trained",
      icon: GraduationCap,
      duration: 2500,
      color: "from-blue-500 to-cyan-500"
    },
    {
      number: "5000",
      suffix: "+",
      label: "Students Placed",
      icon: Building2,
      duration: 2000,
      color: "from-purple-500 to-pink-500"
    },
    {
      number: "95",
      suffix: "%",
      label: "Success Rate",
      icon: TrendingUp,
      duration: 2200,
      color: "from-emerald-500 to-green-500"
    },
    {
      number: "50",
      suffix: "+",
      label: "Expert Trainers",
      icon: Users,
      duration: 1800,
      color: "from-orange-500 to-red-500"
    }
  ];

  const services = [
    {
      title: "Corporate Training",
      description: "Tailored programs designed to upskill your workforce with the latest technologies and methodologies.",
      features: ["Custom Curriculum", "On-site Training", "Performance Tracking"],
      icon: Building2
    },
    {
      title: "Professional Courses",
      description: "Industry-aligned courses that prepare you for real-world challenges and career advancement.",
      features: ["Hands-on Projects", "Industry Certification", "Career Support"],
      icon: GraduationCap
    },
    {
      title: "Consultancy Services",
      description: "Strategic guidance for digital transformation and technology adoption to drive business growth.",
      features: ["Tech Assessment", "Solution Architecture", "Implementation Support"],
      icon: Lightbulb
    }
  ];

  // Animated Stat Component - RESPONSIVE
  const AnimatedStat = ({ stat, index }) => {
    const count = useCountAnimation(stat.number, stat.duration, statsInView);
    const Icon = stat.icon;

    // Format number with commas
    const formatNumber = (num) => {
      if (stat.number === "10000") {
        return num >= 10000 ? "10K" : num.toLocaleString();
      }
      return num.toLocaleString();
    };

    return (
      <div
        className="text-center group"
        style={{
          animation: statsInView ? `slideInUp 0.6s ease-out ${index * 0.1}s both` : 'none'
        }}
      >
        {/* Icon Container - Responsive */}
        <div className={`inline-flex items-center justify-center 
                         w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 
                         bg-gradient-to-br ${stat.color} 
                         rounded-xl sm:rounded-2xl 
                         mb-3 sm:mb-4 
                         group-hover:scale-110 transition-transform duration-300 
                         shadow-lg relative overflow-hidden`}>
          {/* Pulse animation */}
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white relative z-10" />
        </div>

        {/* Number - Responsive */}
        <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2 tabular-nums">
          <span className={`inline-block ${statsInView ? 'animate-pulse-once' : ''}`}>
            {formatNumber(count)}
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
            {stat.suffix}
          </span>
        </div>

        {/* Label - Responsive */}
        <div className="text-xs sm:text-sm text-gray-600 font-medium">{stat.label}</div>

        {/* Progress bar - Responsive */}
        <div className="mt-2 sm:mt-3 h-0.5 sm:h-1 bg-gray-200 rounded-full overflow-hidden max-w-[60px] sm:max-w-[80px] mx-auto">
          <div
            className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-[2000ms] ease-out`}
            style={{
              width: statsInView ? '100%' : '0%',
              transitionDelay: `${index * 100}ms`
            }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="font-sans text-gray-900 bg-white">

      {/* Stats Section with Running Numbers - RESPONSIVE */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background decoration - Responsive */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-cyan-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={statsRef}>
          {/* Section Header - RESPONSIVE */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              <Award className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Our Achievements</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Numbers That
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600"> Speak</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
              Our impact in numbers - a testament to our commitment to excellence
            </p>
          </div>

          {/* Animated Stats Grid - RESPONSIVE */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <AnimatedStat key={index} stat={stat} index={index} />
            ))}
          </div>

          {/* Additional Info - RESPONSIVE */}
          {statsInView && (
            <div className="mt-8 sm:mt-10 md:mt-12 text-center">
              <p className="text-xs sm:text-sm text-gray-500 animate-fade-in px-4 sm:px-0">
                * Statistics updated in real-time • Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Pre-Footer CTA Section - RESPONSIVE */}
      <div className="bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 text-gray-300 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}></div>
          <div className="absolute top-20 sm:top-40 left-10 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-blue-600 rounded-full blur-3xl opacity-10"></div>
          <div className="absolute bottom-20 sm:bottom-40 right-10 sm:right-20 w-36 h-36 sm:w-54 sm:h-54 md:w-72 md:h-72 bg-cyan-600 rounded-full blur-3xl opacity-10"></div>
        </div>
        {/* Pre-Footer CTA */}
        <div className="relative border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-800/30 backdrop-blur-sm 
                    rounded-2xl sm:rounded-3xl 
                    p-6 sm:p-8 md:p-12 
                    border border-slate-700/50 relative overflow-hidden">
              {/* Accent Elements */}
              <div className="absolute top-0 right-0 w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

              <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
                {/* Text Content */}
                <div className="max-w-2xl text-center lg:text-left">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                    Ready to accelerate your career?
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-gray-300">
                    Join thousands of professionals who have transformed their careers with AIM's expert-led courses.
                  </p>
                </div>

                {/* Buttons - IMPROVED RESPONSIVE */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 
                        w-full sm:w-auto lg:w-auto
                        max-w-md sm:max-w-none">
                  <Link
                    to={`${locPrefix}/training`}
                    className="group 
                       px-6 py-3 sm:px-7 sm:py-3.5 lg:px-8 lg:py-4
                       bg-gradient-to-r from-blue-500 to-cyan-500 
                       text-white rounded-xl font-semibold 
                       shadow-xl hover:shadow-2xl 
                       transform hover:-translate-y-1 
                       transition-all duration-300 
                       inline-flex items-center justify-center gap-2
                       text-sm sm:text-base
                       w-full sm:w-auto sm:min-w-[180px] lg:min-w-[200px]
                       whitespace-nowrap"
                  >
                    <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span>Explore Courses</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to={`${locPrefix}/contact`}
                    className="px-6 py-3 sm:px-7 sm:py-3.5 lg:px-8 lg:py-4
                       bg-white/10 backdrop-blur-sm 
                       text-white border border-white/20 
                       rounded-xl font-semibold 
                       hover:bg-white/20 
                       transition-all duration-300 
                       inline-flex items-center justify-center gap-2
                       text-sm sm:text-base
                       w-full sm:w-auto sm:min-w-[160px] lg:min-w-[180px]
                       whitespace-nowrap"
                  >
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span>Contact Us</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* What We Offer Section - RESPONSIVE */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header - RESPONSIVE */}
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              What We Offer
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
              Comprehensive solutions tailored to your learning journey
            </p>
          </div>

          {/* Services Grid - RESPONSIVE */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="group relative">
                  {/* Hover Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

                  {/* Card Content */}
                  <div className="relative bg-white border-2 border-gray-100 
                                  rounded-2xl sm:rounded-3xl 
                                  p-6 sm:p-8 
                                  hover:border-blue-200 transition-colors duration-300">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center 
                                    w-12 h-12 sm:w-14 sm:h-14 
                                    bg-gradient-to-br from-blue-500 to-cyan-500 
                                    rounded-xl sm:rounded-2xl 
                                    mb-4 sm:mb-6 
                                    group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features List */}
                    <ul className="space-y-2 sm:space-y-3">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700">
                          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Animation Styles */}
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-pulse-once {
          animation: pulse 0.5s ease-in-out;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}

export default AboutPage;