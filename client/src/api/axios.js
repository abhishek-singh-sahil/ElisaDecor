import axios from 'axios';

// const api = axios.create({
//   baseURL: import.meta.env.DEV
//     ? (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
//     : '/api',
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

const API_URLS = import.meta.env.DEV
  ? [
      import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    ]
  : [
      'https://elisadecor.onrender.com/api',
      'https://elisadecor-cr9j.onrender.com/api',
    ];

let activeBaseURL = API_URLS[0];

const api = axios.create({
  baseURL: activeBaseURL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login from admin routes
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
