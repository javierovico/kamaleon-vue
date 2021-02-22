import ClaseModel from "@/store/modelos/ClaseModel";
import Archivo from "@/store/modelos/Archivo";
import PanoConfig from "@/store/modelos/PanoConfig";
import Location from "@/store/modelos/Location";

export const TIPO_TERRESTRE = 1

export default class Pano extends ClaseModel{
    id
    nombre
    archivo
    contenido
    zoom
    gps_lat
    gps_lng
    activo
    created_at
    updated_at
    fondo_id
    tipo
    //pivots
    pivot
    //calculadas como atributo
    urlMiniatura
    //relaciones
    fondo
    configuracion
    location
    thumbnail
    //visual
    _reproduciendo = false

    static URL_DESCARGA = `/pano`

    constructor(
        id = null,
        nombre = '',
        archivo = null,
        contenido = null,
        zoom = null,
        gps_lat = '',
        gps_lng = '',
        activo = 1,
        created_at = null,
        updated_at = null,
        fondo_id = null,
        tipo = TIPO_TERRESTRE,
        fondo = null,
        urlMiniatura = '',
        pivot = null,
        configuracion = null,
        location = null,
        thumbnail = null
    ) {
        super();
        this.id=id
        this.nombre=nombre
        this.archivo=archivo
        this.contenido=contenido
        this.zoom=zoom
        this.gps_lat=gps_lat
        this.gps_lng=gps_lng
        this.activo=activo
        this.created_at=created_at
        this.updated_at=updated_at
        this.fondo_id=fondo_id
        this.tipo=tipo
        this.fondo = fondo?Archivo.fromSource(fondo):null
        this.urlMiniatura = urlMiniatura
        this.pivot = pivot
        this.configuracion = configuracion
        this.location = location
        this.thumbnail = thumbnail
    }

    exists(){
        return this.id > 0
    }

    static urlCargaFromId(id){
        return (id)?(`/pano/${id}`):(`/pano`)
    }

    getUrlCarga(){
        return Pano.urlCargaFromId(this[ClaseModel.PRIMARY_KEY])
    }

    static fromSource(e){
        return new Pano(
            e.id,
            e.nombre,
            e.archivo,
            e.contenido,
            e.zoom,
            e.gps_lat,
            e.gps_lng,
            e.activo,
            e.created_at,
            e.updated_at,
            e.fondo_id,
            e.tipo,
            e.fondo,
            e.urlMiniatura,
            e.pivot,
            e.configuracion?PanoConfig.fromSource(e.configuracion):null,
            e.location?Location.fromSource(e.location):null,
            e.thumbnail?Archivo.fromSource(e.thumbnail):null,
        )
    }
}