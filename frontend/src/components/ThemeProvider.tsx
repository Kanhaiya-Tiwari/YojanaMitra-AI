'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type Lang = 'en' | 'hi';

interface ThemeContextType {
    theme: Theme;
    lang: Lang;
    toggleTheme: () => void;
    toggleLang: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    lang: 'en',
    toggleTheme: () => { },
    toggleLang: () => { },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light');
    const [lang, setLang] = useState<Lang>('en');

    useEffect(() => {
        const savedTheme = localStorage.getItem('ym_theme') as Theme;
        const savedLang = localStorage.getItem('ym_lang') as Lang;
        if (savedTheme) setTheme(savedTheme);
        if (savedLang) setLang(savedLang);
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('ym_theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('ym_lang', lang);
    }, [lang]);

    const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));
    const toggleLang = () => setLang(l => (l === 'en' ? 'hi' : 'en'));

    return (
        <ThemeContext.Provider value={{ theme, lang, toggleTheme, toggleLang }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
