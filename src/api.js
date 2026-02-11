import axios from 'axios';

// 1. Log the variable to the console so you can debug in the browser (F12)
console.log('Current API URL:', import.meta.env.VITE_API_BASE_URL);

let baseURL = import.meta.env.VITE_API_BASE_URL;

// 2. Safety Fallback: If we are in production but the variable is missing, force the Render URL
if (!baseURL && import.meta.env.MODE === 'production') {
    console.warn('VITE_API_BASE_URL missing in production. Defaulting to Render URL.');
    baseURL = 'https://diosys-backend.onrender.com/api';
} 

// 3. Dev Fallback
if (!baseURL) {
    baseURL = 'http://localhost:8000/api'; // Or your local test URL
}

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ACCESS_TOKEN');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('ACCESS_TOKEN');
      // Optional: Redirect to login if needed
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;