import React from 'react';
import useStarStore from '../store/useStarStore';

function StarNotebook() {
  const { starData, starProgress, actions } = useStarStore();

  // 獲取標記的單字
  const markedWords = Object.keys(starProgress).filter(word => starProgress[word]?.marked);
  
  // 獲取單字詳細資訊
  const markedWordDetails = markedWords.map(word => {
    const wordData = starData.find(item => item.word === word);
    const progress = starProgress[word];
    return {
      word,
      meaning: wordData?.meaning || '未知',
      synonyms: wordData?.synonyms || [],
      brightness: progress?.brightness || 0,
      attempts: progress?.attempts || 0,
      correct: progress?.correct || 0
    };
  });

  const handleRemoveMark = (word) => {
    actions.toggleStarMark(word);
  };

  const handleStartMission = (word) => {
    actions.startMission(word);
  };

  if (markedWords.length === 0) {
    return (
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">📖 星語冊</h2>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-xl mb-2">你的星語冊還是空的</p>
          <p className="text-sm opacity-80">
            使用記憶標記槍（🔫）在星圖中標記不熟悉的單字，
            <br />
            它們會自動出現在這裡供你複習！
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📖 星語冊</h2>
        <div className="text-sm opacity-80">
          共 {markedWords.length} 個待複習單字
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {markedWordDetails.map((wordDetail) => {
          const accuracyRate = wordDetail.attempts > 0 ? 
            (wordDetail.correct / wordDetail.attempts * 100) : 0;
          
          return (
            <div 
              key={wordDetail.word}
              className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-blur-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-yellow-200">
                  {wordDetail.word}
                </h3>
                <button
                  onClick={() => handleRemoveMark(wordDetail.word)}
                  className="text-red-300 hover:text-red-100 text-sm"
                  title="移除標記"
                >
                  ❌
                </button>
              </div>
              
              <p className="text-sm mb-3 opacity-90">
                {wordDetail.meaning}
              </p>
              
              <div className="mb-3">
                <p className="text-xs opacity-70 mb-1">同義詞:</p>
                <div className="flex flex-wrap gap-1">
                  {wordDetail.synonyms.slice(0, 4).map((synonym, index) => (
                    <span 
                      key={index}
                      className="bg-white bg-opacity-30 px-2 py-1 rounded text-xs"
                    >
                      {synonym}
                    </span>
                  ))}
                  {wordDetail.synonyms.length > 4 && (
                    <span className="text-xs opacity-70">
                      +{wordDetail.synonyms.length - 4} 更多
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs mb-3">
                <div className="flex items-center gap-2">
                  <span>亮度:</span>
                  <div className="w-16 h-2 bg-white bg-opacity-30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-300 transition-all duration-300"
                      style={{ width: `${wordDetail.brightness * 100}%` }}
                    />
                  </div>
                  <span>{(wordDetail.brightness * 100).toFixed(0)}%</span>
                </div>
                {wordDetail.attempts > 0 && (
                  <div>
                    正確率: {accuracyRate.toFixed(0)}%
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleStartMission(wordDetail.word)}
                  className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-400 rounded text-sm font-medium"
                >
                  🎯 練習
                </button>
                <button
                  onClick={() => actions.selectStar(wordDetail.word)}
                  className="px-3 py-2 bg-blue-500 hover:bg-blue-400 rounded text-sm font-medium"
                >
                  👁️ 查看
                </button>
              </div>

              {wordDetail.attempts > 0 && (
                <div className="mt-2 text-xs opacity-70">
                  已練習 {wordDetail.attempts} 次，答對 {wordDetail.correct} 次
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-sm opacity-80 text-center">
        <p>💡 提示: 經常複習標記的單字可以提高記憶效果</p>
        <p>🎯 建議針對低亮度或低正確率的單字多加練習</p>
      </div>
    </div>
  );
}

export default StarNotebook;
