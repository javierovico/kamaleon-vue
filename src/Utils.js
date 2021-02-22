export function addQuery(router,query = {},path = null) {
    let nuevaRuta = {
        path: path?path:router.path.toString(),
        query: query.add?query.add:{}
    }
    for (let key in router.query) {
        let existe = false
        if(query.add){
            for (let key2 in query.add) {
                if(key == key2){
                    existe = true
                }
            }
        }
        if(!existe && (!(query.rem) || query.rem.every(ele=>ele!==key))){
            nuevaRuta.query[key] = router.query[key]
        }
    }
    return nuevaRuta
}

export function intToHour(i) {
    return i<24?(''+((i<10)?('0'+i):(''+i)) + ':00:00'):'23:59:59'
}

export function imprimirError(toastAdmin,error){
    toastAdmin.toast(`Error: ${error}`, {
        variant: 'danger',
        title: 'Delivery',
        autoHideDelay: 5000,
        appendToast: false
    })
}

export function vaciar(obj){
    obj.splice(0,obj.length)
}

export const URL_DELIVERY_V2 = 'http://delivery-api.skytellocal.com.py/api/delivery/v2/'

/*
fuente:[{
    title,
    text,
    key:
    obligatorio: [true/false]
    creacion: [true/false]
}]
 */
export function crearArrayPreguntas(target,fuente,unoSolo = false){
    const ret = fuente.filter(c=> (!c.creacion || !target.exists())).map((f,index,arr)=>{
        let ret =  {
            title: f.title,
            text: f.text?f.text:'',
            input: f.input===false?'':(f.input?f.input:'text'), //si es falso: nada, sino text por default
            inputOptions: f.inputOptions?f.inputOptions:[],
            inputPlaceholder: f.inputPlaceholder?f.inputPlaceholder:'',
            inputValue: (target[f.key] || f.input !== 'select')?target[f.key]:-1,//usuarioEdit.usuario,
        }
        if(!f.onConfirm){       //solo se llama si no hay un preConfirm
            f.onConfirm = ()=>{}
        }
        ret.onConfirm = f.onConfirm
        if(f.preConfirm){
            ret.preConfirm = f.preConfirm
        }else{
            ret.preConfirm = input =>{
                target[f.key] = input
                ret.onConfirm(input)
            }
        }
        if(f.focusConfirm){
            ret.focusConfirm = f.focusConfirm
        }
        if(f.html){
            ret.html = f.html
        }
        if(f.inputValidator){
            ret.inputValidator = f.inputValidator
        }else if(f.obligatorio){
            ret.inputValidator = (input) => {
                if(input.length ===0){
                    return "Campo Obligatorio"
                }
            }
        }
        if((index+1) === arr.length && !unoSolo){
            ret.confirmButtonText = 'Guardar'
            ret.confirmButtonColor = '#36aa32'
        }
        return ret
    })
    return unoSolo?ret[0]:ret
}

export function primeraLetraMayuscula(key){
    return key.charAt(0).toUpperCase() + key.slice(1)
}

export function camelCaseToSpace(c) {
    c = c.replace(/_/g,' ')
    c = c.replace(/([A-Z])/g, " $1")
    c = c.replace(/\s+/g,' ')       //deja solo un espacio en blanco
    c = c.split(' ').map(r=> r.charAt(0).toUpperCase() + r.slice(1)).join(' ').trim();
    return c
    // c = c.charAt(0).toUpperCase() + c.slice(1);     //convierte el primero en mayus
}


import Vue from "vue";
//COMPUTED
export function llenarQuery(params){
    let salida = {}
    for(let [key,value] of Object.entries(params)){
        switch(value.type){
            default:
                Object.assign(salida,{['prop'+key.charAt(0).toUpperCase() + key.slice(1)]: function(){
                    const prefijo = this.propPrefijoQuery?(this.propPrefijoQuery+ '_'):''
                    if(!key){
                        key = camelToSnake(key)
                    }
                    const result = this.$route.query[prefijo + key]
                    if(!result){
                        return value.default
                    }else{
                        switch(value.type){
                            case 'number':
                                return parseInt(result)
                            case 'boolean':
                                return (result === '1' || result === 'true')
                            default:
                                if(value.integer){
                                    return parseInt(result)
                                }
                                return result
                        }
                    }
                }})
        }
    }
    return salida
}

//METHODS
export function cambiarQuery(params){
    let salida = {['loadQuery'] : function(){
        for(let [key,value] of Object.entries(params)){
            switch(value.type){
                case 'modal':
                    if(this['prop'+key.charAt(0).toUpperCase() + key.slice(1)]){
                        this.$bvModal.show(value.id)
                    }
                    break;
                default:
                    this[key] = this['prop'+key.charAt(0).toUpperCase() + key.slice(1)]
                    if(value.form){
                        this['form'+key.charAt(0).toUpperCase() + key.slice(1)] = this['prop'+key.charAt(0).toUpperCase() + key.slice(1)]
                    }
                    break;
            }
        }
    }}
    Object.assign(salida,{['commitQuery'] : function(key){
        this['set'+primeraLetraMayuscula(key)](this['form'+primeraLetraMayuscula(key)])
    }})
    for(let [key,value] of Object.entries(params)){
        switch(value.type){
            case 'modal':
                Object.assign(salida,{['cerrar'+key.charAt(0).toUpperCase() + key.slice(1)]: function(){
                    const prefijo = this.propPrefijoQuery?(this.propPrefijoQuery+ '_'):''
                    const queryInsert = prefijo + key
                    this.$router.push(addQuery(this.$route,{rem:[queryInsert]})).catch(()=>{})
                }})
                Object.assign(salida,{['abrir'+key.charAt(0).toUpperCase() + key.slice(1)]: function(id){
                        const prefijo = this.propPrefijoQuery?(this.propPrefijoQuery+ '_'):''
                        const queryInsert = prefijo + key
                        this.$router.push(addQuery(this.$route,{add:{[queryInsert]:id}})).catch(()=>{})
                    }})
                break;
            default:
                Object.assign(salida,{['set'+key.charAt(0).toUpperCase() + key.slice(1)]: function(nuevo){
                    const prefijo = this.propPrefijoQuery?(this.propPrefijoQuery+ '_'):''
                    if(!key){
                        key = camelToSnake(key)
                    }
                    const queryInsert = prefijo + key
                    if(nuevo !== null){
                        this.$router.replace(addQuery(this.$route,{add:{[queryInsert]:nuevo}})).catch(()=>{})
                    }else{
                        this.$router.replace(addQuery(this.$route,{rem:[queryInsert]})).catch(()=>{})
                    }
                }})
        }
    }
    return salida
}
//WATCH
export function crearWatch(params){
    let salida = {}
    for(let [key,value] of Object.entries(params)){
        switch (value.type){
            case 'modal':
                Object.assign(salida,{['prop'+key.charAt(0).toUpperCase() + key.slice(1)]: function(e){
                    if(e){
                        this.$bvModal.show(value.id)
                    }else{
                        this.$bvModal.hide(value.id)
                    }
                }})
                break;
            default:
                Object.assign(salida,{[key]: function(p){
                    this['set'+key.charAt(0).toUpperCase() + key.slice(1)](p)
                }})
        }
    }
    return salida
}

//DATA
export function crearVariables(params){
    let salida = {}
    for(let [key,value] of Object.entries(params)){
        Object.assign(salida,{[key]: value.default})
        if(value.form){
            Object.assign(salida,{['form'+key.charAt(0).toUpperCase() + key.slice(1)]: value.default})
        }
    }
    return salida
}

export function camelToSnake(str){
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}


export function formatPuntos(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}