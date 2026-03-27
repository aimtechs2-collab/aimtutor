// src/components/ui/Card.jsx

import React from 'react';

const Card = ({ 
  children, 
  variant = 'default',
  padding = 'md',
  hover = true,
  className = '' 
}) => {
  const baseStyles = "bg-white rounded-2xl border border-border-color transition-all duration-300";
  
  const variants = {
    default: "shadow-md",
    elevated: "shadow-lg",
    flat: "shadow-none"
  };
  
  const paddings = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    none: "p-0"
  };
  
  const hoverStyles = hover ? "hover:shadow-xl hover:-translate-y-2 cursor-pointer" : "";
  
  return (
    <div className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};

export default Card;