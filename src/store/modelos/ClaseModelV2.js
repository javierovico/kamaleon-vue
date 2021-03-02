import Tour from "@/store/modelos/Tour";

export default class ClaseModelV2{

    //para actualizacion masiva
    _update = false
    _add = false

    objetos
    primaryKey
    urlDescarga


    constructor(params,objetos = [],primaryKey = 'id',urlDescarga = 'xxx') {
        this.objetos = objetos
        this.primaryKey = primaryKey
        this.urlDescarga = urlDescarga
        this.objetos.forEach(({key,type,porDefecto})=>{
            if(typeof params[key] !== 'undefined'){
                switch(type){
                    case String:
                    case Number:
                    case null:
                        this[key] = params[key]
                        break;
                    default:
                        this[key] = (params[key])?new type(params[key]):null
                }
            }else{
                this[key] = porDefecto
            }
        })
    }


    /**
     * Establece si se va actualizar o no, si no se actualiza, obvio no se agrega
     * @param update
     */
    setUpdate(update){
        this._update = !!update
        if(!update){
            this.setAdd(false)
        }
    }

    /**
     * Establece si se va agregar o no, si se agrega, obvio se actualiza
     * @param add
     */
    setAdd(add){
        this._add = !!add
        if(add){
            this.setUpdate(true)
        }
    }

    /**
     * Retorna true si el modelo fue cambiado (a un nivel basico, no se busca en arrays)
     * @param sucursalCopia
     * @returns {boolean}
     */
    actualizarCambios(sucursalCopia){
        let cambiado = false
        for (let key in sucursalCopia) {
            if(this[key] && this[key].actualizarCambios){
                this[key].actualizarCambios(sucursalCopia[key])
            }else{
                if(this[key] !== sucursalCopia[key]){
                    this[key] = sucursalCopia[key]
                    cambiado = true
                }
            }
        }
        this.construirArrays()
        return cambiado
    }

    /**
     * Por si se quiera alterar los datos a enviar
     * @returns {ClaseModelV2}
     */
    dataEnvio(){
        return this
    }

    exists(){
        return !!(this[this.primaryKey])
    }

    getMethodCarga(){
        return this.exists()?'PUT':'POST'
    }

    getUrlCarga(){
        return ClaseModelV2.urlCargaFromUrlPrimaryKey(this.urlDescarga,this.primaryKey)
    }


    static urlCargaFromUrlPrimaryKey(url,primaryKey){
        if(primaryKey){
            url += `/${primaryKey}`
        }
        return url
    }

}