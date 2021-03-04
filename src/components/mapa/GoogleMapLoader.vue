<template>
    <div>
        <div class="google-map"
             :ref="id"
             style="height: 600px"
        />
        <template v-if="Boolean(this.google) && Boolean(this.map)">
            <slot
                :google="google"
                :map="map"
            />
        </template>
    </div>
</template>

<script>
//https://www.npmjs.com/package/google-maps
import {Loader, LoaderOptions} from 'google-maps';
const options = {/* todo */};
const loader = new Loader('AIzaSyAViVaAwNI4Uss03dVlks2gMZXcYQm3Xlg', options);

export default {
    name: "GoogleMapLoader",
    props: {
        mapConfig: Object,
        id: String,
    },

    data() {
        return {
            google: null,
            map: null,
        }
    },
    mounted() {
        loader.load().then( (google)=> {
            this.google = google
            this.initializeMap()
        });
    },

    methods: {
        initializeMap() {
            this.map = new this.google.maps.Map(this.$refs[this.id], this.mapConfig);
        }
    }
}
</script>

<style scoped>

</style>