import React, { useState, useRef, useEffect } from 'react';
import { ImagePlus, X, Send, UploadCloud, Sparkles } from 'lucide-react';
import { MAX_FILE_SIZE_MB } from '../constants';

interface InputAreaProps {
  onSend: (text: string, image?: string) => void;
  isLoading: boolean;
  theme?: 'light' | 'dark';
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading, theme = 'dark' }) => {
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const processFile = (file: File) => {
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`File too large. Max ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) processFile(file);
        return;
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleSend = () => {
    if ((!text.trim() && !preview) || isLoading) return;
    const base64 = preview ? preview.split(',')[1] : undefined;
    onSend(text, base64);
    setText('');
    setPreview(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`relative rounded-2xl p-4 md:p-5 border shadow-2xl transition-all duration-300 ${isDragging
          ? theme === 'dark'
            ? 'border-pink-500 bg-slate-800/90 scale-[1.02] shadow-pink-500/20'
            : 'border-pink-400 bg-white/90 scale-[1.02] shadow-pink-400/20'
          : theme === 'dark'
            ? 'border-slate-700/50 bg-slate-800/40 backdrop-blur-xl'
            : 'border-gray-200 bg-white/60 backdrop-blur-xl shadow-lg'
        }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Gradient glow effect */}
      <div className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${theme === 'dark' ? 'bg-gradient-to-r from-pink-500/10 to-purple-500/10' : 'bg-gradient-to-r from-pink-400/10 to-purple-400/10'
        }`} />

      {/* Drag Overlay */}
      {isDragging && (
        <div className={`absolute inset-0 z-50 flex items-center justify-center rounded-2xl border-2 border-dashed ${theme === 'dark'
            ? 'bg-slate-900/90 border-pink-500 backdrop-blur-md'
            : 'bg-white/90 border-pink-400 backdrop-blur-md'
          }`}>
          <div className="flex flex-col items-center text-center p-4">
            <div className="relative">
              <UploadCloud size={56} className={theme === 'dark' ? 'text-pink-400' : 'text-pink-500'} />
              <Sparkles size={20} className={`absolute -top-2 -right-2 ${theme === 'dark' ? 'text-yellow-400' : 'text-amber-500'} animate-pulse`} />
            </div>
            <p className={`font-bold text-lg mt-3 ${theme === 'dark' ? 'text-pink-300' : 'text-pink-600'}`}>Drop Your Screenshot Here</p>
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>We'll analyze it instantly</p>
          </div>
        </div>
      )}

      {preview && (
        <div className="relative mb-4 inline-block animate-fade-in">
          <img
            src={preview}
            alt="Upload preview"
            className={`h-28 md:h-36 rounded-xl object-cover shadow-xl border-2 transition-transform hover:scale-105 ${theme === 'dark' ? 'border-slate-600' : 'border-gray-300'
              }`}
          />
          <button
            onClick={() => {
              setPreview(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-all shadow-lg hover:scale-110 active:scale-95"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-4 relative z-10">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder="Paste chat screenshot, or ask: 'Plan a coffee date in NYC'..."
          className={`w-full bg-transparent outline-none resize-none min-h-[70px] max-h-[300px] overflow-y-auto text-base md:text-lg custom-scrollbar ${theme === 'dark'
              ? 'text-slate-100 placeholder-slate-500'
              : 'text-slate-900 placeholder-slate-400'
            }`}
          disabled={isLoading}
          rows={1}
        />

        <div className={`flex justify-between items-center border-t pt-4 gap-3 ${theme === 'dark' ? 'border-slate-700/50' : 'border-gray-200'
          }`}>
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`px-3 py-2.5 rounded-xl transition-all flex items-center gap-2 group ${theme === 'dark'
                  ? 'text-slate-400 hover:text-blue-400 hover:bg-blue-400/10'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              title="Upload Chat Screenshot"
              disabled={isLoading}
            >
              <ImagePlus size={20} className="group-hover:scale-110 transition-transform shrink-0" />
              <span className={`text-xs font-semibold hidden sm:inline ${theme === 'dark' ? 'group-hover:text-blue-400' : 'group-hover:text-blue-600'
                }`}>
                Add Screenshot
              </span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={(!text && !preview) || isLoading}
            className={`relative flex items-center gap-2.5 px-5 md:px-7 py-3 rounded-full font-bold transition-all transform active:scale-95 text-sm md:text-base overflow-hidden group ${(!text && !preview) || isLoading
                ? theme === 'dark'
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 via-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/40 hover:shadow-xl hover:shadow-pink-500/60 hover:scale-105'
              }`}
          >
            {/* Shimmer effect */}
            {(!text && !preview) || isLoading ? null : (
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            )}

            <span className="relative z-10 flex items-center gap-2">
              {isLoading ? (
                <>
                  <Sparkles size={16} className="animate-spin" />
                  <span>Cooking...</span>
                </>
              ) : (
                <>
                  <span className="hidden xs:inline">Generate Rizz</span>
                  <span className="xs:hidden">Rizz It</span>
                  <Send size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputArea;