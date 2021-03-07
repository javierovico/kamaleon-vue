import axios from "axios";
import Tour from "@/store/modelos/Tour";
import Vue from 'vue'
import {crearArrayPreguntas, vaciar} from "@/Utils";
import Pano from "@/store/modelos/Pano";
import Taxo from "@/store/modelos/Taxo";
import TaxoTipo from "@/store/modelos/TaxoTipo";

const state = {
    instancia_departamento: {
        departamentos:[],
        status: '',
    },
    instancia_ciudad: []
};

const getters = {
    taxo_departamento_departamentos: state => state.instancia_departamento.departamentos,
    taxo_departamento_cargado: state => state.instancia_departamento.status === 'cargado',
    taxo_departamento_get_by_id: state => id => state.instancia_departamento.departamentos.find(d=>d.id === id),
    /** Zona de ciudades */
    taxo_ciudad_instancia: state => departamentoId => state.instancia_ciudad.find(o=> o.departamentoId === departamentoId),
    taxo_ciudad_ciudades: (state,getters) => departamentoId => getters.taxo_ciudad_instancia(departamentoId)?getters.taxo_ciudad_instancia(departamentoId).ciudades:[],
    taxo_ciudad_cargado: (state,getters) => departamentoId => getters.taxo_ciudad_instancia(departamentoId)?.status === 'cargado',
    taxo_ciudad_get_ciudad_by_id: (state,getters) => ciudadId =>{
        let ciudad = null
        state.instancia_ciudad.forEach(instancia => {
            !ciudad && ( ciudad = instancia.ciudades.find(c=> c.id === ciudadId))
        })
        return ciudad
    }
}

const actions = {
    /** Carga todos los departamentos */
    taxo_departamento_cargar({getters,commit,dispatch},){
        return new Promise((resolve,reject)=>{
            if(getters.taxo_departamento_cargado){
                resolve({departamentos: getters.taxo_departamento_departamentos})
            }else{
                const params = {
                    descargar:1,
                    taxo_tipo_nombre: TaxoTipo.TIPO_REGION,
                    taxo_id: -1,
                }
                dispatch('taxo_cargar',{params}).then(({taxos})=>{
                    commit('taxo_departamento_set',{departamentos:taxos})
                    resolve({departamentos:taxos})
                }).catch(err =>{
                    commit('taxo_departamento_error', {error:err})
                    dispatch('general_error',err)
                    reject(err)
                })
            }
        })
    },
    /** Carga todas las ciudades de un departamento */
    taxo_ciudad_cargar({getters,commit,dispatch},{departamentoId}){
        return new Promise((resolve,reject)=>{
            if(getters.taxo_ciudad_cargado(departamentoId)){
                resolve({ciudades: getters.taxo_ciudad_ciudades(departamentoId)})
            }else{
                const params = {
                    descargar:1,
                    taxo_tipo_nombre: TaxoTipo.TIPO_REGION,
                    taxo_id: departamentoId,
                }
                dispatch('taxo_cargar',{params}).then(({taxos})=>{
                    commit('taxo_ciudad_set',{ciudades:taxos,departamentoId})
                    resolve({ciudades:taxos})
                }).catch(err =>{
                    commit('taxo_ciudad_error', {departamentoId,error:err})
                    dispatch('general_error',err)
                    reject(err)
                })
            }
        })
    },
    taxo_cargar({getters,commit,dispatch},{params}){
        return new Promise((resolve,reject)=>{
            axios({
                url:Taxo.URL_DESCARGA,
                params,
                method: 'GET',
            }).then(response=>{
                const taxos = response.data.data.map(d=>new Taxo(d))
                resolve({taxos})
            }).catch(err=>{
                commit('taxo_departamento_error', {error:err})
                dispatch('general_error',err)
                reject(err)
            })
        })
    },
};

const mutations = {
    taxo_departamento_set: (state,{departamentos})=>{
        vaciar(state.instancia_departamento.departamentos)
        state.instancia_departamento.departamentos.push(...departamentos)
        state.instancia_departamento.departamentos.status = 'cargado'
    },
    taxo_departamento_error: (state,{error})=>{
        vaciar(state.instancia_departamento.departamentos)
        state.instancia_departamento.departamentos.status = 'error'
    },
    taxo_ciudad_set: (state,{departamentoId,ciudades})=>{
        let instancia = state.instancia_ciudad.find(o=> o.departamentoId === departamentoId)
        if(!instancia){
            instancia = {
                departamentoId,
                ciudades: [],
                status: ''
            }
            state.instancia_ciudad.push(instancia)
        }
        vaciar(instancia.ciudades,...ciudades)
        instancia.status = 'cargado'
    },
    taxo_ciudad_error: (state,{error,departamentoId})=>{
        let instancia = state.instancia_ciudad.find(o=> o.departamentoId === departamentoId)
        vaciar(instancia.ciudades)
        instancia.status = 'error'
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};
