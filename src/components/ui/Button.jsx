import React from 'react';
import { clsx } from 'clsx';

const Button = React.forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,
  className,
  ...props 
}, ref) => {
  const baseClasses = [
    'relative overflow-hidden rounded-2xl font-semibold transition-all duration-300',
    'transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
  ];

  const variants = {
    primary: [
      'bg-gradient-to-br from-amber-500 to-amber-600',
      'text-white hover:from-amber-600 hover:to-amber-700',
      'shadow-amber-200/30 focus:ring-amber-400'
    ],
    secondary: [
      'bg-gradient-to-br from-emerald-400 to-cyan-400',
      'text-white hover:from-emerald-500 hover:to-cyan-500',
      'shadow-emerald-200/50 focus:ring-emerald-400'
    ],
    accent: [
      'bg-gradient-to-br from-orange-400 to-rose-400',
      'text-white hover:from-orange-500 hover:to-rose-500',
      'shadow-orange-200/50 focus:ring-orange-400'
    ],
    soft: [
      'bg-white/90 backdrop-blur-sm text-slate-700',
      'border-2 border-white/50 hover:bg-white',
      'shadow-slate-200/50 focus:ring-slate-400'
    ],
    ghost: [
      'bg-transparent text-slate-300 hover:bg-slate-700/50',
      'border border-slate-600/30 hover:border-slate-500/50 focus:ring-slate-400'
    ]
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const classes = clsx(
    baseClasses,
    variants[variant],
    sizes[size],
    className
  );

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      <div className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
});

Button.displayName = 'Button';

export default Button;