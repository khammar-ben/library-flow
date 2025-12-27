import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  create: (data: { email: string; password: string; role: string }) =>
    api.post('/users', data),
  update: (id: string, data: { email?: string; role?: string }) =>
    api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};

// Books API
export const booksAPI = {
  getAll: () => api.get('/books'),
  getById: (id: string) => api.get(`/books/${id}`),
  create: (data: {
    title: string;
    author: string;
    description: string;
    quantity: number;
    categoryId: string;
  }) => api.post('/books', data),
  update: (
    id: string,
    data: {
      title?: string;
      author?: string;
      description?: string;
      quantity?: number;
      categoryId?: string;
    }
  ) => api.put(`/books/${id}`, data),
  delete: (id: string) => api.delete(`/books/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id: string) => api.get(`/categories/${id}`),
  create: (data: { name: string }) => api.post('/categories', data),
  update: (id: string, data: { name: string }) =>
    api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// Emprunts API
export const empruntsAPI = {
  getAll: () => api.get('/emprunts'),
  getMyEmprunts: () => api.get('/emprunts/my'),
  getById: (id: string) => api.get(`/emprunts/${id}`),
  create: (bookId: string) => api.post('/emprunts', { bookId }),
  returnBook: (id: string) => api.put(`/emprunts/${id}/return`),
  updateStatus: (id: string, status: string) =>
    api.put(`/emprunts/${id}/status`, { status }),
};

export default api;
