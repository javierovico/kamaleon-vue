<template>
    <b-container>
        <b-row>
            <b-col cols="12">
                <h3>Mapa Guia</h3>
            </b-col>
            <b-col cols="12">
                <GoogleMapLoader
                    id="mapa1"
                    :map-config="mapConfig"
                >
                    <template slot-scope="{ google, map }">
                        <GoogleMapMarkerCluster
                            :google="google"
                            :map="map"
                            :markers="puntosPosicion"
                        />
                    </template>

                </GoogleMapLoader>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import GoogleMapLoader from "@/components/mapa/GoogleMapLoader";
const {cambiarQuery} = require("@/Utils");
const {llenarQuery} = require("@/Utils");
const {crearWatch} = require("@/Utils");
const {crearVariables} = require("@/Utils");
import GoogleMapMarkerCluster from "@/components/mapa/GoogleMapMarkerCluster";

const {mapSettings} = require("@/constants/mapSettings");


const variablesQuery = {
    page: {type:'number',default:1},
    sortBy: {type:'string',default:''},
    sortDesc: {type:'boolean',default:false},
    perPage: {type:'number',default:12},
}
export default {
    name: "MapaView",
    components: {GoogleMapMarkerCluster, GoogleMapLoader},
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
        mapConfig() {
            return {
                ...mapSettings,
                zoom:6,
                center: this.mapCenter
            };
        },
        mapCenter() {
            return {
                lat:-25,
                lng:-56,
            };
        },
        puntosPosicion(){
            return this.puntos.map(p=>({
                position:p.getLatLngObject(),
                punto:p
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