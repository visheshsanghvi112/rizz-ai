import React from 'react';
import { Linkedin, Github, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 mt-12 border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400">
            RizzMaster AI
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <p className="text-sm text-slate-400 font-medium flex items-center gap-1">
            Made with <span className="text-red-500 animate-pulse">❤️</span> by 
            <a 
              href="http://linkedin.com/in/vishesh-sanghvi-96b16a237/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-400 transition-colors underline decoration-pink-500/30 underline-offset-4"
            >
              Vishesh Sanghvi
            </a>
          </p>
          
          <div className="flex items-center gap-4 mt-1">
            <a 
              href="http://linkedin.com/in/vishesh-sanghvi-96b16a237/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-[#0077b5] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            {/* Add more social links if needed */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;