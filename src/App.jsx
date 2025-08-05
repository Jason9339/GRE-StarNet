import React, { useState, useEffect } from 'react';
import '@fontsource/inter';
import '@fontsource/fredoka-one';
import { Button, Card } from './components/ui';
import StarField from './components/storybook/StarField';
import { useReducedMotion } from './hooks/useReducedMotion';
import { Toaster } from 'react-hot-toast';
import StarMap from './components/StarMap.jsx';
import RestoreMission from './components/RestoreMission.jsx';
import StarObservatory from './components/StarObservatory.jsx';
import StarNotebook from './components/StarNotebook.jsx';
import StoryIntro from './components/StoryIntro.jsx';
import LandingPage from './components/LandingPage.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';
import useStarStore from './store/useStarStore';

function App() {
  const [activeTab, setActiveTab] = useState('starmap');
  const [showStoryIntro, setShowStoryIntro] = useState(true);
  const [showLandingPage, setShowLandingPage] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);
  const { currentMission, actions } = useStarStore();
  const reducedMotion = useReducedMotion();

  // 當有任務開始時，自動切換到修復任務頁面
  useEffect(() => {
    if (currentMission && !currentMission.completed && isAppReady) {
      setActiveTab('mission');
    }
  }, [currentMission, isAppReady]);

  // 處理故事介紹完成
  const handleStoryComplete = () => {
    setShowStoryIntro(false);
    setShowLandingPage(true);
  };

  // 處理開始新旅程
  const handleStartNewJourney = () => {
    // 重置所有進度
    actions.resetProgress();
    setShowLandingPage(false);
    setIsAppReady(true);
  };

  // 處理讀取進度
  const handleLoadProgress = (progressData) => {
    try {
      if (actions.importProgress(progressData)) {
        setShowLandingPage(false);
        setIsAppReady(true);
        // 可以顯示成功訊息
      } else {
        alert('進度讀取失敗，請檢查檔案格式。');
      }
    } catch (error) {
      alert('進度讀取失敗，請檢查檔案格式。');
    }
  };

  // 處理重播故事
  const handleReplayStory = () => {
    setIsAppReady(false);
    setShowLandingPage(false);
    setShowStoryIntro(true);
  };

  const tabs = [
    { id: 'starmap', name: '🌌 星圖', component: StarMap },
    { id: 'mission', name: '🧠 修復任務', component: RestoreMission },
    { id: 'notebook', name: '📖 星語冊', component: StarNotebook },
    { id: 'observatory', name: '🔭 觀測站', component: StarObservatory }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || StarMap;

  return (
    <div className="min-h-screen bg-gradient-to-br from-story-night via-story-twilight to-story-night relative overflow-hidden">
      {/* 開場故事動畫 */}
      {showStoryIntro && (
        <StoryIntro onComplete={handleStoryComplete} />
      )}

      {/* Landing Page */}
      {showLandingPage && (
        <LandingPage 
          onStartNewJourney={handleStartNewJourney}
          onLoadProgress={handleLoadProgress}
        />
      )}
      
      {/* 魔幻背景星空效果 */}
      {!reducedMotion && <StarField count={25} />}
      
      {/* 主應用界面 - 側邊欄布局 */}
      {isAppReady && (
        <div className="flex h-screen relative z-10">
          {/* 側邊欄 */}
          <aside className="w-80 bg-slate-800/95 backdrop-blur-sm border-r border-slate-600/30 flex flex-col">
            {/* 標題區域 */}
            <div className="p-6 border-b border-slate-600/30">
              <div className="animate-card-entrance">
                <h1 className="text-2xl font-storybook mb-2 text-gradient">
                  🌌 GRE-StarNet
                </h1>
                <h2 className="text-lg font-medium text-slate-100 mb-1">
                  星語者計畫
                </h2>
                <p className="text-sm text-slate-300 font-light">
                  ✨ Restore the Stars
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  喚回記憶的星辰
                </p>
              </div>
            </div>

            {/* 導航選單 */}
            <nav className="flex-1 p-6">
              <div className="space-y-3">
                {tabs.map((tab, index) => (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    variant={activeTab === tab.id ? 'soft' : 'ghost'}
                    size="md"
                    className="w-full justify-start text-left transition-all duration-500 py-3"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {tab.name}
                  </Button>
                ))}
              </div>
            </nav>

            {/* 設定區域 */}
            <div className="p-6 border-t border-slate-600/30">
              <SettingsPanel onReplayStory={handleReplayStory} />
            </div>
          </aside>

          {/* 主要內容區域 */}
          <main className="flex-1 overflow-auto">
            <div className="h-full p-6">
              <Card variant="glass" className="h-full animate-card-entrance storybook-shadow">
                <ActiveComponent />
              </Card>
            </div>
          </main>
        </div>
      )}
      
      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            color: '#1f2937',
            fontFamily: 'Inter, sans-serif',
          },
        }}
      />
    </div>
  );
}

export default App;
