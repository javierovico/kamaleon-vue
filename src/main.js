import Vue from 'vue'
import App from './App.vue'
import router from "@/router/router";
import store from '@/store'
//Bootstarp
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

//https://www.npmjs.com/package/vue-sweetalert2
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
Vue.use(VueSweetalert2);

//https://www.npmjs.com/package/vue2-google-maps
import * as VueGoogleMaps from 'vue2-google-maps'
Vue.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyAViVaAwNI4Uss03dVlks2gMZXcYQm3Xlg',
        // libraries: 'places', // This is required if you use the Autocomplete plugin
    },
})

/** Axios **/
import axios from 'axios';
axios.defaults.baseURL = process.env.VUE_APP_URL_API;
axios.defaults.headers.post['Content-Type'] = 'application/json';

Vue.config.productionTip = false

new Vue({
    render: h => h(App),
    router,
    store,
}).$mount('#app')
