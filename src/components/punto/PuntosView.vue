<template>
    <b-container class="mt-5" fluid="md">
        <b-row>
            <b-col v-for="punto in puntos" col xs="12" sm="12" md="6" lg="4" xl="3" :key="punto.id" class="d-flex align-items-stretch">
                <b-card
                    :title="punto.nombre"
                    :img-src="punto.image?punto.image.url:''"
                    img-alt="Image"
                    img-top
                    tag="article"
                    style="max-width: 20rem;"
                    class="mb-2 mx-auto"
                >
                    <b-card-text v-html="punto.getContenidoCorto(150)"/>
                    <template #footer>
                        <router-link :to="punto.getPuntoUrlSlug()" class="card-link">Ver</router-link>
                    </template>
                </b-card>
            </b-col>
            <b-col cols="12" class="mt-4">
                <b-pagination
                    pills
                    :value="page"
                    :total-rows="totalRow"
                    :per-page="perPage"
                    size="lg"
                    first-number
                    last-number
                    @change="paginationClick"
                />
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
    name: "PuntosView",
    props:{
        propPrefijoQuery: String,
    },
    data(){
        return {
            ...crearVariables(variablesQuery),
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
        params(){
            return {
                with:['image','location'],
                page:this.propPage,
                perPage: this.propPerPage
            }
        },
        idInstancia(){
            return this.$store.getters.punto_get_instancia_from_params(this.params)
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
            this.$store.dispatch('punto_cargar_from_params',{
                params:this.params
            })
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