import React, { useState, useEffect, useMemo } from 'react';
import { Button, Progress, Badge } from './ui';
import useStarStore from '../store/useStarStore';
import CharacterDisplay from './CharacterDisplay';

function RestoreMission() {
  const { currentMission, missionQueue, missionIndex, actions } = useStarStore();
  const [synonymInputs, setSynonymInputs] = useState({}); // 每個同義詞對應一個輸入值
  const [inputStatus, setInputStatus] = useState({}); // 每個輸入框的狀態
  const [showResults, setShowResults] = useState(false);
  const [sparkleAnimation, setSparkleAnimation] = useState(false);
  const [showHints, setShowHints] = useState(false);

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
      currentMission.synonyms.forEach((synonym) => {
        initialInputs[synonym] = '';
        initialStatus[synonym] = 'empty'; // empty, correct, incorrect
      });
      setSynonymInputs(initialInputs);
      setInputStatus(initialStatus);
      setShowResults(false);
      setShowHints(false);
    }
  }, [currentMission]);

  const handleInputChange = (synonym, value) => {
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

  const handleComplete = () => {
    if (!currentMission) return;

    // 將用戶輸入轉換為舊格式以兼容現有的 store 邏輯
    const userInputs = Object.values(synonymInputs).filter(input => input.trim() !== '');
    actions.updateMissionInput(userInputs);
    actions.completeMission();
    setShowResults(true);
    
    // 顯示結果3秒後進入下一題或結束
    setTimeout(() => {
      actions.nextMission();
    }, 3000);
  };

  const handleSkip = () => {
    if (!currentMission) return;
    
    // 將遺漏的單字標記為需要複習
    const missedSynonyms = currentMission.synonyms.filter(synonym => 
      inputStatus[synonym] !== 'correct'
    );
    
    if (missedSynonyms.length > 0) {
      missedSynonyms.forEach(synonym => {
        actions.toggleStarMark(synonym);
      });
    }
    
    actions.nextMission();
  };

  const getCorrectCount = () => {
    if (!currentMission) return 0;
    return Object.values(inputStatus).filter(status => status === 'correct').length;
  };

  const getMissedSynonyms = () => {
    if (!currentMission) return [];
    return currentMission.synonyms.filter(synonym => 
      inputStatus[synonym] !== 'correct'
    );
  };

  const getFirstLetter = (word) => {
    return word.charAt(0).toUpperCase();
  };

  const getHintText = (word) => {
    const length = word.length;
    return showHints
      ? `${word} (${length} 字母)`
      : `${getFirstLetter(word)}${'_'.repeat(length - 1)} (${length} 字母)`;
  };

  if (!currentMission) {
    return (
      <div className="h-full flex flex-col relative bg-gradient-to-br from-story-night via-story-twilight to-story-aurora text-white rounded-lg overflow-hidden">
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
        <div className="flex-1 flex items-center justify-center">
          <div className="relative z-10 text-center max-w-2xl px-6">
            <div className="text-6xl mb-6">🧠</div>
            <h2 className="text-4xl font-storybook mb-6 text-gradient">修復任務</h2>
            <p className="text-xl mb-8 opacity-90">
              點擊星圖中的星星開始，或直接開啟一個修復任務
            </p>
            
            <Button
              onClick={() => actions.startMissionSession()}
              variant="primary"
              size="lg"
              className="mb-8 text-xl px-8 py-4"
            >
              🌠 開始 15 題修復任務
            </Button>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm opacity-80">
              <div className="glass-effect p-4 rounded-xl">
                <div className="text-2xl mb-2">📚</div>
                <p>輸入指定單字的所有同義詞</p>
              </div>
              <div className="glass-effect p-4 rounded-xl">
                <div className="text-2xl mb-2">⭐</div>
                <p>每答對一個同義詞，星星亮度增加</p>
              </div>
              <div className="glass-effect p-4 rounded-xl">
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

  if (showResults || currentMission.completed) {
    const correctCount = getCorrectCount();
    const totalCount = currentMission.synonyms.length;
    const accuracy = totalCount > 0 ? (correctCount / totalCount * 100) : 0;
    const missedSynonyms = getMissedSynonyms();

    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-story-forest via-story-ocean to-story-aurora text-white rounded-lg overflow-hidden">
        {/* 頂部成績展示 */}
        <div className="p-8 text-center">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-4xl font-storybook mb-6 text-gradient">任務完成！</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="glass-effect p-6 rounded-xl">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-xl font-bold text-story-star">{currentMission.word}</div>
              <div className="text-sm opacity-80">主星詞</div>
            </div>
            <div className="glass-effect p-6 rounded-xl">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-xl font-bold">{correctCount}/{totalCount}</div>
              <div className="text-sm opacity-80">正確率 {accuracy.toFixed(0)}%</div>
            </div>
          </div>

          <Progress 
            value={correctCount}
            max={totalCount}
            variant="star"
            animated={true}
            showValue={true}
            className="mb-6"
          />
        </div>
        
        {/* 遺漏的同義詞 */}
        {missedSynonyms.length > 0 && (
          <div className="px-8 mb-6">
            <div className="glass-dark p-6 rounded-xl">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">🔍</span>
                你遺漏的同義詞
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {missedSynonyms.map((synonym, index) => (
                  <Badge 
                    key={index} 
                    variant="error"
                    className="text-base"
                  >
                    {synonym}
                  </Badge>
                ))}
              </div>
              <p className="text-sm opacity-80">這些單字已自動加入你的標記列表中</p>
            </div>
          </div>
        )}
        
        {/* 鼓勵訊息 */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="text-center">
            <div className="text-4xl mb-4">
              {accuracy >= 80 ? '🌟' : accuracy >= 50 ? '⭐' : '💪'}
            </div>
            <p className="text-xl">
              {accuracy >= 80 ? (
                '太棒了！星座重建成功，所有星星都在閃耀！'
              ) : accuracy >= 50 ? (
                '不錯的進步！星星變亮了一些。'
              ) : (
                '繼續努力！多練習幾次就會更熟悉了。'
              )}
            </p>
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

  return (
    <div className={`h-full flex flex-col relative glass-effect text-white rounded-lg overflow-hidden ${sparkleAnimation ? 'animate-pulse' : ''}`}>
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

      {/* 頂部標題區域 */}
      <div className="relative z-10 p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-storybook text-gradient flex items-center gap-3">
            🧠 修復任務
            {sparkleAnimation && <span className="inline-block animate-bounce">✨</span>}
          </h2>
          
          {missionQueue.length > 0 && (
            <Badge variant="glass" className="text-base px-4 py-2">
              {missionIndex + 1} / {missionQueue.length}
            </Badge>
          )}
        </div>
        
        {/* 單字資訊卡片 */}
        <div className="glass-dark p-6 rounded-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">⭐</div>
            <div>
              <h3 className="text-2xl font-bold text-story-star mb-1">
                {currentMission.word}
              </h3>
              <p className="text-lg opacity-90">
                {currentMission.meaning}
              </p>
            </div>
          </div>
          <p className="text-sm opacity-70">
            請輸入所有你知道的同義詞 ({currentMission.synonyms.length} 個)
          </p>
        </div>
      </div>

      {/* 主要輸入區域 */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold text-xl">填入所有同義詞：</h4>
          <Button
            onClick={() => setShowHints(!showHints)}
            variant="soft"
            size="sm"
          >
            {showHints ? '🙈 隱藏提示' : '💡 顯示提示'}
          </Button>
        </div>

        <div className="grid gap-4">
          {currentMission.synonyms.map((synonym, index) => (
            <div key={synonym} className="glass-dark p-4 rounded-xl flex items-center gap-4">
              <Badge variant="primary" className="w-8 h-8 flex items-center justify-center">
                {index + 1}
              </Badge>

              <div className="flex-1">
                {showHints && (
                  <div className="text-sm opacity-70 mb-2">
                    💡 {getHintText(synonym)}
                  </div>
                )}
                <input
                  type="text"
                  value={synonymInputs[synonym] || ''}
                  onChange={(e) => handleInputChange(synonym, e.target.value)}
                  placeholder={`輸入第 ${index + 1} 個同義詞...`}
                  className={`w-full px-4 py-3 rounded-xl text-slate-800 border-2 focus:outline-none transition-all text-lg ${
                    inputStatus[synonym] === 'correct'
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                      : inputStatus[synonym] === 'incorrect'
                      ? 'border-rose-400 bg-rose-50 text-rose-800'
                      : 'border-white/50 bg-white/90 focus:border-story-aurora focus:bg-white'
                  }`}
                  autoFocus={index === 0}
                />
              </div>

              <div className="w-10 h-10 flex items-center justify-center">
                {inputStatus[synonym] === 'correct' && (
                  <span className="text-emerald-400 text-2xl animate-bounce">✅</span>
                )}
                {inputStatus[synonym] === 'incorrect' && (
                  <span className="text-rose-400 text-2xl">❌</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 進度條 */}
        <div className="mt-6">
          <Progress 
            value={getCorrectCount()}
            max={currentMission.synonyms.length}
            variant="primary"
            animated={true}
            showValue={true}
            size="lg"
          />
        </div>
      </div>

      {/* 底部操作區域 */}
      <div className="relative z-10 p-6 border-t border-white/10">
        <div className="flex gap-4 mb-4">
          <Button
            onClick={handleComplete}
            variant="secondary"
            size="lg"
            className="flex-1"
          >
            ✨ 完成任務
          </Button>
          <Button
            onClick={handleSkip}
            variant="ghost"
            size="lg"
            className="flex-1"
          >
            ⏭️ 跳過並標記
          </Button>
        </div>

        <div className="text-sm opacity-70 space-y-1">
          <p>💡 每個輸入框對應一個同義詞，輸入正確會立即顯示綠色勾勾！</p>
          <p>🔄 可以隨時完成任務，未完成的單字會自動加入標記列表</p>
          <p>🎯 全部答對可獲得最高星星亮度獎勵！</p>
        </div>

        {/* 角色指導 */}
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
