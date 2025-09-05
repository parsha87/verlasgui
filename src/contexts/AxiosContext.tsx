// src/contexts/AxiosContext.tsx
import axios from 'axios';
import config from '../config';

const api = axios.create({
  baseURL:  config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // ✅ Skip token for login and register
    const skipAuth = ['/login', '/register'];
    const isAuthSkipped = skipAuth.some(path => config.url?.includes(path));

    if (!isAuthSkipped) {
      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
