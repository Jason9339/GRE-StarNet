import React, { useState, useEffect } from 'react';
import CharacterDisplay from './CharacterDisplay';

function StoryIntro({ onComplete }) {
  const [currentScene, setCurrentScene] = useState(0);
  const [showText, setShowText] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const scenes = [
    {
      id: 'cover',
      title: '🌌 星語者：Restore the Stars',
      subtitle: '喚回記憶的星辰',
      background: 'from-slate-900 via-indigo-900 to-purple-900',
      showCharacters: false,
      text: '',
      duration: 3000
    },
    {
      id: 'scene1',
      title: '失落的星空',
      background: 'from-indigo-900 via-purple-900 to-slate-900',
      showCharacters: false,
      text: '很久以前，天空中閃耀著上百顆記憶之星，它們彼此連結成智慧的星座。',
      duration: 4000
    },
    {
      id: 'scene2',
      title: '語言風暴',
      background: 'from-red-900 via-purple-900 to-slate-900',
      showCharacters: false,
      text: '然而，語言風暴摧毀了一切。星星黯淡、星座破碎。',
      duration: 4000
    },
    {
      id: 'scene3',
      title: '最後的星語者',
      background: 'from-slate-900 via-indigo-900 to-slate-900',
      showCharacters: true,
      text: '你，是最後的星語者。唯一能憑記憶重繪星圖的人。',
      duration: 4000
    },
    {
      id: 'scene4',
      title: '修復之路',
      background: 'from-indigo-900 via-blue-900 to-cyan-900',
      showCharacters: true,
      text: '每當你成功辨認一組星辰，它們就會再次閃耀，連線重組星座。',
      duration: 4000
    },
    {
      id: 'scene5',
      title: '開始旅程',
      background: 'from-blue-900 via-indigo-900 to-purple-900',
      showCharacters: true,
      text: '現在，是時候開始你的旅程。一顆、一組、一網，喚醒整片沉睡的星空。',
      duration: 4000
    }
  ];

  const currentSceneData = scenes[currentScene];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentScene]);

  useEffect(() => {
    if (currentScene < scenes.length - 1) {
      const timer = setTimeout(() => {
        setShowText(false);
        setTimeout(() => {
          setCurrentScene(prev => prev + 1);
        }, 500);
      }, currentSceneData.duration);

      return () => clearTimeout(timer);
    } else {
      // 最後一幕，自動跳到landing page
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onComplete, 500);
      }, currentSceneData.duration);

      return () => clearTimeout(timer);
    }
  }, [currentScene, currentSceneData.duration, onComplete]);

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onComplete, 500);
  };


  const renderStarField = (count = 30) => (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
            opacity: 0.3 + Math.random() * 0.7
          }}
        />
      ))}
    </div>
  );

  const renderStormEffect = () => (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute w-32 h-1 bg-gradient-to-r from-transparent via-red-400 to-transparent animate-ping"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      ))}
    </div>
  );

  const renderBrokenStars = () => (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-gray-400 rounded-full opacity-30 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className={`absolute inset-0 bg-gradient-to-br ${currentSceneData.background} transition-all duration-1000`}>
        {/* 背景效果 */}
        {currentSceneData.id === 'cover' && renderStarField(50)}
        {currentSceneData.id === 'scene1' && renderStarField(40)}
        {currentSceneData.id === 'scene2' && renderStormEffect()}
        {currentSceneData.id === 'scene3' && renderBrokenStars()}
        {currentSceneData.id === 'scene4' && renderStarField(20)}
        {currentSceneData.id === 'scene5' && renderStarField(35)}

        {/* 角色顯示 */}
        {currentSceneData.showCharacters && (
          <>
            <CharacterDisplay 
              type="starnamer" 
              position="center" 
              size="large" 
              mood={currentSceneData.id === 'scene4' ? 'encouraging' : 'neutral'} 
            />
            <CharacterDisplay 
              type="glyphox" 
              position="bottom-right" 
              size="medium" 
              mood={currentSceneData.id === 'scene5' ? 'guiding' : 'curious'} 
            />
          </>
        )}

        {/* 內容區域 */}
        <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
          {/* 標題 */}
          {currentSceneData.id === 'cover' && (
            <div className="fade-in">
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent typewriter">
                {currentSceneData.title}
              </h1>
              <p className="text-2xl text-indigo-200 opacity-90 font-light">
                {currentSceneData.subtitle}
              </p>
            </div>
          )}

          {/* 故事文字 */}
          {currentSceneData.text && (
            <div className={`mt-8 transition-all duration-1000 ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="text-xl md:text-2xl text-white leading-relaxed font-light tracking-wide">
                {currentSceneData.text}
              </p>
            </div>
          )}

        </div>

        {/* 跳過按鈕 */}
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 px-4 py-2 text-white/70 hover:text-white text-sm transition-colors duration-200"
        >
          跳過故事 →
        </button>

        {/* 進度指示器 */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {scenes.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentScene ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default StoryIntro;