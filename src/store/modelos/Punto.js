import ClaseModel from "@/store/modelos/ClaseModel";
import Archivo from "@/store/modelos/Archivo";
import Tour from "@/store/modelos/Tour";

export default class Punto extends ClaseModel{
    id
    slug
    user_id
    image_id
    tour_id
    estado
    nombre
    contenido
    votantes_numero
    votantes_sumatoria
    location_id
    created_at
    updated_at
    //relaciones
    image

    static URL_DESCARGA = `hotel`
    static URL_DESCARGA_SLUG = `punto-slug`

    constructor(
        id = null,
        slug = null,
        user_id = null,
        image_id = null,
        tour_id = null,
        estado = null,
        nombre = null,
        contenido = null,
        votantes_numero = null,
        votantes_sumatoria = null,
        location_id = null,
        created_at = null,
        updated_at = null,
        image = null,
    ) {
        super();
        this.id = id
        this.slug = slug
        this.user_id = user_id
        this.image_id = image_id
        this.tour_id = tour_id
        this.estado = estado
        this.nombre = nombre
        this.contenido = contenido
        this.votantes_numero = votantes_numero
        this.votantes_sumatoria = votantes_sumatoria
        this.location_id = location_id
        this.created_at = created_at
        this.updated_at = updated_at
        this.image = image
    }

    exists(){
        return !!this.id
    }

    getUrlCarga(){
        return Tour.urlCargaFromId(this.exists()?this.id:null)
    }


    static urlCargaFromId(id){
        let url = Punto.URL_DESCARGA
        if(id){
            url += `/${id}`
        }
        return url
    }

    static urlCargaFromSlug(slug){
        return Punto.URL_DESCARGA_SLUG +`/${slug}`
    }

    static fromSource(e){
        return new Punto(
            e.id,
            e.slug,
            e.user_id,
            e.image_id,
            e.tour_id,
            e.estado,
            e.nombre,
            e.contenido,
            e.votantes_numero,
            e.votantes_sumatoria,
            e.location_id,
            e.created_at,
            e.updated_at,
            e.image?Archivo.fromSource(e.image):null,
        )
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
}