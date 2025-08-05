import React from 'react';
import { clsx } from 'clsx';

const Badge = React.forwardRef(({ 
  children,
  variant = 'default',
  size = 'md',
  glowing = false,
  className,
  ...props 
}, ref) => {
  const baseClasses = [
    'inline-flex items-center justify-center font-medium rounded-full',
    'transition-all duration-200 whitespace-nowrap'
  ];

  const variants = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    primary: 'bg-gradient-to-r from-indigo-400 to-purple-400 text-white shadow-md',
    secondary: 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-white shadow-md',
    accent: 'bg-gradient-to-r from-orange-400 to-rose-400 text-white shadow-md',
    star: 'bg-gradient-to-r from-yellow-400 to-amber-400 text-amber-900 shadow-md shadow-yellow-200/50',
    success: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border border-amber-200',
    error: 'bg-rose-100 text-rose-700 border border-rose-200',
    glass: 'glass-effect text-slate-700 border-white/30'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const glowEffect = glowing && variant === 'star' && 'animate-pulse shadow-star';

  const classes = clsx(
    baseClasses,
    variants[variant],
    sizes[size],
    glowEffect,
    className
  );

  return (
    <span ref={ref} className={classes} {...props}>
      {variant === 'star' && (
        <span className="mr-1 text-xs">⭐</span>
      )}
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;