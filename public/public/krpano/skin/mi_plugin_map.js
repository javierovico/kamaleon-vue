/*
    krpano HTML5 Javascript Plugin Example
*/

function krpanoplugin()
{
    var local = this;   // save the 'this' pointer from the current plugin object

    var krpano = null;  // the krpano and plugin interface objects
    var plugin = null;

    var xml_value = 100.0;   // este es el valor original, el que esta en el xml es el que le reemplaza
    //mi propio variable
    var idpadre = '';    //indica qeu no hay
    var locations = [];
    var map;

    var div_info;


    var markerActual = null;   //para guardar el marquer a sser editado
    var modoActual = null;      // null -> no iniciado   1->agregar, mover   2->mover(para gps existente)

    // registerplugin - startup point for the plugin (required)
    // - krpanointerface = krpano interface object
    // - pluginpath = the fully qualified plugin name (e.g. "plugin[name]")
    // - pluginobject = the xml plugin object itself
    local.registerplugin = function(krpanointerface, pluginpath, pluginobject)
    {
        // get the krpano interface and the plugin object
        krpano = krpanointerface;
        plugin = pluginobject;

        // first - say hello
        // krpano.trace(1, "hello from plugin[" + plugin.name + "]");

        // add plugin attributes
        plugin.registerattribute("mode", "normal");
        plugin.registerattribute("value", xml_value, value_setter, value_getter);
        plugin.registerattribute("idpadre",idpadre, set_padre, get_padre)

        // add plugin action (the attribute needs to be lowercase!)
        plugin.dosomething = action_dosomething;
        plugin.abierto = action_abierto;

        // optionally - add some graphical content:

        // register the size of the content
        plugin.registercontentsize(200,200);
    }

    function get_padre(){
        return idpadre;
    }

    function set_padre(nuevoPadre){
        idpadre = nuevoPadre;
        if(idpadre !== '') {
            llenarMapa();
        }
    }

    /**
     * Llena el mapa
     */
    function llenarMapa(){
        // krpano.trace(1, "Se puede llenar con idpadre: "+idpadre);
        // the plugin 'sprite' variable is the internal html element of the plugin
        // plugin.sprite.appendChild(text);
        //javier
        var div_contenedor = document.createElement('div');
        div_contenedor.setAttribute('id','conte_d_'+idpadre);
        div_contenedor.style.cssText = "width:100%;height:100%";

        var div_map = document.createElement('div');
        div_map.setAttribute('id','map_d_'+idpadre);
        div_map.style.cssText = "width:100%;height:100%";
        div_contenedor.appendChild(div_map);
        if(krpano.get("editar")){
            // krpano.trace(1,"Se quiere poner el div loco");
            div_info = document.createElement('div');
            div_info.setAttribute('id','info_d_'+idpadre);
            div_info.style.cssText = "width:50%;height:40px;margin:0px auto;background: #889ccf;border: 2px solid #5878ca;position:absolute;top:0px;right:50px";
            div_contenedor.appendChild(div_info);
        }
        plugin.sprite.appendChild(div_contenedor);
        initMap();
    }

    /**
     * FUncion que se encarga de los zooms
     */
    function aplicarZooms() {
        if(locations.length===0){   //si no hay markers
            return
        }
        var latlngbounds = new google.maps.LatLngBounds();
        for (var k in locations){
            if (locations.hasOwnProperty(k)) {
                if(locations[k] != null ){
                    latlngbounds.extend({lat: locations[k].getPosition().lat(), lng: locations[k].getPosition().lng()});
                }
            }
        }
        map.setCenter(latlngbounds.getCenter());
        map.fitBounds(latlngbounds);
    }


    function initMap() {
        map = new google.maps.Map(document.getElementById('map_d_'+idpadre), {
            zoom: 6.5,
            center: new google.maps.LatLng(-23.1519573,-57.5129576),
            mapTypeId: google.maps.MapTypeId.HYBRID,
            zoomControl: false,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
            },
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            gestureHandling: 'greedy'

        });
        var latlngbounds = new google.maps.LatLngBounds();
        var almenosUno = false;
        var scenes = krpano.get("scene").getArray();
        for (var i=0; i < scenes.length; i++) {
            var scene = scenes[i];
            if(scene['lat']!=null && scene['lng']!=null){
                almenosUno = true;
                var id_pano = parseInt(scene['name'].substring(4));
                var lat = parseFloat(scene['lat']);
                var lng = parseFloat(scene['lng']);
                locations[id_pano] =  new google.maps.Marker({
                    position: {lat: lat, lng: lng},
                    map: map,
                    icon:{
                        url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                    }
                });
                latlngbounds.extend({lat: lat, lng: lng});
                (function (ere) {
                    locations[id_pano].addListener('click',function () {
                        krpano.call("loadscene(pano"+ere+");");
                    });
                })(id_pano);
            }
        }
        //volver a repetir para agregar las lineas
        for (var i=0; i < scenes.length; i++) {
            var scene = scenes[i];
            if(scene['lat']!=null && scene['lng']!=null){
                var id_pano = parseInt(scene['name'].substring(4));
                var lat = parseFloat(scene['lat']);
                var lng = parseFloat(scene['lng']);
                //falta los poligonitos
                var entrada = scene.content;
                while(entrada.indexOf('<hotspot name="pano')>=0){
                    entrada = entrada.substring(entrada.indexOf('<hotspot name="pano')+19);
                    var destino = parseInt(entrada.substring(0,entrada.indexOf('"')));
                    if(locations[destino]!=null) {
                        new google.maps.Polyline({
                            path: [
                                {lat: lat, lng: lng},
                                {
                                    lat: locations[destino].getPosition().lat(),
                                    lng: locations[destino].getPosition().lng()
                                },
                            ],
                            geodesic: true,
                            strokeColor: '#FF0000',
                            strokeOpacity: 1.0,
                            strokeWeight: 2,
                            map: map
                        });
                    }
                }
            }
        }
        if(almenosUno){
            map.setCenter(latlngbounds.getCenter());
            map.fitBounds(latlngbounds);
        }
        //pinta el primer mapa
        action_dosomething(krpano.get("xml.scene"));
        map.addListener('click', function(e) {
            if(modoActual === 1)
                placeMarkerAndPanTo(e.latLng, map);
        });
    }

    /**
     * Agregar un solo marker (eliminar el anterior y volver a agregar)
     * @param latLng
     * @param map
     */
    function placeMarkerAndPanTo(latLng, map) {
        if(markerActual == null){
            markerActual = new google.maps.Marker({
                position: latLng,
                map: map,
                draggable: true,
                icon:{
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                }
            });
        }else{
            markerActual.setPosition(latLng);
        }
        // map.panTo(latLng);
    }

    // unloadplugin - exit point for the plugin (optionally)
    // - will be called from krpano when the plugin will be removed
    // - everything that was added by the plugin should be removed here
    local.unloadplugin = function()
    {
        plugin = null;
        krpano = null;
    }

    // onresize (optionally)
    // - width,height = the new size for the plugin
    // - when not defined then only the krpano plugin html element will be sized
    local.onresize = function(width,height)
    {
        // not used in this example
        // the plugin content will resize automatically because
        // of the width=100%, height=100% CSS style
        return false;
    }

    function value_setter(newvalue)
    {
        if (newvalue != xml_value)
        {
            krpano.trace(1, "'value' will be changed from " + xml_value + " to " + newvalue);
            xml_value = newvalue;
        }
    }

    function value_getter()
    {
        return xml_value;
    }

    /**
     * FUncion que notifica que fue abierta
     */
    function action_abierto() {
        aplicarZooms()
    }

    /**
     * Este es el que pinta los mapas, porque recibe notificacion al cargar una scene
     */
    function action_dosomething(nombrePano){
        if(!nombrePano){
            return;
        }
        let nro_pano = parseInt(nombrePano.substring(4));
        // krpano.trace(1,"Recibido "+ nro_pano);
        //primero pintamos y despintamos los mapas
        for (var k in locations){
            if (locations.hasOwnProperty(k)) {
                if(locations[k] != null ){
                    locations[k].setDraggable(false);   //para asegurar
                    if(parseInt(k)===nro_pano){
                        locations[k].setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
                    }else {
                        locations[k].setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
                    }
                }
            }
        }
        //para admin: ver si se puede editar
        if(krpano.get("editar")) {
            if (markerActual != null) {
                markerActual.setMap(null);
                markerActual = null;
            }
            if(locations[nro_pano]!=null){
                div_info.innerHTML = "Este panorama tiene ubicacion, arrastra para editar y pulsa en actualizar";
                //Create an input type dynamically.
                var element = document.createElement("input");
                //Assign different attributes to the element.
                element.type = "button";
                element.value = "Actualizar gps"; // Really? You want the default value to be the type string?
                element.name = "actualizar"; // And the name too?
                element.onclick = establecerGPSPano;
                div_info.appendChild(element);
                modoActual =2;
                locations[nro_pano].setDraggable(true);
            }else{
                div_info.innerHTML = "Este panorama NO tiene ubicacion, agrega uno";

                //Create an input type dynamically.
                var element = document.createElement("input");
                //Assign different attributes to the element.
                element.type = "button";
                element.value = "Agregar gps"; // Really? You want the default value to be the type string?
                element.name = "agregar"; // And the name too?
                element.onclick = establecerGPSPano;
                div_info.appendChild(element);
                modoActual = 1;
            }
        }
    }

    function establecerGPSPano() {
        var panoActual = parseInt(krpano.get("xml.scene").substring(4),10);
        if(markerActual == null && locations[panoActual] == null){
            alert('Primero tenes que hacer click en el mapa para agregar el nuevo gps');
            return;
        }
        var actualizar = locations[panoActual] !=null;
        var lat = actualizar? locations[panoActual].getPosition().lat() : markerActual.getPosition().lat();
        var lng = actualizar? locations[panoActual].getPosition().lng() : markerActual.getPosition().lng();
        var norte = krpano.get("view.hlookat").toFixed(2);
        var id_pano = panoActual;
        //Agrega a la BD, o actualiza
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                var myObj = JSON.parse(this.responseText);
                if(myObj.error === 1){
                    alert(myObj.msj);
                }else if(myObj.error === 0){    //se alzo bien
                    if(!actualizar) {
                        locations[id_pano] = new google.maps.Marker({
                            position: {
                                lat: lat,
                                lng: lng
                            },
                            map: map,
                            icon: {
                                url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                            }
                        });
                    }
                    if(markerActual!=null) {
                        markerActual.setMap(null);  //borrar el editor si existio
                        markerActual = null;
                    }
                    modoActual = 2; //mover solo
                }else{
                    alert("Error al recibir, no sabemo si funciono");
                }
            }else if(this.readyState ===4){  // error?
                alert("ocurrio un error con la direccion :C");
            }
        };
        xmlhttp.open("GET", "http://www.kamaleon360.com/cargaPano/set_info_pano.php?id="+id_pano+"&lat="+lat+"&lng="+lng+"&norte="+norte, true);
        xmlhttp.send();
    }
}