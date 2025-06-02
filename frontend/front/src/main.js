import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'leaflet/dist/leaflet.css';
import Toast from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import 'animate.css';

const app = createApp(App);
app.use(router);
app.use(Toast, {
  autoClose: 3000,
  position: 'top-right',
});
app.mount('#app');