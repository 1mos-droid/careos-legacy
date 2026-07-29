import React from 'react';
import { motion } from 'framer-motion';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  leftIcon: LeftIcon = null,
  rightIcon: RightIcon = null,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const baseStyle = "relative inline-flex items-center justify-center font-black uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary/40 rounded-[20px] select-none";
  
  const variants = {
    primary: "bg-brand-primary text-white shadow-[0_20px_40px_-10px_rgba(13,148,136,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(13,148,136,0.5)] border border-transparent",
    secondary: "bg-slate-900 text-white shadow-lg hover:bg-slate-800 border border-transparent",
    outline: "bg-transparent text-slate-800 border-2 border-slate-200 hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5",
    ghost: "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent",
    rose: "bg-rose-500 text-white shadow-[0_20px_40px_-10px_rgba(244,63,94,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(244,63,94,0.5)] border border-transparent",
    neumorphic: "bg-brand-bg text-brand-primary border border-transparent neumorphic-convex hover:bg-brand-primary/5 transition-all",
    glass: "glass-panel text-brand-primary border border-slate-100 hover:bg-brand-primary/5 transition-all"
  };

  const sizes = {
    sm: "px-6 py-3 text-[10px] rounded-[16px]",
    md: "px-9 py-4.5 text-[11px] rounded-[22px]",
    lg: "px-12 py-6 text-xs rounded-[26px]"
  };

  const disabledStyle = (isDisabled || isLoading) ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer";

  return (
    <motion.button
      whileTap={!(isDisabled || isLoading) ? { scale: 0.96 } : {}}
      type={type}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${disabledStyle} ${className}`}
      aria-busy={isLoading}
      aria-disabled={isDisabled || isLoading}
      {...props}
    >
      {/* Loading Spinner */}
      {isLoading && (
        <svg 
          className="animate-spin -ml-1 mr-3 h-4.5 w-4.5 text-current shrink-0" 
          fill="none" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}

      {/* Left Icon */}
      {!isLoading && LeftIcon && <LeftIcon className="h-4.5 w-4.5 -ml-1 mr-2.5 shrink-0" aria-hidden="true" />}

      {/* Button Text */}
      <span className="leading-none">{isLoading ? 'Loading...' : children}</span>

      {/* Right Icon */}
      {!isLoading && RightIcon && <RightIcon className="h-4.5 w-4.5 ml-2.5 -mr-1 shrink-0" aria-hidden="true" />}
    </motion.button>
  );
}
