import axios from "axios";
import Tour from "@/store/modelos/Tour";
import Vue from 'vue'
import {crearArrayPreguntas} from "@/Utils";
import TourSpot from "@/store/modelos/TourSpot";
import {instanciaByTourId} from "@/store/modules/tour";

const state = {
    instancias: [],
};

const getters = {
    tourSpot_instancia: state => idInstancia => state.instancias.find(o=> o.idInstancia = idInstancia),
    tourSpot_tourSpots: (state,getters) => idInstancia => {
        const instancia = getters.tourSpot_instancia(idInstancia)
        if(instancia){
            return instancia.tourSpots
        }else{
            return []
        }
    },
    tourSpot_cargado: (state,getters) => idInstancia => getters.tourSpot_instancia(idInstancia).status === 'cargado',
}

const actions = {
    tourSpot_agregar_spots({commit},{tourSpots}){
        commit('tourSpot_agregar_spots',{tourSpots})
    },
    tourSpot_borrar_spots_by_panos_tour({commit},{tour,panoFuente,panoDestino}){
        commit('tourSpot_borrar_spots_by_panos_tour',{tour,panoFuente,panoDestino})
    },
    tourSpot_guardar_cambios({commit,dispatch,getters},{tourSpot}){
        const callBack = ()=> new Promise((res,rej)=>{
            axios({url:tourSpot.getUrlCarga()+`?XDEBUG_SESSION_START=PHPSTORM`, method:tourSpot.getMethodCarga(), data: tourSpot.dataEnvio()}).then(r=>{
                tourSpot.actualizarCambios(r.data)
                commit('tourSpot_modificado',{tourSpot})
                res({message:'Se Modifico el TourSpot'})
            }).catch(e=>{
                rej(e)
            })

        })
        dispatch('general_espera',{callBack})
    },
    tourSpot_view_toggle_estado({commit, dispatch, getters},{tourSpot}){
        Vue.swal.fire({
            title: `${tourSpot.activo?'Desactivar':'Activar'} TourSpotrama ${tourSpot.nombre}?`,
            html: `Se guardara un registro de cambio hecho por el usuario ${getters.userName}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: `Si, ${tourSpot.activo?'Desactivar':'Activar'}!`,
            cancelButtonText: 'Cancelar',
        }).then(result=> {
            if (result.isConfirmed) {
                let tourSpotModificar = TourSpot.fromSource(tourSpot)
                tourSpotModificar.activo = tourSpotModificar.activo?0:1
                dispatch('tourSpot_guardar_cambios',{tourSpot:tourSpotModificar})
            }
        })
    },
    tourSpot_view_editar({commit, dispatch, getters},{tourSpot}){
        let tourSpotEdit = TourSpot.fromSource(tourSpot)
        const arrayPreguntas = crearArrayPreguntas(tourSpotEdit,[
            {
                title:'Nombre del tourSpot',
                key:'nombre',
                obligatorio:true,
            },
        ])
        Vue.swal.mixin({
            input: 'text',
            confirmButtonText: 'Siguiente &rarr;',
            cancelButtonText: 'Cancelar',
            showCancelButton: true,
            progressSteps: arrayPreguntas.map((q,index)=>`${index+1}`),
            showLoaderOnConfirm: true,
            allowEscapeKey: false,
            allowOutsideClick: false,
        }).queue(arrayPreguntas).then((result) => {
            if (result.value) {
                dispatch('general_espera',{
                    callBack:()=>{
                        return new Promise((resolve,reject)=>{
                            dispatch('tourSpot_guardar_cambios',{tourSpot:tourSpotEdit})
                                .then(()=>resolve({message:'Se realizaron los cambios'}))
                                .catch((e)=>reject({title:'fallo '+e,message:(e.response && e.response.data && e.response.data.message)?e.response.data.message:''}))
                        })
                    },
                })
            }
        })
    },
    tourSpot_cargar_by_tour_id({ commit, dispatch, getters}, {id,params,soloRetornar}) {
        const idInstancia = instanciaByTourId(id)
        if(!params){
            params = {}
        }
        if(!(params.perPage)){
            params.perPage = 100
        }
        if(!params.with){
            params.with = []
        }
        if(!params.with.find(w=>w==='image')){
            params.with.push('image')
        }
        return new Promise((resolve, reject) => {
            if(getters.tour_cargado(idInstancia)){
                resolve({idInstancia})
            }else{
                if(!soloRetornar){
                    commit('tourSpot_cargando',{idInstancia});
                }
                axios({
                    url: Tour.urlCargaFromId(id) + TourSpot.URL_DESCARGA+'?XDEBUG_SESSION_START=PHPSTORM',
                    params: params,
                    method: 'GET'
                })
                    .then(response => {
                        const tourSpots = response.data.data.map(p=>TourSpot.fromSource(p))
                        if(!soloRetornar){
                            commit('tourSpot_cargado', {tourSpots,idInstancia})
                        }
                        resolve({response,tourSpots,idInstancia})
                    })
                    .catch(err => {
                        if(!soloRetornar){
                            commit('tourSpot_error', {error:err,idInstancia})
                            dispatch('general_error',err)
                        }
                        reject(err)
                    })
            }
        });
    },
    tourSpot_cargar_by_tour({ commit, dispatch }, {tour,params}) {
        return dispatch('tourSpot_cargar_by_tour_id',{id:tour.id,params})
    },
    tourSpot_tourSpot_by_id({ commit, dispatch }, {id}) {
        return new Promise((resolve, reject) => {
            commit('tourSpot_cargando');
            let params = {
                // with:['tourSpots.fondo'],
            }
            axios({
                url: TourSpot.URL_DESCARGA+`/${id}`+'?XDEBUG_SESSION_START=PHPSTORM',
                params: params,
                method: 'GET'
            })
                .then(response => {
                    commit('tourSpot_cargado_by_id', {response})
                    resolve({response})
                })
                .catch(err => {
                    commit('tourSpot_error', err)
                    dispatch('general_error',err)
                    reject(err)
                })
        });
    },
};

const mutations = {
    tourSpot_borrar_spots_by_panos_tour: (state,{tour,panoFuente,panoDestino}) => {
        const idInstancia = instanciaByTourId(tour.id)
        const tourSpotsDelTour = state.instancias.find(o=>o.idInstancia === idInstancia).tourSpots
        for(let i = tourSpotsDelTour.length -1 ; i>=0 ; i--){
            if((tourSpotsDelTour[i].pano_fuente_id === panoFuente.id && tourSpotsDelTour[i].pano_destino_id === panoDestino.id) || (tourSpotsDelTour[i].pano_destino_id === panoFuente.id && tourSpotsDelTour[i].pano_fuente_id === panoDestino.id)){
                tourSpotsDelTour.splice(i,1)
            }
        }
    },
    tourSpot_agregar_spots: (state,{tourSpots}) => {
        tourSpots.forEach(tourSpot=>{
            const idInstancia = instanciaByTourId(tourSpot.tour_id)
            const tourSpotsDelTour = state.instancias.find(o=>o.idInstancia === idInstancia).tourSpots
            const tourSpotEncontrado = tourSpotsDelTour.find(ts=>ts.id === tourSpot.id)
            if(tourSpotEncontrado){
                tourSpotEncontrado.actualizarCambios(tourSpot)
            }else{
                tourSpotsDelTour.push(tourSpot)
            }
        })
    },
    tourSpot_modificado: (state,{tourSpot}) =>{
        let tourSpotBase = state.tourSpots.find(t=>t.id === tourSpot.id)
        if(tourSpotBase){
            tourSpotBase.actualizarCambios(tourSpot)
        }else{
            state.tourSpots.push(tourSpot)
        }
    },
    tourSpot_cargando: (state,{idInstancia}) => {
        let instancia = state.instancias.find(o=>o.idInstancia === idInstancia)
        if(!instancia){
            instancia = {
                idInstancia: idInstancia,
                tourSpots: [],
                status: '',
            }
            state.instancias.push(instancia)
        }
        instancia.status = 'cargando'
        instancia.tourSpots.splice(0,instancia.tourSpots.length)

    },
    tourSpot_cargado: (state,{tourSpots,idInstancia}) =>{
        let instancia = state.instancias.find(o=>o.idInstancia === idInstancia)
        instancia.status = 'cargado'
        instancia.tourSpots = tourSpots
    },
    tourSpot_cargado_by_id: (state,{response}) =>{
        state.status = 'cargado'
        state.tourSpotById = TourSpot.fromSource(response.data)
    },
    tourSpot_error: (state, {error,idInstancia}) => {
        let instancia = state.instancias.find(o=>o.idInstancia === idInstancia)
        instancia.status = "error";
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};
