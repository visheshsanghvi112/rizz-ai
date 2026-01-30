import React from 'react';
import { Sparkles, Flame, Sun, Moon } from 'lucide-react';
import { Theme } from '../hooks/useTheme';

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
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
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${theme === 'dark'
              ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400 border border-slate-700'
              : 'bg-white hover:bg-gray-100 text-slate-700 border border-gray-200 shadow-sm'
            }`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        <div className="hidden sm:flex gap-2">
          <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-medium whitespace-nowrap ${theme === 'dark'
              ? 'bg-slate-800 border border-slate-700 text-slate-400'
              : 'bg-white border border-gray-200 text-slate-600 shadow-sm'
            }`}>Gemini 2.5</span>
        </div>
      </div>
    </header>
  );
};

export default Header;