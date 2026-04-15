import axios from 'axios';

const InstanceApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 30000,
  withCredentials: true,
});

// Request interceptor para adicionar token
// InstanceApi.interceptors.request.use((config) => {
//   const user = localStorage.getItem('@dashboard:user');
//   if (user) {
//     const token = 'fake-jwt-token'; // Mock token
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default InstanceApi;