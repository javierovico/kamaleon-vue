import PanoConfig from "@/store/modelos/PanoConfig";
import Location from "@/store/modelos/Location";
import ClaseModelV2 from "@/store/modelos/ClaseModelV2";
import Archivo from "@/store/modelos/Archivo";

export const TIPO_TERRESTRE = 1

export default class Pano extends ClaseModelV2{

    static OBJETOS = [
        {key:'id', type:Number, porDefecto:null},
        {key:'nombre', type:String, porDefecto:''},
        {key:'activo', type:Number, porDefecto:1},
        {key:'created_at', type:String, porDefecto:null},
        {key:'updated_at', type:String, porDefecto:null},
        {key:'fondo_id', type:Number, porDefecto:null},
        {key:'miniatura_id', type:Number, porDefecto:null},
        {key:'tipo', type:Number, porDefecto:TIPO_TERRESTRE},
        {key:'pivot', type:Object, porDefecto: {}},
        {key:'configuracion', type:PanoConfig, porDefecto:null},
        {key:'location', type:Location, porDefecto:null},
        {key:'thumbnail', type:Archivo, porDefecto:null},
    ]

    static PRIMARY_KEY = 'id'

    static URL_DESCARGA = `/pano`

    constructor(e) {
        super(e,Pano.OBJETOS,Pano.PRIMARY_KEY);
    }

    exists(){
        return this.id > 0
    }

    static urlCargaFromId(id){
        let url = Pano.URL_DESCARGA
        if(id){
            url += `/${id}`
        }
        return url
    }

    /** Legacy */
    fromSource(e){
        return new Pano(e)
    }

    getUrlCarga(){
        return Pano.urlCargaFromId(this[this.primaryKey])
    }

}