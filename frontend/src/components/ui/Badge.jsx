import React from 'react';

export default function Badge({
  children,
  variant = 'slate',
  className = '',
  ...props
}) {
  const baseStyle = "inline-flex items-center justify-center px-3.5 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider select-none shrink-0";
  
  const variants = {
    pending: "text-amber-600 bg-amber-50 border-amber-100",
    success: "text-emerald-600 bg-emerald-50 border-emerald-100",
    info: "text-blue-600 bg-blue-50 border-blue-100",
    error: "text-rose-600 bg-rose-50 border-rose-100",
    slate: "text-slate-600 bg-slate-50 border-slate-100"
  };

  return (
    <span 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
