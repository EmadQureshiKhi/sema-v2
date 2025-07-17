import React, { forwardRef } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'filled';
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon: Icon,
  iconPosition = 'left',
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  const baseClasses = "w-full px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1";
  
  const variants = {
    default: "border border-kpmg-gray-300 bg-white focus:border-kpmg-blue-500 focus:ring-kpmg-blue-500/20",
    filled: "bg-kpmg-gray-50 border border-transparent focus:bg-white focus:border-kpmg-blue-500 focus:ring-kpmg-blue-500/20"
  };

  const errorClasses = error ? "border-error-500 focus:border-error-500 focus:ring-error-500/20" : "";
  const iconPadding = Icon ? (iconPosition === 'left' ? 'pl-12' : 'pr-12') : '';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-kpmg-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className={`absolute inset-y-0 ${iconPosition === 'left' ? 'left-0' : 'right-0'} flex items-center ${iconPosition === 'left' ? 'pl-4' : 'pr-4'} pointer-events-none`}>
            <Icon className="w-5 h-5 text-kpmg-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          className={`${baseClasses} ${variants[variant]} ${errorClasses} ${iconPadding} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-error-600 animate-fade-in">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;