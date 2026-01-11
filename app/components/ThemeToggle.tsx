'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    const [darkMode, setDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const updateTheme = () => {
            // Check if 'dark' class is present on html
            const isDark = document.documentElement.classList.contains('dark');
            setDarkMode(isDark);

            // Also check/sync with local storage if needed, but the DOM is the source of truth for current state
            // If explicit storage or media query logic is needed for initialization:
            if (!isDark && (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches))) {
                // Should be dark but isn't? 
                // This block usually runs on mount to initialization.
                // But better to trust the class presence if another component already set it.
            }
        };

        // Initial check
        const initTheme = () => {
            if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
                setDarkMode(true);
            } else {
                document.documentElement.classList.remove('dark');
                setDarkMode(false);
            }
        }

        // If the class is already set (by another instance or script), trust it.
        // Otherwise, run init logic.
        if (document.documentElement.classList.contains('dark')) {
            setDarkMode(true);
        } else {
            initTheme();
        }

        const handleStorageChange = () => {
            // Sync when localStorage changes (e.g. other tabs)
            initTheme();
        }

        const handleCustomEvent = () => {
            setDarkMode(document.documentElement.classList.contains('dark'));
        }

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('theme-change', handleCustomEvent);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('theme-change', handleCustomEvent);
        };
    }, []);

    const toggleTheme = () => {
        if (darkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setDarkMode(true);
        }
        window.dispatchEvent(new Event('theme-change'));
    };

    if (!mounted) return null;

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle Dark Mode"
        >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
    );
}
