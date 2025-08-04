import React, { useState } from 'react';
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
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">🔭 星象觀測站</h2>
          <button
            onClick={() => setSelectedWord(null)}
            className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg"
          >
            ← 返回列表
          </button>
        </div>

        <div className="bg-white bg-opacity-20 p-6 rounded-xl backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-yellow-200 mb-2">
                {selectedWord.word}
              </h1>
              <p className="text-xl opacity-90">
                {selectedWord.meaning}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">星星亮度:</span>
                <div className="w-20 h-3 bg-white bg-opacity-30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-300 transition-all duration-300"
                    style={{ width: `${wordProgress.brightness * 100}%` }}
                  />
                </div>
                <span className="text-sm">{(wordProgress.brightness * 100).toFixed(0)}%</span>
              </div>
              {wordProgress.marked && (
                <span className="inline-block bg-red-500 text-white px-2 py-1 rounded text-sm">
                  已標記 🔫
                </span>
              )}
            </div>
          </div>

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
    <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">🔭 星象觀測站</h2>
      
      <div className="mb-6">
        <p className="text-lg mb-4">
          在這裡你可以安靜地學習和觀察星星，不會影響亮度或標記狀態
        </p>
        
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜尋單字、意思或同義詞..."
            className="w-full px-4 py-3 rounded-lg text-black text-lg border-2 border-white focus:border-yellow-300 focus:outline-none"
          />
          <div className="absolute right-3 top-3 text-gray-400">
            🔍
          </div>
        </div>
      </div>

      <div className="grid gap-3 max-h-96 overflow-y-auto">
        {filteredWords.length === 0 ? (
          <div className="text-center py-8 opacity-70">
            {searchTerm ? '沒有找到符合條件的單字' : '開始搜尋來探索星空'}
          </div>
        ) : (
          filteredWords.slice(0, 50).map((wordData) => {
            const wordProgress = starProgress[wordData.word] || { brightness: 0, marked: false };
            return (
              <div
                key={wordData.word}
                onClick={() => handleWordSelect(wordData)}
                className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
                  wordProgress.marked 
                    ? 'bg-red-500 bg-opacity-20 border-red-300 hover:bg-opacity-30' 
                    : 'bg-white bg-opacity-20 border-white border-opacity-30 hover:bg-opacity-30'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-yellow-200">
                      {wordData.word}
                      {wordProgress.marked && ' 🔫'}
                    </h3>
                    <p className="text-sm opacity-90 mb-2">
                      {wordData.meaning}
                    </p>
                    <div className="text-xs opacity-70">
                      同義詞: {wordData.synonyms.slice(0, 3).join(', ')}
                      {wordData.synonyms.length > 3 && ` +${wordData.synonyms.length - 3}`}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="w-16 h-2 bg-white bg-opacity-30 rounded-full overflow-hidden mb-1">
                      <div 
                        className="h-full bg-yellow-300 transition-all duration-300"
                        style={{ width: `${wordProgress.brightness * 100}%` }}
                      />
                    </div>
                    <div className="text-xs">
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
        <div className="text-center mt-4 text-sm opacity-70">
          顯示前50個結果，請使用更具體的搜尋條件
        </div>
      )}
    </div>
  );
}

export default StarObservatory;
