import React from 'react';

export default function Card({
  children,
  isHoverable = false,
  isPremium = false,
  isNeumorphic = false,
  className = '',
  ...props
}) {
  const baseStyle = isNeumorphic
    ? "rounded-[32px] overflow-hidden relative transition-all duration-300"
    : "glass-card rounded-[32px] overflow-hidden border-slate-100/50 shadow-md relative";
  
  const hoverStyle = isHoverable 
    ? "glass-card-hover cursor-pointer" 
    : "";

  const premiumStyle = isPremium 
    ? "glass-card-premium rounded-[40px] border-white/80 shadow-[0_30px_60px_-15px_rgba(15,23,42,0.12)]" 
    : "";

  const neomorphicStyle = isNeumorphic
    ? "neumorphic-convex border-transparent"
    : "";

  return (
    <div 
      className={`${baseStyle} ${hoverStyle} ${premiumStyle} ${neomorphicStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Sub-component for Card Header
Card.Header = function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`p-6 lg:p-8 border-b border-slate-100 ${className}`} {...props}>
      {children}
    </div>
  );
};

// Sub-component for Card Body
Card.Body = function CardBody({ children, className = '', ...props }) {
  return (
    <div className={`p-6 lg:p-8 ${className}`} {...props}>
      {children}
    </div>
  );
};

// Sub-component for Card Footer
Card.Footer = function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={`p-6 lg:p-8 border-t border-slate-100 ${className}`} {...props}>
      {children}
    </div>
  );
};
