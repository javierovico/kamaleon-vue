<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="info">
            <b-navbar-brand href="#">Kamaleon 360.</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <template
                            v-for="(menu,indexMenu) in menus"
                    >
                        <template v-if="menu.isSimple()">
                            <b-nav-item :href="menu.link" @click.prevent="$router.push(menu.link).catch(()=>{})" :key="indexMenu">{{menu.nombre}}</b-nav-item>
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
                        <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
                        <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
                    </b-nav-form>

                    <b-nav-item-dropdown text="Lang" right>
                        <b-dropdown-item href="#">EN</b-dropdown-item>
                        <b-dropdown-item href="#">ES</b-dropdown-item>
                        <b-dropdown-item href="#">RU</b-dropdown-item>
                        <b-dropdown-item href="#">FA</b-dropdown-item>
                    </b-nav-item-dropdown>

                    <b-nav-item-dropdown right>
                        <!-- Using 'button-content' slot -->
                        <template #button-content>
                            <em>User</em>
                        </template>
                        <b-dropdown-item href="#">Profile</b-dropdown-item>
                        <b-dropdown-item href="#">Sign Out</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
    export default {
        name: "NavBar",
        computed:{
            menus(){
                return this.$store.getters.main_menus
            }
        }
    }
</script>

<style scoped>

</style>