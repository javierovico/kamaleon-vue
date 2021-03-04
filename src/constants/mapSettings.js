import colorPalette from "@/constants/colorPalette";
import MarkerClusterer from '@googlemaps/markerclustererplus';

const {
    COLOR_LANDSCAPE,
    COLOR_BORDERS,
    COLOR_WATER,
    COLOR_LINE,
    COLOR_POINT_FILL,
    COLOR_SELECTED_POINT
} = colorPalette;

const COLORS = {
    BORDERS: COLOR_BORDERS,
    LANDSCAPE: COLOR_LANDSCAPE,
    LINE: COLOR_LINE,
    POINT: COLOR_SELECTED_POINT,
    POINT_FILL: COLOR_POINT_FILL,
    WATER: COLOR_WATER
};

const POINT_MARKER_ICON_CONFIG = {
    path: "M 0, 0 m -5, 0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0",
    strokeOpacity: 0.7,
    strokeWeight: 4,
    strokeColor: COLORS.POINT,
    fillColor: COLORS.POINT_FILL,
    fillOpacity: 0.7,
    scale: 1
};

const LINE_SYMBOL_CONFIG = {
    path: "M 0,-2 0,2",
    strokeOpacity: 1,
    strokeWeight: 2,
    scale: 1
};

const LINE_PATH_CONFIG = {
    clickable: false,
    geodesic: false,
    strokeOpacity: 0,
    strokeColor: COLORS.LINE,
    icons: [
        {
            icon: LINE_SYMBOL_CONFIG,
            repeat: "10px"
        }
    ]
};

const mapSettings = {
    clickableIcons: false,
    streetViewControl: false,
    panControlOptions: false,
    gestureHandling: "cooperative",
    backgroundColor: COLORS.LANDSCAPE,
    mapTypeControl: true,
    zoomControlOptions: {
        style: "SMALL"
    },
    zoom: 5,
    minZoom: 2,
    maxZoom: 50,
    styles: [
        {
            featureType: "landscape",
            stylers: [
                { hue: COLORS.LANDSCAPE },
                // { saturation: 50.2 },
                // { lightness: -34.8 },
                // { gamma: 1 }
            ]
        },
        {
            featureType: "poi",
            stylers: [{ visibility: "off" }]
        },
        {
            featureType: "road.highway",
            stylers: [
                { hue: COLORS.LANDSCAPE },
                { saturation: -19.8 },
                { lightness: -1.8 },
                { gamma: 1 }
            ]
        },
        {
            featureType: "road.arterial",
            stylers: [
                { hue: COLORS.LANDSCAPE },
                { saturation: 72.4 },
                { lightness: -32.6 },
                { gamma: 1 }
            ]
        },
        {
            featureType: "road.local",
            stylers: [{ visibility: "off" }]
        },
        {
            featureType: "transit",
            stylers: [{ visibility: "off" }]
        },
        {
            featureType: "administrative.province",
            stylers: [{ visibility: "off" }]
        },
        {
            featureType: "administrative.locality",
            stylers: [{ visibility: "off" }]
        },
        {
            featureType: "administrative.province",
            stylers: [{ visibility: "off" }]
        },
        {
            featureType: "administrative.land_parcel",
            stylers: [{ visibility: "off" }]
        },
        {
            featureType: "administrative.neighborhood",
            stylers: [{ visibility: "off" }]
        },
        {
            featureType: "administrative.country",
            elementType: "geometry.stroke",
            stylers: [{ visibility: "on" }, { color: COLORS.BORDERS }]
        },
        {
            featureType: "administrative",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
        },
        {
            featureType: "water",
            stylers: [
                { hue: COLORS.WATER },
                { saturation: -63.2 },
                { lightness: 38 },
                { gamma: 1 }
            ]
        }
    ]
};


const stylesCluster = [
    [
        MarkerClusterer.withDefaultStyle({
            width: 35,
            height: 35,
            url: "/images/people35.png",
            textColor: "#ff00ff",
            textSize: 10,
        }),
        MarkerClusterer.withDefaultStyle({
            width: 45,
            height: 45,
            url: "../images/people45.png",
            textColor: "#ff0000",
            textSize: 11,
        }),
        MarkerClusterer.withDefaultStyle({
            width: 55,
            height: 55,
            url: "../images/people55.png",
            textColor: "#ffffff",
            textSize: 12,
        }),
    ],
    [
        MarkerClusterer.withDefaultStyle({
            url: "../images/conv30.png",
            width: 30,
            height: 27,
            anchorText: [-3, 0],
            anchorIcon: [27, 28],
            textColor: "#ff00ff",
            textSize: 10,
        }),
        MarkerClusterer.withDefaultStyle({
            url: "../images/conv40.png",
            width: 40,
            height: 36,
            anchorText: [-4, 0],
            anchorIcon: [36, 37],
            textColor: "#ff0000",
            textSize: 11,
        }),
        MarkerClusterer.withDefaultStyle({
            url: "../images/conv50.png",
            width: 50,
            height: 45,
            anchorText: [-5, 0],
            anchorIcon: [45, 46],
            textColor: "#0000ff",
            textSize: 12,
        }),
    ],
    [
        MarkerClusterer.withDefaultStyle({
            url: "../images/heart30.png",
            width: 30,
            height: 26,
            anchorIcon: [26, 15],
            textColor: "#ff00ff",
            textSize: 10,
        }),
        MarkerClusterer.withDefaultStyle({
            url: "../images/heart40.png",
            width: 40,
            height: 35,
            anchorIcon: [35, 20],
            textColor: "#ff0000",
            textSize: 11,
        }),
        MarkerClusterer.withDefaultStyle({
            url: "../images/heart50.png",
            width: 50,
            height: 44,
            anchorIcon: [44, 25],
            textSize: 12,
        }),
    ],
    [
        {
            width: 30,
            height: 30,
            className: "custom-clustericon-1",
        },
        {
            width: 40,
            height: 40,
            className: "custom-clustericon-2",
        },
        {
            width: 50,
            height: 50,
            className: "custom-clustericon-3",
        },
    ],
];

export { mapSettings, LINE_PATH_CONFIG, POINT_MARKER_ICON_CONFIG, stylesCluster };
