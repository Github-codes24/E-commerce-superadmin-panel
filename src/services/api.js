import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://e-commerce-backend-1-we80.onrender.com/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error if needed
      console.warn('Unauthorized access - please login again.');
    }
    return Promise.reject(error);
  }
);

export default api;
