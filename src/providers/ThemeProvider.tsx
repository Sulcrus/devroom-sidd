import React, { ReactNode } from 'react';
import { ThemeProvider as NextThemeProvider, type ThemeProviderProps } from 'next-themes';

interface Props {
  children: ReactNode;
}

export function ThemeProvider({ children }: Props) {
  return (
    <NextThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
    >
      {children}
    </NextThemeProvider>
  );
}