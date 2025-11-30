import { create } from 'zustand';

export const useAdminStore = create((set, get) => ({
  // Users state
  users: [],
  selectedUser: null,
  usersLoading: false,
  usersError: null,

  // Tools state
  tools: [],
  selectedTool: null,
  toolsLoading: false,
  toolsError: null,

  // Categories state
  categories: [],
  categoriesLoading: false,
  categoriesError: null,

  // Analytics state
  analytics: {
    activeUsers: 0,
    totalUsers: 0,
    toolUsage: [],
    pageVisits: [],
    subscriptionStats: {},
  },
  analyticsLoading: false,
  analyticsError: null,

  // Settings state
  settings: {
    theme: 'light',
    featureToggles: {},
  },

  // Filters and pagination
  userFilters: {
    search: '',
    role: 'all',
    status: 'all',
    page: 1,
    limit: 10,
  },

  toolFilters: {
    search: '',
    category: 'all',
    status: 'all',
    page: 1,
    limit: 10,
  },

  // User actions
  setUsers: (users) => set({ users }),
  setSelectedUser: (user) => set({ selectedUser: user }),
  setUsersLoading: (loading) => set({ usersLoading: loading }),
  setUsersError: (error) => set({ usersError: error }),

  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
    })),

  updateUser: (userId, updatedUser) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === userId ? { ...u, ...updatedUser } : u)),
    })),

  deleteUser: (userId) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== userId),
    })),

  toggleUserStatus: (userId) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId ? { ...u, active: !u.active } : u
      ),
    })),

  updateUserRole: (userId, role) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId ? { ...u, role } : u
      ),
    })),

  // Tool actions
  setTools: (tools) => set({ tools }),
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setToolsLoading: (loading) => set({ toolsLoading: loading }),
  setToolsError: (error) => set({ toolsError: error }),

  addTool: (tool) =>
    set((state) => ({
      tools: [...state.tools, tool],
    })),

  updateTool: (toolId, updatedTool) =>
    set((state) => ({
      tools: state.tools.map((t) => (t.id === toolId ? { ...t, ...updatedTool } : t)),
    })),

  deleteTool: (toolId) =>
    set((state) => ({
      tools: state.tools.filter((t) => t.id !== toolId),
    })),

  toggleToolStatus: (toolId) =>
    set((state) => ({
      tools: state.tools.map((t) =>
        t.id === toolId ? { ...t, active: !t.active } : t
      ),
    })),

  // Category actions
  setCategories: (categories) => set({ categories }),
  setCategoriesLoading: (loading) => set({ categoriesLoading: loading }),
  setCategoriesError: (error) => set({ categoriesError: error }),

  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, category],
    })),

  updateCategory: (categoryId, updatedCategory) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === categoryId ? { ...c, ...updatedCategory } : c
      ),
    })),

  deleteCategory: (categoryId) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== categoryId),
    })),

  // Analytics actions
  setAnalytics: (analytics) => set({ analytics }),
  setAnalyticsLoading: (loading) => set({ analyticsLoading: loading }),
  setAnalyticsError: (error) => set({ analyticsError: error }),

  // Settings actions
  setSettings: (settings) =>
    set((state) => ({
      settings: { ...state.settings, ...settings },
    })),

  setTheme: (theme) =>
    set((state) => ({
      settings: { ...state.settings, theme },
    })),

  toggleFeature: (featureName) =>
    set((state) => ({
      settings: {
        ...state.settings,
        featureToggles: {
          ...state.settings.featureToggles,
          [featureName]: !state.settings.featureToggles[featureName],
        },
      },
    })),

  // Filter actions
  setUserFilters: (filters) =>
    set((state) => ({
      userFilters: { ...state.userFilters, ...filters },
    })),

  setToolFilters: (filters) =>
    set((state) => ({
      toolFilters: { ...state.toolFilters, ...filters },
    })),

  // Reset actions
  resetUserFilters: () =>
    set({
      userFilters: {
        search: '',
        role: 'all',
        status: 'all',
        page: 1,
        limit: 10,
      },
    }),

  resetToolFilters: () =>
    set({
      toolFilters: {
        search: '',
        category: 'all',
        status: 'all',
        page: 1,
        limit: 10,
      },
    }),
}));
