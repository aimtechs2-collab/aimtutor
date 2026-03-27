// src/components/ui/Button.jsx

import React from 'react';
import { ArrowRight, Loader } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon,
  iconPosition = 'right',
  loading = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-cyan-600 text-white hover:from-primary-hover hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    secondary: "bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 hover:bg-white/20",
    outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary-light",
    ghost: "bg-transparent text-text-body hover:bg-gray-100"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <Loader className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
        </>
      )}
    </button>
  );
};

export default Button;