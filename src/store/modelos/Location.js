import ClaseModelV2 from "@/store/modelos/ClaseModelV2";

export default class Location extends ClaseModelV2 {

    static OBJETOS = [
        { key:'ciudad_id', type: Number, porDefecto:null},
        { key:'created_at', type: String, porDefecto:null},
        { key:'departamento_id', type: Number, porDefecto:null},
        { key:'descripcion', type: String, porDefecto:null},
        { key:'id', type: Number, porDefecto:null},
        { key:'lat', type: Number, porDefecto:null},
        { key:'lng', type: Number, porDefecto:null},
        { key:'updated_at', type: String, porDefecto:null},
    ]

    constructor(e) {
        super(e,Location.OBJETOS);
    }


    static fromSource(e){
        return new Location(e)
    }

    getLatLngObject(){
        const {lat,lng} = this
        return {lat, lng}
    }
}