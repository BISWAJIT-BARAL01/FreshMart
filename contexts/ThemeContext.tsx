import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  reduceMotion: boolean;
  toggleReduceMotion: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Load from local storage
    const savedTheme = localStorage.getItem('freshmart_theme') as Theme;
    const savedMotion = localStorage.getItem('freshmart_motion') === 'true';
    if (savedTheme) setTheme(savedTheme);
    if (savedMotion) setReduceMotion(savedMotion);
  }, []);

  useEffect(() => {
    // Apply theme class to body
    const root = window.document.documentElement;
    const body = window.document.body;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.remove('light-mode');
    } else {
      root.classList.remove('dark');
      body.classList.add('light-mode');
    }
    
    localStorage.setItem('freshmart_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('freshmart_motion', String(reduceMotion));
  }, [reduceMotion]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleReduceMotion = () => {
    setReduceMotion(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, reduceMotion, toggleReduceMotion }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};