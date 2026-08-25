import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use((response) => {
  const body = response.data;
  if (typeof body === 'string' && /<\s*!doctype|<\s*html/i.test(body)) {
    const error = new Error('The API returned a web page instead of JSON.');
    error.response = response;
    return Promise.reject(error);
  }
  return response;
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mera-store-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
