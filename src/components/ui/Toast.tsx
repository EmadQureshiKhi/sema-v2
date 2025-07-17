import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, type, title, message, duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const getToastStyles = () => {
    const baseStyles = "flex items-start space-x-3 p-4 rounded-xl shadow-strong backdrop-blur-sm border transition-all duration-300 transform";
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-success-50/90 border-success-200 text-success-800`;
      case 'error':
        return `${baseStyles} bg-error-50/90 border-error-200 text-error-800`;
      case 'warning':
        return `${baseStyles} bg-warning-50/90 border-warning-200 text-warning-800`;
      case 'info':
        return `${baseStyles} bg-kpmg-blue-50/90 border-kpmg-blue-200 text-kpmg-blue-800`;
      default:
        return `${baseStyles} bg-white/90 border-kpmg-gray-200 text-kpmg-gray-800`;
    }
  };

  const getIcon = () => {
    const iconClass = "w-5 h-5 flex-shrink-0 mt-0.5";
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-success-600`} />;
      case 'error':
        return <XCircle className={`${iconClass} text-error-600`} />;
      case 'warning':
        return <AlertCircle className={`${iconClass} text-warning-600`} />;
      case 'info':
        return <Info className={`${iconClass} text-kpmg-blue-600`} />;
      default:
        return <Info className={`${iconClass} text-kpmg-gray-600`} />;
    }
  };

  return (
    <div
      className={`${getToastStyles()} ${
        isVisible && !isLeaving 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
      }`}
    >
      {getIcon()}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{title}</p>
        {message && <p className="text-sm opacity-90 mt-1">{message}</p>}
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-black/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;