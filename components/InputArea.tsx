import React, { useState, useRef, useEffect } from 'react';
import { ImagePlus, X, Send, UploadCloud } from 'lucide-react';
import { MAX_FILE_SIZE_MB } from '../constants';

interface InputAreaProps {
  onSend: (text: string, image?: string) => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading }) => {
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea logic
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to correctly calculate scrollHeight for shrinking
      textareaRef.current.style.height = 'auto';
      // Set to scrollHeight, clamped by CSS max-height
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

  // Paste Handler for Images
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault(); // Prevent default paste behavior
        const file = items[i].getAsFile();
        if (file) processFile(file);
        return; // Stop looking after finding an image
      }
    }
  };

  // Drag and Drop Handlers
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
    // Reset height manually after send
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
      className={`relative bg-slate-800/60 backdrop-blur-md rounded-2xl p-3 md:p-4 border shadow-xl transition-all duration-300 ${
        isDragging ? 'border-pink-500 bg-slate-800/90 scale-[1.02]' : 'border-slate-700'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 rounded-2xl border-2 border-dashed border-pink-500">
          <div className="flex flex-col items-center text-pink-400 p-4 text-center">
            <UploadCloud size={48} className="mb-2" />
            <p className="font-bold text-lg">Drop Chat Screenshot Here</p>
          </div>
        </div>
      )}

      {preview && (
        <div className="relative mb-4 inline-block animate-fade-in group">
          <img src={preview} alt="Upload preview" className="h-24 md:h-32 rounded-lg border border-slate-600 object-cover shadow-lg" />
          <button
            onClick={() => {
                setPreview(null); 
                if(fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition shadow-md"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder="Paste chat screenshot, or ask: 'Plan a coffee date in NYC'..."
          className="w-full bg-transparent text-slate-100 placeholder-slate-500 outline-none resize-none min-h-[60px] max-h-[300px] overflow-y-auto text-base md:text-lg custom-scrollbar"
          disabled={isLoading}
          rows={1}
        />
        
        <div className="flex justify-between items-center border-t border-slate-700 pt-3 gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 md:px-3 md:py-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors flex items-center gap-2 group whitespace-nowrap"
              title="Upload Chat Screenshot"
              disabled={isLoading}
            >
              <ImagePlus size={20} className="group-hover:scale-110 transition-transform shrink-0"/>
              <span className="text-xs font-medium hidden sm:inline text-slate-500 group-hover:text-blue-400">Add Screenshot</span>
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
            className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-full font-semibold transition-all transform active:scale-95 text-sm md:text-base ${
              (!text && !preview) || isLoading
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)]'
            }`}
          >
            {isLoading ? 'Thinking...' : <span className="hidden xs:inline">Generate Rizz</span>}
            {isLoading ? null : <span className="xs:hidden">Rizz It</span>}
            {!isLoading && <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputArea;