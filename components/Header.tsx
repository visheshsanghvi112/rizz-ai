import React from 'react';
import { Sparkles, Flame, Settings } from 'lucide-react';

interface HeaderProps {
  onOpenSettings?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="flex items-center justify-between py-4 md:py-6 px-4 md:px-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-2 group cursor-default">
        <div className="relative">
            <Flame className="w-6 h-6 md:w-8 md:h-8 text-orange-500 fill-orange-500 animate-pulse" />
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 absolute -top-1 -right-1 animate-spin-slow" />
        </div>
        <h1 className="text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-pink-600 tracking-tighter group-hover:scale-105 transition-transform">
          RizzMaster AI
        </h1>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:flex gap-2">
          <span className="px-2 py-1 md:px-3 md:py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] md:text-xs text-slate-400 font-medium whitespace-nowrap">Gemini 3 Pro</span>
          <span className="px-2 py-1 md:px-3 md:py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] md:text-xs text-slate-400 font-medium whitespace-nowrap">Gemini 3 Flash</span>
        </div>
        {onOpenSettings && (
          <button 
            onClick={onOpenSettings}
            className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="API Settings"
          >
            <Settings className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;