import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { StateCreator } from 'zustand';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  marital_status?: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

type UserStoreWithMiddleware = StateCreator<
  UserState,
  [['zustand/devtools', never], ['zustand/persist', unknown]],
  [],
  UserState
>;

const userStore: UserStoreWithMiddleware = (set, get) => ({
  user: null,
  loading: false,
  error: null,
  setUser: (user: User | null) => set({ user }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  
  fetchUser: async () => {
    try {
      set({ loading: true, error: null });
      const response = await fetch('/api/user', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/login';
          return;
        }
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch user data');
      }

      const userData = await response.json();
      set({ user: userData });
    } catch (error) {
      console.error('Error fetching user:', error);
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ loading: false });
    }
  },

  refreshUserData: async () => {
    // Clear cache to ensure fresh data
    await get().fetchUser();
  },

  logout: async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Logout failed');
      }

      set({ user: null });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/login';
    }
  }
});

const useUserStore = create<UserState>()(
  devtools(
    persist(userStore, {
      name: 'user-storage',
      partialize: (state: UserState) => ({ user: state.user })
    })
  )
);

export default useUserStore; 