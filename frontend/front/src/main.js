import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Set base URL with localhost fallback for development
axios.defaults.baseURL = import.meta.env.VUE_APP_API_BASE_URL || 'http://localhost:5000';

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