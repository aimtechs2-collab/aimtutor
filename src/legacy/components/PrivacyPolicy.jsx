import React, { useEffect } from 'react';
import {
  Shield,
  Lock,
  Eye,
  Database,
  CreditCard,
  Share2,
  Clock,
  UserCheck,
  Cookie,
  Globe,
  Users,
  Bell,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  FileText,
  AlertCircle,
  CheckCircle2,
  ArrowUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

function PrivacyPolicy() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Table of Contents sections
  const sections = [
    { id: 'introduction', title: '1. Introduction', icon: FileText },
    { id: 'information-collect', title: '2. Information We Collect', icon: Database },
    { id: 'payment-processing', title: '3. Payment Processing with Razorpay', icon: CreditCard },
    { id: 'how-we-use', title: '4. How We Use Your Information', icon: Eye },
    { id: 'data-sharing', title: '5. Data Sharing and Disclosure', icon: Share2 },
    { id: 'data-security', title: '6. Data Security', icon: Lock },
    { id: 'data-retention', title: '7. Data Retention', icon: Clock },
    { id: 'your-rights', title: '8. Your Privacy Rights', icon: UserCheck },
    { id: 'cookies', title: '9. Cookies and Tracking Technologies', icon: Cookie },
    { id: 'third-party', title: '10. Third-Party Links', icon: Globe },
    { id: 'children', title: '11. Children\'s Privacy', icon: Users },
    { id: 'international', title: '12. International Data Transfers', icon: Globe },
    { id: 'changes', title: '13. Changes to This Privacy Policy', icon: Bell },
    { id: 'contact', title: '14. Contact Us', icon: Mail },
  ];

  // Scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 120; // Increased to account for fixed header
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Added pt-20 for header spacing */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden pt-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium">Your Privacy Matters</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Privacy Policy
            </h1>
            
            <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-4">
              Aim Tutor
            </p>
            
            <p className="text-base text-gray-300">
              Last Updated: November 10, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          
          {/* Table of Contents - Sticky Sidebar with Scrollbar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 bg-gray-50 rounded-2xl p-6 border border-gray-200 max-h-[calc(100vh-8rem)] overflow-hidden flex flex-col">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 flex-shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
                Table of Contents
              </h2>
              {/* Scrollable Navigation Container */}
              <nav className="space-y-2 overflow-y-auto overflow-x-hidden flex-1 pr-2 
                scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 
                hover:scrollbar-thumb-gray-500 
                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-gray-100
                [&::-webkit-scrollbar-track]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-gray-400
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:hover:bg-gray-500">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-white hover:text-blue-600 rounded-lg transition-all duration-200 group"
                  >
                    <section.icon className="w-4 h-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                    <span className="truncate">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Privacy Policy Content - Added scroll-mt-24 to each section for proper offset */}
          <main className="lg:col-span-3 prose prose-gray max-w-none">
            {/* Introduction */}
            <section id="introduction" className="mb-12 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                1. Introduction
              </h2>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-6">
                <p className="text-gray-700 leading-relaxed">
                  Welcome to <strong>Aim Tutor</strong> ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services and make payments through our platform integrated with Razorpay payment gateway.
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Please read this privacy policy carefully. By using our services, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section id="information-collect" className="mb-12 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                2. Information We Collect
              </h2>
              
              <h3 className="text-xl font-bold mb-4 text-gray-800">2.1 Personal Information</h3>
              <p className="mb-4 text-gray-700">We may collect the following personal information from you:</p>
              <ul className="space-y-2 mb-8">
                {[
                  'Name and contact information (email address, phone number, billing address)',
                  'Payment information (processed securely through Razorpay)',
                  'Transaction history and purchase details',
                  'Account credentials (username, password)',
                  'Communication preferences'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-bold mb-4 text-gray-800">2.2 Technical Information</h3>
              <ul className="space-y-2">
                {[
                  'IP address and browser type',
                  'Device information and operating system',
                  'Cookies and similar tracking technologies',
                  'Usage data and analytics',
                  'Log files and timestamps'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Payment Processing */}
            <section id="payment-processing" className="mb-12 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                3. Payment Processing with Razorpay
              </h2>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">
                    <strong>Important:</strong> All payment transactions are processed through Razorpay, a PCI-DSS compliant payment gateway. We do not store your complete credit/debit card information on our servers.
                  </p>
                </div>
              </div>

              <p className="mb-4 text-gray-700">When you make a payment through our platform:</p>
              <ul className="space-y-3 mb-6">
                {[
                  'Your payment information is transmitted directly to Razorpay using secure encryption (SSL/TLS)',
                  'Razorpay processes the payment according to their privacy policy and security standards',
                  'We receive only transaction confirmation and limited payment details (last 4 digits of card, transaction ID)'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-gray-700">
                Razorpay's privacy policy can be found at:{' '}
                <a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  https://razorpay.com/privacy/
                </a>
              </p>
            </section>

            {/* How We Use Your Information */}
            <section id="how-we-use" className="mb-12 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                4. How We Use Your Information
              </h2>
              <p className="mb-4 text-gray-700">We use the collected information for the following purposes:</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  'Processing and fulfilling your orders and transactions',
                  'Managing your account and providing customer support',
                  'Sending transaction confirmations, receipts, and notifications',
                  'Improving our services and user experience',
                  'Preventing fraud and ensuring security',
                  'Complying with legal obligations and regulations',
                  'Marketing communications (with your consent)',
                  'Analytics and business intelligence'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                    <ChevronRight className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Data Sharing and Disclosure */}
            <section id="data-sharing" className="mb-12 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                5. Data Sharing and Disclosure
              </h2>
              <p className="mb-4 text-gray-700">We may share your information with:</p>
              <div className="space-y-4 mb-6">
                {[
                  { title: 'Payment Processor', desc: 'Razorpay for processing payments securely' },
                  { title: 'Service Providers', desc: 'Third-party vendors who assist in operating our business' },
                  { title: 'Legal Requirements', desc: 'When required by law, court order, or governmental regulations' },
                  { title: 'Business Transfers', desc: 'In connection with mergers, acquisitions, or asset sales' },
                  { title: 'Consent', desc: 'With your explicit consent for any other purpose' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-semibold text-gray-800">{item.title}:</span>
                      <span className="text-gray-700 ml-2">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                <p className="text-gray-700">
                  We do not sell, rent, or trade your personal information to third parties for marketing purposes.
                </p>
              </div>
            </section>

            {/* Data Security */}
            <section id="data-security" className="mb-12 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                6. Data Security
              </h2>
              <p className="mb-4 text-gray-700">We implement industry-standard security measures to protect your personal information:</p>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[
                  'SSL/TLS encryption for data transmission',
                  'Secure server infrastructure with firewalls',
                  'Regular security audits and vulnerability assessments',
                  'Access controls and authentication mechanisms',
                  'Employee training on data protection and privacy'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-700">
                However, no method of transmission over the internet is 100% secure. While we strive to protect your personal information, we cannot guarantee absolute security.
              </p>
            </section>

            {/* Data Retention */}
            <section id="data-retention" className="mb-12 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                7. Data Retention
              </h2>
              <p className="text-gray-700">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required by law. Transaction records are typically retained for 7 years for accounting and tax purposes.
              </p>
            </section>

            {/* Your Privacy Rights */}
            <section id="your-rights" className="mb-12 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-white" />
                </div>
                8. Your Privacy Rights
              </h2>
              <p className="mb-4 text-gray-700">Depending on your location, you may have the following rights:</p>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[
                  { right: 'Access', desc: 'Request access to your personal data' },
                  { right: 'Correction', desc: 'Request correction of inaccurate or incomplete data' },
                  { right: 'Deletion', desc: 'Request deletion of your personal data' },
                  { right: 'Portability', desc: 'Request a copy of your data in a portable format' },
                  { right: 'Objection', desc: 'Object to processing of your personal data' },
                  { right: 'Withdrawal', desc: 'Withdraw consent at any time (where processing is based on consent)' }
                ].map((item, index) => (
                  <div key={index} className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-1">{item.right}</h4>
                    <p className="text-sm text-gray-700">{item.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-gray-700">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            {/* Cookies and Tracking */}
            <section id="cookies" className="mb-12 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-white" />
                </div>
                9. Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-700">
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie preferences through your browser settings. However, disabling cookies may limit your ability to use certain features of our platform.
              </p>
            </section>

            {/* Third-Party Links */}
            <section id="third-party" className="mb-12 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                10. Third-Party Links
              </h2>
              <p className="text-gray-700">
                Our platform may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
              </p>
            </section>

            {/* Children's Privacy */}
            <section id="children" className="mb-12 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                11. Children's Privacy
              </h2>
              <p className="text-gray-700">
                Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.
              </p>
            </section>

            {/* International Data Transfers */}
            <section id="international" className="mb-12 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                12. International Data Transfers
              </h2>
              <p className="text-gray-700">
                Your information may be transferred to and maintained on servers located outside your country of residence. We ensure appropriate safeguards are in place to protect your information in accordance with this privacy policy.
              </p>
            </section>

            {/* Changes to This Privacy Policy */}
            <section id="changes" className="mb-12 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                13. Changes to This Privacy Policy
              </h2>
              <p className="text-gray-700">
                We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website with a new "Last Updated" date. Your continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact Us */}
            <section id="contact" className="mb-12 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                14. Contact Us
              </h2>
              <p className="mb-6 text-gray-700">
                If you have any questions, concerns, or requests regarding this privacy policy or our data practices, please contact us:
              </p>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Aim Tutor</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">Email:</p>
                      <a href="mailto:admin@aimtutor.in" className="text-blue-600 hover:underline">admin@aimtutor.in</a>
                      <br />
                      <a href="mailto:aimtutor@gmail.com" className="text-blue-600 hover:underline">aimtutor@gmail.com</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">Phone:</p>
                      <a href="tel:+919700187077" className="text-blue-600 hover:underline">+91-9700187077</a>
                      <br />
                      <a href="tel:+916300232040" className="text-blue-600 hover:underline">+91-6300232040</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">Address:</p>
                      <p className="text-gray-700">
                        #50, Kamala Nivas, Sap Street,<br />
                        Gayatri Nagar, Behind Mytrivanam,<br />
                        Ameerpet, Hyderabad - 500038
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transform hover:-translate-y-1 transition-all duration-300 z-50"
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
}

export default PrivacyPolicy;