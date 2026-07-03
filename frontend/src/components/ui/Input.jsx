import React, { useId } from 'react';

export default function Input({
  label,
  error,
  description,
  type = 'text',
  leftIcon: LeftIcon = null,
  rightIcon: RightIcon = null,
  className = '',
  required = false,
  ...props
}) {
  const generatedId = useId();
  const inputId = props.id || generatedId;
  const errorId = `${inputId}-error`;
  const descId = `${inputId}-desc`;

  return (
    <div className="space-y-1.5 w-full text-left">
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId} 
          className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative rounded-[20px] transition-all">
        {/* Left Icon */}
        {LeftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 shrink-0 pointer-events-none z-10">
            <LeftIcon className="h-4.5 w-4.5" aria-hidden="true" />
          </div>
        )}

        {/* Text Input */}
        <input
          id={inputId}
          type={type}
          required={required}
          className={`
            input-field text-sm transition-all duration-300 w-full rounded-[20px] py-3.5 px-5
            ${LeftIcon ? 'pl-12' : ''} 
            ${RightIcon ? 'pr-12' : ''}
            ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'focus:border-brand-primary focus:ring-brand-primary/20'} 
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={
            [
              error ? errorId : null,
              description ? descId : null
            ].filter(Boolean).join(' ') || undefined
          }
          {...props}
        />

        {/* Right Icon */}
        {RightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 shrink-0 pointer-events-none z-10">
            <RightIcon className="h-4.5 w-4.5" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Description caption */}
      {description && !error && (
        <p 
          id={descId} 
          className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1"
        >
          {description}
        </p>
      )}

      {/* Error statement */}
      {error && (
        <p 
          id={errorId} 
          className="text-xs font-semibold text-rose-500 ml-1 mt-1 flex items-center gap-1.5"
          role="alert"
        >
          <span className="h-1.5 w-1.5 bg-rose-500 rounded-full shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
