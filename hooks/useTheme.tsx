import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

export const useTheme = () => {
    const [theme, setTheme] = useState<Theme>(() => {
        // Check localStorage or system preference
        const saved = localStorage.getItem('rizz-theme');
        if (saved === 'light' || saved === 'dark') return saved;

        // Default to dark mode
        return 'dark';
    });

    useEffect(() => {
        localStorage.setItem('rizz-theme', theme);

        // Update document class
        if (theme === 'light') {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
        } else {
            document.documentElement.classList.remove('light');
            document.documentElement.classList.add('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return { theme, toggleTheme };
};
