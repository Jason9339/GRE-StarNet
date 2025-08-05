import React, { useState } from 'react';
import { Button, Card, Badge, Progress } from './ui';
import useStarStore from '../store/useStarStore';

function StarObservatory() {
  const { starData, starProgress, actions } = useStarStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWord, setSelectedWord] = useState(null);

  // 過濾單字
  const filteredWords = starData.filter(item => 
    item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.synonyms.some(synonym => 
      synonym.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleWordSelect = (wordData) => {
    setSelectedWord(wordData);
  };

  const handleMarkWord = (word) => {
    actions.toggleStarMark(word);
  };

  const handleStartMission = (word) => {
    actions.startMission(word);
  };

  if (selectedWord) {
    const wordProgress = starProgress[selectedWord.word] || { brightness: 0, marked: false, attempts: 0, correct: 0 };
    const accuracyRate = wordProgress.attempts > 0 ? (wordProgress.correct / wordProgress.attempts * 100) : 0;

    return (
      <div className="h-full flex flex-col bg-slate-800 text-white rounded-lg overflow-hidden">
        {/* 頂部導航 */}
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-storybook text-gradient">🔭 星象觀測站</h2>
            <Button
              onClick={() => setSelectedWord(null)}
              variant="soft"
              size="md"
            >
              ← 返回列表
            </Button>
          </div>
        </div>

        {/* 可滾動內容 */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* 主要單字資訊 */}
          <Card variant="glass" className="storybook-shadow">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="text-6xl">⭐</div>
                <div>
                  <h1 className="text-4xl font-storybook text-story-star mb-2">
                    {selectedWord.word}
                  </h1>
                  <p className="text-xl opacity-90">
                    {selectedWord.meaning}
                  </p>
                </div>
              </div>
              <div className="text-right space-y-2">
                {wordProgress.marked && (
                  <Badge variant="accent" glowing={true}>
                    🔫 已標記
                  </Badge>
                )}
                <div>
                  <div className="text-sm opacity-80 mb-1">星星亮度</div>
                  <Progress 
                    value={wordProgress.brightness}
                    max={1}
                    variant="star"
                    showValue={true}
                    size="md"
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">🌟 同義詞星座</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {selectedWord.synonyms.map((synonym, index) => {
                const synonymProgress = starProgress[synonym] || { brightness: 0, marked: false };
                return (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      synonymProgress.marked 
                        ? 'bg-red-500 bg-opacity-30 border-red-300' 
                        : 'bg-white bg-opacity-20 border-white border-opacity-30'
                    } hover:bg-opacity-40`}
                    onClick={() => {
                      const synonymData = starData.find(item => item.word === synonym);
                      if (synonymData) handleWordSelect(synonymData);
                    }}
                  >
                    <div className="font-medium">{synonym}</div>
                    <div className="text-xs opacity-70 mt-1">
                      亮度: {(synonymProgress.brightness * 100).toFixed(0)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {wordProgress.attempts > 0 && (
            <div className="mb-6 bg-white bg-opacity-10 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">📊 學習統計</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{wordProgress.attempts}</div>
                  <div className="text-sm opacity-70">練習次數</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{wordProgress.correct}</div>
                  <div className="text-sm opacity-70">答對次數</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{accuracyRate.toFixed(0)}%</div>
                  <div className="text-sm opacity-70">正確率</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => handleStartMission(selectedWord.word)}
              className="px-6 py-3 bg-green-500 hover:bg-green-400 rounded-lg font-bold"
            >
              🎯 開始修復任務
            </button>
            <button
              onClick={() => handleMarkWord(selectedWord.word)}
              className={`px-6 py-3 rounded-lg font-bold ${
                wordProgress.marked
                  ? 'bg-red-500 hover:bg-red-400'
                  : 'bg-yellow-500 hover:bg-yellow-400 text-black'
              }`}
            >
              {wordProgress.marked ? '🔫 取消標記' : '🔫 標記為難詞'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-800 text-white rounded-lg overflow-hidden">
      {/* 頂部標題區域 */}
      <div className="p-6 border-b border-white/10">
        <h2 className="text-3xl font-storybook text-gradient mb-4">🔭 星象觀測站</h2>
        <p className="text-lg opacity-90 mb-4">
          在這裡你可以安靜地學習和觀察星星，不會影響亮度或標記狀態
        </p>
        
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜尋單字、意思或同義詞..."
            className="w-full px-4 py-3 rounded-xl text-slate-800 text-lg border-2 border-white/50 bg-white/90 focus:border-story-aurora focus:bg-white focus:outline-none transition-all"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
            🔍
          </div>
        </div>
      </div>

      {/* 可滾動的單字列表 */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-3">
          {filteredWords.length === 0 ? (
            <div className="text-center py-12 opacity-70">
              <div className="text-4xl mb-4">🌌</div>
              <p className="text-lg">
                {searchTerm ? '沒有找到符合條件的單字' : '開始搜尋來探索星空'}
              </p>
            </div>
          ) : (
            filteredWords.slice(0, 50).map((wordData) => {
              const wordProgress = starProgress[wordData.word] || { brightness: 0, marked: false };
              return (
                <div
                  key={wordData.word}
                  onClick={() => handleWordSelect(wordData)}
                  className={`bg-slate-700 p-4 rounded-xl cursor-pointer transition-all border-2 hover:scale-[1.01] ${
                    wordProgress.marked 
                      ? 'border-amber-400 bg-amber-900/30 hover:bg-amber-900/50' 
                      : 'border-slate-600 hover:border-slate-500 hover:bg-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-amber-300 mb-1">
                        {wordData.word}
                        {wordProgress.marked && ' 🔫'}
                      </h3>
                      <p className="text-base opacity-90 mb-2">
                        {wordData.meaning}
                      </p>
                      <div className="text-sm opacity-70">
                        同義詞: {wordData.synonyms.slice(0, 3).join(', ')}
                        {wordData.synonyms.length > 3 && ` +${wordData.synonyms.length - 3}`}
                      </div>
                    </div>
                    <div className="text-right ml-4 flex flex-col items-end">
                      <div className="w-16 h-2 bg-white/30 rounded-full overflow-hidden mb-1">
                        <div 
                          className="h-full bg-amber-400 transition-all duration-300"
                          style={{ width: `${wordProgress.brightness * 100}%` }}
                        />
                      </div>
                      <div className="text-xs opacity-80">
                        {(wordProgress.brightness * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {filteredWords.length > 50 && (
          <div className="text-center mt-6 p-4 bg-slate-700 rounded-xl">
            <p className="text-sm opacity-70">
              顯示前50個結果，請使用更具體的搜尋條件
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StarObservatory;
