<template>
    <b-container>
        <b-row>
            <b-col cols="12">
                <h3>mapa</h3>
            </b-col>
            <b-col cols="12">
                <GmapMap
                    :center="center"
                    :zoom="7"
                    map-type-id="terrain"
                    style="width: 100%; height: 700px"
                >
                    <GmapMarker
                        :key="index"
                        v-for="(m, index) in puntosPosicion"
                        :position="m.position"
                        :clickable="true"
                        :draggable="true"
                        @click="center=m.position"
                    />
                </GmapMap>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
const {cambiarQuery} = require("@/Utils");
const {llenarQuery} = require("@/Utils");
const {crearWatch} = require("@/Utils");
const {crearVariables} = require("@/Utils");
const variablesQuery = {
    page: {type:'number',default:1},
    sortBy: {type:'string',default:''},
    sortDesc: {type:'boolean',default:false},
    perPage: {type:'number',default:12},
}
export default {
    name: "MapaView",
    props:{
        propPrefijoQuery: String,
    },
    data(){
        return {
            ...crearVariables(variablesQuery),
            center:{lat:-25,lng:-56},
        }
    },
    watch: {
        ...crearWatch(variablesQuery),
        params(){
            this.cargarPuntosInterno()
        },
    },
    computed:{
        ...llenarQuery(variablesQuery),
        puntosPosicion(){
            return this.puntos.map(p=>({
                position:p.getLatLngObject()
            }))
        },
        idInstancia(){
            return this.$store.getters.punto_get_instancia_from_location_only
        },
        puntos(){
            return this.$store.getters.punto_puntos(this.idInstancia)
        },
        totalRow(){
            return this.$store.getters.punto_total(this.idInstancia)
        }
    },
    mounted(){
        this.loadQuery()
        this.cargarPuntosInterno()
    },
    methods:{
        ...cambiarQuery(variablesQuery),
        cargarPuntosInterno(){
            this.$store.dispatch('punto_cargar_all_with_location')
        },
        paginationClick(page){
            if(page !== this.page){
                this.page = page
            }
        },
    }
}
</script>

<style scoped>

</style>