import React, { useState, useEffect } from 'react';
import { Key, ShieldCheck, Zap } from 'lucide-react';
import { API_KEY } from '../constants';

interface ApiKeyModalProps {
  isOpen: boolean;
  onSave: (key: string) => void;
  onClose: () => void; // Only allowed if a key is already set
  hasKey: boolean;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave, onClose, hasKey }) => {
  const [paidKey, setPaidKey] = useState('');
  const [freeKey, setFreeKey] = useState('');
  const [error, setError] = useState('');

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setPaidKey('');
      setFreeKey('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSavePaid = () => {
    if (!paidKey.trim()) {
      setError('Please enter a valid Paid API Key');
      return;
    }
    onSave(paidKey.trim());
  };

  const handleSaveFree = () => {
    if (!freeKey.trim()) {
      setError('Please enter a valid Free API Key');
      return;
    }
    onSave(freeKey.trim());
  };

  const handleUseDemo = () => {
    const demoKey = API_KEY;
    if (!demoKey) {
      setError('Demo key is not configured in this environment.');
      return;
    }
    onSave(demoKey);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-slate-800 rounded-xl">
              <Key className="w-6 h-6 text-pink-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">API Access Required</h2>
              <p className="text-xs text-slate-400">Choose how you want to connect</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
              {error}
            </div>
          )}

          <div className="space-y-6">
            
            {/* Option 1: Paid Key */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-3 h-3" /> Paid API Key (Best Performance)
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={paidKey}
                  onChange={(e) => { setPaidKey(e.target.value); setError(''); }}
                  placeholder="Enter paid gemini-..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500/50 transition-colors placeholder:text-slate-600"
                />
                <button 
                  onClick={handleSavePaid}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors"
                >
                  Save
                </button>
              </div>
            </div>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink-0 mx-4 text-slate-600 text-[10px] uppercase tracking-widest">OR</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* Option 2: Free Key */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-3 h-3" /> Free API Key (Standard)
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={freeKey}
                  onChange={(e) => { setFreeKey(e.target.value); setError(''); }}
                  placeholder="Enter free gemini-..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600"
                />
                <button 
                  onClick={handleSaveFree}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors"
                >
                  Save
                </button>
              </div>
              <p className="text-[10px] text-slate-500">
                Don't have one? Get it at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google AI Studio</a>
              </p>
            </div>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink-0 mx-4 text-slate-600 text-[10px] uppercase tracking-widest">OR</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* Option 3: Demo Key */}
            <button
              onClick={handleUseDemo}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2 group"
            >
              <span className="text-sm font-medium">Use App's Free Key (Demo)</span>
            </button>

          </div>

          {hasKey && (
            <button 
              onClick={onClose}
              className="mt-6 w-full text-center text-xs text-slate-500 hover:text-slate-400 underline"
            >
              Cancel (Keep existing key)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
