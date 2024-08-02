import { createRouter, createWebHistory } from 'vue-router';
import Login from '../vues/Login.vue';
import Register from '../vues/Register.vue';

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;