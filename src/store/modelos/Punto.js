import Archivo from "@/store/modelos/Archivo";
import Tour from "@/store/modelos/Tour";
import ClaseModelV2 from "@/store/modelos/ClaseModelV2";
import Location from "@/store/modelos/Location";

export default class Punto extends ClaseModelV2{

    static OBJETOS = [
        {key:'contenido', type: null, porDefecto:null},
        {key:'created_at', type: null, porDefecto:null},
        {key:'estado', type: null, porDefecto:null},
        {key:'id', type: null, porDefecto:null},
        {key:'image', type: Archivo, porDefecto:null},
        {key:'image_id', type: null, porDefecto:null},
        {key:'location', type: Location, porDefecto:null},
        {key:'location_id', type: null, porDefecto:null},
        {key:'nombre', type: null, porDefecto:null},
        {key:'slug', type: null, porDefecto:null},
        {key:'tour_id', type: null, porDefecto:null},
        {key:'updated_at', type: null, porDefecto:null},
        {key:'user_id', type: null, porDefecto:null},
        {key:'votantes_numero', type: null, porDefecto:null},
        {key:'votantes_sumatoria', type: null, porDefecto:null},
    ]

    static URL_DESCARGA = `hotel`
    static URL_DESCARGA_SLUG = `punto-slug`

    constructor(e) {
        super(e,Punto.OBJETOS,'id',Punto.URL_DESCARGA);
    }

    static urlCargaFromId(id){
        return ClaseModelV2.urlCargaFromUrlPrimaryKey(Punto.URL_DESCARGA,id)
    }

    static urlCargaFromSlug(slug){
        return ClaseModelV2.urlCargaFromUrlPrimaryKey(Punto.URL_DESCARGA_SLUG,slug)
    }

    static fromSource(e){
        return new Punto(e)
    }

    getContenidoLimpio(){
        return this.contenido
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/g, '')
    }

    getContenidoCorto(n = 20,useWordBoundary = true){
        const str = this.getContenidoLimpio()
        if (str.length <= n) { return str; }
        const subString = str.substr(0, n-1); // the original check
        return (useWordBoundary
            ? subString.substr(0, subString.lastIndexOf(" "))
            : subString) + "&hellip;";
    }

    hasTour(){
        return !!this.tour_id
    }

    getTourUrl(){
        return Tour.urlCargaFromId(this.tour_id)
    }

    getPuntoUrlSlug(){
        return Punto.urlCargaFromSlug(this.slug)
    }

    getLatLngObject(){
        return this.location?this.location.getLatLngObject():null
    }

    getMiniaturaUrl(){
        let urlImage = this?.image?.url
        if(!urlImage){
            urlImage =  `http://i.stack.imgur.com/g672i.png`
        }
        return urlImage
    }
}