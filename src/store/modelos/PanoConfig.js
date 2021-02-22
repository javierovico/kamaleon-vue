import ClaseModel from "@/store/modelos/ClaseModel";

export default class PanoConfig extends ClaseModel{
    created_at
    id
    nivel_zoom
    path
    tipo
    updated_at
    //calculados asha
    urlRoot
    thumbnailUrl
    previewUrl

    constructor(
        created_at = null,
        id = null,
        nivel_zoom = null,
        path = null,
        tipo = null,
        updated_at = null,
        urlRoot = null,
        thumbnailUrl = null,
        previewUrl = null
    ) {
        super();
        this.created_at = created_at
        this.id = id
        this.nivel_zoom = nivel_zoom
        this.path = path
        this.tipo = tipo
        this.updated_at = updated_at
        this.urlRoot = urlRoot
        this.thumbnailUrl = thumbnailUrl
        this.previewUrl = previewUrl
    }


    static fromSource(e){
        return new PanoConfig(
            e.created_at,
            e.id,
            e.nivel_zoom,
            e.path,
            e.tipo,
            e.updated_at,
            e.urlRoot,
            e.thumbnailUrl,
            e.previewUrl,
        )
    }
}