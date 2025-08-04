import React, { useState, useEffect } from 'react';
import useStarStore from '../store/useStarStore';

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

  // 創建星座分組（使用圖算法找到所有相互連接的同義詞群組）
  useEffect(() => {
    const wordMap = new Map();
    
    // 建立單字查找表
    starData.forEach(item => {
      wordMap.set(item.word, item);
    });

    // 建立雙向連接圖（只建立原始的同義詞關係）
    const connections = new Map();
    starData.forEach(item => {
      if (!connections.has(item.word)) {
        connections.set(item.word, new Set());
      }
      
      item.synonyms.forEach(synonym => {
        // 檢查同義詞是否存在於詞彙表中
        if (wordMap.has(synonym)) {
          // 只建立直接的雙向連接（A-B，B-A）
          connections.get(item.word).add(synonym);
          if (!connections.has(synonym)) {
            connections.set(synonym, new Set());
          }
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
    starData.forEach(item => {
      if (!visited.has(item.word)) {
        const constellationGroup = new Set();
        dfs(item.word, constellationGroup);
        
        if (constellationGroup.size > 0) {
          const groupWords = Array.from(constellationGroup);
          const stars = groupWords.map(word => wordMap.get(word)).filter(Boolean);
          
          // 選擇第一個單字作為主星（或可以選擇最重要的）
          const mainStar = stars[0];
          
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

          createdConstellations.push({
            id: `constellation-${createdConstellations.length}`,
            mainStar,
            stars,
            connections: Array.from(constellationConnections).map(conn => conn.split('-'))
          });
        }
      }
    });

    setConstellations(createdConstellations);
  }, [starData]);

  const currentConstellation = constellations[currentPage];
  const totalPages = constellations.length;

  const handleStarClick = (word) => {
    if (isMarkingMode) {
      actions.toggleStarMark(word);
    } else {
      actions.selectStar(word);
    }
  };

  const handleStarDoubleClick = (word) => {
    actions.startMission(word);
  };

  const getStarStyle = (word) => {
    const progress = starProgress[word] || { brightness: 0, marked: false };
    const baseSize = 60;
    const brightnessSize = progress.brightness * 20;
    
    return {
      width: baseSize + brightnessSize,
      height: baseSize + brightnessSize,
      backgroundColor: progress.marked ? '#ff6b6b' : '#ffffff',
      borderWidth: progress.marked ? 4 : 2,
      borderColor: progress.marked ? '#e55353' : 
                   selectedStar === word ? '#4a90e2' : '#cccccc',
      opacity: 0.4 + (progress.brightness * 0.6),
      boxShadow: selectedStar === word ? '0 0 20px #4a90e2' : 
                 progress.marked ? '0 0 15px #ff6b6b' : 'none'
    };
  };

  const renderConstellation = () => {
    if (!currentConstellation) return null;

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

    return (
      <div className="relative w-full h-96 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-lg overflow-hidden">
        {/* 星空背景效果 */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* 星座連線 */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {currentConstellation.connections && 
           currentConstellation.connections.map(([from, to], index) => {
            const fromIndex = stars.findIndex(star => star && star.word === from);
            const toIndex = stars.findIndex(star => star && star.word === to);
            
            if (fromIndex === -1 || toIndex === -1 || fromIndex >= positions.length || toIndex >= positions.length) {
              return null;
            }
            
            const fromPos = positions[fromIndex];
            const toPos = positions[toIndex];
            const fromProgress = starProgress[from] || { brightness: 0 };
            const toProgress = starProgress[to] || { brightness: 0 };
            const avgBrightness = (fromProgress.brightness + toProgress.brightness) / 2;
            
            return (
              <line
                key={`${from}-${to}-${index}`}
                x1={`${fromPos.x}%`}
                y1={`${fromPos.y}%`}
                x2={`${toPos.x}%`}
                y2={`${toPos.y}%`}
                stroke="#a0a0ff"
                strokeWidth="2"
                opacity={0.3 + avgBrightness * 0.4}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>

        {/* 星星 */}
        {stars.map((star, index) => {
          if (!star) return null;
          const position = positions[index];
          const isMainStar = index === 0;
          
          return (
            <div
              key={star.word}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                cursor: isMarkingMode ? 'crosshair' : 'pointer'
              }}
              onClick={() => handleStarClick(star.word)}
              onDoubleClick={() => handleStarDoubleClick(star.word)}
            >
              <div
                className="rounded-full border-solid flex items-center justify-center transition-all duration-300"
                style={getStarStyle(star.word)}
              >
                <span className={`font-bold text-center leading-tight ${
                  isMainStar ? 'text-lg text-black' : 'text-sm text-gray-800'
                }`}>
                  {star.word}
                </span>
              </div>
              
              {/* 主星標記 */}
              {isMainStar && (
                <div className="absolute -top-2 -right-2 text-yellow-400 text-xl animate-pulse">
                  ⭐
                </div>
              )}
            </div>
          );
        })}

        {/* 星座名稱 */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
          <h3 className="text-lg font-bold">
            {mainStar.word} 星座
          </h3>
          <p className="text-sm opacity-80 mb-1">
            {mainStar.meaning}
          </p>
          <p className="text-xs opacity-60">
            {stars.length} 顆星星 • {currentConstellation.connections ? currentConstellation.connections.length : 0} 條連線
          </p>
        </div>

        {/* 翻頁控制 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black bg-opacity-50 text-white px-6 py-3 rounded-full">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="px-3 py-1 rounded hover:bg-white hover:bg-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← 上一個
          </button>
          
          <span className="text-sm">
            {currentPage + 1} / {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            className="px-3 py-1 rounded hover:bg-white hover:bg-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一個 →
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full border-2 border-gray-300 rounded-lg relative">
      <div className="flex justify-between items-center p-4 bg-gray-100 rounded-t-lg">
        <h2 className="text-xl font-bold text-gray-800">🌌 我的詞彙星圖</h2>
        <div className="flex gap-2">
          <button
            onClick={actions.toggleMarkingMode}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isMarkingMode 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🔫 {isMarkingMode ? '標記模式 ON' : '標記模式 OFF'}
          </button>
          <input
            type="file"
            accept=".json"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  try {
                    const data = JSON.parse(event.target.result);
                    if (actions.importProgress(data)) {
                      alert('進度匯入成功！');
                    } else {
                      alert('匯入失敗：檔案格式不正確');
                    }
                  } catch (error) {
                    alert('匯入失敗：檔案無法解析');
                  }
                };
                reader.readAsText(file);
              }
              e.target.value = '';
            }}
            className="hidden"
            id="import-progress"
          />
          <label
            htmlFor="import-progress"
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-medium cursor-pointer"
          >
            📂 匯入進度
          </label>
          <button
            onClick={actions.exportProgress}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
          >
            💾 匯出進度
          </button>
        </div>
      </div>
      
      {renderConstellation()}
      
      {selectedStar && (
        <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-sm z-10">
          <h3 className="font-bold text-lg text-black">{selectedStar}</h3>
          <p className="text-gray-600 mb-2">
            {starData.find(item => item.word === selectedStar)?.meaning}
          </p>
          <div className="text-sm">
            <p className="font-medium text-black">同義詞:</p>
            <p className="text-blue-600">
              {starData.find(item => item.word === selectedStar)?.synonyms.join(', ')}
            </p>
          </div>
          <button
            onClick={() => actions.startMission(selectedStar)}
            className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          >
            開始修復任務
          </button>
        </div>
      )}
      
      {/* 使用說明 */}
      <div className="p-4 bg-gray-50 rounded-b-lg text-sm text-gray-600">
        <p className="mb-1">
          💡 <strong>使用說明:</strong> 單擊星星選擇，雙擊開始修復任務，翻頁瀏覽不同星座
        </p>
        <p className="mb-2">
          🎯 星座自動分組相互關聯的同義詞（A-B-C 鏈式連接，但 A 不直接連 C）
        </p>
        {currentConstellation && (
          <p className="text-xs opacity-75">
            <strong>當前星座包含:</strong> {currentConstellation.stars.map(s => s.word).join(', ')}
          </p>
        )}
      </div>
    </div>
  );
}

export default StarMap;