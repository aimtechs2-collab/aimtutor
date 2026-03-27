/**
 * Translation type — all UI strings organized by component area.
 * Use {{city}} as placeholder for city name interpolation.
 */
export type Translations = {
  nav: {
    home: string;
    training: string;
    about: string;
    contact: string;
    signIn: string;
    dashboard: string;
    viewAllCourses: string;
    failedToLoad: string;
    retry: string;
    noCategories: string;
    search: string;
  };
  hero: {
    availableIn: string;
    headline: string;
    brandName: string;
    subheading: string;
    searchPlaceholder: string;
    browseCourses: string;
    bookDemo: string;
    ratedInstitute: string;
    alumni: string;
    hiringPartners: string;
  };
  stats: {
    studentsTrained: string;
    studentsPlaced: string;
    successRate: string;
    expertTrainers: string;
    ourAchievements: string;
    numbersThatSpeak: string;
    speak: string;
    impactDescription: string;
    statsUpdated: string;
  };
  enterprise: {
    trustedBy: string;
    title: string;
    solutions: string;
    description: string;
    features: string[];
    ctaPrimary: string;
    ctaSecondary: string;
    enterpriseClients: string;
    employeesTrained: string;
    satisfactionRate: string;
    supportAvailable: string;
  };
  services: {
    whatWeOffer: string;
    offerDescription: string;
    corporateTraining: string;
    corporateDescription: string;
    corporateFeatures: string[];
    professionalCourses: string;
    professionalDescription: string;
    professionalFeatures: string[];
    consultancy: string;
    consultancyDescription: string;
    consultancyFeatures: string[];
  };
  faq: {
    heading: string;
    description: string;
    questions: Array<{ question: string; answer: string }>;
  };
  footer: {
    popularCourses: string;
    quickLinks: string;
    officeHours: string;
    connectWithUs: string;
    aboutUs: string;
    allCourses: string;
    viewAllCourses: string;
    followUs: string;
    yearsExcellence: string;
    studentsTrained: string;
    callUs: string;
    emailUs: string;
    visitUs: string;
    allRightsReserved: string;
    empoweringSince: string;
    privacyPolicy: string;
    monFri: string;
    saturday: string;
    sunday: string;
    monFriTime: string;
    satTime: string;
    sunTime: string;
  };
  cta: {
    readyToAccelerate: string;
    joinThousands: string;
    exploreCourses: string;
    contactUs: string;
  };
  seo: {
    homeTitle: string;
    homeDescription: string;
    trainingTitle: string;
    trainingDescription: string;
    subcategoryTitle: string;
    subcategoryDescription: string;
    courseTitle: string;
    courseDescription: string;
  };

  categoryPage: {
    loading: string;
    oops: string;
    tryAgain: string;
    notFoundTitle: string;
    notFoundDesc: string;
    goHome: string;
    liveTrainingAvail: string;
    trainingTitle: string;
    trainingInCity: string;
    heroP1: string;
    heroP2: string;
    heroP3: string;
    statsSpec: string;
    statsCourses: string;
    statsRating: string;
    statsStudents: string;
    statsHandsOn: string;
    exploreSubcategoriesTitle: string;
    exploreSubcategoriesDesc: string;
    noSubcategories: string;
    exploreBtn: string;
    featuredTitle: string;
    featuredDesc: string;
    allLevels: string;
    freeCourse: string;
    viewCourse: string;
    faqTitle: string;
    faqDesc: string;
    whyChooseTitle: string;
    whyChooseDesc: string;
    expertInstructorsTitle: string;
    expertInstructorsDesc: string;
    handsOnTitle: string;
    handsOnDesc: string;
    careerSupportTitle: string;
    careerSupportDesc: string;
    studentRating: string;
    jobPlacement: string;
    support: string;
    whatStudentsSayTitle: string;
    whatStudentsSayDesc: string;
    avgRating: string;
    totalReviews: string;
    satisfactionRate: string;
    wouldRecommend: string;
    upcomingTitle: string;
    upcomingDesc: string;
    readyTitle: string;
    readyDesc1: string;
    readyDesc2: string;
    startJourneyBtn: string;
  };
  trainingPage: {
    loading: string;
    noCategoriesTitle: string;
    noCategoriesDesc: string;
    gotQuestions: string;
    faqTitle: string;
    faqQuestions: Array<{ question: string; answer: string }>;
    expertLedPrograms: string;
    title: string;
    description: string;
    searchPlaceholder: string;
    allCategories: string;
    results: string;
    noResultsTitle: string;
    noResultsDesc: string;
    clearSearch: string;
    categoryDesc: string;
    explorePrograms: string;
    cantFindTitle: string;
    cantFindDesc: string;
    talkToAdvisor: string;
    requestCustom: string;
  };
  subcategoryPage: {
    loading: string;
    notFound: string;
    liveTrainingAvail: string;
    rating: string;
    trainingTitle: string;
    trainingInCity: string;
    heroP1: string;
    heroP2: string;
    statsCourses: string;
    statsRating: string;
    statsHandsOn: string;
    coursesInCity: string;
    searchPlaceholder: string;
    noImage: string;
    hours: string;
    free: string;
    viewCourse: string;
    noCoursesFound: string;
    whyChooseTitle: string;
    whyChooseDesc: string;
    expertInstructorsTitle: string;
    expertInstructorsDesc: string;
    handsOnTitle: string;
    handsOnDesc: string;
    careerSupportTitle: string;
    careerSupportDesc: string;
    studentRating: string;
    studentsTrained: string;
    jobPlacement: string;
    support: string;
    whatStudentsSayTitle: string;
    whatStudentsSayDesc: string;
    avgRating: string;
    totalReviews: string;
    satisfactionRate: string;
    wouldRecommend: string;
    faqTitle: string;
    faqDesc: string;
    faqQuestions: string[];
    faqAnswer: string;
    readyTitle: string;
    readyDesc: string;
    startJourneyBtn: string;
  };
  coursePage: {
    loading: string;
    notFound: string;
    home: string;
    training: string;
    trainingInCity: string;
    ratings: string;
    hoursTotal: string;
    lessons: string;
    maxStudents: string;
    downloadBrochure: string;
    whatYouWillLearn: string;
    courseIncludes: string;
    onDemandVideo: string;
    handsOnExercises: string;
    certificateOfCompletion: string;
    fullLifetimeAccess: string;
    accessOnMobile: string;
    courseContent: string;
    modules: string;
    prerequisites: string;
    recommendedPrerequisites: string;
    completeBeforeStarting: string;
    viewDetails: string;
    description: string;
    showMore: string;
    showLess: string;
    whyChooseThisCourse: string;
    expertInstructorsTitle: string;
    expertInstructorsDesc: string;
    handsOnLabsTitle: string;
    handsOnLabsDesc: string;
    certificationTitle: string;
    certificationDesc: string;
    studentFeedback: string;
    showMoreReviews: string;
    faqTitle: string;
    courseFee: string;
    free: string;
    enrollNow: string;
    readyToMaster: string;
    readyToMasterDesc: string;
    reviews: Array<{ user: string; date: string; text: string }>;
    faqs: Array<{ q: string; a: string }>;
  };
};
const en: Translations = {
  nav: {
    home: "Home",
    training: "Training",
    about: "About",
    contact: "Contact",
    signIn: "Sign In",
    dashboard: "Dashboard",
    viewAllCourses: "View All Training Courses",
    failedToLoad: "Failed to load categories",
    retry: "Retry",
    noCategories: "No categories available",
    search: "Search",
  },
  hero: {
    availableIn: "Now Available in {{city}}",
    headline: "Transform Your Career with",
    brandName: "Aim Tutor",
    subheading: "Master cutting-edge technologies with expert-led courses designed for industry leaders in {{city}}",
    searchPlaceholder: "Search for courses, certifications, or skills...",
    browseCourses: "Browse All Courses",
    bookDemo: "Book Free Demo",
    ratedInstitute: "4.8★ Rated Institute",
    alumni: "50,000+ Alumni",
    hiringPartners: "500+ Hiring Partners",
  },
  stats: {
    studentsTrained: "Students Trained",
    studentsPlaced: "Students Placed",
    successRate: "Success Rate",
    expertTrainers: "Expert Trainers",
    ourAchievements: "Our Achievements",
    numbersThatSpeak: "Numbers That",
    speak: "Speak",
    impactDescription: "Our impact in numbers - a testament to our commitment to excellence",
    statsUpdated: "* Statistics updated in real-time",
  },
  enterprise: {
    trustedBy: "Trusted by 500+ Companies",
    title: "Enterprise Training",
    solutions: "Solutions",
    description: "Empower your workforce with customized training programs designed to meet your organization's unique needs in {{city}}.",
    features: [
      "Customized curriculum aligned with your industry",
      "Flexible delivery: On-site, remote, or hybrid",
      "Progress tracking & detailed analytics",
      "Expert instructors with real-world experience",
      "Post-training support and mentorship",
    ],
    ctaPrimary: "Get Ready For AI",
    ctaSecondary: "Make an Enquiry",
    enterpriseClients: "Enterprise Clients",
    employeesTrained: "Employees Trained",
    satisfactionRate: "Satisfaction Rate",
    supportAvailable: "Support Available",
  },
  services: {
    whatWeOffer: "What We Offer",
    offerDescription: "Comprehensive solutions tailored to your learning journey",
    corporateTraining: "Corporate Training",
    corporateDescription: "Tailored programs designed to upskill your workforce with the latest technologies and methodologies.",
    corporateFeatures: ["Custom Curriculum", "On-site Training", "Performance Tracking"],
    professionalCourses: "Professional Courses",
    professionalDescription: "Industry-aligned courses that prepare you for real-world challenges and career advancement.",
    professionalFeatures: ["Hands-on Projects", "Industry Certification", "Career Support"],
    consultancy: "Consultancy Services",
    consultancyDescription: "Strategic guidance for digital transformation and technology adoption to drive business growth.",
    consultancyFeatures: ["Tech Assessment", "Solution Architecture", "Implementation Support"],
  },
  faq: {
    heading: "Frequently Asked Questions",
    description: "Get answers to common questions about Aim Tutor training programs in {{city}}",
    questions: [
      {
        question: "What makes Aim Tutor different from other training institutes?",
        answer: "Aim Tutor stands out with expert instructors (10+ years experience), 100% hands-on learning, small batch sizes, real-world projects, latest curriculum, and placement assistance with 500+ hiring partners.",
      },
      {
        question: "Are Aim Tutor courses available online?",
        answer: "Yes, we offer both online live training and classroom training. Our online sessions are interactive with live instructors, hands-on labs, and the same quality as classroom programs.",
      },
      {
        question: "What kind of job placement assistance does Aim Tutor provide?",
        answer: "We provide resume building, interview preparation, mock interviews, soft skills training, and direct connections with 500+ hiring partners including top MNCs and startups.",
      },
      {
        question: "Do I get industry-recognized certifications after completing courses?",
        answer: "Yes, you receive industry-recognized certificates upon completion. We also help you prepare for vendor certifications like AWS, Microsoft Azure, and Google Cloud.",
      },
      {
        question: "What is the duration and fee structure of Aim Tutor courses?",
        answer: "Course duration varies from 2-6 months. We offer flexible payment options including installments and early bird discounts. Contact us for detailed fee structure.",
      },
      {
        question: "Can I get customized corporate training for my organization?",
        answer: "Yes. We provide tailored corporate training including customized curriculum, flexible delivery (onsite/online/hybrid), progress tracking, and ongoing support.",
      },
    ],
  },
  footer: {
    popularCourses: "Popular Courses",
    quickLinks: "Quick Links",
    officeHours: "Office Hours",
    connectWithUs: "Connect With Us",
    aboutUs: "About Us",
    allCourses: "All Courses",
    viewAllCourses: "View All Courses",
    followUs: "Follow us for updates, tips, and industry insights",
    yearsExcellence: "Years of Excellence",
    studentsTrained: "100K+ Students Trained",
    callUs: "Call Us",
    emailUs: "Email Us",
    visitUs: "Visit Us",
    allRightsReserved: "All rights reserved.",
    empoweringSince: "Empowering careers since 2004",
    privacyPolicy: "Privacy Policy",
    monFri: "Mon - Fri",
    saturday: "Saturday",
    sunday: "Sunday",
    monFriTime: "9:00 AM - 7:00 PM",
    satTime: "9:00 AM - 5:00 PM",
    sunTime: "Online Support Only",
  },
  cta: {
    readyToAccelerate: "Ready to accelerate your career?",
    joinThousands: "Join thousands of professionals who have transformed their careers with AIM's expert-led courses.",
    exploreCourses: "Explore Courses",
    contactUs: "Contact Us",
  },
  seo: {
    homeTitle: "Best Technology Training Institute in {{city}} | AI, Cloud, Data Science | Aim Tutor",
    homeDescription: "Transform your career with Aim Tutor! #1 rated tech training in {{city}}. AI, Cloud, Data Science courses. Expert instructors. 100% placement assistance. Hands-on learning. Enroll now!",
    trainingTitle: "Best Technology Training Courses in {{city}} | {{count}} Categories | Aim Tutor",
    trainingDescription: "🚀 Explore {{count}}+ technology training courses in {{city}}! ⭐ AI, Cloud, Data Science courses. Expert instructors. 100% placement assistance. Hands-on learning. Enroll now!",
    subcategoryTitle: "Best {{name}} Training in {{city}} | Online & Classroom Courses | Aim Tutor",
    subcategoryDescription: "★ Top-rated {{name}} training in {{city}}! Expert instructors, hands-on labs, certification prep, job assistance. Enroll today!",
    courseTitle: "{{name}} Course in {{city}} | Expert-Led Training | Aim Tutor",
    courseDescription: "Enroll in {{name}} training in {{city}}. Instructor-led, hands-on projects, certification. Join 10,000+ graduates. Enroll now!",
  },

  categoryPage: {
    loading: "Loading training programs in {{cityTitle}}...",
    oops: "Oops!",
    tryAgain: "Try Again",
    notFoundTitle: "404",
    notFoundDesc: "Training category not found",
    goHome: "Go Home",
    liveTrainingAvail: "Live Training Available",
    trainingTitle: "{{categoryName}} Training",
    trainingInCity: "in {{cityTitle}}",
    heroP1: "Top-rated {{categoryName}} training in {{cityTitle}} with 4.8/5 star rating from 1000+ students. Online or onsite, instructor-led live {{categoryName}} courses demonstrate through hands-on practice the fundamentals and advanced concepts of {{categoryNameLower}}.",
    heroP2: "{{categoryName}} training is available as 'online live training' or 'onsite classroom training' in {{cityTitle}}. Online sessions feature interactive learning with live instructors, while onsite training can be conducted at customer premises or our Aim Tutor corporate training centers.",
    heroP3: "Aim Tutor - Your Trusted Local Training Provider",
    statsSpec: "Specializations",
    statsCourses: "Courses",
    statsRating: "Rating",
    statsStudents: "Students",
    statsHandsOn: "Hands-On",
    exploreSubcategoriesTitle: "Explore {{categoryName}} Sub-Categories",
    exploreSubcategoriesDesc: "Choose from our comprehensive {{categoryName}} training programs designed to advance your career in {{cityTitle}}",
    noSubcategories: "No training programs available yet. Check back soon!",
    exploreBtn: "Explore",
    featuredTitle: "Featured {{categoryName}} Courses in {{cityTitle}}",
    featuredDesc: "Start learning with our expert-designed {{categoryName}} courses. All programs include hands-on labs and real-world projects.",
    allLevels: "All Levels",
    freeCourse: "FREE",
    viewCourse: "View Course",
    faqTitle: "Frequently Asked Questions About {{categoryName}} Training",
    faqDesc: "Get answers to common questions about our {{categoryName}} training programs in {{cityTitle}}",
    whyChooseTitle: "Why Choose Our {{categoryName}} Training in {{cityTitle}}?",
    whyChooseDesc: "Aim Tutor provides world-class {{categoryName}} training with proven results and industry recognition",
    expertInstructorsTitle: "Expert Instructors",
    expertInstructorsDesc: "Learn from certified professionals with 10+ years of real-world {{categoryName}} experience",
    handsOnTitle: "100% Hands-On Practice",
    handsOnDesc: "Apply {{categoryName}} concepts immediately with practical labs, projects, and real-world scenarios",
    careerSupportTitle: "Career Support & Certification",
    careerSupportDesc: "Get placement assistance, interview prep, and industry-recognized {{categoryName}} certifications",
    studentRating: "Student Rating",
    jobPlacement: "Job Placement",
    support: "Support",
    whatStudentsSayTitle: "What Our {{categoryName}} Students Say",
    whatStudentsSayDesc: "Join thousands of satisfied learners who advanced their careers with Aim Tutor {{categoryName}} training",
    avgRating: "Average Rating",
    totalReviews: "Total Reviews",
    satisfactionRate: "Satisfaction Rate",
    wouldRecommend: "Would Recommend",
    upcomingTitle: "Upcoming {{categoryName}} Courses in {{cityTitle}}",
    upcomingDesc: "Reserve your spot in our next batch of {{categoryName}} training programs. Limited seats available!",
    readyTitle: "Ready to Master {{categoryName}} in {{cityTitle}}?",
    readyDesc1: "Join AIM's top-rated {{categoryName}} training with 4.8-star rating from 1000+ students",
    readyDesc2: "Expert instructors • Hands-on labs • Job placement support • Industry certifications",
    startJourneyBtn: "Start Your Journey Today",
  },
  trainingPage: {
    loading: "Loading training programs in {{cityTitle}}...",
    noCategoriesTitle: "No Categories Available",
    noCategoriesDesc: "Training categories are temporarily unavailable.",
    gotQuestions: "Got Questions?",
    faqTitle: "Frequently Asked Questions",
    faqQuestions: [
      {
        question: "What training courses are available at Aim Tutor in {{cityTitle}}?",
        answer: "Aim Tutor offers {{totalCourses}}+ technology training courses across {{totalCategories}} categories including Artificial Intelligence, Machine Learning, Cloud Computing, Data Science, Cybersecurity, Web Development, DevOps, and more. All courses feature expert instructors and hands-on learning.",
      },
      {
        question: "Are the training courses available online and offline in {{cityTitle}}?",
        answer: "Yes, we offer flexible learning modes including online live training, offline classroom training, and hybrid programs. Our online sessions are interactive with live instructors, while offline classes are conducted at our state-of-the-art facility in {{cityTitle}}.",
      },
      {
        question: "What is the duration and fee structure for training courses?",
        answer: "Course duration varies from 2-6 months depending on the program complexity. We offer flexible payment options including installments and early bird discounts. Contact our counselors for detailed fee structure and current offers for specific courses.",
      },
      {
        question: "Do you provide placement assistance after course completion?",
        answer: "Absolutely! Aim Tutor has a dedicated placement cell with partnerships with 500+ companies. We provide comprehensive placement support including resume building, interview preparation, mock interviews, and direct job referrals with competitive salary packages.",
      },
      {
        question: "What are the prerequisites for joining technology training courses?",
        answer: "Prerequisites vary by course and level. Beginner courses typically require only basic computer literacy, while advanced programs may need specific technical background. Our counselors help you choose the right program based on your current skills and career goals.",
      },
      {
        question: "Are industry certifications provided after training completion?",
        answer: "Yes, you receive industry-recognized certificates upon successful completion of our training programs. We also help you prepare for additional vendor certifications like AWS, Microsoft Azure, Google Cloud, and other professional certifications.",
      },
      {
        question: "Can I get customized corporate training for my organization?",
        answer: "Yes! We provide tailored corporate training solutions for organizations. Our enterprise training includes customized curriculum, flexible delivery options, progress tracking, and ongoing support to meet your specific business objectives.",
      },
      {
        question: "What makes Aim Tutor different from other training institutes?",
        answer: "Aim Tutor stands out with expert instructors having 10+ years industry experience, small batch sizes, 100% hands-on learning, real-world projects, latest curriculum, comprehensive placement assistance, and {{successRate}} success rate.",
      },
    ],
    expertLedPrograms: "{{count}}+ Expert-Led Programs",
    title: "Technology Training Courses in {{cityTitle}}",
    description: "Master the skills that matter most in today's tech industry. Choose from {{count}} comprehensive categories.",
    searchPlaceholder: "Search for courses, topics, or skills...",
    allCategories: "All Categories ({{count}})",
    results: "{{count}} results",
    noResultsTitle: "No categories found",
    noResultsDesc: "Try adjusting your search query or browse all categories",
    clearSearch: "Clear Search",
    categoryDesc: "Explore {{count}} specialized {{name}} training programs with expert instructors",
    explorePrograms: "Explore Programs",
    cantFindTitle: "Can't Find What You're Looking For?",
    cantFindDesc: "Contact our expert training advisors for personalized course recommendations tailored to your career goals.",
    talkToAdvisor: "Talk to an Advisor",
    requestCustom: "Request Custom Training",
  },
  subcategoryPage: {
    loading: "Loading course details in {{cityTitle}}...",
    notFound: "Subcategory not found",
    liveTrainingAvail: "Live Training Available",
    rating: "({{rating}} rating)",
    trainingTitle: "{{subcategoryName}} Training",
    trainingInCity: "in {{cityTitle}}",
    heroP1: "Top-rated {{subcategoryName}} training in {{cityTitle}} with 4.8/5 star rating.",
    heroP2: "{{subcategoryName}} training is available as \"online live training\" or \"onsite live training\" in {{cityTitle}}.",
    statsCourses: "Courses Available",
    statsRating: "Student Rating",
    statsHandsOn: "Hands-On Labs",
    coursesInCity: "{{subcategoryName}} Courses in {{cityTitle}}",
    searchPlaceholder: "Search inside this subcategory...",
    noImage: "No Image",
    hours: "{{hours}} hours",
    free: "FREE",
    viewCourse: "View Course",
    noCoursesFound: "No courses found for this search.",
    whyChooseTitle: "Why Choose Our {{subcategoryName}} Training in {{cityTitle}}?",
    whyChooseDesc: "Aim Tutor provides world-class {{subcategoryName}} training with proven results and industry recognition.",
    expertInstructorsTitle: "Expert Instructors",
    expertInstructorsDesc: "Learn from certified professionals with 10+ years of real-world {{subcategoryName}} experience",
    handsOnTitle: "100% Hands-On Practice",
    handsOnDesc: "Apply {{subcategoryName}} concepts immediately with practical labs, projects, and real-world scenarios",
    careerSupportTitle: "Career Support & Certification",
    careerSupportDesc: "Get placement assistance, interview prep, and industry-recognized {{subcategoryName}} certifications",
    studentRating: "Student Rating",
    studentsTrained: "Students Trained",
    jobPlacement: "Job Placement",
    support: "Support",
    whatStudentsSayTitle: "What Our {{subcategoryName}} Students Say",
    whatStudentsSayDesc: "Join thousands of satisfied learners who advanced their careers with Aim Tutor {{subcategoryName}} training",
    avgRating: "Average Rating",
    totalReviews: "Total Reviews",
    satisfactionRate: "Satisfaction Rate",
    wouldRecommend: "Would Recommend",
    faqTitle: "Frequently Asked Questions About {{subcategoryName}} Training",
    faqDesc: "Get answers to common questions about our {{subcategoryName}} training programs in {{cityTitle}}",
    faqQuestions: [
      "What is {{subcategoryName}} training?",
      "Is {{subcategoryName}} training available online in {{cityTitle}}?",
      "What are the prerequisites for {{subcategoryName}} training?",
      "What is the duration of {{subcategoryName}} training courses?",
      "Does Aim Tutor provide job placement assistance after {{subcategoryName}} training?",
    ],
    faqAnswer: "Aim Tutor offers practical, job-oriented {{subcategoryName}} training with expert mentorship, labs, and placement guidance.",
    readyTitle: "Ready to Master {{subcategoryName}} in {{cityTitle}}?",
    readyDesc: "Join AIM's top-rated {{subcategoryName}} training with 4.8★ rating from 1000+ professionals.",
    startJourneyBtn: "Start Your Journey Today",
  },
  coursePage: {
    loading: "Loading course…",
    notFound: "Course not found",
    home: "Home",
    training: "Training",
    trainingInCity: "Training in {{cityTitle}}",
    ratings: "ratings",
    hoursTotal: "{{hours}}h total",
    lessons: "lessons",
    maxStudents: "Max {{count}}",
    downloadBrochure: "Download Brochure",
    whatYouWillLearn: "What you'll learn",
    courseIncludes: "This course includes:",
    onDemandVideo: "{{hours}}h {{minutes}}m on-demand video",
    handsOnExercises: "Hands-on exercises",
    certificateOfCompletion: "Certificate of completion",
    fullLifetimeAccess: "Full lifetime access",
    accessOnMobile: "Access on mobile",
    courseContent: "Course content",
    modules: "modules",
    prerequisites: "Prerequisites",
    recommendedPrerequisites: "Recommended Prerequisites",
    completeBeforeStarting: "Complete these courses before starting",
    viewDetails: "View Details",
    description: "Description",
    showMore: "Show more",
    showLess: "Show less",
    whyChooseThisCourse: "Why choose this course?",
    expertInstructorsTitle: "Expert Instructors",
    expertInstructorsDesc: "10+ years experience",
    handsOnLabsTitle: "Hands-On Labs",
    handsOnLabsDesc: "Real-world projects",
    certificationTitle: "Certification",
    certificationDesc: "Industry-recognized",
    studentFeedback: "Student feedback",
    showMoreReviews: "Show more reviews",
    faqTitle: "Frequently Asked Questions",
    courseFee: "Course fee",
    free: "Free",
    enrollNow: "Enroll Now",
    readyToMaster: "Ready to Master {{courseTitle}}?",
    readyToMasterDesc: "Join {{count}}+ students who rated this course {{rating}}★",
    reviews: [
      { user: "Amelia Chen", date: "2 days ago", text: "Absolutely fantastic course! The structure is perfect—each module builds on the last. I went from zero knowledge to building my own applications in 6 weeks." },
      { user: "Ravi Patel", date: "1 week ago", text: "Best course I've taken. Good pace, excellent projects. Already applied these skills in my job and got a promotion!" },
      { user: "Sofia Rodriguez", date: "2 weeks ago", text: "Really comprehensive course. Covers everything from basics to advanced topics. Exceptional value." },
      { user: "James Wilson", date: "3 weeks ago", text: "This course is a game-changer. Clear explanations, practical labs, and real-world applications. Highly recommend!" },
      { user: "Yuki Tanaka", date: "1 month ago", text: "Exactly what I needed to advance my career. The support and community are great bonuses. Worth every penny." },
      { user: "Mohammed Al-Said", date: "1 month ago", text: "Very well structured and comprehensive. Great investment in my career." },
    ],
    faqs: [
      { q: "What are the technical requirements?", a: "A standard laptop or desktop with internet connection. All tools are free and open-source." },
      { q: "Is there a certificate?", a: "Yes, you'll receive a verified certificate of completion for LinkedIn and resume." },
      { q: "How long do I have access?", a: "Lifetime access to all materials, including future updates." },
      { q: "What if I don't have programming experience?", a: "Course is designed for all levels. We start from fundamentals and build up step by step." },
    ]
  },
};

export default en;
