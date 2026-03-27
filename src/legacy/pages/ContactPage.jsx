import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Title, Meta, Link as HeadLink } from "react-head";
import { useParams } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Building2,
  Globe,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Users,
  Calendar,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Briefcase,
  GraduationCap,
  HeadphonesIcon,
  MapPinned,
  Zap,
  Award,
  Target,
  Star,
  Shield,
  AlertCircle,
  X,
  ChevronDown,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { slugify } from '../utils/seoSlug';
import api from '../utils/api';

/* ============================================
   CONSTANTS & CONFIGURATION
   Note: yearsInBusiness is calculated dynamically!
   This ensures the page always shows accurate years.
============================================ */

// Location Coordinates - Aim Tutor Ameerpet Campus
const LOCATION = {
  latitude: 17.438253044319286,
  longitude: 78.4452963483808,
  address: {
    street: "#50, Kamala Nivas, Sap Street, Gayatri Nagar, Behind Mytrivanam",
    locality: "Ameerpet",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500038",
    country: "India",
    countryCode: "IN"
  }
};

// Company Info - Dynamic Year Calculation Strategy
// 🎯 yearsInBusiness automatically updates every new year!
const COMPANY_INFO = {
  name: "Aim Tutor",
  alternateName: "The School of Artificial Intelligence",
  foundingYear: 2007,
  yearsInBusiness: new Date().getFullYear() - 2007, // Dynamic: Always current!
  studentsPlaced: "50,000+",
  corporateClients: "500+",
  coursesOffered: "25+",
  industryExperts: "100+",
  rating: "4.9",
  totalReviews: "5,847",
  website: "https://www.aimtutor.in"
};

// Social Media Links
const SOCIAL_MEDIA = [
  {
    icon: Linkedin,
    name: 'LinkedIn',
    link: 'https://www.linkedin.com/in/aimtutorameerpet/',
    color: 'hover:text-blue-600 hover:bg-blue-50',
    bgColor: 'bg-blue-600',
  },
  {
    icon: Facebook,
    name: 'Facebook',
    link: 'https://www.facebook.com/aimtutorameerpet',
    color: 'hover:text-blue-500 hover:bg-blue-50',
    bgColor: 'bg-blue-500',
  },
  {
    icon: Twitter,
    name: 'X (Twitter)',
    link: 'https://x.com/aimtechhyd',
    color: 'hover:text-gray-900 hover:bg-gray-100',
    bgColor: 'bg-gray-900',
  },
  {
    icon: Instagram,
    name: 'Instagram',
    link: 'https://www.instagram.com/aimtutorameerpet/',
    color: 'hover:text-pink-600 hover:bg-pink-50',
    bgColor: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500',
  },
  {
    icon: Youtube,
    name: 'YouTube',
    link: 'https://www.youtube.com/@aimtutor8983',
    color: 'hover:text-red-600 hover:bg-red-50',
    bgColor: 'bg-red-600',
  },
];

// Contact Methods - Uses dynamic yearsInBusiness
const CONTACT_METHODS = [
  {
    icon: Phone,
    title: 'Call Us',
    details: ['+91 97001 87077', '+91 63002 32040'],
    subtext: 'Mon-Sat, 9 AM - 7 PM IST',
    color: 'from-blue-500 to-cyan-500',
    action: 'tel:+919700187077',
    actionLabel: 'Call Now'
  },
  {
    icon: Mail,
    title: 'Email Us',
    details: ['admin@aimtutor.in', 'aimtutor@gmail.com'],
    subtext: 'We reply within 2 hours',
    color: 'from-purple-500 to-pink-500',
    action: 'mailto:admin@aimtutor.in',
    actionLabel: 'Send Email'
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    details: ['Aim Tutor Campus', 'Ameerpet, Hyderabad - 500038'],
    subtext: `${COMPANY_INFO.yearsInBusiness} Years at the Same Location`, // Dynamic!
    color: 'from-orange-500 to-red-500',
    action: `https://www.google.com/maps?q=${LOCATION.latitude},${LOCATION.longitude}`,
    actionLabel: 'Get Directions'
  },
];

// Office Hours
const OFFICE_HOURS = [
  { day: 'Monday - Friday', time: '9:00 AM - 7:00 PM', isOpen: true },
  { day: 'Saturday', time: '9:00 AM - 5:00 PM', isOpen: true },
  { day: 'Sunday', time: 'Closed (Online Support)', isOpen: false },
];

// Quick Links
const QUICK_LINKS = [
  { icon: GraduationCap, title: 'Course Enquiry', description: `Explore ${COMPANY_INFO.coursesOffered} AI programs` },
  { icon: Briefcase, title: 'Corporate Training', description: `${COMPANY_INFO.corporateClients} enterprise clients` },
  { icon: Calendar, title: 'Schedule Demo', description: 'Free trial class' },
  { icon: Users, title: 'Career Guidance', description: `${COMPANY_INFO.studentsPlaced} placed` },
];

// Course Options
const COURSE_OPTIONS = [
  { value: '', label: 'Select a course' },
  { value: 'ml-ai', label: 'Machine Learning & AI' },
  { value: 'deep-learning', label: 'Deep Learning' },
  { value: 'nlp', label: 'Natural Language Processing' },
  { value: 'computer-vision', label: 'Computer Vision' },
  { value: 'data-science', label: 'Data Science with AI' },
  { value: 'generative-ai', label: 'Generative AI & LLMs' },
  { value: 'python-ai', label: 'Python for AI' },
  { value: 'ai-business', label: 'AI for Business Leaders' },
  { value: 'mlops', label: 'MLOps & AI Engineering' },
  { value: 'corporate', label: 'Corporate Training' },
  { value: 'other', label: 'Other / Not Sure' },
];

// FAQs - Dynamic years throughout answers
const FAQS = [
  {
    question: 'How long has Aim Tutor been providing AI training?',
    answer: `Aim Tutor has been a pioneer in technology education for over ${COMPANY_INFO.yearsInBusiness} years since ${COMPANY_INFO.foundingYear}. We started with software training and evolved into a specialized AI and Machine Learning training institute, making us one of the most experienced training providers in Hyderabad.`,
  },
  {
    question: 'Do you offer online classes for AI training?',
    answer: 'Yes! Aim Tutor offers flexible learning modes including online live training, offline classroom training at our Ameerpet campus, and hybrid programs. Our online sessions feature interactive live instructors, hands-on labs, and recorded sessions for revision.',
  },
  {
    question: 'What is the batch size for AI training courses?',
    answer: `We maintain small batch sizes of 15-20 students for personalized attention. With ${COMPANY_INFO.yearsInBusiness} years of teaching experience, we understand that quality learning requires individual mentorship from our expert instructors.`,
  },
  {
    question: 'Do you provide placement assistance after course completion?',
    answer: `Absolutely! With ${COMPANY_INFO.studentsPlaced} students placed over ${COMPANY_INFO.yearsInBusiness} years, our dedicated placement cell has partnerships with ${COMPANY_INFO.corporateClients} companies including TCS, Infosys, Wipro, Amazon, Google, Microsoft, and leading startups.`,
  },
  {
    question: 'Can I visit the Aim Tutor campus in Ameerpet?',
    answer: `Yes, walk-ins are welcome at our Ameerpet campus which has been our home for ${COMPANY_INFO.yearsInBusiness} years! Visit us Monday-Saturday, 9 AM - 7 PM. We're located at ${LOCATION.address.street}, near Ameerpet Metro Station.`,
  },
  {
    question: 'What AI courses are available at Aim Tutor?',
    answer: `We offer ${COMPANY_INFO.coursesOffered} comprehensive AI training programs including Machine Learning & AI, Deep Learning, Generative AI & LLMs, Natural Language Processing, Computer Vision, Data Science, Python for AI, and customized corporate training.`,
  },
  {
    question: 'What makes Aim Tutor different from other training institutes?',
    answer: `With ${COMPANY_INFO.yearsInBusiness} years of excellence, ${COMPANY_INFO.studentsPlaced} successful alumni, ${COMPANY_INFO.corporateClients} corporate clients, and a ${COMPANY_INFO.rating}/5 rating from ${COMPANY_INFO.totalReviews} reviews, we offer unmatched experience, industry connections, and proven placement track record.`,
  },
  {
    question: 'Is there parking available at the Ameerpet campus?',
    answer: 'Yes, free parking is available for both two-wheelers and four-wheelers. Our campus is also well-connected by public transport - just a 5-minute walk from Ameerpet Metro Station with multiple bus routes available.',
  }
];

// Trust Badges - Dynamic years
const TRUST_BADGES = [
  { icon: Award, value: `${COMPANY_INFO.yearsInBusiness}+`, label: 'Years Excellence' },
  { icon: Users, value: COMPANY_INFO.studentsPlaced, label: 'Students Trained' },
  { icon: Building2, value: COMPANY_INFO.corporateClients, label: 'Corporate Clients' },
  { icon: Star, value: COMPANY_INFO.rating, label: `Rating (${COMPANY_INFO.totalReviews} Reviews)` },
];

/* ============================================
   MAIN COMPONENT
============================================ */
function ContactPage() {
  const { country, region, city: cityParam } = useParams();
  const successRef = useRef(null);
  const formRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    type: 'individual',
    message: '',
  });

  // Form UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // FAQ Accordion State (for accessibility)
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // ============================================
  // AUTO-HIDE SUCCESS MESSAGE (Fixed: moved to top level)
  // ============================================
  useEffect(() => {
    let timer;
    if (submitSuccess) {
      timer = setTimeout(() => setSubmitSuccess(false), 10000);
    }
    return () => clearTimeout(timer);
  }, [submitSuccess]);

  // ============================================
  // MEMOIZED LOCATION DATA
  // ============================================
  const getStoredValue = useCallback((key, fallback) => {
    if (typeof window === 'undefined') return fallback;
    try {
      return localStorage.getItem(key) || fallback;
    } catch {
      return fallback;
    }
  }, []);

  const locCountry = country || getStoredValue("user_country", "in");
  const locRegion = region || getStoredValue("user_region", "ts");
  const locCity = cityParam || getStoredValue("user_city", "Hyderabad");

  const locPrefix = useMemo(() => 
    `/${locCountry}/${locRegion}/${slugify(locCity)}`,
    [locCountry, locRegion, locCity]
  );

  const cityTitle = useMemo(() => 
    locCity.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    [locCity]
  );

  // ============================================
  // MEMOIZED SEO CONFIGURATION
  // ============================================
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://www.aimtutor.in';

  const seoConfig = useMemo(() => ({
    pageTitle: `Contact Aim Tutor | ${COMPANY_INFO.yearsInBusiness}+ Years of AI Training Excellence in ${cityTitle}`,
    pageDescription: `📞 Contact Aim Tutor - ${COMPANY_INFO.yearsInBusiness} years of excellence in AI training! 🏢 Visit our Ameerpet campus ✅ ${COMPANY_INFO.studentsPlaced} students placed ✅ ${COMPANY_INFO.corporateClients} corporate clients ✅ Expert counselors. Call +91-97001 87077!`,
    canonicalUrl: `${siteUrl}${locPrefix}/contact`,
    ogImageUrl: `${siteUrl}/images/og/aim-technologies-contact.jpg`,
    keywords: [
      `Aim Tutor contact ${cityTitle}`,
      `AI training institute Ameerpet ${COMPANY_INFO.yearsInBusiness} years`,
      `best machine learning courses Hyderabad`,
      `contact AI training center ${cityTitle}`,
      `technology training institute since ${COMPANY_INFO.foundingYear}`,
      `Aim Tutor Ameerpet campus`,
      `AI course enquiry Hyderabad`,
      `corporate AI training contact`,
      `data science training ${cityTitle}`,
      `best AI institute Hyderabad contact`,
      `${COMPANY_INFO.studentsPlaced} students placed`,
      `${COMPANY_INFO.corporateClients} corporate clients`,
      'artificial intelligence training near me',
      'ML training with placement',
      'deep learning course Hyderabad',
      'generative AI training',
      'ChatGPT training Hyderabad',
      'Python AI course Ameerpet'
    ].join(', ')
  }), [cityTitle, locPrefix, siteUrl]);

  // ============================================
  // MEMOIZED STRUCTURED DATA SCHEMAS
  // ============================================
  const organizationSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${siteUrl}/#organization`,
    "name": COMPANY_INFO.name,
    "alternateName": [COMPANY_INFO.alternateName, "AIM Tech", "Aim Tutor Training Institute"],
    "url": COMPANY_INFO.website,
    "logo": `${siteUrl}/images/logo.png`,
    "image": [
      `${siteUrl}/images/aim-technologies-campus.jpg`,
      `${siteUrl}/images/aim-tech-ameerpet.jpg`,
      `${siteUrl}/images/aim-training-classroom.jpg`
    ],
    "description": `${COMPANY_INFO.name} - ${COMPANY_INFO.yearsInBusiness} years of excellence in AI and technology training. ${COMPANY_INFO.studentsPlaced} students trained, ${COMPANY_INFO.corporateClients} corporate clients. Premier AI training institute in Ameerpet, Hyderabad.`,
    "foundingDate": COMPANY_INFO.foundingYear.toString(),
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "minValue": 50,
      "maxValue": 100
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": LOCATION.address.street,
      "addressLocality": LOCATION.address.locality,
      "addressRegion": LOCATION.address.state,
      "postalCode": LOCATION.address.pincode,
      "addressCountry": LOCATION.address.countryCode
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": LOCATION.latitude,
      "longitude": LOCATION.longitude
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+91-9700187077",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi", "Telugu"],
        "hoursAvailable": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "19:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Saturday",
            "opens": "09:00",
            "closes": "17:00"
          }
        ]
      },
      {
        "@type": "ContactPoint",
        "telephone": "+91-6300232040",
        "contactType": "sales"
      },
      {
        "@type": "ContactPoint",
        "email": "admin@aimtutor.in",
        "contactType": "customer service"
      }
    ],
    "sameAs": SOCIAL_MEDIA.map(s => s.link).concat([COMPANY_INFO.website]),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": COMPANY_INFO.rating,
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": COMPANY_INFO.totalReviews.replace(',', ''),
      "reviewCount": "4523"
    },
    "alumni": {
      "@type": "QuantitativeValue",
      "value": 50000,
      "unitText": "students"
    }
  }), [siteUrl]);

  const localBusinessSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "EducationalOrganization", "ProfessionalService"],
    "@id": `${siteUrl}/#localbusiness`,
    "name": COMPANY_INFO.name,
    "description": `Premier AI training institute with ${COMPANY_INFO.yearsInBusiness} years of excellence. Offering Machine Learning, Deep Learning, Data Science courses with 100% placement assistance.`,
    "url": COMPANY_INFO.website,
    "telephone": "+91-9700187077",
    "email": "admin@aimtutor.in",
    "foundingDate": COMPANY_INFO.foundingYear.toString(),
    "address": {
      "@type": "PostalAddress",
      "streetAddress": LOCATION.address.street,
      "addressLocality": LOCATION.address.locality,
      "addressRegion": LOCATION.address.state,
      "postalCode": LOCATION.address.pincode,
      "addressCountry": LOCATION.address.countryCode
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": LOCATION.latitude,
      "longitude": LOCATION.longitude
    },
    "hasMap": `https://www.google.com/maps?q=${LOCATION.latitude},${LOCATION.longitude}`,
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "19:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "17:00"
      }
    ],
    "priceRange": "₹₹",
    "currenciesAccepted": "INR",
    "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "UPI", "Bank Transfer", "EMI"],
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": LOCATION.latitude,
        "longitude": LOCATION.longitude
      },
      "geoRadius": "50000"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": COMPANY_INFO.rating,
      "reviewCount": COMPANY_INFO.totalReviews.replace(',', '')
    },
    "sameAs": SOCIAL_MEDIA.map(s => s.link)
  }), [siteUrl]);

  const contactPageSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": `Contact ${COMPANY_INFO.name}`,
    "description": seoConfig.pageDescription,
    "url": seoConfig.canonicalUrl,
    "mainEntity": {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": siteUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Contact Us",
          "item": seoConfig.canonicalUrl
        }
      ]
    }
  }), [siteUrl, seoConfig.pageDescription, seoConfig.canonicalUrl]);

  const faqSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }), []);

  // ============================================
  // INJECT JSON-LD INTO DOCUMENT HEAD
  // ============================================
  useEffect(() => {
    const schemas = [
      { id: 'organization-schema', data: organizationSchema },
      { id: 'local-business-schema', data: localBusinessSchema },
      { id: 'contact-page-schema', data: contactPageSchema },
      { id: 'faq-schema', data: faqSchema }
    ];

    const scriptElements = [];

    schemas.forEach(({ id, data }) => {
      // Remove existing script if present
      const existingScript = document.getElementById(id);
      if (existingScript) {
        existingScript.remove();
      }

      // Create and append new script
      const script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
      scriptElements.push(script);
    });

    // Cleanup on unmount
    return () => {
      scriptElements.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, [organizationSchema, localBusinessSchema, contactPageSchema, faqSchema]);

  // ============================================
  // MEMOIZED FORM VALIDATION
  // ============================================
  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return 'Name should only contain letters';
        return '';

      case 'email':
        if (!value.trim()) return 'Email address is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';

      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
        if (!/^(\+91)?[6-9]\d{9}$/.test(cleanPhone)) return 'Please enter a valid Indian phone number';
        return '';

      default:
        return '';
    }
  }, []);

  // ============================================
  // MEMOIZED FORM HANDLERS
  // ============================================
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    setErrors(prev => prev[name] ? { ...prev, [name]: '' } : prev);

    // Clear submit error
    setSubmitError(prev => prev ? null : prev);
  }, []);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    // Validate all required fields
    const newErrors = {};
    ['name', 'email', 'phone'].forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ name: true, email: true, phone: true });
      const firstErrorField = Object.keys(newErrors)[0];
      document.getElementById(firstErrorField)?.focus();
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone_number: formData.phone.replace(/[\s\-\(\)]/g, ''),
        course_intrest: formData.course || 'Not specified',
        message: `[${formData.type.toUpperCase()} ENQUIRY] ${formData.message || 'No additional message provided'}`.trim()
      };

      const response = await api.post('/api/v1/contact/contact-forms', payload);

      if (response.status === 200 || response.status === 201) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          course: '',
          type: 'individual',
          message: '',
        });
        setTouched({});
        setErrors({});

        // Focus success message for accessibility
        setTimeout(() => {
          successRef.current?.focus();
          successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    } catch (error) {
      console.error('Contact form submission error:', error);

      let errorMessage = 'Failed to send your message. Please try again or call us directly.';

      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Please check your information and try again.';
        } else if (error.response.status === 429) {
          errorMessage = 'Too many requests. Please wait a moment and try again.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Our server is temporarily unavailable. Please call us at +91-97001 87077.';
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      }

      setSubmitError(errorMessage);
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateField]);

  // ============================================
  // ACCESSIBLE FAQ TOGGLE
  // ============================================
  const toggleFaq = useCallback((index) => {
    setOpenFaqIndex(prev => prev === index ? null : index);
  }, []);

  const handleFaqKeyDown = useCallback((e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFaq(index);
    }
  }, [toggleFaq]);

  // ============================================
  // MEMOIZED MAP URL
  // ============================================
  const googleMapsDirectionsUrl = useMemo(() => 
    `https://www.google.com/maps/dir/?api=1&destination=${LOCATION.latitude},${LOCATION.longitude}&destination_place_id=AIM+Technologies+Ameerpet`,
    []
  );

  return (
    <div className="font-sans text-gray-900 leading-relaxed overflow-x-hidden bg-white mt-20">

      {/* ============================================
          🔥 SEO HEAD TAGS
      ============================================ */}
      <>
        <Title>{seoConfig.pageTitle}</Title>
        <Meta name="description" content={seoConfig.pageDescription} />
        <Meta name="keywords" content={seoConfig.keywords} />
        <Meta name="author" content={COMPANY_INFO.name} />
        <Meta name="publisher" content={COMPANY_INFO.name} />
        <Meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <Meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <Meta name="bingbot" content="index, follow" />

        {/* Geo Tags */}
        <Meta name="geo.region" content="IN-TS" />
        <Meta name="geo.placename" content={`${LOCATION.address.locality}, ${LOCATION.address.city}`} />
        <Meta name="geo.position" content={`${LOCATION.latitude};${LOCATION.longitude}`} />
        <Meta name="ICBM" content={`${LOCATION.latitude}, ${LOCATION.longitude}`} />

        {/* Open Graph */}
        <Meta property="og:title" content={seoConfig.pageTitle} />
        <Meta property="og:description" content={seoConfig.pageDescription} />
        <Meta property="og:type" content="website" />
        <Meta property="og:url" content={seoConfig.canonicalUrl} />
        <Meta property="og:site_name" content={COMPANY_INFO.name} />
        <Meta property="og:locale" content="en_IN" />
        <Meta property="og:image" content={seoConfig.ogImageUrl} />
        <Meta property="og:image:secure_url" content={seoConfig.ogImageUrl} />
        <Meta property="og:image:width" content="1200" />
        <Meta property="og:image:height" content="630" />
        <Meta property="og:image:alt" content={`Contact ${COMPANY_INFO.name} - ${COMPANY_INFO.yearsInBusiness} Years of AI Training Excellence`} />
        <Meta property="og:phone_number" content="+91-9700187077" />
        <Meta property="og:email" content="admin@aimtutor.in" />
        <Meta property="article:publisher" content={SOCIAL_MEDIA.find(s => s.name === 'Facebook').link} />

        {/* Twitter */}
        <Meta name="twitter:card" content="summary_large_image" />
        <Meta name="twitter:site" content="@aimtutor" />
        <Meta name="twitter:creator" content="@aimtutor" />
        <Meta name="twitter:title" content={seoConfig.pageTitle} />
        <Meta name="twitter:description" content={seoConfig.pageDescription} />
        <Meta name="twitter:image" content={seoConfig.ogImageUrl} />
        <Meta name="twitter:image:alt" content={`Contact ${COMPANY_INFO.name} in ${cityTitle}`} />

        {/* Canonical */}
        <HeadLink rel="canonical" href={seoConfig.canonicalUrl} />
        <HeadLink rel="alternate" hrefLang="en-in" href={seoConfig.canonicalUrl} />
        <HeadLink rel="alternate" hrefLang="en" href={seoConfig.canonicalUrl} />
        <HeadLink rel="alternate" hrefLang="x-default" href={`${siteUrl}/contact`} />

        {/* Preconnect */}
        <HeadLink rel="preconnect" href="https://www.google.com" />
        <HeadLink rel="preconnect" href="https://maps.googleapis.com" />
        <HeadLink rel="preconnect" href="https://maps.gstatic.com" crossOrigin="anonymous" />
        <HeadLink rel="dns-prefetch" href="//www.google-analytics.com" />
        <HeadLink rel="dns-prefetch" href="//www.googletagmanager.com" />

        {/* Business Meta */}
        <Meta name="business:contact_data:street_address" content={LOCATION.address.street} />
        <Meta name="business:contact_data:locality" content={LOCATION.address.locality} />
        <Meta name="business:contact_data:region" content={LOCATION.address.state} />
        <Meta name="business:contact_data:postal_code" content={LOCATION.address.pincode} />
        <Meta name="business:contact_data:country_name" content={LOCATION.address.country} />
        <Meta name="business:contact_data:phone_number" content="+91-9700187077" />
        <Meta name="business:contact_data:email" content="admin@aimtutor.in" />
        <Meta name="business:contact_data:website" content={COMPANY_INFO.website} />

        {/* Additional */}
        <Meta name="format-detection" content="telephone=yes" />
        <Meta name="theme-color" content="#3B82F6" />
        <Meta httpEquiv="content-language" content="en-IN" />
        <Meta name="application-name" content={COMPANY_INFO.name} />
        <Meta name="apple-mobile-web-app-title" content={COMPANY_INFO.name} />
        <Meta name="classification" content="Education, Training, AI, Technology" />
        <Meta name="rating" content="General" />
        <Meta name="revisit-after" content="3 days" />
        <Meta name="distribution" content="global" />
        <Meta name="coverage" content="Worldwide" />
        <Meta name="target" content="all" />
        <Meta name="HandheldFriendly" content="True" />
        <Meta name="MobileOptimized" content="320" />
      </>

      {/* ============================================
          🎯 HERO SECTION
      ============================================ */}
      <header className="relative min-h-[600px] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMXYxaC0xeiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvZz48L3N2Zz4=')] opacity-40" aria-hidden="true"></div>

        <div className="max-w-7xl mx-auto px-5 py-20 relative z-10 w-full">
          {/* Breadcrumb */}
          <nav className="flex gap-2 text-sm text-gray-400 mb-8" aria-label="Breadcrumb" itemScope itemType="https://schema.org/BreadcrumbList">
            <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link to="/" className="hover:text-white transition-colors" itemProp="item">
                <span itemProp="name">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span className="text-white font-medium" itemProp="name" aria-current="page">Contact Us</span>
              <meta itemProp="position" content="2" />
            </span>
          </nav>

          <div className="max-w-4xl mx-auto text-center">
            {/* Legacy Badge - Dynamic Years */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border border-yellow-500/30">
              <Award className="w-5 h-5 text-yellow-400" aria-hidden="true" />
              <span className="text-sm font-bold text-yellow-300">
                {COMPANY_INFO.yearsInBusiness}+ Years of Excellence Since {COMPANY_INFO.foundingYear}
              </span>
              <Sparkles className="w-4 h-4 text-yellow-400" aria-hidden="true" />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Get in Touch with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mt-2">
                {COMPANY_INFO.name}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
              <strong>{COMPANY_INFO.yearsInBusiness} years</strong> of transforming careers in AI &amp; Machine Learning.
              Visit our <strong>Ameerpet campus</strong> in {cityTitle} or connect with our expert counselors today.
            </p>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {TRUST_BADGES.map((badge, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <badge.icon className="w-8 h-8 text-cyan-400 mx-auto mb-2" aria-hidden="true" />
                  <p className="text-2xl md:text-3xl font-bold text-white">{badge.value}</p>
                  <p className="text-xs md:text-sm text-gray-300">{badge.label}</p>
                </div>
              ))}
            </div>

            {/* Quick Contact */}
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="tel:+919700187077"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <Phone className="w-5 h-5 animate-pulse" aria-hidden="true" />
                <span>+91 97001 87077</span>
              </a>
              <a
                href="https://wa.me/919700187077?text=Hi, I'm interested in AI training courses at Aim Tutor."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <MessageSquare className="w-5 h-5" aria-hidden="true" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================
          📞 CONTACT METHODS SECTION
      ============================================ */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white" aria-labelledby="contact-methods-heading">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
              <MessageSquare className="w-4 h-4 text-blue-600" aria-hidden="true" />
              <span className="text-sm font-medium text-blue-600">Multiple Ways to Connect</span>
            </div>
            <h2 id="contact-methods-heading" className="text-4xl md:text-5xl font-bold mb-4">
              Reach Out to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                Our Expert Team
              </span>
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              With <strong>{COMPANY_INFO.yearsInBusiness} years of experience</strong>, our counselors have helped {COMPANY_INFO.studentsPlaced} students find the right AI career path. Connect with us today!
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto">
            {CONTACT_METHODS.map((method, index) => (
              <article
                key={index}
                className="group bg-white rounded-3xl p-8 border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${method.color} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} aria-hidden="true"></div>
                <div className="absolute inset-[2px] bg-white rounded-3xl" aria-hidden="true"></div>

                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`} aria-hidden="true">
                    <method.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{method.title}</h3>
                  {method.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-700 font-semibold mb-1 text-lg">
                      {detail}
                    </p>
                  ))}
                  <p className="text-sm text-gray-500 mt-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                    {method.subtext}
                  </p>

                  <a
                    href={method.action}
                    target={method.action.startsWith('http') ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className={`mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${method.color} text-white rounded-xl font-semibold shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 w-full justify-center`}
                  >
                    <span>{method.actionLabel}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Social Media */}
          <div className="text-center">
            <p className="text-gray-600 mb-6 text-lg">Follow us on social media for AI tips, course updates &amp; success stories</p>
            <div className="flex flex-wrap gap-4 justify-center">
              {SOCIAL_MEDIA.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-3 px-5 py-3 bg-white rounded-xl border border-gray-200 ${social.color} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                  aria-label={`Follow ${COMPANY_INFO.name} on ${social.name}`}
                >
                  <social.icon className="w-6 h-6" aria-hidden="true" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 text-sm">{social.name}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          📝 CONTACT FORM & SIDEBAR
      ============================================ */}
      <section className="py-20 bg-white" aria-labelledby="contact-form-heading" ref={formRef}>
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid lg:grid-cols-5 gap-12">

            {/* Contact Form */}
            <article className="lg:col-span-3">
              <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 rounded-3xl p-8 md:p-12 border border-blue-100 shadow-xl">

                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 bg-blue-200 px-4 py-2 rounded-full mb-4">
                    <Send className="w-4 h-4 text-blue-700" aria-hidden="true" />
                    <span className="text-sm font-medium text-blue-700">Send us a Message</span>
                  </div>
                  <h2 id="contact-form-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    Start Your AI Journey with{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                      {COMPANY_INFO.yearsInBusiness} Years of Expertise
                    </span>
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Fill out the form and our expert counselors will contact you within <strong>1 hour</strong> with personalized course recommendations.
                  </p>
                </div>

                {/* Success Message */}
                {submitSuccess && (
                  <div
                    ref={successRef}
                    tabIndex={-1}
                    className="mb-6 bg-green-100 border-2 border-green-500 text-green-800 px-6 py-5 rounded-2xl flex items-start gap-4"
                    role="alert"
                    aria-live="polite"
                  >
                    <CheckCircle2 className="w-8 h-8 flex-shrink-0 text-green-600" aria-hidden="true" />
                    <div>
                      <p className="font-bold text-lg">🎉 Message Sent Successfully!</p>
                      <p className="text-sm mt-1">Thank you for contacting {COMPANY_INFO.name}. Our counselor will reach out to you within 2 hours during business hours.</p>
                      <p className="text-sm mt-2 font-medium">For immediate assistance, call: <a href="tel:+919700187077" className="underline">+91 97001 87077</a></p>
                    </div>
                    <button
                      onClick={() => setSubmitSuccess(false)}
                      className="ml-auto text-green-600 hover:text-green-800"
                      aria-label="Dismiss success message"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* Error Message */}
                {submitError && (
                  <div
                    className="mb-6 bg-red-100 border-2 border-red-500 text-red-800 px-6 py-5 rounded-2xl flex items-start gap-4"
                    role="alert"
                    aria-live="assertive"
                  >
                    <AlertCircle className="w-8 h-8 flex-shrink-0 text-red-600" aria-hidden="true" />
                    <div>
                      <p className="font-bold text-lg">Submission Failed</p>
                      <p className="text-sm mt-1">{submitError}</p>
                    </div>
                    <button
                      onClick={() => setSubmitError(null)}
                      className="ml-auto text-red-600 hover:text-red-800"
                      aria-label="Dismiss error message"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>

                  {/* Full Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                      Full Name <span className="text-red-500" aria-hidden="true">*</span>
                      <span className="sr-only">(required)</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      autoComplete="name"
                      placeholder="Enter your full name"
                      className={`w-full px-5 py-4 bg-white border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 ${errors.name && touched.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                      aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
                      aria-invalid={errors.name && touched.name ? 'true' : 'false'}
                    />
                    {errors.name && touched.name && (
                      <p id="name-error" className="mt-2 text-sm text-red-600 flex items-center gap-1" role="alert">
                        <AlertCircle className="w-4 h-4" aria-hidden="true" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email & Phone */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                        Email Address <span className="text-red-500" aria-hidden="true">*</span>
                        <span className="sr-only">(required)</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        autoComplete="email"
                        placeholder="your.email@example.com"
                        className={`w-full px-5 py-4 bg-white border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 ${errors.email && touched.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                        aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
                        aria-invalid={errors.email && touched.email ? 'true' : 'false'}
                      />
                      {errors.email && touched.email && (
                        <p id="email-error" className="mt-2 text-sm text-red-600 flex items-center gap-1" role="alert">
                          <AlertCircle className="w-4 h-4" aria-hidden="true" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                        Phone Number <span className="text-red-500" aria-hidden="true">*</span>
                        <span className="sr-only">(required)</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        autoComplete="tel"
                        placeholder="+91 97001 87077"
                        className={`w-full px-5 py-4 bg-white border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 ${errors.phone && touched.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                        aria-describedby={errors.phone && touched.phone ? 'phone-error' : undefined}
                        aria-invalid={errors.phone && touched.phone ? 'true' : 'false'}
                      />
                      {errors.phone && touched.phone && (
                        <p id="phone-error" className="mt-2 text-sm text-red-600 flex items-center gap-1" role="alert">
                          <AlertCircle className="w-4 h-4" aria-hidden="true" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Course Interest */}
                  <div>
                    <label htmlFor="course" className="block text-sm font-bold text-gray-700 mb-2">
                      Course of Interest
                    </label>
                    <select
                      id="course"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 cursor-pointer"
                    >
                      {COURSE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Enquiry Type */}
                  <fieldset>
                    <legend className="block text-sm font-bold text-gray-700 mb-3">
                      I am interested in <span className="text-red-500" aria-hidden="true">*</span>
                      <span className="sr-only">(required)</span>
                    </legend>
                    <div className="grid md:grid-cols-2 gap-4" role="radiogroup">
                      <label className={`flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${formData.type === 'individual' ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-300 bg-white hover:border-blue-300'}`}>
                        <input
                          type="radio"
                          name="type"
                          value="individual"
                          checked={formData.type === 'individual'}
                          onChange={handleChange}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <p className="font-bold text-gray-900">Individual Training</p>
                          <p className="text-xs text-gray-500">Personal career growth</p>
                        </div>
                      </label>
                      <label className={`flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${formData.type === 'corporate' ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-300 bg-white hover:border-blue-300'}`}>
                        <input
                          type="radio"
                          name="type"
                          value="corporate"
                          checked={formData.type === 'corporate'}
                          onChange={handleChange}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <p className="font-bold text-gray-900">Corporate Training</p>
                          <p className="text-xs text-gray-500">{COMPANY_INFO.corporateClients} clients served</p>
                        </div>
                      </label>
                    </div>
                  </fieldset>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
                      Your Message <span className="text-gray-400">(Optional)</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Tell us about your learning goals, preferred batch timings, or any specific questions..."
                      className="w-full px-5 py-4 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full px-8 py-5 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    aria-busy={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                        <span>Sending Your Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-6 h-6" aria-hidden="true" />
                        <span>Send Message to {COMPANY_INFO.name}</span>
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" aria-hidden="true" />
                      </>
                    )}
                  </button>

                  {/* Trust Note */}
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Shield className="w-4 h-4 text-green-500" aria-hidden="true" />
                    <span>Your information is secure and will never be shared. By submitting, you agree to our{' '}
                      <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
                    </span>
                  </div>
                </form>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-2 space-y-6">

              {/* Why Choose Us Card */}
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-8 text-white shadow-xl">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Zap className="w-6 h-6" aria-hidden="true" />
                  Why Choose {COMPANY_INFO.name}?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-cyan-300 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-bold">{COMPANY_INFO.yearsInBusiness}+ Years of Excellence</p>
                      <p className="text-sm text-cyan-100">Since {COMPANY_INFO.foundingYear}, pioneering AI education</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-cyan-300 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-bold">{COMPANY_INFO.studentsPlaced} Students Placed</p>
                      <p className="text-sm text-cyan-100">Proven track record in placements</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-cyan-300 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-bold">{COMPANY_INFO.corporateClients} Clients</p>
                      <p className="text-sm text-cyan-100">Trusted by top MNCs & startups</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-cyan-300 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-bold">{COMPANY_INFO.rating}/5 Rating</p>
                      <p className="text-sm text-cyan-100">From {COMPANY_INFO.totalReviews} verified reviews</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Office Hours */}
              <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center" aria-hidden="true">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Office Hours</h3>
                </div>
                <div className="space-y-4">
                  {OFFICE_HOURS.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${schedule.isOpen ? 'bg-green-500' : 'bg-red-500'}`} aria-hidden="true"></div>
                        <span className="font-semibold text-gray-700">{schedule.day}</span>
                      </div>
                      <span className={`text-sm font-medium ${schedule.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                        {schedule.time}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-gray-500 flex items-center gap-2">
                  <HeadphonesIcon className="w-4 h-4" aria-hidden="true" />
                  24/7 online support via email & WhatsApp
                </p>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  {QUICK_LINKS.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-x-1 group cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true">
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Website Link */}
              <a
                href={COMPANY_INFO.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center" aria-hidden="true">
                    <Globe className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Official Website</p>
                    <p className="font-bold text-lg">{COMPANY_INFO.website.replace('https://', '')}</p>
                  </div>
                  <ArrowRight className="w-6 h-6 ml-auto" aria-hidden="true" />
                </div>
              </a>
            </aside>
          </div>
        </div>
      </section>

      {/* ============================================
          🗺️ MAP & LOCATION SECTION
      ============================================ */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white" aria-labelledby="location-heading">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full mb-4">
              <MapPin className="w-4 h-4 text-orange-600" aria-hidden="true" />
              <span className="text-sm font-medium text-orange-600">{COMPANY_INFO.yearsInBusiness} Years at Same Location</span>
            </div>
            <h2 id="location-heading" className="text-4xl md:text-5xl font-bold mb-4">
              Visit Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                Ameerpet Campus
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Located in the heart of India's largest IT training hub since <strong>{COMPANY_INFO.foundingYear}</strong>.
              Walk-ins welcome! Easy access from Ameerpet Metro Station.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-stretch">

            {/* Map */}
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white h-[450px] relative">
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1903.3!2d${LOCATION.longitude}!3d${LOCATION.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI2JzE3LjciTiA3OMKwMjYnNDMuMSJF!5e0!3m2!1sen!2sin!4v1699999999999!5m2!1sen!2sin`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${COMPANY_INFO.name} Location Map - Ameerpet, Hyderabad`}
              ></iframe>

              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" aria-hidden="true" />
                  {COMPANY_INFO.name}
                </p>
              </div>
            </div>

            {/* Address Details */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-3xl p-8 text-white shadow-xl">
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold mb-1">{COMPANY_INFO.name}</h3>
                    <p className="text-orange-100 text-lg">{COMPANY_INFO.alternateName}</p>
                    <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full mt-2">
                      <Award className="w-4 h-4" aria-hidden="true" />
                      <span className="text-sm font-medium">Since {COMPANY_INFO.foundingYear}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-orange-200 mt-1 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-bold text-lg mb-1">Campus Address</p>
                      <address className="text-orange-100 not-italic leading-relaxed">
                        {LOCATION.address.street}<br />
                        {LOCATION.address.locality}, {LOCATION.address.city} - {LOCATION.address.pincode}<br />
                        {LOCATION.address.state}, {LOCATION.address.country}
                      </address>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-orange-200 mt-1 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-bold text-lg mb-1">Phone</p>
                      <div className="text-orange-100 space-y-1">
                        <a href="tel:+919700187077" className="hover:text-white transition-colors flex items-center gap-2">
                          +91 97001 87077 <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Primary</span>
                        </a>
                        <a href="tel:+916300232040" className="hover:text-white transition-colors block">+91 63002 32040</a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-orange-200 mt-1 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-bold text-lg mb-1">Email</p>
                      <div className="text-orange-100 space-y-1">
                        <a href="mailto:admin@aimtutor.in" className="hover:text-white transition-colors block">admin@aimtutor.in</a>
                        <a href="mailto:aimtutor@gmail.com" className="hover:text-white transition-colors block">aimtutor@gmail.com</a>
                      </div>
                    </div>
                  </div>
                </div>

                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-3 px-8 py-4 bg-white text-orange-600 rounded-xl font-bold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full justify-center text-lg"
                >
                  <MapPinned className="w-6 h-6" aria-hidden="true" />
                  <span>Get Directions</span>
                  <ArrowRight className="w-6 h-6" aria-hidden="true" />
                </a>
              </div>

              {/* Landmarks */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-blue-500" aria-hidden="true" />
                  Nearby Landmarks & Transportation
                </h4>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" aria-hidden="true" />
                    <span><strong>Ameerpet Metro Station</strong> - 5 min walk</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" aria-hidden="true" />
                    <span><strong>Behind Mytrivanam</strong> - Main landmark</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" aria-hidden="true" />
                    <span><strong>Free Parking</strong> - 2-wheelers & 4-wheelers</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" aria-hidden="true" />
                    <span><strong>Multiple Bus Routes</strong> - Well connected</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          ❓ ACCESSIBLE FAQ SECTION
      ============================================ */}
      <section className="py-20 bg-white" aria-labelledby="faq-heading">
        <div className="max-w-4xl mx-auto px-5">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full mb-4">
              <MessageSquare className="w-4 h-4 text-purple-600" aria-hidden="true" />
              <span className="text-sm font-medium text-purple-600">Quick Answers</span>
            </div>
            <h2 id="faq-heading" className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Questions
              </span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Get instant answers about our <strong>{COMPANY_INFO.yearsInBusiness} years</strong> of AI training excellence,
              courses, placements, and admissions.
            </p>
          </div>

          {/* Accessible FAQ Accordion */}
          <div className="space-y-4" role="region" aria-label="Frequently Asked Questions">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              const headingId = `faq-heading-${index}`;
              const panelId = `faq-panel-${index}`;

              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <h3>
                    <button
                      id={headingId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleFaq(index)}
                      onKeyDown={(e) => handleFaqKeyDown(e, index)}
                      className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset"
                    >
                      <span className="font-bold text-lg text-gray-900 pr-4">
                        {faq.question}
                      </span>
                      <span
                        className={`w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      >
                        <ChevronDown className="w-5 h-5 text-white" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={headingId}
                    hidden={!isOpen}
                    className={`transition-all duration-300 ${isOpen ? 'block' : 'hidden'}`}
                  >
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* More Questions CTA */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
              <p className="text-xl text-gray-700 mb-4">Still have questions? Our expert counselors are here to help!</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="tel:+919700187077"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <Phone className="w-5 h-5" aria-hidden="true" />
                  Call +91 97001 87077
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default ContactPage;