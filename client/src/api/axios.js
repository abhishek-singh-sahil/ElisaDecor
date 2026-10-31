// import axios from 'axios';

// // const api = axios.create({
// //   baseURL: import.meta.env.DEV
// //     ? (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
// //     : '/api',
// //   withCredentials: true,
// //   headers: {
// //     'Content-Type': 'application/json',
// //   },
// // });

// const API_URLS = import.meta.env.DEV
//   ? [
//       import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
//     ]
//   : [
//       'https://elisadecor.onrender.com/api',
//       'https://elisadecor-cr9j.onrender.com/api',
//     ];

// let activeBaseURL = API_URLS[0];

// const api = axios.create({
//   baseURL: activeBaseURL,
//   timeout: 15000,
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Response interceptor for consistent error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Only redirect to login from admin routes
//       if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
//         window.location.href = '/admin/login';
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;



import axios from 'axios';

// Primary and backup backend URLs
const API_URLS = import.meta.env.DEV
  ? [
      import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    ]
  : [
      'https://elisadecor.onrender.com/api',
      'https://elisadecor-cr9j.onrender.com/api',
    ];

// Currently active server
let activeBaseURL = API_URLS[0];

// Axios instance
const api = axios.create({
  baseURL: activeBaseURL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Always use the active backend
api.interceptors.request.use(
  (config) => {
    config.baseURL = activeBaseURL;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    activeBaseURL = response.config.baseURL;
    return response;
  },

  async (error) => {
    const config = error.config;

    // Detect network errors and server errors (5xx)
    const shouldFailover =
      !error.response ||
      (error.response.status >= 500 &&
        error.response.status <= 599);

    // Try backup server only once per request
    if (
      config &&
      shouldFailover &&
      !config._failoverAttempted &&
      API_URLS.length > 1
    ) {
      config._failoverAttempted = true;

      const failedServer = config.baseURL;

      const backupServer = API_URLS.find(
        (url) => url !== failedServer
      );

      if (backupServer) {
        console.warn(
          'Backend failed. Switching to backup:',
          backupServer
        );

        activeBaseURL = backupServer;
        config.baseURL = backupServer;

        return api.request(config);
      }
    }

    // Existing 401 authentication handling
    if (error.response?.status === 401) {
      if (
        window.location.pathname.startsWith('/admin') &&
        window.location.pathname !== '/admin/login'
      ) {
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
