import ClaseModel from "@/store/modelos/ClaseModel";
import Archivo from "@/store/modelos/Archivo";

export default class Tour extends ClaseModel{
    id
    nombre
    activo
    created_at
    updated_at

    static URL_DESCARGA = `tour`

    constructor(
        id = null,
        nombre = null,
        activo = null,
        created_at = null,
        updated_at = null,
    ) {
        super();
        this.id = id
        this.nombre = nombre
        this.activo = activo
        this.created_at = created_at
        this.updated_at = updated_at
    }

    exists(){
        return !!this.id
    }

    getUrlCarga(){
        return Tour.urlCargaFromId(this.exists()?this.id:null)
    }


    static urlCargaFromId(id){
        let url = Tour.URL_DESCARGA
        if(id){
            url += `/${id}`
        }
        return url
    }


    static fromSource(e){
        return new Tour(
            e.id,
            e.nombre,
            e.activo,
            e.created_at,
            e.updated_at,
        )
    }

}