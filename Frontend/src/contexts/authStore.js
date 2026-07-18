import { create } from 'zustand';
import { TOKEN_KEY, USER_KEY } from '@/constants';

// Hydrate from localStorage on load
const savedUser  = (() => { try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; } })();
const savedToken = localStorage.getItem(TOKEN_KEY);

const useAuthStore = create((set) => ({
  user:  savedUser  || null,
  token: savedToken || null,
  isAuthenticated: !!(savedUser && savedToken),

  setAuth: (user, token) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  updateUser: (updated) => {
    const merged = { ...(savedUser || {}), ...updated };
    localStorage.setItem(USER_KEY, JSON.stringify(merged));
    set((s) => ({ user: { ...s.user, ...updated } }));
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
