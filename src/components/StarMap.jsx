import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui';
import useStarStore from '../store/useStarStore';
import CharacterDisplay from './CharacterDisplay';

function StarMap() {
  const {
    starData,
    starProgress,
    isMarkingMode,
    selectedStar,
    actions
  } = useStarStore();

  const [currentPage, setCurrentPage] = useState(0);
  const [constellations, setConstellations] = useState([]);
  const positionsRef = useRef([]);
  const [tooltipPos, setTooltipPos] = useState(null);

  // 創建星座分組（使用圖算法找到所有相互連接的同義詞群組）
  useEffect(() => {
    // 收集所有出現的詞彙（包括同義詞）
    const allWords = new Set();
    const wordData = new Map();
    const connections = new Map();

    // 第一步：收集所有詞彙和它們的數據
    starData.forEach(item => {
      allWords.add(item.word);
      wordData.set(item.word, item);
      
      // 也收集所有同義詞
      item.synonyms.forEach(synonym => {
        allWords.add(synonym);
        // 如果同義詞沒有數據，創建基本數據
        if (!wordData.has(synonym)) {
          wordData.set(synonym, {
            word: synonym,
            meaning: "同義詞",
            synonyms: []
          });
        }
      });
    });

    // 第二步：建立連接關係
    allWords.forEach(word => {
      connections.set(word, new Set());
    });

    starData.forEach(item => {
      item.synonyms.forEach(synonym => {
        // 建立單向連接：主詞 → 同義詞
        connections.get(item.word).add(synonym);
        
        // 如果同義詞也有自己的同義詞列表，建立反向連接
        const synonymData = starData.find(s => s.word === synonym);
        if (synonymData && synonymData.synonyms.includes(item.word)) {
          connections.get(synonym).add(item.word);
        }
      });
    });


    // 使用深度優先搜索找到所有連通分量（星座）
    const visited = new Set();
    const createdConstellations = [];

    const dfs = (word, currentGroup) => {
      if (visited.has(word)) return;
      visited.add(word);
      currentGroup.add(word);
      
      const neighbors = connections.get(word) || new Set();
      neighbors.forEach(neighbor => {
        if (!visited.has(neighbor)) {
          dfs(neighbor, currentGroup);
        }
      });
    };

    // 找到所有星座群組
    allWords.forEach(word => {
      if (!visited.has(word)) {
        const constellationGroup = new Set();
        dfs(word, constellationGroup);
        
        if (constellationGroup.size > 0) {
          const groupWords = Array.from(constellationGroup);
          const stars = groupWords.map(word => wordData.get(word)).filter(Boolean);
          
          // 選擇中心星：優先選擇來自原始數據的詞，其次選擇連接最多的詞
          const mainStar = stars.reduce((prev, current) => {
            // 優先選擇來自starData的詞（有意思和同義詞的詞）
            const prevHasData = starData.some(item => item.word === prev.word);
            const currentHasData = starData.some(item => item.word === current.word);
            
            if (prevHasData && !currentHasData) return prev;
            if (!prevHasData && currentHasData) return current;
            
            // 如果都有或都沒有數據，選擇連接最多的
            const prevConnections = connections.get(prev.word)?.size || 0;
            const currentConnections = connections.get(current.word)?.size || 0;
            return currentConnections > prevConnections ? current : prev;
          });
          
          // 生成這個星座內的實際連線（避免重複）
          const constellationConnections = new Set();
          groupWords.forEach(word => {
            const neighbors = connections.get(word) || new Set();
            neighbors.forEach(neighbor => {
              if (constellationGroup.has(neighbor)) {
                // 使用字典序排序避免重複連線 (A-B 和 B-A)
                const connection = [word, neighbor].sort().join('-');
                constellationConnections.add(connection);
              }
            });
          });

          // 如果沒有連線但有多個星星，創建基本的星型連線（以主星為中心）
          if (constellationConnections.size === 0 && groupWords.length > 1) {
            const centerWord = mainStar.word;
            groupWords.forEach(word => {
              if (word !== centerWord) {
                const connection = [centerWord, word].sort().join('-');
                constellationConnections.add(connection);
              }
            });
          }

          const connectionsArray = Array.from(constellationConnections).map(conn => conn.split('-'));

          // 確保主星位於星星列表的第一個位置
          const orderedStars = [
            mainStar,
            ...stars.filter(s => s.word !== mainStar.word)
          ];

          createdConstellations.push({
            id: `constellation-${createdConstellations.length}`,
            mainStar,
            stars: orderedStars,
            connections: connectionsArray
          });
          
        }
      }
    });

    setConstellations(createdConstellations);
  }, [starData]);

  const currentConstellation = constellations[currentPage];
  const totalPages = constellations.length;

  const handleStarClick = (word, position) => {
    if (isMarkingMode) {
      actions.toggleStarMark(word);
    } else {
      actions.selectStar(word);
      setTooltipPos(position);
    }
  };

  const handleStarDoubleClick = (word) => {
    actions.startMission(word);
  };

  const getStarStyle = (word) => {
    const starState = actions.getStarState(word);
    const baseSize = 20;
    const brightnessSize = starState.brightness * 12;
    const totalSize = baseSize + brightnessSize;
    
    // 根據亮度選擇顏色
    const getStarColor = () => {
      if (starState.marked) return '#fbbf24'; // 金色標記
      if (starState.brightness > 0.7) return '#fbbf24'; // 金色高亮
      if (starState.brightness > 0.4) return '#c084fc'; // 紫色中亮
      if (starState.brightness > 0.1) return '#a5b4fc'; // 藍色低亮
      return '#f8fafc'; // 白色未練習
    };
    
    return {
      width: totalSize,
      height: totalSize,
      backgroundColor: getStarColor(),
      borderWidth: starState.marked ? 3 : 1,
      borderColor: starState.marked ? '#f59e0b' : 
                   selectedStar === word ? '#60a5fa' : 'transparent',
      opacity: 0.6 + (starState.brightness * 0.4),
      boxShadow: selectedStar === word ? `0 0 20px ${getStarColor()}` : 
                 starState.marked ? `0 0 15px #fbbf24` : 
                 starState.brightness > 0.3 ? `0 0 8px ${getStarColor()}` : 'none',
      transform: starState.brightness > 0.5 ? 'scale(1.1)' : 'scale(1)',
      filter: `brightness(${1 + starState.brightness * 0.3})`
    };
  };

  // 當外部選擇星星時，更新提示框位置
  useEffect(() => {
    if (!selectedStar || !currentConstellation) {
      setTooltipPos(null);
      return;
    }
    const index = currentConstellation.stars.findIndex(s => s.word === selectedStar);
    if (index !== -1 && positionsRef.current[index]) {
      setTooltipPos(positionsRef.current[index]);
    }
  }, [selectedStar, currentConstellation]);

  const renderConstellation = () => {
    if (!currentConstellation) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-lg">
          <div className="text-white text-center">
            <div className="text-2xl mb-2">🌌</div>
            <div className="text-lg font-medium">載入星座中...</div>
          </div>
        </div>
      );
    }

    const { mainStar, stars } = currentConstellation;
    
    // 動態位置布局 - 根據星座大小調整
    const generatePositions = (starCount) => {
      const positions = [{ x: 50, y: 50 }]; // 主星位置（中心）
      
      if (starCount <= 1) return positions;
      
      // 為其他星星生成圓形分布的位置
      const radius = Math.min(35, 25 + starCount * 2); // 動態半徑
      const angleStep = (2 * Math.PI) / (starCount - 1);
      
      for (let i = 1; i < starCount; i++) {
        const angle = angleStep * (i - 1);
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        
        // 確保星星在畫布範圍內
        positions.push({
          x: Math.max(10, Math.min(90, x)),
          y: Math.max(10, Math.min(90, y))
        });
      }
      
      return positions;
    };
    
    const positions = generatePositions(stars.length);
    positionsRef.current = positions;

    return (
      <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-lg overflow-hidden">
        {/* 魔幻星空背景效果 - 移除浮動動畫 */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(50)].map((_, i) => {
            const colors = ['bg-white', 'bg-yellow-200', 'bg-pink-200', 'bg-blue-200'];
            const sizes = ['w-0.5 h-0.5', 'w-1 h-1', 'w-1.5 h-1.5'];
            return (
              <div
                key={i}
                className={`absolute ${colors[Math.floor(Math.random() * colors.length)]} ${sizes[Math.floor(Math.random() * sizes.length)]} rounded-full`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  boxShadow: '0 0 6px currentColor'
                }}
              />
            );
          })}
        </div>

        {/* 星座連線 */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="magicalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a5b4fc" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>
          {currentConstellation.connections && 
           currentConstellation.connections.map(([from, to], index) => {
            const fromIndex = stars.findIndex(star => star && star.word === from);
            const toIndex = stars.findIndex(star => star && star.word === to);
            
            if (fromIndex === -1 || toIndex === -1 || fromIndex >= positions.length || toIndex >= positions.length) {
              return null;
            }
            
            const fromPos = positions[fromIndex];
            const toPos = positions[toIndex];
            const connectionBrightness = actions.getConnectionBrightness(from, to);


            return (
              <line
                key={`${from}-${to}-${index}`}
                x1={`${fromPos.x}%`}
                y1={`${fromPos.y}%`}
                x2={`${toPos.x}%`}
                y2={`${toPos.y}%`}
                stroke={connectionBrightness > 0 ? 'url(#magicalGradient)' : '#9ca3af'}
                strokeWidth="2"
                opacity={0.8 + connectionBrightness * 0.2}
                strokeLinecap="round"
                className="transition-all duration-500 drop-shadow-sm"
                style={{
                  filter: `brightness(${0.8 + connectionBrightness * 0.5})`,
                  strokeDasharray: '4 4',
                  animation: connectionBrightness > 0.3 ? 'twinkle 2s ease-in-out infinite' : 'none'
                }}
              />
            );
          })}
        </svg>

        {/* 星星 */}
        {stars.map((star, index) => {
          if (!star) return null;
          const position = positions[index];
          const isMainStar = index === 0;
          
          const starState = actions.getStarState(star.word);
          
          return (
            <div
              key={star.word}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 hover:scale-125 z-10`}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                cursor: isMarkingMode ? 'crosshair' : 'pointer'
              }}
              onClick={() => handleStarClick(star.word, position)}
              onDoubleClick={() => handleStarDoubleClick(star.word)}
            >
              <div className="relative">
                <div
                  className="rounded-full border-solid transition-all duration-300"
                  style={getStarStyle(star.word)}
                />
                <span
                  className="absolute left-full ml-1 top-1/2 -translate-y-1/2 font-bold text-base text-white whitespace-nowrap"
                  style={{ textShadow: '0 0 3px rgba(0,0,0,0.9)' }}
                >
                  {star.word}
                </span>
              </div>
            </div>
          );
        })}

        {/* 語星獸引導 */}
        <CharacterDisplay 
          type="glyphox" 
          position="bottom-left" 
          size="medium" 
          mood={currentConstellation && currentConstellation.stars.some(s => actions.getStarState(s.word).brightness > 0.5) ? 'happy' : 'guiding'} 
        />

        {/* 翻頁控制 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-sm text-white px-6 py-3 rounded-full border border-white/20">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
          >
            ← 上一個
          </button>
          
          <span className="text-base font-semibold px-2">
            {currentPage + 1} / {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
          >
            下一個 →
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full relative">
      {renderConstellation()}
      
      {selectedStar && (
        <div
          className="absolute bg-white/95 backdrop-blur-sm p-5 rounded-xl shadow-xl max-w-sm z-10 border border-white/20"
          style={
            tooltipPos
              ? {
                  left: `${tooltipPos.x}%`,
                  top: `${tooltipPos.y}%`,
                  transform: 'translate(-50%, -120%)'
                }
              : { bottom: '1rem', right: '1rem' }
          }
        >
          <h3 className="font-bold text-xl text-black mb-2">{selectedStar}</h3>
          <p className="text-gray-700 mb-3 text-base">
            {starData.find(item => item.word === selectedStar)?.meaning}
          </p>
          <div className="text-base">
            <p className="font-semibold text-black mb-1">同義詞:</p>
            <p className="text-blue-600">
              {starData.find(item => item.word === selectedStar)?.synonyms.join(', ')}
            </p>
          </div>
          <button
            onClick={() => actions.startMission(selectedStar)}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-base font-medium transition-colors"
          >
            開始修復任務
          </button>
        </div>
      )}
    </div>
  );
}

export default StarMap;