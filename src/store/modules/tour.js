import axios from "axios";
import Tour from "@/store/modelos/Tour";
import Vue from 'vue'
import {crearArrayPreguntas} from "@/Utils";
import TourSpot from "@/store/modelos/TourSpot";

const state = {
    instancias:[],
    // status: "",
    // tours: [],
    // tourById: null,
    // audioActual: null,
};

export function instanciaByTourId(id) {
    return `by_tour_id-${id}`
}

const getters = {
    tour_instancia: state => idInstancia => state.instancias.find(o=>o.idInstancia === idInstancia),
    tour_tour_by_id: (state,getters)=> id =>{
        const idInstancia = instanciaByTourId(id)
        const tours = getters.tour_tours(idInstancia)
        if(tours.length > 0){
            return tours[0]
        }else{
            return null
        }
    },
    tour_tours: (state,getters) => idInstancia => {
        const instancia = getters.tour_instancia(idInstancia)
        return instancia?instancia.tours:[]
    },
    tour_find_tour: state => id => {
        let tour = null
        state.instancias.forEach(instancia => {
            instancia.tours.forEach(t=>{
                if(t.id===id){
                    tour = t
                }
            })
        })
        return tour
    },
    tour_cargado: (state,getters) => idInstancia => getters.tour_instancia(idInstancia)?.status === 'cargado',
    tour_cargando: (state,getters) => idInstancia => getters.tour_instancia(idInstancia).status === 'cargando',
}

const actions = {
    tour_desasignar_spot({dispatch},{panoFuente,panoDestino,tour}){
        axios({
            url: tour.getUrlCarga() + panoFuente.getUrlCarga() + `/hotspot` + panoDestino.getUrlCarga(),
            method: 'DELETE'
        }).then(response=>{
            dispatch('tourSpot_borrar_spots_by_panos_tour',{tour,panoFuente,panoDestino})
            dispatch('visor_actualizar_pantalla_by_tour',{tour})
        }).catch(error=> dispatch('general_error',error))
    },
    tour_asignar_spot({dispatch},{panoFuente,panoDestino,tour,en_h,en_v,a_h,a_v}){
        axios({
            url: tour.getUrlCarga() + panoFuente.getUrlCarga() + `/hotspot` + panoDestino.getUrlCarga(),
            data:{
                en_h,en_v,a_h,a_v,
            },
            method: 'POST'
        }).then(response=>{
            const tourSpots = response.data.map(ts=>TourSpot.fromSource(ts))
            dispatch('tourSpot_agregar_spots',{tourSpots})
            dispatch('visor_actualizar_pantalla_by_tour',{tour})
        }).catch(error=> dispatch('general_error',error))
    },
    tour_eliminar_fondo({dispatch,getters},{tour}){
        Vue.swal.fire({
            title: `Desasignar fondo del Tour ${tour.nombre}?`,
            html: `Se guardara un registro de cambio hecho por el usuario ${getters.userName}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: `Si,Eliminar!`,
            cancelButtonText: 'Cancelar',
        }).then(result=> {
            if (result.isConfirmed) {
                let tourEdit = Tour.fromSource(tour)
                tourEdit.fondo_id = 0
                dispatch('tour_guardar_cambios',{tour:tourEdit})
            }
        })
    },
    tour_asignar_fondo({dispatch},{archivo,tour}){
        let tourEdit = Tour.fromSource(tour)
        tourEdit.fondo_id = archivo.id
        dispatch('tour_guardar_cambios',{tour:tourEdit})
    },
    tour_view_reproducir_sonido({commit},{tour}){
        commit('tour_reproducir_sonido',{tour})
    },
    tour_view_parar_sonido({commit}){
        commit('tour_parar_sonido')
    },
    tour_guardar_cambios({commit,dispatch,getters},{tour}){
        const callBack = ()=> new Promise((res,rej)=>{
            axios({url:tour.getUrlCarga()+`?XDEBUG_SESSION_START=PHPSTORM`, method:tour.getMethodCarga(), data: tour.dataEnvio()}).then(r=>{
                tour.actualizarCambios(r.data)
                commit('tour_modificado',{tour})
                res({message:'Se Modifico el Tour'})
            }).catch(e=>{
                rej(e)
            })

        })
        dispatch('general_espera',{callBack})
    },
    tour_view_toggle_estado({commit, dispatch, getters},{tour}){
        Vue.swal.fire({
            title: `${tour.activo?'Desactivar':'Activar'} Tour ${tour.nombre}?`,
            html: `Se guardara un registro de cambio hecho por el usuario ${getters.userName}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: `Si, ${tour.activo?'Desactivar':'Activar'}!`,
            cancelButtonText: 'Cancelar',
        }).then(result=> {
            if (result.isConfirmed) {
                let tourModificar = Tour.fromSource(tour)
                tourModificar.activo = tourModificar.activo?0:1
                dispatch('tour_guardar_cambios',{tour:tourModificar})
            }
        })
    },
    tour_view_crear_nuevo({dispatch}){
        let tour = new Tour()
        dispatch('tour_view_editar',{tour})
    },
    tour_view_editar({commit, dispatch, getters},{tour}){
        let tourEdit = Tour.fromSource(tour)
        const arrayPreguntas = crearArrayPreguntas(tourEdit,[
            {
                title:'Nombre del tour',
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
                            dispatch('tour_guardar_cambios',{tour:tourEdit})
                                .then(()=>resolve({message:'Se realizaron los cambios'}))
                                .catch((e)=>reject({title:'fallo '+e,message:(e.response && e.response.data && e.response.data.message)?e.response.data.message:''}))
                        })
                    },
                })
            }
        })
    },
    tour_cargar({ commit, dispatch }, {params,idInstancia}) {
        return new Promise((resolve, reject) => {
            commit('tour_cargando',{idInstancia});
            axios({url: Tour.URL_DESCARGA+'?XDEBUG_SESSION_START=PHPSTORM', params: params, method: 'GET' })
                .then(response => {
                    const tours = response.data.data.map(t=> Tour.fromSource(t))
                    commit('tour_cargado', {tours,idInstancia})
                    resolve({response})
                })
                .catch(error => {
                    commit('tour_error', {error,idInstancia})
                    dispatch('general_error',error)
                    reject(error)
                })
        });
    },
    tour_tour_by_id({ commit, dispatch, getters }, {id,soloRetornar,params}) {
        const idInstancia = instanciaByTourId(id)
        return new Promise((resolve, reject) => {
            let tourF = getters.tour_find_tour(id)
            if(getters.tour_cargado(idInstancia)){
                resolve({idInstancia,tour:tourF})
            }else{
                if(tourF){  //tourFind se encontro en los tours ya cargados
                    if(!soloRetornar){
                        commit('tour_cargado', {tours:[tourF],idInstancia})
                    }
                    resolve({
                        idInstancia,
                        tour: tourF
                    })
                }else{
                    if(!soloRetornar){
                        commit('tour_cargando',{idInstancia});
                    }
                    axios({
                        url: Tour.URL_DESCARGA+`/${id}`+'?XDEBUG_SESSION_START=PHPSTORM',
                        params: params,
                        method: 'GET'
                    })
                        .then(response => {
                            const tour = Tour.fromSource(response.data)
                            if(!soloRetornar){
                                commit('tour_cargado', {tours:[tour],idInstancia})
                            }
                            resolve({
                                response,
                                tour
                            })
                        })
                        .catch(err => {
                            if(!soloRetornar){
                                commit('tour_error', {error:err,idInstancia})
                                dispatch('general_error',err)
                            }
                            reject(err)
                        })
                }
            }
        });
    },
    tour_asignar_panorama({dispatch},{tour,pano}){
        dispatch('general_confirmar',{titulo:'Asignar el panorama al tour?'}).then(()=>{
            dispatch('general_espera',{
                callBack:()=> new Promise((resolve,reject)=>{
                    axios({
                        url: tour.getUrlCarga() +'/'+ pano.getUrlCarga() + '/asignar',
                        method:'POST'
                    })
                        .catch(err => reject(err))
                        .then((response)=>{
                            dispatch('pano_agregar_a_tour',{pano,tour})
                            dispatch('visor_actualizar_pantalla_by_tour',{tour})
                            resolve()
                        })
                })
            })
        })
    },
    tour_desasignar_panorama({dispatch,commit},{tour,pano}){
        dispatch('general_confirmar',{titulo:'Desasignar el panorama del tour?'}).then(()=>{
            dispatch('general_espera',{
                callBack: () => new Promise((resolve,reject)=>{
                    axios({
                        url: tour.getUrlCarga() +'/'+ pano.getUrlCarga() + '/des-asignar',
                        method:'DELETE'
                    })
                        .catch(err => reject(err))
                        .then((response)=>{
                            dispatch('pano_quitar_de_tour',{pano,tour})
                            dispatch('visor_actualizar_pantalla_by_tour',{tour})
                            resolve()
                        })
                })
            })
        })
    },
};

const mutations = {
    tour_parar_sonido: (state) => {
        if(state.audioActual){
            state.audioActual.pause();
            state.audioActual.currentTime = 0;
            state.audioActual.src = ''
        }
        state.tours.forEach(t=> {
            t._reproduciendo = false
        })
    },
    tour_reproducir_sonido: (state,{tour}) => {
        if(state.audioActual){
            state.audioActual.pause();
            state.audioActual.currentTime = 0;
            state.audioActual.src = tour.fondo.url
        }else{
            state.audioActual = new Audio(tour.fondo.url)
        }
        state.audioActual.play()
        state.tours.forEach(t=> {
            t._reproduciendo = false
        })
        tour._reproduciendo = true
    },
    tour_modificado: (state,{tour}) =>{
        let tourBase = state.tours.find(t=>t.id === tour.id)
        if(tourBase){
            tourBase.actualizarCambios(tour)
        }else{
            state.tours.splice(0,0,tour)
        }
    },
    tour_cargando: (state,{idInstancia}) => {
        let instancia = state.instancias.find(o=>o.idInstancia === idInstancia)
        if(!instancia){
            instancia = {
                idInstancia: idInstancia,
                status: "",
                tours: [],
                audioActual: null,
            }
            state.instancias.push(instancia)
        }
        instancia.status = 'cargando'
        instancia.tours.splice(0,instancia.tours.length)
        //todo: ver audio actual
    },
    tour_cargado: (state,{tours,idInstancia}) =>{
        let instancia = state.instancias.find(o=>o.idInstancia === idInstancia)
        instancia.status = 'cargado'
        instancia.tours = tours
    },
    tour_error: (state,{error,idInstancia}) => {
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
