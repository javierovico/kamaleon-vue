import axios from "axios";
import Tour from "@/store/modelos/Tour";
import Vue from 'vue'
import TourSpot from "@/store/modelos/TourSpot";

const state = {
    instancia_visor: [],
};

const getters = {
    visor_instancia_visor: state => idVisor => state.instancia_visor.find(o=> o.idVisor === idVisor),
    visor_instancias_by_tour_id : state => id => state.instancia_visor?.filter(o=> o.tipoVisor && o.tipoVisor.tipo === 'tour' && o.tipoVisor.id === id),
    visor_tourSpots: (state,getters) => idVisor => {
        const tourSpotIdInstancia = getters.visor_instancia_visor(idVisor).tourSpotIdInstancia
        if(tourSpotIdInstancia){
            return getters.tourSpot_tourSpots(tourSpotIdInstancia)
        }else{
            return []
        }
    },
    visor_tour: (state,getters) => idVisor => getters.visor_instancia_visor(idVisor)?.tour,
    visor_panos: (state,getters) => idVisor => {
        const panoIdInstancia = getters.visor_instancia_visor(idVisor)?.panoIdInstancia
        return panoIdInstancia?getters.pano_panos(panoIdInstancia):[]
    },
    visor_status_visor: (state,getters) => idVisor => getters.visor_instancia_visor(idVisor)?.statusVisor,
    visor_cargado: (state,getters) => idVisor => {
        const panoIdInstancia = getters.visor_instancia_visor(idVisor)?.panoIdInstancia
        return (
            // getters.visor_status_visor(idVisor) &&
            // getters.visor_status_visor(idVisor).tourSpot &&
            // getters.visor_status_visor(idVisor).tour &&
            (
                panoIdInstancia &&
                getters.pano_cargado(panoIdInstancia)
            )
        )
    },
    visor_titulo: (state,getters) => idVisor => {
        const tourId = getters.visor_instancia_visor(idVisor)?.tourId
        if(!getters.visor_cargado(idVisor)){
            return `No Cargado`
        }else if(tourId){
            return getters.tour_tour_by_id(tourId).nombre
        }else{
            return `Sin Nombre`
        }
    },
    visor_instancia: (state,getters) => idVisor => getters.visor_instancia_visor(idVisor)?.instancia,
}

const actions = {
    visor_restablecer({commit,dispatch},{idVisor}){
        commit('visor_cargando',{idVisor})
    },
    visor_cargar_by_tour_id({ commit, dispatch }, {idVisor,id,params}) {  //carga los parametros a parir del tourID
        const paramsPano = {
            with: ['configuracion','location','thumbnail']
        }
        dispatch('visor_restablecer',{idVisor})
        commit('visor_tipo_visor',{idVisor,tipo: {tipo:'tour',id:id}})
        dispatch('tour_tour_by_id',{id,soloRetornar: false}).then(({idInstancia})=>{
            commit('visor_tour_cargado',{tourId:id,idVisor})
        })
        dispatch('pano_cargar_by_tour_id',{id,params:paramsPano,soloRetornar:false}).then(({idInstancia})=>{
            commit('visor_panos_cargado',{idVisor,panoIdInstancia:idInstancia})
        })
        dispatch('tourSpot_cargar_by_tour_id',{id,params,soloRetornar:false}).then(({idInstancia})=>{
            commit('visor_tourSpot_cargado',{tourSpotIdInstancia:idInstancia,idVisor})
        })
    },
    visor_cargar_by_pano_id({ commit, dispatch }, {id,params,idVisor}) {  //carga los parametros a parir del panoId
        if(!params){
            params = {}
        }
        if(!params.with){
            params.with = []
        }
        if(!params.with.find(w=>w === 'configuracion')){
            params.with.push('configuracion')
        }
        if(!params.with.find(w=>w === 'location')){
            params.with.push('location')
        }
        dispatch('visor_restablecer',{idVisor})
        commit('visor_tipo_visor',{idVisor,tipo: {tipo:'pano',id:id}})
        commit('visor_tour_cargado',{tourId:false,idVisor})
        commit('visor_tourSpot_cargado',{tourSpotIdInstancia:false,idVisor})
        dispatch('pano_pano_by_id',{id,params,soloRetornar:false}).then(({idInstancia})=>{
            commit('visor_panos_cargado',{panoIdInstancia:idInstancia,idVisor})
            dispatch('visor_actualizar_pantalla',{idVisor})
        })
    },
    visor_crear_instancia({commit,dispatch, getters},{idVisor,loadClick,editar,viewChange,sceneChange,panoIdInicial,errorChange,vistaH,vistaV}){
        window.embedpano({
            xml:process.env.BASE_URL+`public/krpano/plugins/plantilla.xml`,
            // id:id,
            target:idVisor,
            vars:{
                "idunico":"nose",
                "autorot":'false',
                editar,
                sceneChange,
                panoIdInicial,
                errorChange,
                vistaH,
                vistaV,
                notificar:()=>{
                    dispatch('visor_actualizar_pantalla',{idVisor})
                },
                llamada: false,     //establecer a una funcion llamable
                raizArchivos: process.env.VUE_APP_URL_S3,
                panos: [],// getters.visor_panos,
                tituloPanorama: '',// getters.visor_titulo,
                tourSpots: [],//getters.visor_tourSpots,
                loadClick,
                viewChange,
            },
            initvars:{
                'URLKRPANO': `/public/krpano`,
                'ROOT_URL' : `/public`,
                'URL_GENERADOR_THUMB': `${URL}/pano/?/thumbnail`
            },
            onready: (instancia)=>{
                commit('visor_instancia_creada', {instancia,idVisor})
                dispatch('visor_actualizar_pantalla',{idVisor})
            },
            consolelog:true
        });
    },
    visor_actualizar_pantalla_by_tour({dispatch,getters},{tour}){
        getters.visor_instancias_by_tour_id(tour.id).forEach(instancia=>{
            const instanciaKR = instancia.instancia
            const h = instanciaKR.get('view.hlookat')
            const v = instanciaKR.get('view.vlookat')
            instanciaKR.set('vistaH',h)
            instanciaKR.set('vistaV',v)
            dispatch('visor_actualizar_pantalla',{idVisor: instancia.idVisor})
        })
    },
    visor_actualizar_hotspots_by_tour({dispatch,getters},{tour}){
        getters.visor_instancias_by_tour_id(tour.id).forEach(instancia=>{
            dispatch('visor_actualizar_hotspot',{idVisor: instancia.idVisor})
        })
    },
    visor_actualizar_pantalla({getters},{idVisor}){
        const instancia = getters.visor_instancia(idVisor)
        if(instancia){
            console.log('ver')
            instancia.set(`panos`,getters.visor_panos(idVisor))
            instancia.set('tituloPanorama', getters.visor_titulo(idVisor))
            instancia.set('tourSpots',getters.visor_tourSpots(idVisor))
            instancia.call(`plugin[cargador].carga_dinamica('actualizado');`)
        }
    },
    visor_actualizar_hotspot({getters},{idVisor}){
        const instancia = getters.visor_instancia(idVisor)
        if(instancia){
            instancia.set('tourSpots',getters.visor_tourSpots(idVisor))
            instancia.call(`plugin[cargador].actualizar_hotspots();`)
        }
    },
    visor_limpiar_pantalla({getters},{idVisor}){
        const instancia = getters.visor_instancia(idVisor)
        if(instancia){
            // instancia.call(`trace('Limpiando')`)
        }
    },
    visor_cambiar_pano({getters},{pano_id,idVisor}){
        const instancia = getters.visor_instancia(idVisor)
        if(instancia){
            instancia.call(`plugin[cargador].cambiar_pano(${pano_id});`)
        }
    },
};

const mutations = {
    // visor_actualizar_desde_tour_id: (state, {id})=>{
    //     state.instancias.filter(o=>o.tipo === 'tour' && o.id===id).forEach(instancia=>{
    //         instancia
    //     })
    // },
    visor_cargando: (state,{idVisor}) => {
        let instancia = state.instancia_visor.find(o=>o.idVisor===idVisor)
        if(!instancia){
            instancia = {
                idVisor:idVisor,
                statusVisor: {},
                tipoVisor: null,
            }
            state.instancia_visor.push(instancia)
        }
        instancia.panoIdInstancia = null
        instancia.tourId = null
        instancia.tourSpotInstancia = null
    },
    visor_tipo_visor: (state, {idVisor,tipo}) =>{
        let instancia = state.instancia_visor.find(o=>o.idVisor===idVisor)
        instancia.tipoVisor = tipo
    },
    visor_tour_cargado: (state,{tourId,idVisor}) => {
        let instancia = state.instancia_visor.find(o=>o.idVisor===idVisor)
        instancia.tourId = tourId
    },
    visor_panos_cargado: (state,{idVisor,panoIdInstancia}) => {
        let instancia = state.instancia_visor.find(o=>o.idVisor===idVisor)
        instancia.panoIdInstancia = panoIdInstancia
    },
    visor_tourSpot_cargado: (state,{tourSpotIdInstancia,idVisor}) => {
        let instancia = state.instancia_visor.find(o=>o.idVisor===idVisor)
        instancia.tourSpotIdInstancia = tourSpotIdInstancia
    },
    visor_instancia_creada: (state, {instancia,idVisor}) => {
        let instanciar = state.instancia_visor.find(o=>o.idVisor===idVisor)
        instanciar.instancia = instancia
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
