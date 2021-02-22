import ClaseModel from "@/store/modelos/ClaseModel";

export default class Archivo extends ClaseModel{
    created_at
    id
    path
    thumb
    thumb_url
    tipo
    updated_at
    url
    //de vista
    _reproduciendo = false

    static URL_DESCARGA = `archivo`
    static TIPO_SONIDO = 6;

    constructor(
        created_at = null,
        id = null,
        path = null,
        thumb = null,
        thumb_url = null,
        tipo = null,
        updated_at = null,
        url = null,
    ) {
        super();
        this.created_at = created_at
        this.id = id
        this.path = path
        this.thumb = thumb
        this.thumb_url = thumb_url
        this.tipo = tipo
        this.updated_at = updated_at
        this.url = url
    }

    tipoStr(){
        switch(this.tipo){
            case 6:
                return 'Audio'
            case 7:
                return 'Imagen'
            default:
                return 'Desconocido'
        }
    }

    exists(){
        return this.id > 0
    }

    getUrlCarga(){
        return (this.exists())?(`archivo/${this.id}`):(`archivo`)
    }

    static fromSource(e){
        return new Archivo(
            e.created_at,
            e.id,
            e.path,
            e.thumb,
            e.thumb_url,
            e.tipo,
            e.updated_at,
            e.url,
        )
    }
}