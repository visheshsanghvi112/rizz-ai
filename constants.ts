// API Key from environment variables
// In production (Vercel), set VITE_GEMINI_API_KEY in your environment variables
export const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Debug logging (remove in production)
console.log('🔑 API Key loaded:', API_KEY ? `Yes (${API_KEY.length} chars)` : 'NO - MISSING!');

export const PLACEHOLDER_TEXT = "Paste a screenshot of your chat, or type what she said...";

export const MAX_FILE_SIZE_MB = 5;
