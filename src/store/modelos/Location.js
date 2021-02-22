import ClaseModel from "@/store/modelos/ClaseModel";

export default class PanoConfig extends ClaseModel{
    id
    ciudad_id
    departamento_id
    lat
    lng
    descripcion
    created_at
    updated_at

    constructor(
        id = null,
        ciudad_id = null,
        departamento_id = null,
        lat = null,
        lng = null,
        descripcion = null,
        created_at = null,
        updated_at = null,
    ) {
        super();
        this.id = id
        this.ciudad_id = ciudad_id
        this.departamento_id = departamento_id
        this.lat = lat
        this.lng = lng
        this.descripcion = descripcion
        this.created_at = created_at
        this.updated_at = updated_at
    }


    static fromSource(e){
        return new PanoConfig(
            e.id,
            e.ciudad_id,
            e.departamento_id,
            e.lat,
            e.lng,
            e.descripcion,
            e.created_at,
            e.updated_at,
        )
    }
}