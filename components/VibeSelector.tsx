import React from 'react';
import { RizzTone, ToneSelection } from '../types';
import { Sparkles, Heart, Smile, Skull, Briefcase, Flame } from 'lucide-react';

interface VibeSelectorProps {
  selectedTone: ToneSelection;
  setTone: (tone: ToneSelection) => void;
}

const VibeSelector: React.FC<VibeSelectorProps> = ({ selectedTone, setTone }) => {
  const vibes: { id: ToneSelection; label: string; icon: any; color: string }[] = [
    { id: 'Mixed', label: 'Surprise Me', icon: Sparkles, color: 'text-yellow-400' },
    { id: RizzTone.FLIRTY, label: 'Flirty', icon: Heart, color: 'text-pink-500' },
    { id: RizzTone.ROMANTIC, label: 'Romantic', icon: Flame, color: 'text-red-500' },
    { id: RizzTone.FUNNY, label: 'Funny', icon: Smile, color: 'text-orange-400' },
    { id: RizzTone.UNHINGED, label: 'Unhinged', icon: Skull, color: 'text-gray-400' },
    { id: RizzTone.PROFESSIONAL, label: 'Polite', icon: Briefcase, color: 'text-blue-400' },
  ];

  return (
    <div className="flex flex-col gap-2 mb-4">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
        Select Vibe
      </label>
      <div className="flex flex-wrap gap-2">
        {vibes.map((vibe) => {
          const isSelected = selectedTone === vibe.id;
          const Icon = vibe.icon;
          return (
            <button
              key={vibe.id}
              onClick={() => setTone(vibe.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all border grow sm:grow-0 justify-center ${
                isSelected
                  ? 'bg-slate-800 border-slate-500 text-white shadow-md shadow-purple-500/10'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon size={14} className={isSelected ? vibe.color : 'text-slate-500'} />
              {vibe.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VibeSelector;