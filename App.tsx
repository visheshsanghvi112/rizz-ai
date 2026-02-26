import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputArea from './components/InputArea';
import ResultCard from './components/ResultCard';
import ToneSelector from './components/ToneSelector';
import VibeSelector from './components/VibeSelector';
import Footer from './components/Footer';
import HistorySection from './components/HistorySection';
import ApiKeyModal from './components/ApiKeyModal';
import { generateRizz } from './services/geminiService';
import { AnalysisResult, ModelMode, ToneSelection, HistoryItem } from './types';
import { Loader2, RefreshCw } from 'lucide-react';

const MAX_VISIBLE_SUGGESTIONS = 6;
const HISTORY_KEY = 'rizz_history_v1';
const API_KEY_STORAGE = 'gemini_api_key_v1';

const App: React.FC = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<ModelMode>(ModelMode.FAST);
  const [tone, setTone] = useState<ToneSelection>('Mixed');
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // API Key Management
  const [apiKey, setApiKey] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Track context for "Load More"
  const [lastPrompt, setLastPrompt] = useState<{text: string, image?: string} | null>(null);
  const [iteration, setIteration] = useState(0);

  // Load History & API Key
  useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }

    const savedKey = localStorage.getItem(API_KEY_STORAGE);
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      // Open modal if no key found
      setIsSettingsOpen(true);
    }
  }, []);

  const handleSaveKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem(API_KEY_STORAGE, key);
    setIsSettingsOpen(false);
  };

  const saveToHistory = (item: HistoryItem) => {
    const newHistory = [item, ...history].slice(0, 10); // Keep last 10
    setHistory(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  const handleSend = async (text: string, imageBase64?: string) => {
    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setIteration(0);
    setLastPrompt({ text, image: imageBase64 });

    try {
      const data = await generateRizz(apiKey, text, imageBase64, mode, tone, 0);
      setResult(data);
      
      // Save to history
      saveToHistory({
        id: Date.now().toString(),
        timestamp: Date.now(),
        prompt: text,
        imagePreview: imageBase64,
        result: data,
        mode,
        tone
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. The AI got nervous.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!lastPrompt || !result) return;
    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }
    
    setIsLoading(true);
    const nextIter = iteration + 1;
    setIteration(nextIter);

    try {
      const newData = await generateRizz(apiKey, lastPrompt.text, lastPrompt.image, mode, tone, nextIter);
      
      setResult(prev => {
        if (!prev) return newData;
        
        // Rolling window
        const allSuggestions = [...prev.suggestions, ...newData.suggestions];
        const rollingSuggestions = allSuggestions.length > MAX_VISIBLE_SUGGESTIONS 
          ? allSuggestions.slice(allSuggestions.length - MAX_VISIBLE_SUGGESTIONS)
          : allSuggestions;

        return {
          ...prev,
          summary: prev.summary,
          suggestions: rollingSuggestions,
          groundingLinks: newData.groundingLinks || prev.groundingLinks
        };
      });
    } catch (err) {
      setError('Could not load more options.');
    } finally {
      setIsLoading(false);
    }
  };

  const restoreHistoryItem = (item: HistoryItem) => {
    setResult(item.result);
    setLastPrompt({ text: item.prompt, image: item.imagePreview });
    setMode(item.mode);
    setTone(item.tone);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] text-slate-100 selection:bg-pink-500/30">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />

      <ApiKeyModal 
        isOpen={isSettingsOpen} 
        onSave={handleSaveKey} 
        onClose={() => setIsSettingsOpen(false)}
        hasKey={!!apiKey}
      />

      <main className="flex-grow max-w-3xl mx-auto px-4 w-full flex flex-col gap-6 pb-8">
        
        <div className="text-center space-y-3 mb-2 pt-4">
          <h2 className="text-2xl md:text-3xl font-light text-slate-200 tracking-tight">
             Crush your reply game.
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Upload chat screenshots or explain the context. <br className="hidden sm:block"/>
            Powered by <span className="text-blue-400 font-medium">Gemini 3 Pro</span> & <span className="text-yellow-400 font-medium">Flash</span>
          </p>
        </div>

        <div className="flex flex-col gap-1 mt-2">
          <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1 mb-1">Select Model</label>
          <ToneSelector currentMode={mode} setMode={setMode} />
        </div>

        <VibeSelector selectedTone={tone} setTone={setTone} />

        <InputArea onSend={handleSend} isLoading={isLoading} />

        {isLoading && !result && (
          <div className="flex flex-col items-center justify-center py-16 animate-pulse text-slate-500">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-pink-500" />
            <p className="text-sm font-medium tracking-widest uppercase animate-pulse">
              {mode === ModelMode.DEEP ? 'Analyzing Vibe...' : 'Cooking Rizz...'}
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 my-2">
               <div className="h-[1px] bg-slate-800 flex-1"></div>
               <span className="text-xs font-medium text-slate-600 uppercase tracking-widest">Results</span>
               <div className="h-[1px] bg-slate-800 flex-1"></div>
            </div>

            <ResultCard result={result} />
            
            <div className="flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="group flex items-center gap-2 px-8 py-3 rounded-full bg-slate-900 border border-slate-700 hover:border-pink-500/50 hover:bg-slate-800 transition-all shadow-lg active:scale-95 hover:shadow-pink-500/10"
              >
                {isLoading ? (
                   <Loader2 className="w-4 h-4 animate-spin text-pink-500" />
                ) : (
                   <RefreshCw className="w-4 h-4 text-pink-500 group-hover:rotate-180 transition-transform" />
                )}
                <span className="font-semibold text-slate-300 group-hover:text-white text-sm">
                  {isLoading ? 'Thinking...' : 'Load Better Options'}
                </span>
              </button>
            </div>
          </div>
        )}

        <HistorySection history={history} onSelect={restoreHistoryItem} onClear={clearHistory} />

      </main>

      <Footer />
    </div>
  );
};

export default App;