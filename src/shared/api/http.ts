import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000, // 10 seconds
});

// Request interceptor: Attach authentication token from sessionStorage
apiClient.interceptors.request.use((config) => {
  const raw = sessionStorage.getItem('quill_auth');

  if (!raw) {
    return config;
  }

  try {
    const parsed = JSON.parse(raw) as { token?: string };

    if (parsed.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  } catch {
    sessionStorage.removeItem('quill_auth');
  }

  return config;
});

// Response interceptor: Handle errors globally with console logging
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error details for debugging
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const endpoint = error.config?.url;
      const message = error.response?.data?.message || error.message;

      console.error('[API Error]', {
        status,
        endpoint,
        message,
        timestamp: new Date().toISOString(),
      });

      // Log 401 specifically for auth issues
      if (status === 401) {
        console.warn('[Auth Error] Unauthorized request - token may be invalid or expired');
      }
    } else {
      console.error('[API Error] Non-Axios error:', error);
    }

    return Promise.reject(error);
  }
);
