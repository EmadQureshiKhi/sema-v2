import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false
}) => {
  const baseClasses = "rounded-2xl transition-all duration-300";
  
  const variants = {
    default: "bg-white/80 backdrop-blur-sm border border-kpmg-gray-200 shadow-soft",
    elevated: "bg-white shadow-strong border border-kpmg-gray-100",
    outlined: "bg-white border-2 border-kpmg-blue-200",
    glass: "bg-white/60 backdrop-blur-md border border-white/20 shadow-soft"
  };
  
  const paddings = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  };

  const hoverClasses = hover ? "hover:shadow-strong hover:scale-[1.02] hover:-translate-y-1" : "";

  return (
    <div className={`${baseClasses} ${variants[variant]} ${paddings[padding]} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;