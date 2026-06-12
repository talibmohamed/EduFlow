import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('eduflow_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url ?? '';
      // /api/auth/login: let the login form surface the error itself.
      // /api/auth/me: AuthContext already handles the session-restore failure path.
      const isAuthEndpoint = url === '/api/auth/login' || url === '/api/auth/me';

      if (!isAuthEndpoint) {
        localStorage.removeItem('eduflow_token');
        // Skip redirect if already on /auth to avoid a loop.
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
          window.location.replace('/auth');
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
