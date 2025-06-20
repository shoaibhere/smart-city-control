
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
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
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password },{withCredentials:true});
    return response.data;
  },
  register: async (username: string,firstName:string,lastName:string, email: string, password: string) => {
    const response = await api.post('/auth/register', { username,firstName,lastName, email, password},{withCredentials:true});
    return response.data;
  },
};

// lib/api.ts
export const issuesAPI = {
create: async (data: FormData) => {
  return await axios.post('http://localhost:8000/api/issues', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      
    },
    withCredentials:true
  });
}

};


// Polls API
export const pollsAPI = {
  getAll: async () => {
    const response = await api.get('/polls');
    return response.data;
  },
  create: async (pollData: any) => {
    const response = await api.post('/polls', pollData);
    return response.data;
  },
  vote: async (id: string, optionId: string) => {
    const response = await api.post(`/polls/${id}/vote`, { optionId });
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  create: async (userData: any) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  updateRole: async (id: string, role: string) => {
    const response = await api.put(`/users/${id}/role`, { role });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

// Reports API
export const reportsAPI = {
  upload: async (reportData: any) => {
    const response = await api.post('/reports', reportData);
    return response.data;
  },
};
