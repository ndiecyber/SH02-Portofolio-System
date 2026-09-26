import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ppms-backend-api-production.up.railway.app';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach token if it exists (for Bearer fallback) & strip empty query params
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sh02_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Strip empty string query params to avoid backend 422 validation errors on enum fields
    if (config.params && typeof config.params === 'object') {
      const cleanParams = {};
      Object.keys(config.params).forEach((key) => {
        const val = config.params[key];
        if (val !== '' && val !== null && val !== undefined) {
          cleanParams[key] = val;
        }
      });
      config.params = cleanParams;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors globally & enrich error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        const isAuthEndpoint = error.config?.url?.includes('/auth/');
        if (!isAuthEndpoint) {
          // Automatic logout on unauthorized status for data endpoints
          localStorage.removeItem('sh02_auth_token');
          localStorage.removeItem('sh02_auth_user');
          window.dispatchEvent(new Event('auth-logout'));
        }
      }

      // Enrich error.message with backend's specific validation error details
      const data = error.response.data;
      if (data) {
        if (data.summary) {
          error.message = data.summary;
        } else if (data.message) {
          error.message = data.message;
        }
      }
    }
    return Promise.reject(error);
  }
);

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export default api;
