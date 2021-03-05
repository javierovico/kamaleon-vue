<template>
  <div ref="popup" v-show="punto">
    <div>
      <a href="#" @click.prevent="infoWindowClick(punto)">
        <h5>{{ punto?punto.nombre:'' }}</h5>
      </a>
    </div>
    <div>
      <img :src='punto?punto.getMiniaturaUrl():""' alt="img" style="width: 150px;height: 100%">
    </div>
  </div>
</template>

<script>
import { POINT_MARKER_ICON_CONFIG } from "@/constants/mapSettings";
import { stylesCluster } from "@/constants/mapSettings";
import MarkerClusterer from '@googlemaps/markerclustererplus';

const {addQuery} = require("@/Utils");

export default {
    props: {
        google: {
            type: Object,
            required: true
        },
        map: {
            type: Object,
            required: true
        },
        markers: {
            type: Array,
            required: true
        }
    },
    data(){
        return{
            markersGoogle:[],
            markerClusterer:null,
            infoWindow: null,
            style: 3,
            punto: null,
        }
    },
    watch:{
        markers(){
            this.cargarMarkers()
        }
    },
    mounted() {
        this.cargarMarkers()
        this.infoWindow = new this.google.maps.InfoWindow({
            content: `Hola`
        })
    },
    methods:{
        infoWindowClick(punto){
            this.$router.push(addQuery(this.$route,{},punto.getPuntoUrlSlug()))
        },
        cargarMarkers(){
            this.markerClusterer?.clearMarkers();
            const { Marker } = this.google.maps;
            this.markersGoogle = this.markers.map(m=> {
                const marker = new Marker(
                    {
                        position: m.position,
                        marker: m,
                        map: this.map,
                        icon: POINT_MARKER_ICON_CONFIG,
                        title: m.punto.nombre,
                        punto:m.punto,
                    }
                )
                marker.addListener('click', () =>{
                    this.punto = marker.punto
                    this.infoWindow.setContent(this.$refs.popup)
                    this.infoWindow.open(this.map,marker)
                })
                return marker
            })
            this.markerClusterer = new MarkerClusterer(this.map, this.markersGoogle,
                {
                    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
                    styles: stylesCluster[this.style],
                    clusterClass: this.style === 3 ? "custom-clustericon" : undefined,
                }
            );
        }
    },
    // render() {
    //     return undefined
    // }
};
</script>

<style>

.custom-clustericon {
    background: var(--cluster-color);
    color: #fff;
    border-radius: 100%;
    font-weight: bold;
    font-size: 15px;
    display: flex;
    align-items: center;
}

.custom-clustericon::before,
.custom-clustericon::after {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;

    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    background: var(--cluster-color);
    opacity: 0.2;
    border-radius: 100%;
}

.custom-clustericon::before {
    padding: 7px;
}

.custom-clustericon::after {
    padding: 14px;
}

.custom-clustericon-1 {
    --cluster-color: #00a2d3;
}

.custom-clustericon-2 {
    --cluster-color: #ff9b00;
}

.custom-clustericon-3 {
    --cluster-color: #ff6969;
}
</style>