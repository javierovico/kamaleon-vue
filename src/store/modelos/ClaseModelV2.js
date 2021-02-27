export default class ClaseModelV2{

    //para actualizacion masiva
    _update = false
    _add = false

    objetos
    primaryKey


    constructor(params,objetos = [],primaryKey = 'id') {
        this.objetos = objetos
        this.primaryKey = primaryKey
        this.objetos.forEach(({key,type,porDefecto})=>{
            if(params[key]){
                switch(type){
                    case String:
                        this[key] = params[key]
                        break;
                    case Number:
                        this[key] = parseInt(params[key])
                        break;
                    default:
                        this[key] = new type(params[key])
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

    static URL_DESCARGA = `/xxxx`

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

    construirArrays() {

    }


    exists(){
        throw 'Se debe implementar en el hijo'
    }

    getUrlCarga(){
        throw 'Se debe implementar en el hijo'
    }

    getMethodCarga(){
        return this.exists()?'PUT':'POST'
    }

    static urlCargaFromId(id){
        throw 'nos'
        // let url = '/categoria'
        // if(id){
        //     url += `/${id}`
        // }
        // return url
    }


    getPrimaryKey(){
        throw 'no impoement  3232'
    }
}