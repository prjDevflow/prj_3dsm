import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Request interceptor para adicionar token
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('@dashboard:user');
  if (user) {
    const token = 'fake-jwt-token'; // Mock token
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;