import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StateCreator } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

type ThemeStoreWithPersist = StateCreator<
  ThemeState,
  [['zustand/persist', unknown]],
  [],
  ThemeState
>;

const themeStore: ThemeStoreWithPersist = (set) => ({
  theme: 'light',
  setTheme: (theme: 'light' | 'dark') => set({ theme }),
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  }))
});

const useThemeStore = create<ThemeState>()(
  persist(themeStore, {
    name: 'theme-storage'
  })
);

export default useThemeStore; 