import Vue from "vue";
import Vuex from "vuex";
import main from "@/store/modules/principal/main";
import punto from "@/store/modules/punto/punto";
import general from "@/store/modules/principal/general";
import visor from "@/store/modules/visor";
import tourSpot from "@/store/modules/tourSpot";
import pano from "@/store/modules/pano";
import tour from "@/store/modules/tour";
Vue.use(Vuex);
const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
    modules: {
        main,
        punto,
        general,
        visor,
        tourSpot,
        pano,
        tour
    },
    strict: debug
});
