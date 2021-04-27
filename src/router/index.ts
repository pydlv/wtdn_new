import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import {authModule} from "@/store";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue')
    },
    {
        path: '/user-home',
        name: 'UserHome',
        component: () => import('@/views/UserHome.vue')
    },
    {
        path: '/signup',
        name: 'Sign Up',
        component: () => import('@/views/SignUp.vue')
    },
    {
        path: '/manage-account',
        name: 'Manage Account',
        component: () => import('@/views/ManageAccount.vue')
    },
    {
        path: '/change-password',
        name: 'ChangePassword',
        component: () => import('@/views/ChangePassword.vue')
    }
]

const router = new VueRouter({
    routes
})

const publicRoutes = ['/', '/home', '/login', '/signup'];
const cantBeLoggedIn = ['/login', '/signup'];

export function needsRedirectedFromNonProtectedPage(path: string) {
    // Shouldn't be able to visit the login or sign up pages
    return cantBeLoggedIn.includes(path) && authModule.isLoggedIn;
}

export function needsRedirectedFromProtectedPage(path: string) {
    return !publicRoutes.includes(path) && !authModule.isLoggedIn;
}

router.beforeEach((to, from, next) => {
    if (needsRedirectedFromNonProtectedPage(to.path)) {
        next({ name: 'UserHome' })
    } else if (needsRedirectedFromProtectedPage(to.path)) {
        next({ name: 'Login' })
    } else {
        next()
    }
})

export default router
