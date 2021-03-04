<template>
    <b-container>
        <b-row>
            <b-col cols="12">
                <h3>mapa</h3>
            </b-col>
            <b-col cols="6">
                <h2>mapa1</h2>
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
<!--                        <GoogleMapMarker-->
<!--                            v-for="marker in puntosPosicion"-->
<!--                            :key="marker.id"-->
<!--                            :marker="marker"-->
<!--                            :google="google"-->
<!--                            :map="map"-->
<!--                        />-->
<!--                        <GoogleMapLine-->
<!--                            v-for="line in lines"-->
<!--                            :key="line.id"-->
<!--                            :path.sync="line.path"-->
<!--                            :google="google"-->
<!--                            :map="map"-->
<!--                        />-->
                    </template>

                </GoogleMapLoader>
            </b-col>
            <b-col cols="6">
                <h2>mapa2</h2>
                <GoogleMapLoader
                    id="mapa2"
                    :map-config="mapConfig"
                >
                    <template slot-scope="{ google, map }">
                        <GoogleMapMarker
                            v-for="marker in puntosPosicion"
                            :key="marker.id"
                            :marker="marker"
                            :google="google"
                            :map="map"
                        />
                        <GoogleMapLine
                            v-for="line in lines"
                            :key="line.id"
                            :path.sync="line.path"
                            :google="google"
                            :map="map"
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
import {load, Map, Marker} from 'vue-google-maps'
import GoogleMapMarker from "@/components/mapa/GoogleMapMarker";
import GoogleMapLine from "@/components/mapa/GoogleMapLine";
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
    components: {GoogleMapMarkerCluster, GoogleMapLine, GoogleMapMarker, GoogleMapLoader},
    props:{
        propPrefijoQuery: String,
    },
    data(){
        return {
            ...crearVariables(variablesQuery),
            center:{lat:-25,lng:-56},
            markers: [
                {
                    id: "a",
                    position: { lat: 3, lng: 101 }
                },
                {
                    id: "b",
                    position: { lat: 5, lng: 99 }
                },
                {
                    id: "c",
                    position: { lat: 6, lng: 97 }
                }
            ],
            lines: [
                {
                    id: "1",
                    path: [{ lat: 3, lng: 101 }, { lat: 5, lng: 99 }]
                },
                {
                    id: "2",
                    path: [{ lat: 5, lng: 99 }, { lat: 6, lng: 97 }]
                }
            ]
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
            // return [
            //     {
            //         position:{lat:-25,lng:-56}
            //     }
            // ]
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