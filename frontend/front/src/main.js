import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Vue3Toasity from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import 'leaflet/dist/leaflet.css'; // Add this line

const app = createApp(App);
app.use(router);
app.use(Vue3Toasity, { autoClose: 3000 });
app.mount('#app');