import Vue from "vue";
import VueRouter from "vue-router";
import Prueba from "@/components/Prueba";
import PuntosView from "@/components/punto/PuntosView";
import PuntoView from "@/components/punto/PuntoView";
Vue.use(VueRouter);

const routes = [
    {
        path: "/lugares",
        name: "Lugares",
        component: PuntosView,
        props:{
            propPrefijoQuery: 'punto',
        }
    },
    {
        path: "/punto-slug/:hotel_slug",
        name: "Hotel",
        component: PuntoView,
        props: (route) => ({
            propPrefijoQuery: 'punto_slug',
            propSlug: route.params.hotel_slug
        })
    },
]

export default new VueRouter({
    mode: "history",
    routes
})