import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className = ''
}) {
  // Listen for Escape key to close the modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = ''; // Restore background scrolling
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          aria-describedby={description ? "modal-desc" : undefined}
        >
          {/* Backdrop Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            aria-hidden="true"
          />
          
          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full max-w-lg glass-card rounded-[40px] p-8 lg:p-10 shadow-2xl relative z-10 bg-white ${className}`}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="text-left space-y-1">
                {title && (
                  <h3 id="modal-title" className="text-2xl font-black text-slate-900 tracking-tight">
                    {title}
                  </h3>
                )}
                {description && (
                  <p id="modal-desc" className="text-xs text-slate-500 font-medium">
                    {description}
                  </p>
                )}
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="text-left">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
