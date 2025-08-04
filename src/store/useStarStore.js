import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import starDataJson from '../data/star_data.json';

const useStarStore = create(
  persist(
    (set, get) => ({
      // 詞彙資料
      starData: starDataJson,
      
      // 使用者進度資料
      starProgress: {}, // { wordId: { brightness: 0.5, marked: false, attempts: 3, correct: 2 } }
      
      // 標記模式狀態
      isMarkingMode: false,
      
      // 目前的學習/挑戰狀態
      currentMission: null, // { word: 'alleviate', synonyms: [...], userInputs: [...] }
      
      // UI 狀態
      selectedStar: null,
      
      // Actions
      actions: {
        // 切換標記模式
        toggleMarkingMode: () => set(state => ({
          isMarkingMode: !state.isMarkingMode
        })),
        
        // 標記/取消標記單字
        toggleStarMark: (word) => set(state => ({
          starProgress: {
            ...state.starProgress,
            [word]: {
              brightness: state.starProgress[word]?.brightness || 0,
              marked: !state.starProgress[word]?.marked,
              attempts: state.starProgress[word]?.attempts || 0,
              correct: state.starProgress[word]?.correct || 0
            }
          }
        })),
        
        // 更新星星亮度（根據答題表現）
        updateStarBrightness: (word, delta) => set(state => {
          const current = state.starProgress[word] || { brightness: 0, marked: false, attempts: 0, correct: 0 };
          const newBrightness = Math.max(0, Math.min(1, current.brightness + delta));
          
          return {
            starProgress: {
              ...state.starProgress,
              [word]: {
                ...current,
                brightness: newBrightness
              }
            }
          };
        }),
        
        // 記錄答題嘗試
        recordAttempt: (word, isCorrect) => set(state => {
          const current = state.starProgress[word] || { brightness: 0, marked: false, attempts: 0, correct: 0 };
          
          return {
            starProgress: {
              ...state.starProgress,
              [word]: {
                ...current,
                attempts: current.attempts + 1,
                correct: current.correct + (isCorrect ? 1 : 0)
              }
            }
          };
        }),
        
        // 開始修復任務
        startMission: (word) => {
          const starItem = starDataJson.find(item => item.word === word);
          if (starItem) {
            set({
              currentMission: {
                word: starItem.word,
                meaning: starItem.meaning,
                synonyms: starItem.synonyms,
                userInputs: [],
                completed: false
              }
            });
          }
        },
        
        // 更新任務使用者輸入
        updateMissionInput: (inputs) => set(state => ({
          currentMission: state.currentMission ? {
            ...state.currentMission,
            userInputs: inputs
          } : null
        })),
        
        // 完成任務
        completeMission: () => set(state => {
          if (state.currentMission) {
            // 計算正確率並更新亮度
            const { word, synonyms, userInputs } = state.currentMission;
            const correctCount = userInputs.filter(input => 
              synonyms.some(synonym => synonym.toLowerCase() === input.toLowerCase())
            ).length;
            const accuracy = correctCount / synonyms.length;
            const brightnessIncrease = accuracy * 0.2; // 全對可增加0.2亮度
            
            // 更新星星亮度和記錄
            get().actions.updateStarBrightness(word, brightnessIncrease);
            get().actions.recordAttempt(word, accuracy > 0.8);
            
            return {
              currentMission: {
                ...state.currentMission,
                completed: true
              }
            };
          }
          return state;
        }),
        
        // 清除當前任務
        clearMission: () => set({ currentMission: null }),
        
        // 選擇星星
        selectStar: (word) => set({ selectedStar: word }),
        
        // 清除選擇
        clearSelection: () => set({ selectedStar: null }),
        
        // 獲取標記的單字
        getMarkedStars: () => {
          const { starProgress } = get();
          return Object.keys(starProgress).filter(word => starProgress[word]?.marked);
        },
        
        // 獲取星星狀態
        getStarState: (word) => {
          const { starProgress } = get();
          return starProgress[word] || { brightness: 0, marked: false, attempts: 0, correct: 0 };
        },
        
        // 匯出進度
        exportProgress: () => {
          const { starProgress } = get();
          const exportData = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            starProgress
          };
          
          const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `gre-starnet-progress-${new Date().toISOString().slice(0, 10)}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        },
        
        // 匯入進度
        importProgress: (progressData) => {
          try {
            const data = typeof progressData === 'string' ? JSON.parse(progressData) : progressData;
            if (data.starProgress) {
              set({ starProgress: data.starProgress });
              return true;
            }
            return false;
          } catch (error) {
            console.error('Failed to import progress:', error);
            return false;
          }
        },
        
        // 重置所有進度
        resetProgress: () => set({ 
          starProgress: {},
          currentMission: null,
          selectedStar: null
        })
      }
    }),
    {
      name: 'gre-starnet-storage',
      // 只持久化必要的資料
      partialize: (state) => ({
        starProgress: state.starProgress
      })
    }
  )
);

export default useStarStore;