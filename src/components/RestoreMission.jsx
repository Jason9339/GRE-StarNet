import React, { useState, useEffect, useMemo } from 'react';
import { Button, Progress, Badge } from './ui';
import useStarStore from '../store/useStarStore';
import CharacterDisplay from './CharacterDisplay';

function RestoreMission() {
  const { currentMission, missionQueue, missionIndex, starData, isSessionComplete, sessionStats, actions } = useStarStore();
  const [synonymInputs, setSynonymInputs] = useState({}); // 每個同義詞對應一個輸入值
  const [inputStatus, setInputStatus] = useState({}); // 每個輸入框的狀態
  const [dontKnowStatus, setDontKnowStatus] = useState({}); // 追蹤"不會"的狀態
  const [sparkleAnimation, setSparkleAnimation] = useState(false);
  const [allDontKnow, setAllDontKnow] = useState(false); // 是否全部不會

  // 預先生成星空，避免每次 render 重新計算造成閃爍
  const introStars = useMemo(() =>
    Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${2 + Math.random() * 4}s`
    })),
  []);

  const missionStars = useMemo(() =>
    Array.from({ length: 15 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${3 + Math.random() * 4}s`
    })),
  []);

  useEffect(() => {
    if (currentMission) {
      // 為每個同義詞初始化輸入狀態
      const initialInputs = {};
      const initialStatus = {};
      const initialDontKnow = {};
      currentMission.synonyms.forEach((synonym) => {
        initialInputs[synonym] = '';
        initialStatus[synonym] = 'empty'; // empty, correct, incorrect, dont_know
        initialDontKnow[synonym] = false;
      });
      setSynonymInputs(initialInputs);
      setInputStatus(initialStatus);
      setDontKnowStatus(initialDontKnow);
      setAllDontKnow(false);
    }
  }, [currentMission]);

  const handleInputChange = (synonym, value) => {
    // 如果已經標記為"不會"，則不允許修改
    if (dontKnowStatus[synonym]) {
      return;
    }

    setSynonymInputs(prev => ({
      ...prev,
      [synonym]: value
    }));

    // 即時檢查輸入
    const trimmedValue = value.trim().toLowerCase();
    if (trimmedValue === '') {
      setInputStatus(prev => ({
        ...prev,
        [synonym]: 'empty'
      }));
    } else if (trimmedValue === synonym.toLowerCase()) {
      setInputStatus(prev => ({
        ...prev,
        [synonym]: 'correct'
      }));
      setSparkleAnimation(true);
      setTimeout(() => setSparkleAnimation(false), 500);
    } else {
      setInputStatus(prev => ({
        ...prev,
        [synonym]: 'incorrect'
      }));
    }
  };

  const handleDontKnow = (synonym) => {
    // 標記為不會，顯示正確答案
    const newDontKnowStatus = { ...dontKnowStatus, [synonym]: true };
    
    setDontKnowStatus(newDontKnowStatus);
    setSynonymInputs(prev => ({
      ...prev,
      [synonym]: synonym
    }));
    setInputStatus(prev => ({
      ...prev,
      [synonym]: 'dont_know'
    }));

    // 標記單字到星語冊
    const synonymData = starData.find(item => item.synonyms.includes(synonym));
    if (synonymData) {
      actions.toggleStarMark(synonym);
    }

    // 檢查是否所有答案都標記為"不會"
    const allDontKnowState = currentMission.synonyms.every(syn => newDontKnowStatus[syn]);
    setAllDontKnow(allDontKnowState);
  };

  const handleComplete = () => {
    if (!currentMission) return;
    
    // 將用戶輸入轉換為舊格式以兼容現有的 store 邏輯
    const userInputs = Object.values(synonymInputs).filter(input => input.trim() !== '');
    actions.updateMissionInput(userInputs);
    actions.completeMission();
    
    // 進入下一題
    actions.nextMission();
  };

  const handleEarlyEnd = () => {
    // 提前結束整個任務
    actions.clearMission();
  };

  const getCorrectCount = () => {
    if (!currentMission) return 0;
    return Object.values(inputStatus).filter(status => status === 'correct').length;
  };

  const getMissedSynonyms = () => {
    if (!currentMission) return [];
    return currentMission.synonyms.filter(synonym => 
      inputStatus[synonym] !== 'correct' && inputStatus[synonym] !== 'dont_know'
    );
  };

  const getDontKnowSynonyms = () => {
    if (!currentMission) return [];
    return currentMission.synonyms.filter(synonym => 
      inputStatus[synonym] === 'dont_know'
    );
  };

  const getFirstLetter = (word) => {
    return word.charAt(0).toUpperCase();
  };

  const getHintText = (word) => {
    const length = word.length;
    return `${getFirstLetter(word)}${'_'.repeat(length - 1)}`;
  };

  // 顯示整個任務完成的總結頁面
  if (isSessionComplete && sessionStats) {
    return (
      <div className="h-full bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-900 text-white rounded-lg overflow-hidden">
        {/* 頂部成績展示 */}
        <div className="p-6 text-center">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-4xl font-storybook mb-6 text-gradient">15題任務完成！</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-700/50 p-4 rounded-xl backdrop-blur-sm">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold">{sessionStats.totalQuestions}</div>
              <div className="text-sm opacity-80">總題數</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-xl backdrop-blur-sm">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-emerald-400">{sessionStats.correctAnswers}</div>
              <div className="text-sm opacity-80">答對數</div>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-xl backdrop-blur-sm">
              <div className="text-3xl mb-2">📈</div>
              <div className="text-2xl font-bold text-story-star">
                {sessionStats.totalQuestions > 0 ? Math.round((sessionStats.correctAnswers / sessionStats.totalQuestions) * 100) : 0}%
              </div>
              <div className="text-sm opacity-80">正確率</div>
            </div>
          </div>

          <Progress 
            value={sessionStats.correctAnswers}
            max={sessionStats.totalQuestions}
            variant="star"
            animated={true}
            showValue={true}
            className="mb-6"
          />
        </div>
        
        {/* 需要複習的單字 */}
        {(sessionStats.missedWords.length > 0 || sessionStats.dontKnowWords.length > 0) && (
          <div className="px-6 mb-6 space-y-4">
            {sessionStats.missedWords.length > 0 && (
              <div className="bg-slate-700/50 p-4 rounded-xl backdrop-blur-sm">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <span className="text-xl">🔍</span>
                  需要複習的單字 ({sessionStats.missedWords.length}個)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sessionStats.missedWords.map((word, index) => (
                    <Badge 
                      key={index} 
                      variant="error"
                      className="text-sm"
                    >
                      {word}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {sessionStats.dontKnowWords.length > 0 && (
              <div className="bg-rose-900/30 p-4 rounded-xl backdrop-blur-sm border border-rose-500/30">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <span className="text-xl">❓</span>
                  不會的單字 ({sessionStats.dontKnowWords.length}個)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sessionStats.dontKnowWords.map((word, index) => (
                    <Badge 
                      key={index} 
                      variant="error"
                      className="text-sm bg-rose-600 text-white"
                    >
                      {word}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* 鼓勵訊息 */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <div className="text-4xl mb-4">
              {sessionStats.correctAnswers / sessionStats.totalQuestions >= 0.8 ? '🌟' : 
               sessionStats.correctAnswers / sessionStats.totalQuestions >= 0.6 ? '⭐' : '💪'}
            </div>
            <p className="text-xl mb-6">
              {sessionStats.correctAnswers / sessionStats.totalQuestions >= 0.8 ? (
                '太棒了！你已經掌握得很好了！'
              ) : sessionStats.correctAnswers / sessionStats.totalQuestions >= 0.6 ? (
                '不錯的表現！繼續加油！'
              ) : (
                '持續練習，你會越來越進步的！'
              )}
            </p>
            
            <Button
              onClick={() => {
                actions.clearMission();
                actions.startMissionSession();
              }}
              variant="primary"
              size="lg"
              className="mb-4"
            >
              🔄 再來一次
            </Button>
            
            <Button
              onClick={() => actions.clearMission()}
              variant="ghost"
              size="lg"
            >
              📚 回到主畫面
            </Button>
          </div>
        </div>

        {/* 角色慶祝 */}
        <CharacterDisplay 
          type="glyphox" 
          position="bottom-left" 
          size="medium" 
          mood="happy" 
        />
      </div>
    );
  }

  if (!currentMission) {
    return (
      <div className="h-full bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-900 text-white rounded-lg overflow-hidden relative">
        {/* 星空背景 */}
        <div className="absolute inset-0 pointer-events-none">
          {introStars.map((star, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-40 animate-pulse"
              style={{
                left: star.left,
                top: star.top,
                animationDelay: star.animationDelay,
                animationDuration: star.animationDuration
              }}
            />
          ))}
        </div>

        {/* 居中內容 */}
        <div className="flex items-center justify-center h-full p-8">
          <div className="text-center max-w-2xl">
            <div className="text-6xl mb-6 animate-float-gentle">🧠</div>
            <h2 className="text-3xl font-storybook mb-4 text-gradient">修復任務</h2>
            <p className="text-lg mb-8 opacity-90 leading-relaxed">
              點擊星圖中的星星開始，或直接開啟一個修復任務
            </p>
            
            <Button
              onClick={() => actions.startMissionSession()}
              variant="primary"
              size="lg"
              className="mb-8 text-lg px-10 py-4 animate-button-pulse"
            >
              🌠 開始 15 題修復任務
            </Button>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm opacity-80">
              <div className="bg-slate-700/50 p-4 rounded-xl backdrop-blur-sm">
                <div className="text-2xl mb-2">📚</div>
                <p>輸入指定單字的所有同義詞</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-xl backdrop-blur-sm">
                <div className="text-2xl mb-2">⭐</div>
                <p>每答對一個同義詞，星星亮度增加</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-xl backdrop-blur-sm">
                <div className="text-2xl mb-2">🎯</div>
                <p>全部答對重建星座，星星閃閃發光</p>
              </div>
            </div>
          </div>
        </div>

        {/* 角色指導 */}
        <CharacterDisplay 
          type="starnamer" 
          position="bottom-right" 
          size="medium" 
          mood="encouraging" 
        />
      </div>
    );
  }



  return (
    <div className="h-full bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-900 text-white rounded-lg overflow-hidden flex flex-col">
      {/* 星空背景 */}
      <div className="absolute inset-0 pointer-events-none">
        {missionStars.map((star, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.animationDelay,
              animationDuration: star.animationDuration
            }}
          />
        ))}
      </div>

      {/* 頂部區域 - 簡化高度 */}
      <div className="relative z-10 px-6 py-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-storybook text-gradient flex items-center gap-2">
            🧠 修復任務
          </h2>
          
          {missionQueue.length > 0 && (
            <Badge variant="primary" className="px-3 py-1">
              {missionIndex + 1} / {missionQueue.length}
            </Badge>
          )}
        </div>
        
        {/* 單字資訊卡片 - 緊湊設計 */}
        <div className="bg-slate-700/50 p-4 rounded-xl backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⭐</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-amber-300">{currentMission.word}</h3>
                <span className="text-sm opacity-80 text-slate-300">{currentMission.meaning}</span>
              </div>
              <p className="text-xs opacity-70">
                填入所有同義詞 ({currentMission.synonyms.length} 個)
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* 進度條 */}
              <div className="w-32">
                <Progress 
                  value={getCorrectCount()}
                  max={currentMission.synonyms.length}
                  variant="star"
                  animated={true}
                  showValue={true}
                  size="sm"
                />
              </div>
              <Button
                onClick={handleComplete}
                variant="primary"
                size="sm"
                className="px-3 py-1 text-xs"
              >
                ▶️ 下一題
              </Button>
              <Button
                onClick={handleEarlyEnd}
                variant="ghost"
                size="sm"
                className="px-3 py-1 text-xs text-red-300 hover:text-red-200"
              >
                🏁 結束任務
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 主要輸入區域 */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-3 mb-6">
          {currentMission.synonyms.map((synonym, index) => (
            <div key={synonym} className="bg-slate-700/30 p-3 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Badge variant="primary" className="w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </Badge>

                <div className="flex-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={synonymInputs[synonym] || ''}
                      onChange={(e) => handleInputChange(synonym, e.target.value)}
                      placeholder={getHintText(synonym)}
                      className={`flex-1 px-3 py-1.5 rounded-lg text-slate-800 border-2 focus:outline-none transition-all font-sans ${
                        inputStatus[synonym] === 'correct'
                          ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                          : inputStatus[synonym] === 'dont_know'
                          ? 'border-rose-500 bg-rose-100 text-rose-800'
                          : inputStatus[synonym] === 'incorrect'
                          ? 'border-rose-400 bg-rose-50 text-rose-800'
                          : 'border-white/50 bg-white/90 focus:border-story-aurora focus:bg-white'
                      }`}
                      disabled={dontKnowStatus[synonym]}
                      autoFocus={index === 0}
                    />
                    <Button
                      onClick={() => handleDontKnow(synonym)}
                      variant="ghost"
                      size="sm"
                      className="px-2 py-1 text-xs text-amber-300 hover:text-amber-200"
                      disabled={dontKnowStatus[synonym]}
                    >
                      {dontKnowStatus[synonym] ? '已標' : '不會'}
                    </Button>
                  </div>
                </div>

                <div className="w-8 h-8 flex items-center justify-center">
                  {inputStatus[synonym] === 'correct' && (
                    <span className="text-emerald-400 text-xl animate-bounce">✅</span>
                  )}
                  {inputStatus[synonym] === 'dont_know' && (
                    <span className="text-rose-500 text-xl">❓</span>
                  )}
                  {inputStatus[synonym] === 'incorrect' && (
                    <span className="text-rose-400 text-xl">❌</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 全部不會提示 */}
        {allDontKnow && (
          <div className="mx-6 mb-4 p-3 bg-amber-900/30 border border-amber-500/50 rounded-xl">
            <p className="text-sm text-amber-200 text-center">
              📝 所有答案都已標記為不會，可以點擊"下一題"繼續
            </p>
          </div>
        )}
      </div>

      {/* 右下角角色 - 縮小文字 */}
      <div className="absolute bottom-4 right-4 z-20">
        <CharacterDisplay 
          type="starnamer" 
          position="bottom-right" 
          size="small" 
          mood={getCorrectCount() === currentMission.synonyms.length ? 'happy' : 
                getCorrectCount() > 0 ? 'encouraging' : 'thinking'} 
        />
      </div>
    </div>
  );
}

export default RestoreMission;