import React, { useState } from "react";

export default function HiringPartnersSlider() {
  // Tech Giants & FAANG
  const techGiants = [
    { name: "Google", domain: "google.com", color: "#4285F4" },
    { name: "Microsoft", domain: "microsoft.com", color: "#00A4EF" },
    { name: "Apple", domain: "apple.com", color: "#555555" },
    { name: "Amazon", domain: "amazon.com", color: "#FF9900" },
    { name: "Meta", domain: "meta.com", color: "#0081FB" },
    { name: "Netflix", domain: "netflix.com", color: "#E50914" },
    { name: "Tesla", domain: "tesla.com", color: "#CC0000" },
    { name: "NVIDIA", domain: "nvidia.com", color: "#76B900" },
    { name: "Adobe", domain: "adobe.com", color: "#FF0000" },
  ];

  // Indian IT Companies
  const indianIT = [
    // { name: "TCS", domain: "tcs.com", color: "#0066B3" },
    { name: "Infosys", domain: "infosys.com", color: "#007CC3" },
    { name: "Wipro", domain: "wipro.com", color: "#341C53" },
    // { name: "HCL", domain: "hcltech.com", color: "#0073CF" },
    { name: "Tech Mahindra", domain: "techmahindra.com", color: "#E31837" },
    { name: "Cognizant", domain: "cognizant.com", color: "#1A4CA1" },
    { name: "LTI Mindtree", domain: "ltimindtree.com", color: "#0072CE" },
    { name: "Mphasis", domain: "mphasis.com", color: "#1E3C70" },
  ];

  // Consulting & Services
  const consulting = [
    { name: "Accenture", domain: "accenture.com", color: "#A100FF" },
    { name: "Deloitte", domain: "deloitte.com", color: "#86BC25" },
    { name: "PwC", domain: "pwc.com", color: "#D93F0B" },
    { name: "EY", domain: "ey.com", color: "#FFE600" },
    { name: "KPMG", domain: "kpmg.com", color: "#00338D" },
    { name: "Capgemini", domain: "capgemini.com", color: "#0070AD" },
    { name: "IBM", domain: "ibm.com", color: "#054ADA" },
    // { name: "McKinsey", domain: "mckinsey.com", color: "#0A3D62" },
  ];

  // Emerging Tech & Enterprise
  const emerging = [
    { name: "Salesforce", domain: "salesforce.com", color: "#00A1E0" },
    { name: "Oracle", domain: "oracle.com", color: "#C74634" },
    { name: "SAP", domain: "sap.com", color: "#0FAAFF" },
    { name: "Cisco", domain: "cisco.com", color: "#049FD9" },
    { name: "Intel", domain: "intel.com", color: "#0071C5" },
    { name: "AMD", domain: "amd.com", color: "#ED1C24" },
    { name: "Qualcomm", domain: "qualcomm.com", color: "#3253DC" },
    { name: "VMware", domain: "vmware.com", color: "#607078" },
  ];

  // Logo Card with multiple fallback sources
  const LogoCard = ({ company }) => {
    const [imageError, setImageError] = useState(false);
    const [currentSourceIndex, setCurrentSourceIndex] = useState(0);

    // Multiple logo sources as fallbacks
    const logoSources = [
      // 1. Google Favicon Service (most reliable)
      `https://www.google.com/s2/favicons?domain=${company.domain}&sz=128`,
      // 2. DuckDuckGo Icons
      `https://icons.duckduckgo.com/ip3/${company.domain}.ico`,
      // 3. Favicon.io
      `https://favicon.io/favicon/${company.domain}`,
      // 4. IconHorse
      `https://icon.horse/icon/${company.domain}`,
    ];

    const handleImageError = () => {
      if (currentSourceIndex < logoSources.length - 1) {
        setCurrentSourceIndex(prev => prev + 1);
      } else {
        setImageError(true);
      }
    };

    // Get initials for fallback
    const getInitials = (name) => {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    return (
      <div className="flex-shrink-0">
        <div className="w-28 h-16 sm:w-32 sm:h-18 md:w-40 md:h-20 
                        flex items-center justify-center gap-2
                        bg-white rounded-lg sm:rounded-xl 
                        border border-gray-200
                        shadow-sm cursor-pointer 
                        hover:shadow-md hover:border-gray-300
                        hover:scale-105 sm:hover:scale-110 
                        transition-all duration-300
                        px-3 sm:px-4">
          {!imageError ? (
            <>
              <img
                src={logoSources[currentSourceIndex]}
                alt={`${company.name} logo`}
                className="w-6 h-6 sm:w-8 sm:h-8 object-contain flex-shrink-0"
                onError={handleImageError}
                loading="lazy"
              />
              <span className="text-xs sm:text-sm font-semibold text-gray-700 
                               truncate leading-tight">
                {company.name}
              </span>
            </>
          ) : (
            // Fallback: Colored initial badge + name
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: company.color || '#6366F1' }}
              >
                <span className="text-white text-xs sm:text-sm font-bold">
                  {getInitials(company.name)}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-700 
                               truncate leading-tight">
                {company.name}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Logo Row with infinite scroll animation
  const LogoRow = ({ companies, direction = "left", speed = 35 }) => {
    // Triple the companies for seamless loop
    const tripled = [...companies, ...companies, ...companies];

    return (
      <div className="relative overflow-hidden py-2 sm:py-3">
        <div
          className={`flex gap-4 sm:gap-6 md:gap-8 ${direction === "left" ? "animate-scroll-left" : "animate-scroll-right"
            }`}
          style={{
            animationDuration: `${speed}s`,
            width: "max-content"
          }}
        >
          {tripled.map((company, index) => (
            <LogoCard key={`${company.domain}-${index}`} company={company} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="relative w-full bg-gradient-to-b from-gray-50 via-white to-gray-50 
                        py-12 sm:py-16 md:py-20 overflow-hidden">

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-1/4 
                        w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 
                        bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 
                        w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 
                        bg-cyan-500 rounded-full blur-3xl" />
      </div>

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 
                      mb-8 sm:mb-10 md:mb-14 text-center relative z-10">
        <div className="inline-flex items-center gap-2 
                        bg-blue-50 border border-blue-100 
                        px-3 py-1.5 sm:px-4 sm:py-2 
                        rounded-full mb-4 sm:mb-6">
          <span className="text-xs sm:text-sm font-medium text-blue-600 tracking-wide">
            🤝 Trusted Partnerships
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
                       font-light mb-3 sm:mb-4 text-gray-900 tracking-tight">
          Our{" "}
          <span className="font-semibold bg-clip-text text-transparent 
                           bg-gradient-to-r from-blue-500 to-cyan-500">
            Hiring Partners
          </span>
        </h2>

        <p className="text-sm sm:text-base md:text-lg 
                      text-gray-600 font-light tracking-wide 
                      max-w-2xl mx-auto px-4 sm:px-0">
          Alumni from our programs work at Fortune 500 companies worldwide
        </p>
      </div>

      {/* Animation Styles */}
      <style>
        {`
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }
          
          @keyframes scroll-right {
            0% { transform: translateX(-33.333%); }
            100% { transform: translateX(0); }
          }
          
          .animate-scroll-left {
            animation: scroll-left linear infinite;
          }
          
          .animate-scroll-right {
            animation: scroll-right linear infinite;
          }
          
          /* Pause on hover for desktop */
          @media (min-width: 768px) {
            .animate-scroll-left:hover,
            .animate-scroll-right:hover {
              animation-play-state: paused;
            }
          }
          
          /* Reduce motion for accessibility */
          @media (prefers-reduced-motion: reduce) {
            .animate-scroll-left,
            .animate-scroll-right {
              animation: none;
            }
          }
        `}
      </style>

      {/* Logo Rows */}
      <div className="relative space-y-2 sm:space-y-3 md:space-y-4">
        <LogoRow companies={techGiants} direction="left" speed={45} />
        <LogoRow companies={indianIT} direction="right" speed={50} />
        <LogoRow companies={consulting} direction="left" speed={48} />
        <LogoRow companies={emerging} direction="right" speed={52} />
      </div>

      {/* Fade Overlays */}
      <div className="absolute inset-y-0 left-0 
                      w-16 sm:w-24 md:w-32 
                      bg-gradient-to-r from-gray-50 via-white/80 to-transparent 
                      pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 
                      w-16 sm:w-24 md:w-32 
                      bg-gradient-to-l from-gray-50 via-white/80 to-transparent 
                      pointer-events-none z-10" />
    </section>
  );
}