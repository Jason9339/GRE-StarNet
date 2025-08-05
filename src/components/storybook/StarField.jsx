import React, { useMemo } from 'react';

const StarField = ({ count = 30, className = '' }) => {
  const stars = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 3,
      size: Math.random() > 0.7 ? 'w-1.5 h-1.5' : 'w-1 h-1',
      color: [
        'bg-yellow-200', 
        'bg-pink-200', 
        'bg-blue-200', 
        'bg-purple-200'
      ][Math.floor(Math.random() * 4)]
    })),
    [count]
  );

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {stars.map(star => (
        <div
          key={star.id}
          className={`${star.size} ${star.color} rounded-full absolute animate-twinkle-magic`}
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            boxShadow: '0 0 10px currentColor'
          }}
        />
      ))}
    </div>
  );
};

export default StarField;