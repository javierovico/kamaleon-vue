<template>
    <div id="app">
        <NavBar/>
        <router-view></router-view>
    </div>
</template>

<script>

    import NavBar from "@/components/fijos/NavBar";
    export default {
        name: 'App',
        components: {
            NavBar
        },
        // mounted() {
        //     this.$store.dispatch('punto_general_cargar_todo')
        // }
    }
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
</style>
