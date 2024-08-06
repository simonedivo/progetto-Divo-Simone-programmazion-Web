import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './routing/routing.js';

createApp(App).use(router).mount('#app');