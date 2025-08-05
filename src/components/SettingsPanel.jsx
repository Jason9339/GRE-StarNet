import React, { useState } from 'react';
import { Button } from './ui';
import useStarStore from '../store/useStarStore';

function SettingsPanel({ onReplayStory }) {
  const [isOpen, setIsOpen] = useState(false);
  const { actions, isMarkingMode } = useStarStore();

  const handleExportProgress = () => {
    actions.exportProgress();
    setIsOpen(false);
  };

  const handleImportProgress = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
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
    event.target.value = '';
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

  const handleToggleMarking = () => {
    actions.toggleMarkingMode();
  };

  return (
    <div className="space-y-6">
      {/* 標記模式切換 */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-100">星星標記</h3>
        <Button
          onClick={handleToggleMarking}
          variant={isMarkingMode ? 'accent' : 'soft'}
          size="sm"
          className="w-full justify-start py-2.5"
        >
          🔫 {isMarkingMode ? '標記模式 ON' : '標記模式 OFF'}
        </Button>
      </div>

      {/* 進度管理 */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-100">進度管理</h3>
        <div className="space-y-2">
          <Button
            onClick={handleExportProgress}
            variant="soft"
            size="sm"
            className="w-full justify-start py-2.5"
          >
            💾 匯出進度
          </Button>
          <input
            type="file"
            accept=".json"
            onChange={handleImportProgress}
            className="hidden"
            id="import-progress-sidebar"
          />
          <label htmlFor="import-progress-sidebar" className="block">
            <Button
              variant="soft"
              size="sm"
              className="w-full justify-start cursor-pointer py-2.5"
            >
              📂 匯入進度
            </Button>
          </label>
        </div>
      </div>

      {/* 其他設定 */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-100">其他設定</h3>
        <div className="space-y-2">
          <Button
            onClick={handleReplayStory}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50 py-2.5"
          >
            📖 重播故事
          </Button>
          <Button
            onClick={handleResetProgress}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-red-300 hover:text-red-200 hover:bg-red-900/20 py-2.5"
          >
            🗑️重置進度
          </Button>
        </div>
      </div>

      {/* 版本信息 */}
      <div className="text-xs text-slate-400 text-center pt-3 border-t border-slate-600/30 font-medium">
        GRE-StarNet v1.2
      </div>
    </div>
  );
}

export default SettingsPanel;