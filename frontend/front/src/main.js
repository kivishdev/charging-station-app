import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Vue3Toasity from 'vue3-toastify';

const app = createApp(App);
app.use(router);
app.use(Vue3Toasity, { autoClose: 3000 });
app.mount('#app');