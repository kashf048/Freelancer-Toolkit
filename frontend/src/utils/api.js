import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    // For development, if backend is not available, return mock data
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || error.message.includes('timeout')) {
      console.warn('Backend not available, using mock data for:', error.config?.url);
      
      // Return mock data based on the endpoint
      const url = error.config?.url || '';
      if (url.includes('/projects/1')) {
        return Promise.resolve({
          data: {
            id: 1,
            name: 'E-commerce Website Redesign',
            description: 'Complete redesign of the TechStart Inc. e-commerce platform with modern UI/UX, improved performance, and mobile responsiveness.',
            status: 'In Progress',
            priority: 'High',
            progress: 65,
            budget: 25000,
            spent: 16250,
            start_date: '2024-01-01',
            end_date: '2024-04-01',
            due_date: '2024-03-25',
            client_id: 1,
            client_name: 'TechStart Inc.',
            tags: '["Web Design", "E-commerce", "React", "UI/UX"]',
            team_members: '[{"name": "John Doe", "role": "Lead Developer", "avatar": "JD"}, {"name": "Jane Smith", "role": "UI Designer", "avatar": "JS"}]',
            milestones: '[{"name": "Design Mockups", "status": "Completed", "due_date": "2024-02-15"}, {"name": "Frontend Development", "status": "In Progress", "due_date": "2024-03-15"}]'
          }
        });
      }
      
      return Promise.resolve({ data: [] });
    }
    return Promise.reject(error);
  }
);

// Client API functions
export const clientsAPI = {
  getAll: (params = {}) => api.get('/clients', { params }),
  getById: (id) => api.get(`/clients/${id}`),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
  getStats: () => api.get('/clients/stats'),
};

// Project API functions
export const projectsAPI = {
  getAll: (params = {}) => api.get('/projects', { params }),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  getStats: () => api.get('/projects/stats'),
};

// Invoice API functions
export const invoicesAPI = {
  getAll: (params = {}) => api.get('/invoices', { params }),
  getById: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post('/invoices', data),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  delete: (id) => api.delete(`/invoices/${id}`),
  markPaid: (id, data) => api.post(`/invoices/${id}/mark-paid`, data),
  getStats: () => api.get('/invoices/stats'),
};

// User API functions
export const usersAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/signup', data),
  getProfile: () => api.get('/settings'),
  updateProfile: (data) => api.put('/settings/profile', data),
};

export default api;

