import api from '../utils/api';

export const adminApi = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard'),

  // Users
  getUsers: (filters = {}) => api.get('/admin/users', { params: filters }),
  toggleAdminStatus: (id) => api.put(`/admin/users/${id}/toggle-admin`),
  // Note: createUser, updateUser, deleteUser, toggleUserStatus, updateUserRole are not explicitly mapped to backend yet, but the backend is ready.

  // Tools
  getTools: (filters = {}) => api.get('/admin/tools', { params: filters }),
  createTool: (data) => api.post('/admin/tools', data),
  updateTool: (id, data) => api.put(`/admin/tools/${id}`, data),
  deleteTool: (id) => api.delete(`/admin/tools/${id}`),
  toggleToolStatus: (id) => api.put(`/admin/tools/${id}/toggle-status`),
  // Note: getToolById, getCategories, createCategory, updateCategory, deleteCategory are not mapped to backend yet.

  // Analytics
  getAnalytics: () => api.get('/admin/analytics'),

  // Settings
  getSystemSettings: () => api.get('/admin/settings'),
  updateSystemSettings: (data) => api.put('/admin/settings', data),
};
