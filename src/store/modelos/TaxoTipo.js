import ClaseModelV2 from "@/store/modelos/ClaseModelV2";

/**
 * Es un conjunto de EncuestaRespuesta
 */
export default class TaxoTipo extends ClaseModelV2 {
    static PRIMARY_KEY = 'id'
    static URL_DESCARGA = `/taxo-tipo`
    static TIPO_REGION = 'regiones'

    static OBJETOS = [
        TaxoTipo.PRIMARY_KEY,
    ]

    constructor(e) {
        super(e,TaxoTipo.OBJETOS,TaxoTipo.PRIMARY_KEY,TaxoTipo.URL_DESCARGA);
    }

    static urlCargaFromId(id){
        return ClaseModelV2.urlCargaFromUrlPrimaryKey(TaxoTipo.URL_DESCARGA,id)
    }

    static fromSource(e){
        return new TaxoTipo(e)
    }

}