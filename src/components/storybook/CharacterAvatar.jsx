import React from 'react';
import { clsx } from 'clsx';

const CharacterAvatar = ({ 
  type = 'starnamer', 
  size = 'md', 
  mood = 'neutral',
  animated = true,
  className 
}) => {
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  const baseClasses = clsx(
    'relative rounded-full border-2 overflow-hidden transition-all duration-300',
    'hover:scale-110 cursor-pointer',
    animated && 'animate-float-gentle',
    sizes[size],
    className
  );

  const renderStarnamer = () => (
    <div className={clsx(baseClasses, 'bg-gradient-to-br from-slate-700 via-indigo-600 to-slate-800 border-indigo-300')}>
      {/* 斗篷效果 */}
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent" />
      
      {/* 星星圖騰 */}
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2">
        <div className="w-2 h-2 bg-yellow-300 rounded-sm transform rotate-45 animate-twinkle-magic">
          <div className="absolute inset-0 bg-yellow-200 rounded-sm animate-pulse" />
        </div>
      </div>
      
      {/* 眼睛 */}
      <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 flex gap-0.5">
        <div className="w-1 h-1 bg-cyan-200 rounded-full animate-pulse" />
        <div className="w-1 h-1 bg-cyan-200 rounded-full animate-pulse" />
      </div>
      
      {/* 星筆 */}
      <div className="absolute -right-0.5 top-1/2 w-3 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full transform -rotate-45" />
      
      {/* 心情指示器 */}
      {mood === 'happy' && (
        <div className="absolute -top-1 -right-1 text-yellow-400 animate-bounce text-xs">✨</div>
      )}
      {mood === 'thinking' && (
        <div className="absolute -top-1 -right-1 text-blue-400 animate-pulse text-xs">💭</div>
      )}
      {mood === 'encouraging' && (
        <div className="absolute -top-1 -right-1 text-green-400 animate-pulse text-xs">👍</div>
      )}
    </div>
  );

  const renderGlyphox = () => (
    <div className={clsx(baseClasses, 'bg-gradient-to-br from-orange-300 via-purple-400 to-indigo-500 border-purple-300')}>
      {/* 毛皮效果 */}
      <div className="absolute inset-0 bg-gradient-to-t from-orange-400/60 to-transparent" />
      
      {/* 記憶寶石 */}
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
        <div className="w-1.5 h-1.5 bg-cyan-300 rounded-full relative">
          <div className="absolute inset-0 bg-cyan-200 rounded-full animate-ping" />
        </div>
      </div>
      
      {/* 眼睛 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-1">
        <div className="w-1 h-1 bg-emerald-300 rounded-full animate-pulse" />
        <div className="w-1 h-1 bg-emerald-300 rounded-full animate-pulse" />
      </div>
      
      {/* 鼻子 */}
      <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2">
        <div className="w-0.5 h-0.5 bg-pink-300 rounded-full" />
      </div>
      
      {/* 星塵尾巴 */}
      <div className="absolute -right-1 bottom-0 w-2 h-0.5 bg-gradient-to-r from-purple-400 to-transparent rounded-full transform rotate-12" />
      
      {/* 心情指示器 */}
      {mood === 'happy' && (
        <div className="absolute -top-1 -right-1 text-yellow-400 animate-bounce text-xs">🌟</div>
      )}
      {mood === 'curious' && (
        <div className="absolute -top-1 -right-1 text-purple-400 animate-pulse text-xs">❓</div>
      )}
      {mood === 'guiding' && (
        <div className="absolute -top-1 -right-1 text-blue-400 animate-bounce text-xs">👆</div>
      )}
    </div>
  );

  return type === 'starnamer' ? renderStarnamer() : renderGlyphox();
};

export default CharacterAvatar;