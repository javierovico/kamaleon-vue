import ClaseModelV2 from "@/store/modelos/ClaseModelV2";
import Archivo from "@/store/modelos/Archivo";

export default class TourSpot extends ClaseModelV2{

    static OBJETOS = [
        {key:'a_h',type:String, porDefecto: null},
        {key:'a_v',type:String, porDefecto: null},
        {key:'activo',type:String, porDefecto: null},
        {key:'created_at',type:String, porDefecto: null},
        {key:'en_h',type:String, porDefecto: null},
        {key:'en_v',type:String, porDefecto: null},
        {key:'id',type:String, porDefecto: null},
        {key:'image',type:Archivo, porDefecto: null},
        {key:'image_id',type:String, porDefecto: null},
        {key:'pano_destino_id',type:String, porDefecto: null},
        {key:'pano_fuente_id',type:String, porDefecto: null},
        {key:'tour_id',type:String, porDefecto: null},
        {key:'updated_at',type:String, porDefecto: null},
    ]

    static URL_DESCARGA = `/tour-spot`

    constructor(e) {
        super(e,TourSpot.OBJETOS);
    }

    exists(){
        return !!this.id
    }

    getUrlCarga(){
        let url = `tour-spot`
        if(this.exists()){
            url += `/${this.id}`
        }
        return url
    }

    static fromSource(e){
        return new TourSpot(e)
    }
}