import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem('theme') || 'light',

  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem('theme', theme);
    applyTheme(theme);
  },

  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
      return { theme: newTheme };
    });
  },

  initTheme: () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    set({ theme: savedTheme });
    applyTheme(savedTheme);
  },
}));

// Helper function to apply theme to DOM
function applyTheme(theme) {
  const html = document.documentElement;
  if (theme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
}

// Initialize theme on store creation
useThemeStore.getState().initTheme();
