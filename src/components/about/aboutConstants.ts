import type { LucideIcon } from "lucide-react";
import {
  Brain,
  Lightbulb,
  Heart,
  Globe,
  Cpu,
  Network,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Clock,
  Users,
  Award,
  Star,
} from "lucide-react";

export const LOCATION = {
  latitude: 17.438253044319286,
  longitude: 78.4452963483808,
  address: {
    street: "#50, Kamala Nivas, Sap Street, Gayatri Nagar, Behind Mytrivanam",
    locality: "Ameerpet",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500038",
    country: "India",
    countryCode: "IN",
  },
} as const;

export const COMPANY_INFO = {
  name: "Aim Tutor",
  alternateName: "The School of Artificial Intelligence",
  tagline: "One Stop Upskill Center for Modern Technologies",
  foundingYear: 2007,
  get yearsInBusiness() {
    return new Date().getFullYear() - 2007;
  },
  studentsPlaced: "50,000+",
  studentsTrained: "100,000+",
  corporateClients: "500+",
  coursesOffered: "25+",
  industryExperts: "100+",
  successRate: "98%",
  countriesReached: "35+",
  rating: "4.9",
  totalReviews: "15,000",
  website: "https://www.aimtutor.in",
  email: "admin@aimtutor.in",
  phone: "+91-9700187077",
  phoneSecondary: "+91-6300232040",
} as const;

export const SOCIAL_MEDIA = {
  linkedin: "https://www.linkedin.com/in/aimtutorameerpet/",
  facebook: "https://www.facebook.com/aimtutorameerpet",
  twitter: "https://x.com/aimtechhyd",
  instagram: "https://www.instagram.com/aimtutorameerpet/",
  youtube: "https://www.youtube.com/@aimtutor8983",
} as const;

export function getStats(): { number: string; label: string; icon: LucideIcon }[] {
  return [
    { number: `${COMPANY_INFO.yearsInBusiness}+`, label: "Years of Excellence", icon: Clock },
    { number: COMPANY_INFO.studentsTrained, label: "Students Trained", icon: GraduationCap },
    { number: COMPANY_INFO.corporateClients, label: "Corporate Clients", icon: Briefcase },
    { number: COMPANY_INFO.successRate, label: "Success Rate", icon: TrendingUp },
  ];
}

export const CORE_VALUES: {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}[] = [
  {
    icon: Brain,
    title: "AI-First Approach",
    description:
      "Leading the revolution in artificial intelligence education with cutting-edge curriculum and industry-relevant training.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "Constantly evolving our programs to match the rapidly changing AI landscape and emerging technologies.",
    color: "from-cyan-500 to-teal-500",
  },
  {
    icon: Heart,
    title: "Student-Centric",
    description: `Your success is our legacy. ${COMPANY_INFO.yearsInBusiness} years of experience in personalized mentorship and career guidance.`,
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Globe,
    title: "Global Vision",
    description:
      "Expanding from Hyderabad to the world, making quality AI education accessible internationally.",
    color: "from-orange-500 to-red-500",
  },
];

export function getMilestones() {
  return [
    {
      year: COMPANY_INFO.foundingYear.toString(),
      title: "The Foundation",
      description: `Established in ${LOCATION.address.locality}, ${LOCATION.address.city} as a premier software training institute, building the foundation of excellence.`,
      isHighlight: true,
      highlightColor: "orange" as const,
    },
    {
      year: "2013",
      title: "Regional Leader",
      description: `Became ${LOCATION.address.city}'s most trusted name in software training, with 50+ corporate partnerships.`,
      isHighlight: false,
    },
    {
      year: "2022",
      title: "AI Transformation",
      description:
        "Recognized the AI revolution and began restructuring curriculum to focus on artificial intelligence and machine learning.",
      isHighlight: false,
    },
    {
      year: "2026",
      title: "Global Expansion",
      description: `Launching global initiatives to bring ${COMPANY_INFO.yearsInBusiness} years of training expertise to the international market with AI-focused education.`,
      isHighlight: true,
      highlightColor: "blue" as const,
    },
  ];
}

export function getWhyChooseUs() {
  return [
    `${COMPANY_INFO.yearsInBusiness} years of proven software training excellence`,
    "AI-focused curriculum designed by industry experts",
    "Hands-on projects with real-world AI applications",
    `Located in ${LOCATION.address.locality} - ${LOCATION.address.city}'s IT training hub`,
    "International certification programs",
    "Job placement assistance with global companies",
    "Flexible learning: Online, Offline & Hybrid modes",
    "Small batch sizes for personalized AI mentorship",
    "Lifetime access to AI course materials and updates",
    "State-of-the-art AI labs and infrastructure",
  ];
}

export function getGlobalReach(): { icon: LucideIcon; number: string; label: string }[] {
  return [
    { icon: Users, number: COMPANY_INFO.studentsTrained, label: "Alumni Worldwide" },
    { icon: Globe, number: COMPANY_INFO.countriesReached, label: "Countries Reached" },
    { icon: Award, number: "10+", label: "Industry Awards" },
    { icon: Star, number: `${COMPANY_INFO.rating}/5`, label: "Student Rating" },
  ];
}

export const AI_SPECIALIZATIONS: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: Brain,
    title: "Machine Learning & AI",
    description:
      "Deep dive into ML algorithms, neural networks, and practical AI applications that drive modern technology.",
  },
  {
    icon: Cpu,
    title: "Deep Learning & NLP",
    description:
      "Master advanced deep learning techniques, transformers, and natural language processing for cutting-edge AI solutions.",
  },
  {
    icon: Network,
    title: "AI for Business",
    description:
      "Learn to implement AI strategies, automation, and intelligent systems that transform business operations.",
  },
];

export function getAboutFaqs() {
  return [
    {
      question: `How long has ${COMPANY_INFO.name} been in operation?`,
      answer: `${COMPANY_INFO.name} was established in ${COMPANY_INFO.foundingYear} in ${LOCATION.address.locality}, ${LOCATION.address.city}. We have over ${COMPANY_INFO.yearsInBusiness} years of experience in software and technology training, making us one of the most experienced training institutes in India.`,
    },
    {
      question: `What courses does ${COMPANY_INFO.name} offer?`,
      answer: `${COMPANY_INFO.name} specializes in AI and Machine Learning courses, Deep Learning & NLP, AI for Business, Data Science, Python Programming, and various other technology training programs. We offer ${COMPANY_INFO.coursesOffered} courses in both online and offline training modes.`,
    },
    {
      question: `Where is ${COMPANY_INFO.name} located?`,
      answer: `Our headquarters is located in ${LOCATION.address.locality}, ${LOCATION.address.city}, ${LOCATION.address.state} - India's largest IT training hub. We also offer online training programs accessible worldwide to students in ${COMPANY_INFO.countriesReached} countries.`,
    },
    {
      question: `What is ${COMPANY_INFO.name}'s success rate?`,
      answer: `${COMPANY_INFO.name} has a ${COMPANY_INFO.successRate} success rate with over ${COMPANY_INFO.studentsTrained} students trained and ${COMPANY_INFO.corporateClients} corporate clients. Our alumni work in top companies across ${COMPANY_INFO.countriesReached} countries worldwide.`,
    },
    {
      question: `Does ${COMPANY_INFO.name} offer placement assistance?`,
      answer: `Yes, ${COMPANY_INFO.name} provides comprehensive job placement assistance including resume building, interview preparation, and connections with our network of ${COMPANY_INFO.corporateClients} corporate partners globally. We've successfully placed ${COMPANY_INFO.studentsPlaced} students over ${COMPANY_INFO.yearsInBusiness} years.`,
    },
  ];
}
