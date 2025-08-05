import React from 'react';
import { clsx } from 'clsx';

const Card = React.forwardRef(({ 
  children, 
  variant = 'default',
  glowing = false,
  floating = false,
  className,
  ...props 
}, ref) => {
  const baseClasses = [
    'relative rounded-3xl shadow-xl border transition-all duration-300'
  ];

  const variants = {
    default: [
      'bg-white/95 backdrop-blur-sm border-white/50'
    ],
    glass: [
      'glass-effect border-white/20'
    ],
    gradient: [
      'bg-gradient-to-br from-white/95 to-white/80',
      'backdrop-blur-sm border-white/30'
    ]
  };

  const effects = {
    glowing: glowing && [
      'shadow-2xl shadow-indigo-200/50',
      'ring-2 ring-indigo-200/30'
    ],
    floating: floating && 'animate-float-gentle'
  };

  const classes = clsx(
    baseClasses,
    variants[variant],
    effects.glowing,
    effects.floating,
    className
  );

  return (
    <div ref={ref} className={classes} {...props}>
      {glowing && (
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-3xl blur opacity-30 animate-pulse" />
      )}
      {/* Ensure children can expand to fill the card for full-height layouts like the star map */}
      <div className="relative z-10 p-6 h-full">
        {children}
      </div>
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
