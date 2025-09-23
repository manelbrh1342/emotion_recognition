import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';

const Toast = ({ message, type = 'error', isVisible, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="w-5 h-5" />;
      case 'info':
        return <FiInfo className="w-5 h-5" />;
      case 'error':
      default:
        return <FiAlertCircle className="w-5 h-5" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'rgba(16, 185, 129, 0.1)',
          border: 'rgba(16, 185, 129, 0.3)',
          text: 'text-emerald-400',
          icon: 'text-emerald-400',
        };
      case 'info':
        return {
          bg: 'rgba(59, 130, 246, 0.1)',
          border: 'rgba(59, 130, 246, 0.3)',
          text: 'text-blue-400',
          icon: 'text-blue-400',
        };
      case 'error':
      default:
        return {
          bg: 'rgba(239, 68, 68, 0.1)',
          border: 'rgba(239, 68, 68, 0.3)',
          text: 'text-red-400',
          icon: 'text-red-400',
        };
    }
  };

  const colors = getColors();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.9 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.4 
          }}
          className="fixed top-4 left-0 right-0 z-[9999] w-full max-w-xs sm:max-w-md px-2 mx-auto"
          style={{
            background: colors.bg,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="p-4 flex items-start gap-3">
            <div className={`${colors.icon} flex-shrink-0 mt-0.5`}>
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`${colors.text} text-sm font-medium leading-relaxed`}>
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 ml-2 p-1.5 rounded-lg transition-all duration-200"
              style={{
                backgroundColor: colors.border,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = colors.border.replace('0.3', '0.5');
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = colors.border;
              }}
              aria-label="Close notification"
            >
              <FiX className={`w-4 h-4 ${colors.text}`} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Toast notification hook
export const useToast = () => {
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'error'
  });

  const showToast = (message, type = 'error', duration = 5000) => {
    setToast({
      isVisible: true,
      message,
      type,
      duration
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const ToastComponent = () => (
    <Toast
      message={toast.message}
      type={toast.type}
      isVisible={toast.isVisible}
      onClose={hideToast}
      duration={toast.duration}
    />
  );

  return {
    showToast,
    hideToast,
    ToastComponent
  };
};

// Demo component
const ToastDemo = () => {
  const { showToast, ToastComponent } = useToast();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white mb-8">Toast Notification Demo</h1>
        
        <div className="space-y-3">
          <button
            onClick={() => showToast("Microphone access denied or not available", "error")}
            className="block w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Show Error Toast
          </button>
          
          <button
            onClick={() => showToast("Audio file must be 10 seconds or shorter. Your file is 15.3 seconds.", "error")}
            className="block w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Show Duration Error
          </button>
          
          <button
            onClick={() => showToast("Please select an audio file", "error")}
            className="block w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Show File Type Error
          </button>
          
          <button
            onClick={() => showToast("Audio processed successfully!", "success")}
            className="block w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Show Success Toast
          </button>
          
          <button
            onClick={() => showToast("Processing your audio file...", "info", 3000)}
            className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Show Info Toast
          </button>
        </div>
      </div>
      
      <ToastComponent />
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string,
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number,
};

export default ToastDemo;