import axios from "axios";
import Tour from "@/store/modelos/Tour";
import Vue from 'vue'
import {crearArrayPreguntas} from "@/Utils";
import Pano from "@/store/modelos/Pano";

function instanciaByTourId(id) {
    return `by_tour_id-${id}`
}
export const INSTANCIA_POR_PARAMETROS = 1;

const state = {
    instancias:[],
    // status: "",
    // panos: [],
    // panoById: null,
    // audioActual: null,
};

const getters = {
    pano_instancia: state => idInstancia => state.instancias.find(o=>o.idInstancia === idInstancia),
    pano_panos: (state,getters) => idInstancia => getters.pano_instancia(idInstancia)?getters.pano_instancia(idInstancia).panos:[],
    pano_panos_by_tour_id:(state,getters) => idTour => getters.pano_panos(instanciaByTourId(idTour)),
    pano_find_by_id: (state,getters) => (id) => {   //busca en todas las instancias el pano
        let pano = null
        state.instancias.forEach(instancia =>{
            let panoB = instancia.panos.find(p=>p.id ===id)
            if(panoB){
                pano = panoB
            }
        })
        return pano
    },
    pano_cargado_by_tour_id: (state,getters) => id => getters.pano_cargado(instanciaByTourId(id)),
    pano_cargado: (state,getters) => idInstancia => getters.pano_instancia(idInstancia)?.status === 'cargado',
    pano_cargando: (state,getters) => idInstancia => getters.pano_instancia(idInstancia)?.status === 'cargando',
    pano_total: (state,getters) => idInstancia => getters.pano_cargado(idInstancia)?getters.pano_instancia(idInstancia)?.total:1000,
    pano_last_page: (state,getters) => idInstancia => getters.pano_instancia(idInstancia)?.last_page,
}

const actions = {
    pano_view_crear_pano({dispatch}){
        const pano = new Pano()
        return dispatch('pano_view_editar',{pano})
    },
    pano_crear_thumb({dispatch},{pano}){
        axios({
            url:pano.getUrlCarga() + `/crear-thumbnail`,
            method:'POST'
        })
    },
    pano_quitar_de_tour({dispatch},{pano,tour}){
        dispatch('pano_quitar',{pano,idInstancia:instanciaByTourId(tour.id)})
    },
    pano_quitar({commit},{pano,idInstancia}){    //quita un pano de todas las listas
        commit('pano_quitar',{pano,idInstancia})
    },
    pano_agregar_a_tour({dispatch},{pano,tour}){    //agrega un pano a una lista de un tour
        dispatch('pano_agregar',{pano,idInstancia:instanciaByTourId(tour.id)})
    },
    pano_agregar({commit},{pano,idInstancia}){    //agrega un pano a una lista
        commit('pano_agregar',{pano,idInstancia})
    },
    pano_eliminar_fondo({dispatch,getters},{pano}){
        Vue.swal.fire({
            title: `Desasignar fondo del Panorama ${pano.nombre}?`,
            html: `Se guardara un registro de cambio hecho por el usuario ${getters.userName}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: `Si,Eliminar!`,
            cancelButtonText: 'Cancelar',
        }).then(result=> {
            if (result.isConfirmed) {
                let panoEdit = Pano.fromSource(pano)
                panoEdit.fondo_id = 0
                dispatch('pano_guardar_cambios',{pano:panoEdit})
            }
        })
    },
    pano_asignar_fondo({dispatch},{archivo,pano}){
        let panoEdit = Pano.fromSource(pano)
        panoEdit.fondo_id = archivo.id
        dispatch('pano_guardar_cambios',{pano:panoEdit})
    },
    pano_guardar_cambios({commit,dispatch,getters},{pano,idInstancia}){
        return new Promise(resolve=>{
            const callBack = ()=> new Promise((res,rej)=>{
                axios({url:pano.getUrlCarga()+`?XDEBUG_SESSION_START=PHPSTORM`, method:pano.getMethodCarga(), data: pano.dataEnvio()}).then(r=>{
                    pano.actualizarCambios(r.data)
                    commit('pano_modificado',{pano,idInstancia})
                    commit('pano_limpiar',{tipoInstancia:INSTANCIA_POR_PARAMETROS})
                    res({message:'Se Modifico el Pano'})
                    resolve()
                }).catch(e=>{
                    rej(e)
                })

            })
            dispatch('general_espera',{callBack})
        })
    },
    pano_view_toggle_estado({commit, dispatch, getters},{pano}){
        Vue.swal.fire({
            title: `${pano.activo?'Desactivar':'Activar'} Panorama ${pano.nombre}?`,
            html: `Se guardara un registro de cambio hecho por el usuario ${getters.userName}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: `Si, ${pano.activo?'Desactivar':'Activar'}!`,
            cancelButtonText: 'Cancelar',
        }).then(result=> {
            if (result.isConfirmed) {
                let panoModificar = Pano.fromSource(pano)
                panoModificar.activo = panoModificar.activo?0:1
                dispatch('pano_guardar_cambios',{pano:panoModificar})
            }
        })
    },
    pano_view_editar({commit, dispatch, getters},{pano}){
        return new Promise(resolveGeneral=>{
            let panoEdit = Pano.fromSource(pano)
            const arrayPreguntas = crearArrayPreguntas(panoEdit,[
                {
                    title:'Nombre del pano',
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
                                dispatch('pano_guardar_cambios',{pano:panoEdit})
                                    .then(()=>resolve({message:'Se realizaron los cambios'}))
                                    .catch((e)=>reject({title:'fallo '+e,message:(e.response && e.response.data && e.response.data.message)?e.response.data.message:''}))
                            }).then(()=>{
                                resolveGeneral()
                            })
                        },
                    })
                }
            })
        })
    },
    pano_cargar_by_tour_id({commit,dispatch,getters},{id,params,soloRetornar}){
        const idInstancia = instanciaByTourId(id)
        return new Promise((resolve, reject) => {
            if(getters.pano_cargado(idInstancia)){
                resolve({idInstancia})
            }else{
                if(!soloRetornar){
                    commit('pano_cargando',{idInstancia});
                }
                axios({
                    url: Tour.urlCargaFromId(id) + Pano.URL_DESCARGA+'?XDEBUG_SESSION_START=PHPSTORM',
                    params: params,
                    method: 'GET'
                })
                    .then(response => {
                        const panos = response.data.data.map(p=>new Pano(p))
                        if(!soloRetornar){
                            commit('pano_cargado', {panos,idInstancia})
                        }
                        resolve({response,panos,idInstancia})
                    })
                    .catch(error => {
                        if(!soloRetornar){
                            commit('pano_error', {error,idInstancia})
                            dispatch('general_error',error)
                        }
                        reject(error)
                    })
            }
        });
    },
    pano_cargar_by_tour({ commit, dispatch, getters}, {tour,params}) {
        return dispatch('pano_cargar_by_tour_id',{id:tour.id,params})
    },
    pano_pano_by_id({ commit, dispatch, getters}, {id,soloRetornar}) {
        const idInstancia = `by_pano_id-${id}`
        return new Promise((resolve, reject) => {
            if(!soloRetornar){
                commit('pano_cargando',{idInstancia});
            }
            let params = {
                // with:['panos.fondo'],
            }
            let pano = getters.pano_find_by_id(id)
            if(pano){
                if(!soloRetornar){
                    commit('pano_cargado', {panos:[pano],idInstancia})
                }
                resolve({panos:[pano],idInstancia})
            }else{
                axios({
                    url: Pano.urlCargaFromId(id)/*Pano.URL_DESCARGA+`/${id}`*/+'?XDEBUG_SESSION_START=PHPSTORM',
                    params: params,
                    method: 'GET'
                })
                    .then(response => {
                        let panos = [Pano.fromSource(response.data)]
                        if(!soloRetornar){
                            commit('pano_cargado', {panos,idInstancia})
                        }
                        resolve({response,panos,idInstancia})
                    })
                    .catch(err => {
                        if(!soloRetornar){
                            commit('pano_error', {error:err,idInstancia})
                            dispatch('general_error',err)
                        }
                        reject(err)
                    })
            }
        });
    },
    pano_cargar({getters,commit,dispatch},{params,soloRetornar,idInstancia}){   //Carga panoramas por parametros
        return new Promise((resolve,reject)=>{
            if(getters.pano_cargado(idInstancia)){
                resolve({idInstancia})
            }else{
                if(!soloRetornar){
                    commit('pano_cargando',{idInstancia,tipoInstancia:INSTANCIA_POR_PARAMETROS});
                }
                axios({
                    url:Pano.urlCargaFromId(null),
                    params: params,
                    method: 'GET',
                }).then(response=>{
                    let panos = response.data.data.map(p=>Pano.fromSource(p))
                    if(!soloRetornar){
                        commit('pano_cargado', {panos,idInstancia,last_page:response.data.last_page,total:response.data.total})     //todo: Hacer que la instancia guarda "last_page" y "total"
                    }
                    resolve({response,panos,idInstancia})
                }).catch(err=>{
                    if(!soloRetornar){
                        commit('pano_error', {error:err,idInstancia})
                        dispatch('general_error',err)
                    }
                    reject(err)
                })
            }
        })
    },
};

const mutations = {
    pano_limpiar: (state,{tipoInstancia})=>{
        state.instancias.filter(i => i.tipoInstancia === tipoInstancia).forEach(instancia=>{
            instancia.status = ''
            instancia.panos.splice(0,instancia.panos.length)
        })
    },
    pano_modificado: (state,{pano,idInstancia}) =>{     //realiza el cambi en todas las listas, y si no estan en la lista seleccionada, se agrega ahi
        state.instancias.forEach(instancia =>{
            let panoBase = instancia.panos.find(t=>t.id === pano.id)
            if(panoBase){
                panoBase.actualizarCambios(pano)
            }else if(idInstancia && instancia.idInstancia === idInstancia){
                instancia.panos.push(pano)
            }
        })
    },
    pano_quitar: (state,{pano,idInstancia}) => {    //quita el pano de una instancia
        const instancia = state.instancias.find(o=>o.idInstancia === idInstancia)
        const indexPano = instancia.panos.findIndex(p=>p.id === pano.id)
        instancia.panos.splice(indexPano,1)
    },
    pano_agregar: (state,{pano,idInstancia}) => {
        state.instancias.find(o=>o.idInstancia === idInstancia).panos.push(pano)
        // state.panos.push(pano)
    },
    pano_cargando: (state,{idInstancia,tipoInstancia}) => {     //todo: separar el "cargado" de la creacion de instancia
        let instancia = state.instancias.find(o=>o.idInstancia === idInstancia)
        if(!instancia){
            instancia = {
                status: "",
                panos: [],
                audioActual: null,
                idInstancia: idInstancia,
                tipoInstancia,
                last_page:1000,
                total:1,
            }
            state.instancias.push(instancia)
        }
        instancia.status = 'cargando'
        instancia.last_page = 1000
        instancia.total = 1
        instancia.panos.splice(0,instancia.panos.length)
    },
    pano_cargado: (state,{panos,idInstancia,last_page,total}) =>{
        let instancia = state.instancias.find(o=>o.idInstancia === idInstancia)
        instancia.status = 'cargado'
        instancia.panos = panos
        instancia.last_page = last_page
        instancia.total = total
    },
    // pano_cargado_by_id: (state,{pano}) =>{
    //     state.status = 'cargado'
    //     state.panoById = pano
    // },
    pano_error: (state, {error,idInstancia}) => {
        let instancia = state.instancias.find(o=>o.idInstancia === idInstancia)
        instancia.status = "error";
        // state.panos.splice(0,state.panos.length)
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};
