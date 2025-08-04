import React, { useState } from 'react';
import useStarStore from '../store/useStarStore';

function SettingsPanel({ onReplayStory }) {
  const [isOpen, setIsOpen] = useState(false);
  const { actions } = useStarStore();

  const handleExportProgress = () => {
    actions.exportProgress();
    setIsOpen(false);
  };


  const handleResetProgress = () => {
    if (confirm('確定要重置所有學習進度嗎？此操作無法復原。')) {
      actions.resetProgress();
      setIsOpen(false);
    }
  };

  const handleReplayStory = () => {
    onReplayStory();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* 設置按鈕 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        ⚙️
      </button>

      {/* 設置面板 */}
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div 
            className="fixed inset-0 bg-black/20 z-30"
            onClick={() => setIsOpen(false)}
          />
          
          {/* 設置內容 */}
          <div className="absolute top-12 right-0 w-64 bg-white rounded-lg shadow-xl border border-indigo-200 z-50 fade-in">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                ⚙️ 設置選單
              </h3>
              
              <div className="space-y-3">
                {/* 重播故事 */}
                <button
                  onClick={handleReplayStory}
                  className="w-full text-left px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  📖 重播開場故事
                </button>

                {/* 儲存進度 */}
                <button
                  onClick={handleExportProgress}
                  className="w-full text-left px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  💾 儲存學習進度
                </button>

                {/* 分隔線 */}
                <div className="border-t border-gray-200 my-2" />

                {/* 重置進度 */}
                <button
                  onClick={handleResetProgress}
                  className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  🗑️ 重置所有進度
                </button>
              </div>

              {/* 版本信息 */}
              <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500 text-center">
                GRE-StarNet v1.1<br/>
                星語者計畫
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SettingsPanel;