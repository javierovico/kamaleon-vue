import ClaseModelV2 from "@/store/modelos/ClaseModelV2";
export default class Archivo extends ClaseModelV2{

    static TIPO_SONIDO = 6;
    static TIPO_ABSOLUTO = 1;

    static OBJETOS = [
        {key:'id', type:Number, porDefecto:null},
        {key:'created_at', type:String, porDefecto:null},
        {key:'updated_at', type:String, porDefecto:null},
        {key:'path', type:String, porDefecto: ''},
        {key:'tipo', type:Number, porDefecto:Archivo.TIPO_ABSOLUTO},
        {key:'url', type:String, porDefecto: ''},
    ]

    static URL_DESCARGA = `archivo`

    constructor(e) {
        super(e,Archivo.OBJETOS);
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
        return !!this.id
    }

    static urlCargaFromId(id){
        let url = Archivo.URL_DESCARGA
        if(id){
            url += `/${id}`
        }
        return url
    }


    static fromSource(e){
        return new Archivo(e)
    }
}