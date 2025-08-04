import React, { useState, useEffect, useMemo } from 'react';
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
      ? `${getFirstLetter(word)}${'_'.repeat(length - 1)} (${length} 字母)`
      : `${getFirstLetter(word)}__ (${length} 字母)`;
  };

  if (!currentMission) {
    return (
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 text-white p-8 rounded-lg shadow-xl overflow-hidden">
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

        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4">🧠 修復任務</h2>
          <p className="text-lg mb-4">
            點擊星圖中的星星開始，或直接開啟一個修復任務。
          </p>
          <button
            onClick={() => actions.startMissionSession()}
            className="px-6 py-3 bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-300 hover:to-purple-300 rounded-lg font-bold shadow-lg transition-colors"
          >
            🌠 開始 15 題修復任務
          </button>
          <div className="text-sm opacity-80 mt-6">
            <p>📚 在修復任務中，你需要輸入指定單字的所有同義詞</p>
            <p>⭐ 每答對一個同義詞，星星亮度就會增加</p>
            <p>🎯 全部答對可以重建星座，讓所有相關星星閃閃發光！</p>
          </div>
        </div>
      </div>
    );
  }

  if (showResults || currentMission.completed) {
    const correctCount = getCorrectCount();
    const totalCount = currentMission.synonyms.length;
    const accuracy = totalCount > 0 ? (correctCount / totalCount * 100) : 0;
    const missedSynonyms = getMissedSynonyms();

    return (
      <div className="bg-gradient-to-r from-emerald-400 to-teal-400 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">🎉 任務完成！</h2>
        <div className="text-lg mb-4">
          <p className="mb-2">主星詞: <span className="font-bold text-yellow-200">{currentMission.word}</span></p>
          <p className="mb-2">正確率: <span className="font-bold">{correctCount}/{totalCount} ({accuracy.toFixed(0)}%)</span></p>
        </div>
        
        {missedSynonyms.length > 0 && (
          <div className="bg-white bg-opacity-20 p-4 rounded-lg mb-4">
            <h3 className="font-bold mb-2">🔍 你遺漏的同義詞:</h3>
            <div className="flex flex-wrap gap-2">
              {missedSynonyms.map((synonym, index) => (
                <span key={index} className="bg-rose-400 bg-opacity-40 px-2 py-1 rounded text-sm">
                  {synonym}
                </span>
              ))}
            </div>
            <p className="text-sm mt-2 opacity-80">這些單字已自動加入你的標記列表中</p>
          </div>
        )}
        
        <div className="text-sm opacity-80">
          {accuracy >= 80 ? (
            <p>🌟 太棒了！星座重建成功，所有星星都在閃耀！</p>
          ) : accuracy >= 50 ? (
            <p>⭐ 不錯的進步！星星變亮了一些。</p>
          ) : (
            <p>💪 繼續努力！多練習幾次就會更熟悉了。</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 text-white p-6 rounded-lg shadow-lg transition-all duration-300 ${sparkleAnimation ? 'animate-pulse' : ''} overflow-hidden`}>
      <div className="absolute inset-0 pointer-events-none">
        {missionStars.map((star, i) => (
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
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-4">
          🧠 修復任務
          {sparkleAnimation && <span className="inline-block ml-2 animate-bounce">✨</span>}
        </h2>

        {missionQueue.length > 0 && (
          <p className="text-sm mb-4 opacity-80">
            題目 {missionIndex + 1} / {missionQueue.length}
          </p>
        )}
      
      <div className="mb-6">
        <h3 className="text-xl mb-2">
          主星詞: <span className="font-bold text-yellow-200">{currentMission.word}</span>
        </h3>
        <p className="text-lg opacity-80 mb-2">
          意思: {currentMission.meaning}
        </p>
        <p className="text-sm opacity-70">
          請輸入所有你知道的同義詞 ({currentMission.synonyms.length} 個)
        </p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-lg">請填入所有同義詞：</h4>
          <button
            onClick={() => setShowHints(!showHints)}
            className="px-3 py-1 bg-yellow-300 bg-opacity-30 hover:bg-opacity-50 rounded-lg text-sm"
          >
            {showHints ? '🙈 隱藏提示' : '💡 顯示提示'}
          </button>
        </div>

        <div className="grid gap-3">
          {currentMission.synonyms.map((synonym, index) => (
            <div key={synonym} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>

              <div className="flex-1">
                <div className="text-xs opacity-70 mb-1">
                  提示: {getHintText(synonym)}
                </div>
                <input
                  type="text"
                  value={synonymInputs[synonym] || ''}
                  onChange={(e) => handleInputChange(synonym, e.target.value)}
                  placeholder={`輸入第 ${index + 1} 個同義詞...`}
                  className={`w-full px-4 py-3 rounded-lg text-black border-2 focus:outline-none transition-all ${
                    inputStatus[synonym] === 'correct'
                      ? 'border-emerald-300 bg-emerald-50'
                      : inputStatus[synonym] === 'incorrect'
                      ? 'border-rose-300 bg-rose-50'
                      : 'border-white bg-white focus:border-indigo-200'
                  }`}
                  autoFocus={index === 0}
                />
              </div>

              <div className="w-8 h-8 flex items-center justify-center">
                {inputStatus[synonym] === 'correct' && (
                  <span className="text-emerald-400 text-xl animate-bounce">✅</span>
                )}
                {inputStatus[synonym] === 'incorrect' && (
                  <span className="text-rose-400 text-xl">❌</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm opacity-80">
          <div className="flex justify-between">
            <span>進度: {getCorrectCount()} / {currentMission.synonyms.length}</span>
            <span>完成度: {Math.round((getCorrectCount() / currentMission.synonyms.length) * 100)}%</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mt-2">
            <div
              className="bg-emerald-300 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(getCorrectCount() / currentMission.synonyms.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleComplete}
          className="px-6 py-2 bg-emerald-400 hover:bg-emerald-300 font-bold rounded-lg"
        >
          完成任務
        </button>
        <button
          onClick={handleSkip}
          className="px-6 py-2 bg-slate-300 hover:bg-slate-200 font-bold rounded-lg"
        >
          跳過並標記遺漏詞
        </button>
      </div>

      <div className="mt-4 text-xs opacity-60">
        <p>💡 提示: 每個輸入框對應一個同義詞，輸入正確會立即顯示綠色勾勾！</p>
        <p>🔄 可以隨時完成任務，未完成的單字會自動加入標記列表</p>
        <p>🎯 全部答對可獲得最高星星亮度獎勵！</p>
      </div>

      {/* 星語者陪伴 */}
      <CharacterDisplay 
        type="starnamer" 
        position="bottom-right" 
        size="medium" 
        mood={getCorrectCount() === currentMission.synonyms.length ? 'happy' : 
              getCorrectCount() > 0 ? 'encouraging' : 'thinking'} 
      />
    </div>
  </div>
  );
}

export default RestoreMission;
