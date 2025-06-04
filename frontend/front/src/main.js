import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Use your existing VUE_API_BASE_URL environment variable
axios.defaults.baseURL = import.meta.env.VUE_APP_API_BASE_URL || 'http://localhost:5000';

// CRITICAL: Enable credentials for cross-origin requests
axios.defaults.withCredentials = true;

const app = createApp(App);

// Configure axios globally
app.config.globalProperties.$axios = axios;

// Add toast notification plugin
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-right',
  theme: 'colored',
  transition: 'zoom',
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
});

// Add router
app.use(router);

// Mount the app
app.mount('#app');

// Add global error handler
app.config.errorHandler = (err) => {
  console.error('Global Vue error:', err);
  const toast = app.config.globalProperties.$toast;
  if (toast) {
    toast.error(`Application error: ${err.message}`);
  }
};

// Add request interceptor to include token in all requests
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Add response interceptor to handle 401 errors
axios.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    router.push('/');
    app.config.globalProperties.$toast.error('Session expired. Please log in again.');
  }
  return Promise.reject(error);
});