// components/Footer.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { buildCategoryCitySeo, slugify } from '../utils/seoSlug';
import api from '../utils/api';
import {
  GraduationCap,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Loader2,
  Clock,
  Brain,
  Sparkles,
  ArrowRight,
  Globe,
} from 'lucide-react';

const Footer = () => {
  // ✅ Get Location Context
  const { country, region, city } = useParams();
  const locCountry = country || localStorage.getItem("user_country") || "in";
  const locRegion = region || localStorage.getItem("user_region") || "ts";
  const locCity = city || localStorage.getItem("user_city") || "Hyderabad";
  const locPrefix = `/${locCountry}/${locRegion}/${slugify(locCity)}`;
  const cityForHeading = slugify(locCity);

  // ✅ State for Popular Courses
  const [popularCourses, setPopularCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // ✅ Fetch Popular Courses from API
  useEffect(() => {
    fetchPopularCourses();
  }, []);

  const fetchPopularCourses = async () => {
    try {
      setLoadingCourses(true);

      // Fetch master categories
      const response = await api.post('/api/v1/public/get-mastercategories');
      
      const categories = response.data.categories || [];
      
      // Take first 8 categories as "popular"
      const popularCoursesData = categories.slice(0, 8).map(category => ({
        id: category.id,
        title: category.name,
        name: category.name
      }));
      
      setPopularCourses(popularCoursesData);
      
    } catch (err) {
      console.error('❌ Error fetching popular courses:', err);
      // Fallback to empty array on error
      setPopularCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  // ✅ Quick Links
  const quickLinks = [
    { title: "About Us", href: `${locPrefix}/about`, icon: Sparkles },
    { title: "Contact", href: `${locPrefix}/contact`, icon: Mail },
    { title: "All Courses", href: `${locPrefix}/training`, icon: GraduationCap },
  ];

  // ✅ Office Hours
  const officeHours = [
    { day: "Mon - Fri", time: "9:00 AM - 7:00 PM" },
    { day: "Saturday", time: "9:00 AM - 5:00 PM" },
    { day: "Sunday", time: "Online Support Only" },
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-gray-300 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
        <div className="absolute top-40 left-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-72 h-72 bg-cyan-600 rounded-full blur-3xl opacity-10 animate-pulse delay-700"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Company Info & Contact */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <Link to={locPrefix} className="flex items-center gap-3 mb-8 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              </div>
              <div>
                <h3 className="text-white text-2xl font-bold">Aim Tutor</h3>
                <p className="text-xs text-cyan-400 font-medium">The Academy  of AI</p>
              </div>
            </Link>

            <p className="mb-8 text-gray-400 leading-relaxed">
              20+ years of excellence in software training. Leading the AI education revolution from Hyderabad to the world.
            </p>

            {/* Contact Information */}
            <div className="space-y-5">
              {/* Phone Numbers */}
              <div>
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cyan-400" />
                  Call Us
                </h4>
                <div className="space-y-2 pl-6">
                  <a href="tel:+919700187077" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-2">
                    <span className="text-sm">+91 97001 87077</span>
                  </a>
                  <a href="tel:+916300232040" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-2">
                    <span className="text-sm">+91 63002 32040</span>
                  </a>
                </div>
              </div>

              {/* Email Addresses */}
              <div>
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  Email Us
                </h4>
                <div className="space-y-2 pl-6">
                  <a href="mailto:admin@aimtutor.in" className="text-gray-300 hover:text-cyan-400 transition-colors block text-sm">
                    admin@aimtutor.in
                  </a>
                  <a href="mailto:aimtutor@gmail.com" className="text-gray-300 hover:text-cyan-400 transition-colors block text-sm">
                    aimtutor@gmail.com
                  </a>
                </div>
              </div>

              {/* Address */}
              <div>
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  Visit Us
                </h4>
                <p className="text-gray-400 text-sm pl-6 leading-relaxed">
                  #50, Kamala Nivas, Sap Street,<br />
                  Gayatri Nagar, Behind Mytrivanam,<br />
                  Ameerpet, Hyderabad - 500038
                </p>
              </div>
            </div>
          </div>

          {/* Popular Courses */}
          <div className="lg:col-span-1">
            <h3 className="text-white mb-8 text-lg font-bold relative">
              <span className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-cyan-400" />
                Popular Courses
              </span>
              <span className="absolute -bottom-2 left-0 w-20 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></span>
            </h3>
            
            {loadingCourses ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading courses...</span>
              </div>
            ) : popularCourses.length === 0 ? (
              <p className="text-gray-500 text-sm">No courses available</p>
            ) : (
              <ul className="space-y-3">
                {popularCourses.map((course) => (
                  <li key={course.id}>
                    <a 
                      href={`${locPrefix}/training/${course.id}/${buildCategoryCitySeo(course.name, cityForHeading)}`}
                      className="text-gray-400 hover:text-cyan-400 transition-all duration-300 flex items-center gap-2 group text-sm cursor-pointer"
                    >
                      <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                      <span>{course.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {/* View All Courses Button */}
            {!loadingCourses && popularCourses.length > 0 && (
              <Link
                to={`${locPrefix}/training`}
                className="inline-flex items-center gap-2 mt-6 text-cyan-400 hover:text-cyan-300 font-medium text-sm group"
              >
                <span>View All Courses</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-white mb-8 text-lg font-bold relative">
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                Quick Links
              </span>
              <span className="absolute -bottom-2 left-0 w-20 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-cyan-400 transition-all duration-300 flex items-center gap-3 group"
                  >
                    <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-cyan-500 transition-all">
                      <link.icon className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-sm font-medium">{link.title}</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Office Hours */}
            <div className="mt-10">
              <h3 className="text-white mb-6 text-lg font-bold relative">
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  Office Hours
                </span>
                <span className="absolute -bottom-2 left-0 w-20 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></span>
              </h3>
              <div className="space-y-3 pl-1">
                {officeHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">{schedule.day}</span>
                    <span className="text-gray-300 font-medium">{schedule.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Connect with Us */}
          <div className="lg:col-span-1">
            <h3 className="text-white mb-8 text-lg font-bold relative">
              <span className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                Connect With Us
              </span>
              <span className="absolute -bottom-2 left-0 w-20 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></span>
            </h3>

            {/* Social Links */}
            <div className="mb-8">
              <p className="text-gray-400 mb-6 text-sm">Follow us for updates, tips, and industry insights</p>
              <div className="grid grid-cols-3 gap-3">
                <a 
                  href="https://www.linkedin.com/in/aimtutor/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full h-12 bg-slate-800 text-gray-400 flex items-center justify-center rounded-xl transition-all hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white hover:-translate-y-1 border border-slate-700 group duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
                <a 
                  href="https://x.com/aimtechhyd" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full h-12 bg-slate-800 text-gray-400 flex items-center justify-center rounded-xl transition-all hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white hover:-translate-y-1 border border-slate-700 group duration-300"
                  aria-label="Twitter"
                >
                  <Twitter  className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
                
                <a 
                  href="https://www.instagram.com/aimtutorameerpet" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full h-12 bg-slate-800 text-gray-400 flex items-center justify-center rounded-xl transition-all hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white hover:-translate-y-1 border border-slate-700 group duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">20+</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Years of Excellence</p>
                  <p className="text-gray-400 text-xs">100K+ Students Trained</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm mb-2">
                &copy; {new Date().getFullYear()} <span className="text-white font-semibold">Aim Tutor</span> - All rights reserved.
              </p>
              <p className="text-gray-500 text-xs">
                Empowering careers since 2004
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap gap-6 text-sm">
              <Link to={`${locPrefix}/privacy-policy`} className="text-gray-500 hover:text-cyan-400 transition-colors">
                Privacy Policy
              </Link>
              
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;