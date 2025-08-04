import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import starDataJson from '../data/star_data.json';

const useStarStore = create(
  persist(
    (set, get) => ({
      // 詞彙資料
      starData: starDataJson,
      
      // 使用者進度資料
      starProgress: {}, // { wordId: { marked: false, attempts: 3, correct: 2 } }
      
      // 連線亮度資料 - 每條連線（單字間的等價關係）的亮度
      connectionBrightness: {}, // { "word1-word2": 0.3, "word2-word3": 0.7 }
      
      // 標記模式狀態
      isMarkingMode: false,
      
      // 目前的學習/挑戰狀態
      currentMission: null, // { word: 'alleviate', synonyms: [...], userInputs: [...] }

      // 修復任務隊列狀態
      missionQueue: [], // [{ word, meaning, synonyms }]
      missionIndex: 0,
      
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
              marked: !state.starProgress[word]?.marked,
              attempts: state.starProgress[word]?.attempts || 0,
              correct: state.starProgress[word]?.correct || 0
            }
          }
        })),
        
        // 更新連線亮度（根據答題表現）
        updateConnectionBrightness: (word1, word2, delta) => set(state => {
          const connectionKey = [word1, word2].sort().join('-');
          const currentBrightness = state.connectionBrightness[connectionKey] || 0;
          const newBrightness = Math.max(0, Math.min(1, currentBrightness + delta));
          
          return {
            connectionBrightness: {
              ...state.connectionBrightness,
              [connectionKey]: newBrightness
            }
          };
        }),
        
        // 記錄答題嘗試
        recordAttempt: (word, isCorrect) => set(state => {
          const current = state.starProgress[word] || { marked: false, attempts: 0, correct: 0 };
          
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
              },
              missionQueue: [],
              missionIndex: 0
            });
          }
        },

        // 開始一個修復任務序列
        startMissionSession: (count = 15) => {
          const shuffled = [...starDataJson].sort(() => Math.random() - 0.5);
          const selected = shuffled.slice(0, count);
          if (selected.length > 0) {
            set({
              missionQueue: selected,
              missionIndex: 0,
              currentMission: {
                word: selected[0].word,
                meaning: selected[0].meaning,
                synonyms: selected[0].synonyms,
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
            // 計算正確率並更新連線亮度
            const { word, synonyms, userInputs } = state.currentMission;
            const correctInputs = userInputs.filter(input => 
              synonyms.some(synonym => synonym.toLowerCase() === input.toLowerCase())
            );
            const accuracy = correctInputs.length / synonyms.length;
            
            // 對每個正確的同義詞，更新其與主詞的連線亮度
            correctInputs.forEach(correctInput => {
              const matchingSynonym = synonyms.find(synonym => 
                synonym.toLowerCase() === correctInput.toLowerCase()
              );
              if (matchingSynonym) {
                get().actions.updateConnectionBrightness(word, matchingSynonym, 0.1);
              }
            });
            
            // 記錄答題嘗試
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

        // 進入下一個修復任務或結束序列
        nextMission: () => set(state => {
          const nextIndex = state.missionIndex + 1;
          if (state.missionQueue && nextIndex < state.missionQueue.length) {
            const nextItem = state.missionQueue[nextIndex];
            return {
              missionIndex: nextIndex,
              currentMission: {
                word: nextItem.word,
                meaning: nextItem.meaning,
                synonyms: nextItem.synonyms,
                userInputs: [],
                completed: false
              }
            };
          }
          return {
            currentMission: null,
            missionQueue: [],
            missionIndex: 0
          };
        }),

        // 清除當前任務與序列
        clearMission: () => set({ currentMission: null, missionQueue: [], missionIndex: 0 }),
        
        // 選擇星星
        selectStar: (word) => set({ selectedStar: word }),
        
        // 清除選擇
        clearSelection: () => set({ selectedStar: null }),
        
        // 獲取標記的單字
        getMarkedStars: () => {
          const { starProgress } = get();
          return Object.keys(starProgress).filter(word => starProgress[word]?.marked);
        },
        
        // 獲取連線亮度
        getConnectionBrightness: (word1, word2) => {
          const { connectionBrightness } = get();
          const connectionKey = [word1, word2].sort().join('-');
          return connectionBrightness[connectionKey] || 0;
        },
        
        // 計算星星亮度（所有相連線的亮度總和）
        getStarBrightness: (word) => {
          const { starData, connectionBrightness } = get();
          const starItem = starData.find(item => item.word === word);
          if (!starItem) return 0;
          
          let totalBrightness = 0;
          
          // 計算與同義詞的連線亮度總和
          starItem.synonyms.forEach(synonym => {
            const connectionKey = [word, synonym].sort().join('-');
            totalBrightness += connectionBrightness[connectionKey] || 0;
          });
          
          // 也要檢查其他星星是否將此詞作為同義詞
          starData.forEach(otherItem => {
            if (otherItem.word !== word && otherItem.synonyms.includes(word)) {
              const connectionKey = [word, otherItem.word].sort().join('-');
              totalBrightness += connectionBrightness[connectionKey] || 0;
            }
          });
          
          return Math.min(1, totalBrightness); // 最大亮度為1
        },
        
        // 獲取星星狀態
        getStarState: (word) => {
          const { starProgress } = get();
          const brightness = get().actions.getStarBrightness(word);
          return { 
            brightness, 
            marked: starProgress[word]?.marked || false, 
            attempts: starProgress[word]?.attempts || 0, 
            correct: starProgress[word]?.correct || 0 
          };
        },
        
        // 匯出進度
        exportProgress: () => {
          const { starProgress, connectionBrightness } = get();
          const exportData = {
            version: '1.1',
            timestamp: new Date().toISOString(),
            starProgress,
            connectionBrightness
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
              const updateData = { starProgress: data.starProgress };
              if (data.connectionBrightness) {
                updateData.connectionBrightness = data.connectionBrightness;
              }
              set(updateData);
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
          connectionBrightness: {},
          currentMission: null,
          selectedStar: null
        })
      }
    }),
    {
      name: 'gre-starnet-storage',
      // 只持久化必要的資料
      partialize: (state) => ({
        starProgress: state.starProgress,
        connectionBrightness: state.connectionBrightness
      })
    }
  )
);

export default useStarStore;