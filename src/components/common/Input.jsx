import React, { forwardRef } from 'react';
import clsx from 'clsx';

const Input = forwardRef(
  (
    {
      label,
      type = 'text',
      error,
      variant = 'dark',
      className,
      icon: Icon,
      required,
      id,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'w-full border rounded-lg py-2.5 px-3 text-sm focus:outline-none transition-all duration-200';

    const variants = {
      dark: 'bg-slate-900/60 text-dark-text placeholder:text-slate-500 border-dark-border focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo',
      light: 'bg-white text-slate-900 placeholder:text-slate-400 border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600',
    };

    const labelStyles = {
      dark: 'text-dark-muted',
      light: 'text-slate-600',
    };

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={id} className={clsx("block text-xs font-bold uppercase tracking-wider", labelStyles[variant])}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className={clsx(
              "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
              variant === 'dark' ? 'text-dark-muted' : 'text-slate-400'
            )}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          <input
            id={id}
            ref={ref}
            type={type}
            className={clsx(
              baseStyles,
              variants[variant],
              Icon ? 'pl-10' : 'pl-3',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-500 font-semibold animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
