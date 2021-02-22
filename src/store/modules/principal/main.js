import Menu, {MENU_SIMPLE} from "@/store/modules/principal/Menu";

const menu =[
    new Menu('Lugares','/lugares',null,null,MENU_SIMPLE),
]

const state = {

}

const getters = {
    main_menus: state => menu
}

const actions = {

}

const mutations = {

}

export default {
    state,
    getters,
    actions,
    mutations
};
