<template>
    <b-container class="mt-5" fluid="md">
        <b-row>
            <b-col cols="12" v-if="tourId">
                <PanoView
                    :prop-id="panoId"
                    :prop-pano-id="visor.panoId"
                    :prop-id-div="visor.id"
                    :prop-h="visor.h"
                    :prop-v="visor.v"
                    @panoChange="panoChange($event)"
                />
            </b-col>
            <b-col v-else cols="12">
                <b-carousel
                    id="carousel-fade"
                    style="text-shadow: 0px 0px 2px #000"
                    fade
                    indicators
                    img-width="1024"
                    img-height="480"
                >
                    <b-carousel-slide
                        caption="First slide"
                        img-src="https://picsum.photos/1024/480/?image=10"
                    ></b-carousel-slide>
                    <b-carousel-slide
                        caption="Second Slide"
                        img-src="https://picsum.photos/1024/480/?image=12"
                    ></b-carousel-slide>
                    <b-carousel-slide
                        caption="Third Slide"
                        img-src="https://picsum.photos/1024/480/?image=22"
                    ></b-carousel-slide>
                </b-carousel>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import PanoView from "@/components/pano/PanoView";
const {cambiarQuery} = require("@/Utils");
const {llenarQuery} = require("@/Utils");
const {crearWatch} = require("@/Utils");
const {crearVariables} = require("@/Utils");
const variablesQuery = {
    page: {type:'number',default:1},
    sortBy: {type:'string',default:''},
    sortDesc: {type:'boolean',default:false},
    perPage: {type:'number',default:12},
    panoActualId: {type:'number', default:null}
}

export default {
    name: "PuntoView",
    components: {PanoView},
    props:{
        propPrefijoQuery: String,
        propSlug: String,
    },
    data(){
        return {
            ...crearVariables(variablesQuery),
        }
    },
    watch: {
        ...crearWatch(variablesQuery),
    },
    computed:{
        ...llenarQuery(variablesQuery),
        panoId(){
            return {
                tourIdVisor: this.punto?.tour_id,
                panoIdVisor: null,
            }
        },
        visor(){
            return{
                id:'id-tour-view-punto',
                h:50.0,
                v:0.0,
                panoId:this.propPanoActualId,
            }
        },
        punto(){
            return this.$store.getters.punto_get_punto_by_slug(this.propSlug)
        },
        tourId(){
            return (this.punto && this.punto.tour_id)? this.punto.tour_id:null
        }
    },
    mounted(){
        this.loadQuery()
        this.cargarPuntoInterno()
        this.cargarTourInterno()
    },
    methods:{
        ...cambiarQuery(variablesQuery),
        cargarPuntoInterno(){
            this.$store.dispatch('punto_cargar_from_slug',{
                slug:this.propSlug,
            })
        },
        cargarTourInterno(){
            if(this.tourId){
                this.$store.dispatch('tour_tour_by_id',{id:this.tourId})
            }
        },
        panoChange(panoId){
            this.setPanoActualId(panoId)
        },
    }
}
</script>

<style scoped>

</style>