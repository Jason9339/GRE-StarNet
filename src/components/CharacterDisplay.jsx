import React from 'react';

function CharacterDisplay({ type = 'starnamer', position = 'bottom-left', size = 'medium', mood = 'neutral' }) {
  const getSizeClasses = () => {
    switch (size) {
      case 'small': return 'w-16 h-16';
      case 'medium': return 'w-24 h-24';
      case 'large': return 'w-32 h-32';
      default: return 'w-24 h-24';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left': return 'bottom-4 left-4';
      case 'bottom-right': return 'bottom-4 right-4';
      case 'top-left': return 'top-4 left-4';
      case 'top-right': return 'top-4 right-4';
      case 'center': return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default: return 'bottom-4 left-4';
    }
  };

  const renderStarnamer = () => (
    <div className={`absolute ${getPositionClasses()} z-20 fade-in`}>
      <div className="relative group">
        {/* 星語者示意圖 - 深藍斗篷人物 */}
        <div className={`${getSizeClasses()} rounded-full bg-gradient-to-br from-slate-700 via-indigo-600 to-slate-800 border-2 border-indigo-300 relative overflow-hidden transition-all duration-300 hover:scale-110`}>
          {/* 斗篷效果 */}
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent rounded-full" />
          
          {/* 星星圖騰 */}
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2">
            <div className="w-3 h-3 bg-yellow-300 star-twinkle rounded-sm transform rotate-45 relative">
              <div className="absolute inset-0 bg-yellow-200 rounded-sm animate-pulse" />
            </div>
          </div>
          
          {/* 眼睛 */}
          <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 flex gap-1">
            <div className="w-1 h-1 bg-cyan-200 rounded-full animate-pulse" />
            <div className="w-1 h-1 bg-cyan-200 rounded-full animate-pulse" />
          </div>
          
          {/* 星筆 */}
          <div className="absolute -right-1 top-1/2 w-4 h-1 bg-gradient-to-r from-silver-400 to-yellow-300 rounded-full transform -rotate-45 star-bright" />
        </div>
        
        {/* 名稱標籤 */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          星語者
        </div>
        
        {/* 心情指示器 */}
        {mood === 'happy' && (
          <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce">✨</div>
        )}
        {mood === 'thinking' && (
          <div className="absolute -top-2 -right-2 text-blue-400 animate-pulse">💭</div>
        )}
        {mood === 'encouraging' && (
          <div className="absolute -top-2 -right-2 text-green-400 animate-pulse">👍</div>
        )}
      </div>
    </div>
  );

  const renderGlyphox = () => (
    <div className={`absolute ${getPositionClasses()} z-20 fade-in`}>
      <div className="relative group">
        {/* 語星獸示意圖 - 狐狸 + 星光圖案 */}
        <div className={`${getSizeClasses()} rounded-full bg-gradient-to-br from-orange-300 via-purple-400 to-indigo-500 border-2 border-purple-300 relative overflow-hidden transition-all duration-300 hover:scale-110 star-twinkle`}>
          {/* 毛皮效果 */}
          <div className="absolute inset-0 bg-gradient-to-t from-orange-400/60 to-transparent rounded-full" />
          
          {/* 記憶寶石（額頭） */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
            <div className="w-2 h-2 bg-cyan-300 rounded-full star-bright relative">
              <div className="absolute inset-0 bg-cyan-200 rounded-full animate-ping" />
            </div>
          </div>
          
          {/* 狐狸眼睛 */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
            <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
          </div>
          
          {/* 鼻子 */}
          <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2">
            <div className="w-1 h-1 bg-pink-300 rounded-full" />
          </div>
          
          {/* 星塵尾巴 */}
          <div className="absolute -right-2 bottom-1 w-3 h-1 bg-gradient-to-r from-purple-400 to-transparent rounded-full star-bright transform rotate-12" />
        </div>
        
        {/* 名稱標籤 */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          語星獸
        </div>
        
        {/* 心情指示器 */}
        {mood === 'happy' && (
          <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce">🌟</div>
        )}
        {mood === 'curious' && (
          <div className="absolute -top-2 -right-2 text-purple-400 animate-pulse">❓</div>
        )}
        {mood === 'guiding' && (
          <div className="absolute -top-2 -right-2 text-blue-400 animate-bounce">👆</div>
        )}
      </div>
    </div>
  );

  return type === 'starnamer' ? renderStarnamer() : renderGlyphox();
}

export default CharacterDisplay;