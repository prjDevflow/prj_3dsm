import axios from 'axios';

const InstanceApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 30000,
  withCredentials: true,
});

InstanceApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('@dashboard:token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default InstanceApi;