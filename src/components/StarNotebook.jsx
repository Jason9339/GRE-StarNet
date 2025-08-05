import React from 'react';
import { Button, Badge, Progress } from './ui';
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
      <div className="h-full flex flex-col bg-slate-800 text-white rounded-lg overflow-hidden">
        {/* 頂部標題 */}
        <div className="p-6 border-b border-white/10">
          <h2 className="text-3xl font-storybook text-gradient">📖 星語冊</h2>
        </div>
        
        {/* 居中空狀態 */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">📝</div>
            <h3 className="text-2xl font-bold mb-4 text-amber-300">你的星語冊還是空的</h3>
            <div className="bg-slate-700 p-6 rounded-xl">
              <p className="text-lg opacity-90 leading-relaxed">
                使用記憶標記槍（🔫）在星圖中標記不熟悉的單字，
                它們會自動出現在這裡供你複習！
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-800 text-white rounded-lg overflow-hidden">
      {/* 頂部標題區域 */}
      <div className="p-6 border-b border-white/10">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-storybook text-gradient">📖 星語冊</h2>
          <Badge variant="glass" className="text-base px-4 py-2">
            {markedWords.length} 個待複習單字
          </Badge>
        </div>
      </div>

      {/* 可滾動的單字列表 */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {markedWordDetails.map((wordDetail) => {
            const accuracyRate = wordDetail.attempts > 0 ?
              (wordDetail.correct / wordDetail.attempts * 100) : 0;

            return (
              <div
                key={wordDetail.word}
                className="bg-slate-700 p-4 rounded-xl border-2 transition-all hover:scale-[1.02] border-slate-600 hover:border-slate-500 hover:bg-slate-600"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-amber-300">
                    {wordDetail.word}
                  </h3>
                  <Button
                    onClick={() => handleRemoveMark(wordDetail.word)}
                    variant="ghost"
                    size="sm"
                    className="text-red-300 hover:text-red-200 hover:bg-red-900/20 p-1 h-auto"
                  >
                    ❌
                  </Button>
                </div>

                <p className="text-base mb-3 opacity-90">
                  {wordDetail.meaning}
                </p>

                <div className="mb-4">
                  <p className="text-sm opacity-70 mb-2">同義詞:</p>
                  <div className="flex flex-wrap gap-1">
                    {wordDetail.synonyms.slice(0, 4).map((synonym, index) => (
                      <Badge
                        key={index}
                        variant="soft"
                        className="text-xs"
                      >
                        {synonym}
                      </Badge>
                    ))}
                    {wordDetail.synonyms.length > 4 && (
                      <Badge variant="ghost" className="text-xs opacity-70">
                        +{wordDetail.synonyms.length - 4} 更多
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-80">星星亮度</span>
                    <span className="font-medium">{(wordDetail.brightness * 100).toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={wordDetail.brightness}
                    max={1}
                    variant="star"
                    size="sm"
                  />
                  {wordDetail.attempts > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="opacity-80">正確率</span>
                      <span className={`font-medium ${
                        accuracyRate >= 80 ? 'text-emerald-300' :
                        accuracyRate >= 50 ? 'text-yellow-300' : 'text-red-300'
                      }`}>
                        {accuracyRate.toFixed(0)}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mb-3">
                  <Button
                    onClick={() => handleStartMission(wordDetail.word)}
                    variant="primary"
                    size="sm"
                    className="flex-1"
                  >
                    🎯 練習
                  </Button>
                  <Button
                    onClick={() => actions.selectStar(wordDetail.word)}
                    variant="secondary"
                    size="sm"
                  >
                    👁️ 查看
                  </Button>
                </div>

                {wordDetail.attempts > 0 && (
                  <div className="text-xs opacity-70 text-center p-2 glass-dark rounded-lg">
                    已練習 {wordDetail.attempts} 次，答對 {wordDetail.correct} 次
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 底部提示 */}
        <div className="mt-8 bg-slate-700 p-6 rounded-xl text-center">
          <div className="space-y-2 text-sm opacity-80">
            <p>💡 提示: 經常複習標記的單字可以提高記憶效果</p>
            <p>🎯 建議針對低亮度或低正確率的單字多加練習</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StarNotebook;
