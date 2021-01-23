import Vue from "vue";
import VueRouter from "vue-router";
import Prueba from "@/components/Prueba";
Vue.use(VueRouter);

const routes = [
    {
        path: "/hola",
        name: "Home",
        component: Prueba
    },
]

export default new VueRouter({
    mode: "history",
    routes
})