import React, { useState } from 'react';
import CharacterDisplay from './CharacterDisplay';

function LandingPage({ onStartNewJourney, onLoadProgress }) {
  const [dragOver, setDragOver] = useState(false);

  const handleFileImport = (file) => {
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const progressData = JSON.parse(e.target.result);
          onLoadProgress(progressData);
        } catch (error) {
          alert('進度檔案格式錯誤，請檢查檔案。');
        }
      };
      reader.readAsText(file);
    } else {
      alert('請選擇有效的 JSON 進度檔案。');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileImport(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileImport(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
      {/* 魔幻星空背景 */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(60)].map((_, i) => {
          const colors = ['bg-white', 'bg-yellow-200', 'bg-pink-200', 'bg-blue-200'];
          const sizes = ['w-0.5 h-0.5', 'w-1 h-1', 'w-1.5 h-1.5'];
          return (
            <div
              key={i}
              className={`absolute ${colors[Math.floor(Math.random() * colors.length)]} ${sizes[Math.floor(Math.random() * sizes.length)]} rounded-full animate-pulse`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                boxShadow: '0 0 6px currentColor'
              }}
            />
          );
        })}
      </div>

      {/* 背景漸層光暈 */}
      <div className="absolute inset-0 bg-gradient-radial from-indigo-500/10 via-transparent to-transparent" />

      {/* 角色顯示 */}
      <CharacterDisplay 
        type="starnamer" 
        position="top-left" 
        size="large" 
        mood="neutral" 
      />
      <CharacterDisplay 
        type="glyphox" 
        position="bottom-left" 
        size="medium" 
        mood="guiding" 
      />

      {/* 主要內容 */}
      <div className="relative z-10 max-w-2xl mx-auto px-8 text-center fade-in">
        {/* 標題 */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
            🌌 歡迎，星語者
          </h1>
          <p className="text-xl text-indigo-200 opacity-90 font-light leading-relaxed">
            準備好踏上修復星空的旅程了嗎？<br/>
            選擇你的開始方式：
          </p>
        </div>

        {/* 操作選項 */}
        <div className="space-y-6">
          {/* 開始新旅程 */}
          <button
            onClick={onStartNewJourney}
            className="w-full max-w-md mx-auto block px-12 py-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xl font-semibold rounded-2xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/30 group"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl group-hover:animate-pulse">🌟</span>
              <span>開始新的旅程</span>
            </div>
            <p className="text-sm opacity-80 mt-2">從頭開始你的詞彙學習冒險</p>
          </button>

          {/* 讀取進度區域 */}
          <div 
            className={`w-full max-w-md mx-auto p-6 border-2 border-dashed rounded-2xl transition-all duration-300 ${
              dragOver 
                ? 'border-yellow-400 bg-yellow-400/10' 
                : 'border-slate-400 hover:border-slate-300 hover:bg-slate-800/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="text-center">
              <div className="mb-4">
                <span className="text-4xl">📂</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">讀取學習進度</h3>
              <p className="text-sm text-slate-300 mb-4">
                {dragOver ? '放下進度檔案繼續你的學習旅程' : '拖放JSON進度檔案到此處，或點擊選擇檔案'}
              </p>
              
              <label className="inline-block px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg cursor-pointer transition-colors duration-200">
                選擇進度檔案
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
            </div>
          </div>
        </div>

        {/* 提示文字 */}
        <div className="mt-12 text-sm text-slate-400 opacity-70">
          <p className="flex items-center justify-center gap-2 mb-2">
            <span>💡</span>
            你可以隨時在應用內儲存學習進度
          </p>
          <p className="flex items-center justify-center gap-2">
            <span>🎯</span>
            透過答題表現，讓星座連線逐漸變亮
          </p>
        </div>
      </div>

      {/* 版本信息 */}
      <div className="absolute bottom-4 right-4 text-xs text-slate-500">
        GRE-StarNet v1.1 | 星語者計畫
      </div>
    </div>
  );
}

export default LandingPage;