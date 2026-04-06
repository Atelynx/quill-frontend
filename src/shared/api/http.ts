import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
});

apiClient.interceptors.request.use((config) => {
  const raw = localStorage.getItem('quill_auth');

  if (!raw) {
    return config;
  }

  try {
    const parsed = JSON.parse(raw) as { token?: string };

    if (parsed.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  } catch {
    localStorage.removeItem('quill_auth');
  }

  return config;
});
