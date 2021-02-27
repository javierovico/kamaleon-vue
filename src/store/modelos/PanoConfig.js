import ClaseModelV2 from "@/store/modelos/ClaseModelV2";
import Location from "@/store/modelos/Location";
import Archivo from "@/store/modelos/Archivo";
import {TIPO_TERRESTRE} from "@/store/modelos/Pano";

export default class PanoConfig extends ClaseModelV2{

    static OBJETOS = [
        {key:'created_at', type:String, porDefecto:null},
        {key:'id', type:Number, porDefecto:null},
        {key:'nivel_zoom', type:Number, porDefecto:0},
        {key:'path', type:String, porDefecto:''},
        {key:'previewUrl', type:String, porDefecto:null},
        {key:'tipo', type:Number, porDefecto:1},
        {key:'updated_at', type:String, porDefecto:null},
        {key:'urlRoot', type:String, porDefecto:null},
        {key:'circleUrl', type:String, porDefecto:null},
    ]

    static PRIMARY_KEY = 'id'

    static URL_DESCARGA = `/xxx`

    constructor(e) {
        super(e,PanoConfig.OBJETOS,PanoConfig.PRIMARY_KEY);
    }

    static fromSource(e){
        return new PanoConfig(e)
    }
}