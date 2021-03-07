import axios from "axios";
import Punto from "@/store/modelos/Punto";
import {vaciar} from "@/Utils";


function instanciaFromParams(params) {
    return 'pano_from_params:'+JSON.stringify(params)
}

function instanciaFromSlug(slug) {
    return 'pano_from_slug:'+slug
}

const TIPO_PARAMS = 1
const TIPO_SLUG = 2
const TIPO_LOCATION_ONLY = 3

const state = {
    instancias: []
};

const getters = {
    punto_instancia: state => idInstancia => state.instancias.find(o=>o.idInstancia === idInstancia),
    punto_status: (state,getters) => idInstancia => getters.punto_instancia(idInstancia)?.status,
    punto_cargado: (state,getters) => idInstancia => getters.punto_status(idInstancia) === 'cargado',
    punto_error_string: (state,getters) => idInstancia => getters.punto_status(idInstancia) === 'error'?getters.punto_instancia(idInstancia)?.errorString:'',
    punto_cargando: (state,getters) => idInstancia => getters.punto_instancia(idInstancia)?.status === 'cargando',
    punto_puntos: (state,getters) => idInstancia => getters.punto_cargado(idInstancia)?getters.punto_instancia(idInstancia)?.puntos:[],
    punto_total: (state,getters) => idInstancia => getters.punto_cargado(idInstancia)?getters.punto_instancia(idInstancia)?.total:1000,
    punto_sin_resultados: (state,getters) => idInstancia => getters.punto_cargado(idInstancia)?getters.punto_instancia(idInstancia)?.total === 0:false,
    punto_last_page: (state,getters) => idInstancia => getters.punto_instancia(idInstancia)?.last_page,
    punto_recargar: (state,getters) => idInstancia => getters.punto_instancia(idInstancia)?.status === 'recargar',
    punto_instanciado: (state,getters) => idInstancia => !!getters.punto_instancia(idInstancia),
    punto_get_instancia_from_params: () => params => instanciaFromParams(params),
    punto_get_instancia_from_location_only: () => instanciaFromLocationOnly(),
    /** Busca si existe un punto ya cargado a partir de su slug */
    punto_get_punto_by_slug: (state,getters) => slug => {
        let punto = null
        /** Si toavia no hay puntos, se le asigna al punto de esta instancia (sino encontro toma undefined y sigue buscando */
        state.instancias.forEach(instancia => !punto && (punto = instancia.puntos.find(p=> p.slug === slug)))
        return punto
    }
}


function instanciaFromLocationOnly() {
    return `from_loca_only`;
}

const actions = {
    punto_cargar_from_slug({dispatch,getters},{slug}){
        if(!getters.punto_get_punto_by_slug(slug)){
            const idInstancia = instanciaFromSlug(slug)
            const url = Punto.URL_DESCARGA
            const tipoInstancia = TIPO_SLUG
            const params = {
                slug,
                with:['image']      //todo: ver una forma mas elegante
            }
            return dispatch('punto_cargar',{params,url,idInstancia,tipoInstancia})
        }
    },
    punto_cargar_all_with_location({dispatch}){
        const params = {
            with:['image','location'],
            whereHas: ['location'],
            // columns: ['id','nombre','slug','image_id','location_id'],
            descargar:true,
        }
        const idInstancia = instanciaFromLocationOnly()
        const url = Punto.URL_DESCARGA
        const tipoInstancia = TIPO_LOCATION_ONLY
        return dispatch('punto_cargar',{params,url,idInstancia,tipoInstancia})
    },
    punto_cargar_from_params({ commit, dispatch }, {params}) {
        const idInstancia = instanciaFromParams(params)
        const url = Punto.URL_DESCARGA
        const tipoInstancia = TIPO_PARAMS
        return dispatch('punto_cargar',{params,url,idInstancia,tipoInstancia})
    },
    punto_cargar({getters,commit,dispatch},{params,url,idInstancia,tipoInstancia}){
        if(!getters.punto_instanciado(idInstancia)){
            commit('punto_crear_instancia',{idInstancia,tipoInstancia,params,url})
        }
        if(!getters.punto_cargado(idInstancia) && !getters.punto_cargando(idInstancia)){
            commit('punto_cargando',{idInstancia,tipoInstancia})
            return new Promise((resolve, reject) => {
                axios({
                    url,
                    params,
                    method: 'GET'
                }).then(response => {
                    const puntos = response.data.data.map(p=> Punto.fromSource(p))
                    const {total,last_page} = response.data
                    dispatch('punto_guardar_puntos',{idInstancia,puntos,total,last_page,tipoInstancia})
                    resolve()
                }).catch(error => {
                    dispatch('general_error', error)
                    commit('punto_error', {error,idInstancia});
                    reject(error)
                })
            });
        }
    },
    punto_guardar_puntos({commit,dispatch,getters},{idInstancia,puntos,total,last_page}){
        commit('punto_cargando',{idInstancia})
        commit('punto_cargado', {puntos,idInstancia,total,last_page});
    },
};

const mutations = {
    punto_crear_instancia(state,{idInstancia,tipoInstancia,params,url}){
        let instancia = state.instancias.find(o=>o.idInstancia === idInstancia)
        if(!instancia){
            instancia = {
                idInstancia,
                puntos: [],
                status: '',
                last_page:1000,
                total:1,
                params,
                url,
                tipoInstancia
            }
            state.instancias.push(instancia)
        }else{
            throw 'No puede repetirse la creacion de instancia'
        }
    },
    punto_cargando(state,{idInstancia}){
        let instancia = state.instancias.find(o=>o.idInstancia === idInstancia)
        instancia.status = 'cargando'
        vaciar(instancia.puntos)
    },
    punto_cargado(state,{idInstancia,puntos,last_page,total}){
        let instancia = state.instancias.find(o=>o.idInstancia === idInstancia)
        instancia.puntos = puntos
        instancia.last_page = last_page
        instancia.total = total
        instancia.status = 'cargado'
    },
    punto_error(state,{idInstancia,error}){
        let instancia = state.instancias.find(o=>o.idInstancia === idInstancia)
        vaciar(instancia.puntos)
        instancia.status = 'error'
        instancia.errorString = (error.response && error.response.data.message) ? error.response.data.message : error
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};
