// src/components/ui/SectionHeader.jsx

import React from 'react';

const SectionHeader = ({ 
  badge, 
  badgeIcon: BadgeIcon,
  title, 
  highlight, 
  description, 
  centered = true 
}) => {
  return (
    <div className={`${centered ? 'text-center' : ''} mb-16`}>
      {/* Badge */}
      {badge && (
        <div className={`inline-flex items-center gap-2 bg-gradient-to-r from-primary to-cyan-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 ${centered ? '' : 'mb-4'}`}>
          {BadgeIcon && <BadgeIcon className="w-4 h-4" />}
          <span>{badge}</span>
        </div>
      )}
      
      {/* Title */}
      <h2 className="text-4xl md:text-5xl font-bold text-text-dark mb-4">
        {title}
        {highlight && (
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-600 mt-2">
            {highlight}
          </span>
        )}
      </h2>
      
      {/* Description */}
      {description && (
        <p className="text-xl text-text-body max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;