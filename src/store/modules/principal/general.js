import Vue from 'vue'
import {vaciar} from "@/Utils";
const state = {
    status: "",
    categorias: [],
    errorString: '',
    statusPila: '',
    categoriasPila: [],
}


const getters = {

}

const mutations = {
}

const actions = {
    general_confirmar({getters},{titulo,html,afirmativo}){
        if(html){
            html = html+`.\n<br>`
        }else{
            html = ``
        }
        html += `Se guardara un registro de cambio hecho por el usuario ${getters.userName}`
        if(!afirmativo){
            afirmativo = 'SI'
        }
        return new Promise((resolve,reject)=>{
            Vue.swal.fire({
                title: titulo,
                html: html,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: afirmativo,
                cancelButtonText: 'Cancelar',
            }).then(result=> {
                if (result.isConfirmed) {
                    resolve()
                }else{
                    reject()
                }
            }).catch(e=>{
                reject(e)
            })
        })
    },
    general_espera ({commit, dispatch, getters}, {callBack}) {
        // const callBack = dato.callBack
        Vue.swal.fire({
            icon: 'info',
            allowOutsideClick:false,
            allowEscapeKey: false,
            title: 'Espere',
            showConfirmButton: false,
            // timer: 4500,
            willOpen: () => {
                Vue.swal.showLoading()
                callBack().then(({titulo})=>{
                    const message = titulo?titulo:'Correcto'
                    const Toast = Vue.swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Vue.swal.stopTimer)
                            toast.addEventListener('mouseleave', Vue.swal.resumeTimer)
                        }
                    })
                    Toast.fire({
                        icon: 'success',
                        title: message
                    })
                }).catch(e=>{
                    dispatch('general_error',e)
                })
            },
        })
    },
    'GENERAL_ESPERA': ({commit, dispatch, getters}, dato) => {
        const callBack = dato.callBack
        Vue.swal.fire({
            icon: 'info',
            allowOutsideClick:false,
            allowEscapeKey: false,
            title: 'Espere',
            showConfirmButton: false,
            // timer: 4500,
            willOpen: () => {
                Vue.swal.showLoading()
                callBack().then(r=>{
                    const message = r.message
                    const Toast = Vue.swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Vue.swal.stopTimer)
                            toast.addEventListener('mouseleave', Vue.swal.resumeTimer)
                        }
                    })
                    Toast.fire({
                        icon: 'success',
                        title: message
                    })
                }).catch(e=>{
                    dispatch('general_error',e)
                    // console.error(e)
                    // Vue.swal.fire({
                    //     icon: 'error',
                    //     title: `${e.title}`,
                    //     text: e.message,
                    //     showConfirmButton: true,
                    // })
                })
            },
        })
    },
    general_error({commit,dispatch,getters},e){
        console.error(e)
        const titulo = (e.response && e.response.data.message) ? e.response.data.message : 'Error'
        const texto = `${e}`
        Vue.swal.fire({
            icon: 'error',
            title: titulo,
            text: texto,
            showConfirmButton: true,
        })
    },
    general_error_mensaje({commit,dispatch,getters},{titulo,detalle}){
        Vue.swal.fire({
            icon: 'error',
            title: titulo,
            text: detalle?detalle:'',
            showConfirmButton: true,
        })
    }
}

export default {
    state,
    getters,
    actions,
    mutations
};
