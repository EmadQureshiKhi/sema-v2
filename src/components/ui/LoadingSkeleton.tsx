import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  variant?: 'card' | 'table' | 'chart' | 'text';
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  className = '', 
  lines = 3, 
  variant = 'text' 
}) => {
  const baseClasses = "animate-pulse bg-gradient-to-r from-kpmg-gray-200 via-kpmg-gray-100 to-kpmg-gray-200 bg-[length:200%_100%] animate-shimmer";

  if (variant === 'card') {
    return (
      <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-kpmg-gray-200 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl ${baseClasses}`}></div>
            <div className="flex-1 space-y-2">
              <div className={`h-4 rounded ${baseClasses} w-3/4`}></div>
              <div className={`h-3 rounded ${baseClasses} w-1/2`}></div>
            </div>
          </div>
          <div className="space-y-3">
            {Array.from({ length: lines }).map((_, i) => (
              <div key={i} className={`h-3 rounded ${baseClasses}`} style={{ width: `${Math.random() * 40 + 60}%` }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex space-x-4">
            <div className={`h-4 rounded ${baseClasses} w-1/4`}></div>
            <div className={`h-4 rounded ${baseClasses} w-1/6`}></div>
            <div className={`h-4 rounded ${baseClasses} w-1/4`}></div>
            <div className={`h-4 rounded ${baseClasses} w-1/6`}></div>
            <div className={`h-4 rounded ${baseClasses} w-1/6`}></div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className={`${className}`}>
        <div className="animate-pulse">
          <div className={`h-64 rounded-xl ${baseClasses} mb-4`}></div>
          <div className="flex justify-between">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`h-4 rounded ${baseClasses} w-16`}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`h-4 rounded ${baseClasses}`} style={{ width: `${Math.random() * 40 + 60}%` }}></div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;