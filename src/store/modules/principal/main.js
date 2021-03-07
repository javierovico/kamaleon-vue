import Menu, {MENU_SIMPLE} from "@/store/modules/principal/Menu";

const menu =[
    new Menu('Lugares','/lugares',null,null,MENU_SIMPLE),
]

const state = {
    departamento_id: null,
    ciudad_id: null,
    busqueda: '',
}

const getters = {
    main_menus: state => menu,
    main_departamento_id: state => state.departamento_id,
    main_ciudad_id: state => state.ciudad_id,
    main_busqueda: state => state.busqueda,

}

const actions = {
    main_set_ciudad_id({commit},ciudad_id){
        commit('main_set_ciudad_id',ciudad_id)
    },
    main_set_departamento_id({commit},departamento_id){
        commit('main_set_departamento_id',departamento_id)
    },
    main_set_busqueda({commit},busqueda){
        commit('main_set_busqueda',busqueda)
    }
}

const mutations = {
    main_set_ciudad_id: (state,ciudad_id) =>{
        state.ciudad_id = ciudad_id
    },
    main_set_departamento_id: (state,departamento_id) =>{
        state.departamento_id = departamento_id
    },
    main_set_busqueda: (state,busqueda) =>{
        state.busqueda = busqueda
    },
}

export default {
    state,
    getters,
    actions,
    mutations
};
