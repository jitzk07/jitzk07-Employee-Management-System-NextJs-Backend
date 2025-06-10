// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust if needed
});

api.interceptors.request.use(
  config => {
    const token = typeof window !== 'undefined' && localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token; 
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api;
