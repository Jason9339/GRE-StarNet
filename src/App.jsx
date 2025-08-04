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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black bg-opacity-50 text-white p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            🌌 GRE-StarNet 星語者計畫
          </h1>
          <p className="text-sm opacity-80">
            Restore the Stars — 喚回記憶的星辰
          </p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-black bg-opacity-30 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-black rounded-t-lg'
                    : 'text-white hover:bg-white hover:bg-opacity-20 rounded-t-lg'
                }`}
              >
                {tab.name}
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
