import React from 'react';
import { clsx } from 'clsx';

const Progress = React.forwardRef(({ 
  value = 0,
  max = 100,
  size = 'md',
  variant = 'primary',
  animated = false,
  showValue = false,
  className,
  ...props 
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const variants = {
    primary: 'from-indigo-400 via-purple-400 to-pink-400',
    secondary: 'from-emerald-400 to-cyan-400',
    accent: 'from-orange-400 to-rose-400',
    star: 'from-yellow-400 via-amber-400 to-orange-400'
  };

  return (
    <div ref={ref} className={clsx('w-full', className)} {...props}>
      {showValue && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-700">進度</span>
          <span className="text-sm font-medium text-slate-500">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={clsx(
        'w-full bg-slate-200/50 rounded-full overflow-hidden',
        sizes[size]
      )}>
        <div
          className={clsx(
            'h-full bg-gradient-to-r transition-all duration-500 ease-out rounded-full',
            variants[variant],
            animated && 'animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
        >
          {animated && (
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          )}
        </div>
      </div>
    </div>
  );
});

Progress.displayName = 'Progress';

export default Progress;