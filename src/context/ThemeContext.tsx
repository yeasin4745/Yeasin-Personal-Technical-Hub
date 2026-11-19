import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeMode } from '../types';

interface ThemeContextType {
  theme: ThemeMode;
  isHighContrast: boolean;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const STORAGE_KEY = 'yeasin_portfolio_theme_mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY);
      if (savedTheme === 'cyber-dark' || savedTheme === 'high-contrast') {
        return savedTheme;
      }
      // Check system contrast preference
      if (window.matchMedia && window.matchMedia('(prefers-contrast: more)').matches) {
        return 'high-contrast';
      }
    } catch {
      // Fallback for private browsing or restricted environments
    }
    return 'cyber-dark';
  });

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch (err) {
      console.error('Could not save theme preference:', err);
    }
  };

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'cyber-dark' ? 'high-contrast' : 'cyber-dark';
    setTheme(nextTheme);
  };

  // Sync DOM classes and attributes on theme change
  useEffect(() => {
    const root = document.documentElement;
    const isHC = theme === 'high-contrast';

    if (isHC) {
      root.classList.add('high-contrast', 'theme-high-contrast');
      root.classList.remove('theme-cyber-dark');
      root.setAttribute('data-theme', 'high-contrast');
    } else {
      root.classList.add('theme-cyber-dark');
      root.classList.remove('high-contrast', 'theme-high-contrast');
      root.setAttribute('data-theme', 'cyber-dark');
    }
  }, [theme]);

  // Listen for OS system contrast changes
  useEffect(() => {
    if (!window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-contrast: more)');
    
    const handleContrastChange = (e: MediaQueryListEvent) => {
      // Only auto-update if the user hasn't explicitly set a preference in localStorage
      try {
        const hasSaved = localStorage.getItem(STORAGE_KEY);
        if (!hasSaved) {
          setTheme(e.matches ? 'high-contrast' : 'cyber-dark');
        }
      } catch {
        // Ignored
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleContrastChange);
    } else {
      mediaQuery.addListener(handleContrastChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleContrastChange);
      } else {
        mediaQuery.removeListener(handleContrastChange);
      }
    };
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isHighContrast: theme === 'high-contrast',
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
