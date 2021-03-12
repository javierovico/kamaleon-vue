<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="info">
            <b-navbar-brand href="/">Kamaleon 360.</b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <template
                            v-for="(menu,indexMenu) in menus"
                    >
                        <template v-if="menu.isSimple()">
                            <b-nav-item :href="menu.link" @click.prevent="clickMenuInterno(menu)" :key="indexMenu">{{menu.nombre}}</b-nav-item>
                        </template>
                        <template v-else>
                            <b-nav-item-dropdown :key="indexMenu" :text="menu.nombre" right>
                                <b-dropdown-item
                                        href="#"
                                        :key="indexSubMenu"
                                        v-for="(menu,indexSubMenu) in menu.hijos"
                                        @click.prevent="clickMenu(menu.link)"
                                >
                                    {{ menu.nombre }}
                                </b-dropdown-item>
                            </b-nav-item-dropdown>
                        </template>
                    </template>
                </b-navbar-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                    <b-nav-form>
                        <b-form-input v-model="formBusqueda" size="sm" class="mr-sm-2" placeholder="busqueda..."></b-form-input>
                        <b-button size="sm" class="my-2 my-sm-0" type="submit" @click.prevent="buscarPorNombre">buscar</b-button>
                    </b-nav-form>

                    <b-nav-item-dropdown :text="departamento?departamento.getNombreDepartamento():'Departamentos'" right>
                        <b-dropdown-item
                            @click.prevent="departamentoPulsado(null)"
                        >
                            Todos
                        </b-dropdown-item>
                        <template v-for="departamento in departamentos">
                            <b-dropdown-item
                                @click.prevent="departamentoPulsado(departamento)"
                                :key="departamento.id"
                            >
                                {{ departamento.getNombreDepartamento() }}
                            </b-dropdown-item>
                        </template>
                    </b-nav-item-dropdown>

                    <b-nav-item-dropdown right :text="ciudad?ciudad.nombre:'Ciudades'" v-if="ciudades.length">
                        <b-dropdown-item
                            @click.prevent="ciudadPulsado(null)"
                        >
                            Todos
                        </b-dropdown-item>
                        <template v-for="ciudad in ciudades">
                            <b-dropdown-item
                                @click.prevent="ciudadPulsado(ciudad)"
                                :key="ciudad.id"
                            >
                                {{ ciudad.nombre }}
                            </b-dropdown-item>
                        </template>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
const {cambiarQuery,addQuery,rutearV2} = require("@/Utils");
const {llenarQuery} = require("@/Utils");
const {crearWatch} = require("@/Utils");
const {crearVariables} = require("@/Utils");

const variablesQuery = {
    busqueda: {type:'string', default:'', form:true},
    departamentoId: {type:'number', default:null},
    ciudadId: {type:'number', default:null},
}
export default {
    name: "NavBar",
    data: ()=>({
        ...crearVariables(variablesQuery),
    }),
    watch: {
        ...crearWatch(variablesQuery),
        propDepartamentoId(id){
            this.loadCiudadesInterno()
            this.$store.dispatch('main_set_departamento_id',id)
        },
        propCiudadId(id){
            this.$store.dispatch('main_set_ciudad_id',id)
        },
        propBusqueda(b){
            this.$store.dispatch('main_set_busqueda',b)
        }
    },
    computed:{
        ...llenarQuery(variablesQuery),
        menus(){
            return this.$store.getters.main_menus
        },
        departamentos(){
            return this.$store.getters.taxo_departamento_departamentos
        },
        ciudades(){
            return this.$store.getters.taxo_ciudad_ciudades(this.propDepartamentoId)
        },
        departamento(){
            return this.$store.getters.taxo_departamento_get_by_id(this.propDepartamentoId)
        },
        ciudad(){
            return this.$store.getters.taxo_ciudad_get_ciudad_by_id(this.propCiudadId)
        },
    },
    methods:{
        ...cambiarQuery(variablesQuery),
        buscarPorNombre(){
            this.setBusqueda(this.formBusqueda)
        },
        departamentoPulsado(departamento){
            this.setDepartamentoId(departamento?departamento.id:null)
        },
        ciudadPulsado(ciudad){
            this.setCiudadId(ciudad?ciudad.id:null)
        },
        loadDepartamentosInterno(){
            this.$store.dispatch('taxo_departamento_cargar')
        },
        loadCiudadesInterno(){
            if(this.propDepartamentoId){
                this.$store.dispatch('taxo_ciudad_cargar',{
                    departamentoId: this.propDepartamentoId
                })
            }
        },
        setParametrosGenerales(){
            this.$store.dispatch('main_set_busqueda',this.propBusqueda)
            this.$store.dispatch('main_set_ciudad_id',this.propCiudadId)
            this.$store.dispatch('main_set_departamento_id',this.propDepartamentoId)
        },
        clickMenuInterno(menu){
            rutearV2({
                path:menu.link
            })
        }
    },
    mounted() {
        this.loadQuery()
        this.loadDepartamentosInterno()
        this.loadCiudadesInterno()
        this.setParametrosGenerales()
    }
}
</script>

<style scoped>

</style>