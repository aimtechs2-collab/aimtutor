import type { LucideIcon } from "lucide-react";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  GraduationCap,
  Briefcase,
  Calendar,
  Users,
  Award,
  Building2,
  Star,
} from "lucide-react";
import { LOCATION } from "@/components/about/aboutConstants";

export { LOCATION };

const foundingYear = 2007;

export const CONTACT_COMPANY_INFO = {
  name: "Aim Tutor",
  alternateName: "The School of Artificial Intelligence",
  foundingYear,
  get yearsInBusiness() {
    return new Date().getFullYear() - foundingYear;
  },
  studentsPlaced: "50,000+",
  corporateClients: "500+",
  coursesOffered: "25+",
  industryExperts: "100+",
  rating: "4.9",
  totalReviews: "5,847",
  website: "https://www.aimtutor.in",
} as const;

export const CONTACT_SOCIAL_MEDIA: {
  icon: LucideIcon;
  name: string;
  link: string;
  color: string;
  bgColor: string;
}[] = [
  {
    icon: Linkedin,
    name: "LinkedIn",
    link: "https://www.linkedin.com/in/aimtutorameerpet/",
    color: "hover:text-blue-600 hover:bg-blue-50",
    bgColor: "bg-blue-600",
  },
  {
    icon: Facebook,
    name: "Facebook",
    link: "https://www.facebook.com/aimtutorameerpet",
    color: "hover:text-blue-500 hover:bg-blue-50",
    bgColor: "bg-blue-500",
  },
  {
    icon: Twitter,
    name: "X (Twitter)",
    link: "https://x.com/aimtechhyd",
    color: "hover:text-gray-900 hover:bg-gray-100",
    bgColor: "bg-gray-900",
  },
  {
    icon: Instagram,
    name: "Instagram",
    link: "https://www.instagram.com/aimtutorameerpet/",
    color: "hover:text-pink-600 hover:bg-pink-50",
    bgColor: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500",
  },
  {
    icon: Youtube,
    name: "YouTube",
    link: "https://www.youtube.com/@aimtutor8983",
    color: "hover:text-red-600 hover:bg-red-50",
    bgColor: "bg-red-600",
  },
];

export function getContactMethods(): {
  icon: LucideIcon;
  title: string;
  details: string[];
  subtext: string;
  color: string;
  action: string;
  actionLabel: string;
}[] {
  return [
    {
      icon: Phone,
      title: "Call Us",
      details: ["+91 97001 87077", "+91 63002 32040"],
      subtext: "Mon-Sat, 9 AM - 7 PM IST",
      color: "from-blue-500 to-cyan-500",
      action: "tel:+919700187077",
      actionLabel: "Call Now",
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["admin@aimtutor.in", "aimtutor@gmail.com"],
      subtext: "We reply within 2 hours",
      color: "from-purple-500 to-pink-500",
      action: "mailto:admin@aimtutor.in",
      actionLabel: "Send Email",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["Aim Tutor Campus", "Ameerpet, Hyderabad - 500038"],
      subtext: `${CONTACT_COMPANY_INFO.yearsInBusiness} Years at the Same Location`,
      color: "from-orange-500 to-red-500",
      action: `https://www.google.com/maps?q=${LOCATION.latitude},${LOCATION.longitude}`,
      actionLabel: "Get Directions",
    },
  ];
}

export const OFFICE_HOURS = [
  { day: "Monday - Friday", time: "9:00 AM - 7:00 PM", isOpen: true },
  { day: "Saturday", time: "9:00 AM - 5:00 PM", isOpen: true },
  { day: "Sunday", time: "Closed (Online Support)", isOpen: false },
] as const;

export const QUICK_LINKS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: GraduationCap,
    title: "Course Enquiry",
    description: `Explore ${CONTACT_COMPANY_INFO.coursesOffered} AI programs`,
  },
  {
    icon: Briefcase,
    title: "Corporate Training",
    description: `${CONTACT_COMPANY_INFO.corporateClients} enterprise clients`,
  },
  { icon: Calendar, title: "Schedule Demo", description: "Free trial class" },
  {
    icon: Users,
    title: "Career Guidance",
    description: `${CONTACT_COMPANY_INFO.studentsPlaced} placed`,
  },
];

export const COURSE_OPTIONS = [
  { value: "", label: "Select a course" },
  { value: "ml-ai", label: "Machine Learning & AI" },
  { value: "deep-learning", label: "Deep Learning" },
  { value: "nlp", label: "Natural Language Processing" },
  { value: "computer-vision", label: "Computer Vision" },
  { value: "data-science", label: "Data Science with AI" },
  { value: "generative-ai", label: "Generative AI & LLMs" },
  { value: "python-ai", label: "Python for AI" },
  { value: "ai-business", label: "AI for Business Leaders" },
  { value: "mlops", label: "MLOps & AI Engineering" },
  { value: "corporate", label: "Corporate Training" },
  { value: "other", label: "Other / Not Sure" },
] as const;

export function getContactFaqs() {
  const C = CONTACT_COMPANY_INFO;
  const L = LOCATION;
  return [
    {
      question: "How long has Aim Tutor been providing AI training?",
      answer: `Aim Tutor has been a pioneer in technology education for over ${C.yearsInBusiness} years since ${C.foundingYear}. We started with software training and evolved into a specialized AI and Machine Learning training institute, making us one of the most experienced training providers in Hyderabad.`,
    },
    {
      question: "Do you offer online classes for AI training?",
      answer:
        "Yes! Aim Tutor offers flexible learning modes including online live training, offline classroom training at our Ameerpet campus, and hybrid programs. Our online sessions feature interactive live instructors, hands-on labs, and recorded sessions for revision.",
    },
    {
      question: "What is the batch size for AI training courses?",
      answer: `We maintain small batch sizes of 15-20 students for personalized attention. With ${C.yearsInBusiness} years of teaching experience, we understand that quality learning requires individual mentorship from our expert instructors.`,
    },
    {
      question: "Do you provide placement assistance after course completion?",
      answer: `Absolutely! With ${C.studentsPlaced} students placed over ${C.yearsInBusiness} years, our dedicated placement cell has partnerships with ${C.corporateClients} companies including TCS, Infosys, Wipro, Amazon, Google, Microsoft, and leading startups.`,
    },
    {
      question: "Can I visit the Aim Tutor campus in Ameerpet?",
      answer: `Yes, walk-ins are welcome at our Ameerpet campus which has been our home for ${C.yearsInBusiness} years! Visit us Monday-Saturday, 9 AM - 7 PM. We're located at ${L.address.street}, near Ameerpet Metro Station.`,
    },
    {
      question: "What AI courses are available at Aim Tutor?",
      answer: `We offer ${C.coursesOffered} comprehensive AI training programs including Machine Learning & AI, Deep Learning, Generative AI & LLMs, Natural Language Processing, Computer Vision, Data Science, Python for AI, and customized corporate training.`,
    },
    {
      question: "What makes Aim Tutor different from other training institutes?",
      answer: `With ${C.yearsInBusiness} years of excellence, ${C.studentsPlaced} successful alumni, ${C.corporateClients} corporate clients, and a ${C.rating}/5 rating from ${C.totalReviews} reviews, we offer unmatched experience, industry connections, and proven placement track record.`,
    },
    {
      question: "Is there parking available at the Ameerpet campus?",
      answer:
        "Yes, free parking is available for both two-wheelers and four-wheelers. Our campus is also well-connected by public transport - just a 5-minute walk from Ameerpet Metro Station with multiple bus routes available.",
    },
  ];
}

export const TRUST_BADGES: { icon: LucideIcon; value: string; label: string }[] = [
  { icon: Award, value: `${CONTACT_COMPANY_INFO.yearsInBusiness}+`, label: "Years Excellence" },
  { icon: Users, value: CONTACT_COMPANY_INFO.studentsPlaced, label: "Students Trained" },
  { icon: Building2, value: CONTACT_COMPANY_INFO.corporateClients, label: "Corporate Clients" },
  {
    icon: Star,
    value: CONTACT_COMPANY_INFO.rating,
    label: `Rating (${CONTACT_COMPANY_INFO.totalReviews} Reviews)`,
  },
];
