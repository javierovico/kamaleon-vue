export default class ClaseModelV2{

    objetos
    primaryKey
    urlDescarga

    /**
     * @param params
     * @param objetos:
     * [
     *      {
     *          key:'encuesta_nueva',
     *          type: Encuesta,
     *          porDefecto: new Encuesta(3,3,2),
     *      },
     *      {
     *          key:'preguntas',
     *          type: Pregunta,
     *          porDefecto: undefined,
     *          array: true,
     *      },
     *      {
     *          key:'pivot',
     *          type: undefined,
     *          porDefecto: undefined,
     *          hijos:[
     *              {
     *                  key:'encuesta_nueva',
     *                  type: Encuesta,
     *                  porDefecto: new Encuesta(3,3,2),
     *              },
     *          ]
     *      },
     *      {
     *          key:'pivot',
     *          type: undefined,
     *          porDefecto: undefined,
     *          hijos:['id','texto']
     *      }
     * ]
     * @param primaryKey
     * @param urlDescarga
     */
    constructor(params,objetos = [],primaryKey = 'id',urlDescarga = 'xxx') {
        this.objetos = objetos
        this.primaryKey = primaryKey
        this.urlDescarga = urlDescarga
        this.iterarHijos(params,this.objetos)
    }

    /**
     * Basicamente exporta los datos necesarios nada mas de este objeto para ser serializado
     */
    export(){
        return this.iterarExport(this.objetos)
    }

    iterarExport(objetos,target = this){
        let result = {}
        objetos = objetos.map(o=>(o?.key)?o:({
            key:o,
        }))
        objetos.forEach(({key,type = null, array = false, hijos = false})=>{
            if(hijos && hijos.length){
                result [key] = this.iterarExport(hijos,target[key])
            }else{
                if(target[key]){
                    switch(type){
                        case String:
                        case Number:
                        case null:
                        case undefined:
                            result[key] = target[key]
                            break;
                        default:
                            if(array){
                                result[key] = target[key].map(t=>t.export())
                            }else{
                                result[key] = target[key].export()
                            }
                    }
                }
            }
        })
        return result
    }

    iterarHijos(params,objetos,target = this){
        objetos = objetos.map(o=>(o?.key)?o:({
            key:o,
        }))
        objetos.forEach(({key,type = null,porDefecto = null, array = false, hijos = false})=>{
            if(hijos && hijos.length){
                target[key] = {}
                this.iterarHijos(params[key]?params[key]:{},hijos,target[key])
            }else{
                if(array){
                    porDefecto = []
                }
                if(typeof params[key] !== 'undefined'){
                    switch(type){
                        case String:
                        case Number:
                        case null:
                        case undefined:
                            target[key] = params[key]
                            break;
                        default:
                            if(array){
                                target[key] = (params[key] && params[key].length)?(params[key].map(p=>new type(p))):[]
                            }else{
                                target[key] = (params[key])?new type(params[key]):null
                            }
                    }
                }else{
                    target[key] = porDefecto
                }
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