import ClaseModelV2 from "@/store/modelos/ClaseModelV2";

/**
 * Es un conjunto de EncuestaRespuesta
 */
export default class Taxo extends ClaseModelV2 {
    static PRIMARY_KEY = 'id'
    static URL_DESCARGA = `/taxo`
    static URL_DEPARTAMENTO = 'departamento';
    static PREFIJO_DEPARTAMENTO = "Departamento de "

    static OBJETOS = [
        Taxo.PRIMARY_KEY,
        'activo',
        'archivo_id',
        'created_at',
        'nombre',
        'show',
        'taxo_id',
        'taxo_tipo_id',
        'updated_at',
    ]

    constructor(e) {
        super(e,Taxo.OBJETOS,Taxo.PRIMARY_KEY,Taxo.URL_DESCARGA);
    }

    static urlCargaFromId(id){
        return ClaseModelV2.urlCargaFromUrlPrimaryKey(Taxo.URL_DESCARGA,id)
    }

    static fromSource(e){
        return new Taxo(e)
    }

    getNombreDepartamento(){
        return this.nombre.substring(Taxo.PREFIJO_DEPARTAMENTO.length)
    }

}