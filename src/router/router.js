import Vue from "vue";
import VueRouter from "vue-router";
import Inicio from "@/components/Inicio";
import PuntosView from "@/components/punto/PuntosView";
import PuntoView from "@/components/punto/PuntoView";
import MapaView from '@/components/mapa/MapaView'
Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Inicio",
        component: Inicio,
        props:{
            propPrefijoQuery: 'inicio',
        }
    },
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
    {
        path: '/prueba-mapa',
        name: "PruebaMapa",
        component: MapaView,
    }
]

export default new VueRouter({
    mode: "history",
    routes
})