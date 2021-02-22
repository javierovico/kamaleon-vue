import ClaseModel from "@/store/modelos/ClaseModel";
import Archivo from "@/store/modelos/Archivo";

export default class TourSpot extends ClaseModel{
    id
    tour_id
    pano_fuente_id
    pano_destino_id
    en_h
    en_v
    a_h
    a_v
    activo
    created_at
    updated_at
    image

    static URL_DESCARGA = `/tour-spot`

    constructor(
        id = null,
        tour_id = null,
        pano_fuente_id = null,
        pano_destino_id = null,
        en_h = null,
        en_v = null,
        a_h = null,
        a_v = null,
        activo = null,
        created_at = null,
        updated_at = null,
        image = null,
    ) {
        super();
        this.id = id
        this.tour_id = tour_id
        this.pano_fuente_id = pano_fuente_id
        this.pano_destino_id = pano_destino_id
        this.en_h = en_h
        this.en_v = en_v
        this.a_h = a_h
        this.a_v = a_v
        this.activo = activo
        this.created_at = created_at
        this.updated_at = updated_at
        this.image = image
    }

    exists(){
        return this.id
    }

    getUrlCarga(){
        let url = `tour-spot`
        if(this.exists()){
            url += `/${this.id}`
        }
        return url
    }

    static fromSource(e){
        return new TourSpot(
            e.id,
            e.tour_id,
            e.pano_fuente_id,
            e.pano_destino_id,
            e.en_h,
            e.en_v,
            e.a_h,
            e.a_v,
            e.activo,
            e.created_at,
            e.updated_at,
            e.image?Archivo.fromSource(e.image):null,
        )
    }
}