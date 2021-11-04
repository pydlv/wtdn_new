import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import {store} from './store'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import BootstrapVue from "bootstrap-vue";

Vue.config.productionTip = false

Vue.use(BootstrapVue);

export const vm = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

Vue.prototype.$successToast = (message: string) => {
    vm.$bvToast.toast(message, {
        title: 'Success',
        variant: 'success',
        solid: true,
        autoHideDelay: 2000
    })
}

Vue.prototype.$failToast = (message: string) => {
    vm.$bvToast.toast(message, {
        title: 'Failure',
        variant: 'danger',
        solid: true,
        autoHideDelay: 2000
    })
}
