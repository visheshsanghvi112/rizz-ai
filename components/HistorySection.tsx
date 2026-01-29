import React from 'react';
import { HistoryItem } from '../types';
import { Clock, Trash2, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface HistorySectionProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

const HistorySection: React.FC<HistorySectionProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full mt-12 animate-fade-in">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-slate-400 font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
          <Clock size={14} /> Recent Rizz
        </h3>
        <button 
          onClick={onClear}
          className="text-xs text-red-500/70 hover:text-red-400 flex items-center gap-1 transition-colors"
        >
          <Trash2 size={12} /> Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 transition-all group text-left"
          >
            <div className="flex flex-col overflow-hidden">
              <span className="text-slate-200 text-sm font-medium truncate pr-4">
                {item.prompt || (item.imagePreview ? 'Image Analysis' : 'Empty Prompt')}
              </span>
              <div className="flex items-center gap-2 mt-1">
                 <span className="text-[10px] text-slate-500">
                    {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                 </span>
                 <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {item.mode}
                 </span>
              </div>
            </div>
            <ArrowRight size={14} className="text-slate-600 group-hover:text-pink-500 transition-colors shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistorySection;