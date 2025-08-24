// components/ThemeProvider.tsx
import { useTheme } from '@hooks/useTheme';
import React, { useEffect } from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { isDark, mode } = useTheme();

  useEffect(() => {
    // Apply theme classes on mount and theme changes
    const root = window.document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark, mode]);

  return <>{children}</>;
};
