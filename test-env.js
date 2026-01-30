console.log('=== RIZZ AI ENVIRONMENT CHECK ===');
console.log('VITE_GEMINI_API_KEY exists:', !!import.meta.env.VITE_GEMINI_API_KEY);
console.log('API Key length:', import.meta.env.VITE_GEMINI_API_KEY?.length || 0);
console.log('API Key starts with AIza:', import.meta.env.VITE_GEMINI_API_KEY?.startsWith('AIza'));
console.log('=================================');
