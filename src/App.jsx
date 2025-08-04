import React, { useState, useEffect } from 'react';
import StarMap from './components/StarMap.jsx';
import RestoreMission from './components/RestoreMission.jsx';
import StarObservatory from './components/StarObservatory.jsx';
import StarNotebook from './components/StarNotebook.jsx';
import useStarStore from './store/useStarStore';

function App() {
  const [activeTab, setActiveTab] = useState('starmap');
  const { currentMission } = useStarStore();

  // 當有任務開始時，自動切換到修復任務頁面
  useEffect(() => {
    if (currentMission && !currentMission.completed) {
      setActiveTab('mission');
    }
  }, [currentMission]);

  const tabs = [
    { id: 'starmap', name: '🌌 星圖', component: StarMap },
    { id: 'mission', name: '🧠 修復任務', component: RestoreMission },
    { id: 'notebook', name: '📖 星語冊', component: StarNotebook },
    { id: 'observatory', name: '🔭 觀測站', component: StarObservatory }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || StarMap;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      {/* 魔幻背景粒子效果 */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 6}s`
            }}
          />
        ))}
      </div>
      
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900/90 via-indigo-900/90 to-slate-900/90 backdrop-blur-md text-white p-6 border-b border-indigo-500/30">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
            🌌 GRE-StarNet 星語者計畫
          </h1>
          <p className="text-lg opacity-90 font-light tracking-wide">
            ✨ Restore the Stars — 喚回記憶的星辰 ✨
          </p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-gradient-to-r from-slate-800/80 via-indigo-800/80 to-slate-800/80 backdrop-blur-md sticky top-0 z-10 border-b border-indigo-400/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex space-x-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-4 font-medium transition-all duration-300 rounded-t-xl relative overflow-hidden group ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-indigo-200 hover:text-white hover:bg-gradient-to-r hover:from-indigo-600/50 hover:to-purple-600/50'
                }`}
              >
                <span className="relative z-10 fade-in">{tab.name}</span>
                {activeTab === tab.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4">
        <div className="mb-4">
          <ActiveComponent />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black bg-opacity-50 text-white text-center py-4 mt-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm">
            ✨ 每當你成功辨認一組星辰（等價詞），它們就會再次閃耀，連線重組星座
          </p>
          <p className="text-xs opacity-60 mt-1">
            你，是最後一位「星語者」，唯一能憑記憶重繪星圖的人
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
