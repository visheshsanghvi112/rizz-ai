import React from 'react';
import { ModelMode } from '../types';
import { Zap, BrainCircuit, Search } from 'lucide-react';

interface ToneSelectorProps {
  currentMode: ModelMode;
  setMode: (mode: ModelMode) => void;
}

const ToneSelector: React.FC<ToneSelectorProps> = ({ currentMode, setMode }) => {
  const modes = [
    { 
      id: ModelMode.FAST, 
      label: 'Fast Rizz', 
      icon: Zap, 
      desc: 'Quick wit (Gemini 3 Flash)',
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10 border-yellow-400/20'
    },
    { 
      id: ModelMode.DEEP, 
      label: 'Deep Analysis', 
      icon: BrainCircuit, 
      desc: 'Smart thinking (Gemini 3 Pro)',
      color: 'text-purple-400',
      bg: 'bg-purple-400/10 border-purple-400/20'
    },
    { 
      id: ModelMode.SEARCH, 
      label: 'Date Planner', 
      icon: Search, 
      desc: 'Real info (Search)',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10 border-blue-400/20'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
      {modes.map((mode) => {
        const isSelected = currentMode === mode.id;
        const Icon = mode.icon;
        return (
          <button
            key={mode.id}
            onClick={() => setMode(mode.id)}
            className={`flex items-center sm:block md:flex gap-3 p-3 rounded-xl border transition-all duration-200 text-left h-full ${
              isSelected 
                ? `${mode.bg} border-opacity-100 shadow-[0_0_15px_rgba(0,0,0,0.3)]` 
                : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <div className={`p-2 rounded-lg bg-slate-900 ${mode.color} shrink-0 mb-0 sm:mb-2 md:mb-0`}>
              <Icon size={20} />
            </div>
            <div className="min-w-0">
              <div className={`font-semibold text-sm truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                {mode.label}
              </div>
              <div className="text-xs text-slate-500 truncate">{mode.desc}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ToneSelector;