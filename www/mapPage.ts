const LATITUDE: string = 'latitude';
const LONGTUDE: string = 'longitude';
const CAMERA_ZOOM: string = 'camera_zoom';

declare var device, google, plugin: any;

class MapPage {

    static browserMap: any; 
    static pluginMap: any; 

    initialize = () => {
        console.log('initialize called!');
        document.addEventListener('deviceready', this.onDeviceReady, false);
    }

    static initBrowserMap() {
        MapPage.browserMap = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 8,
            mapTypeId: 'hybrid',
            streetViewControl: false	
        });
    }

    onDeviceReady = () => {
        console.log('Platform: ' + device.platform);
        if (device.platform === 'iOS' || device.platform === 'Android') {
            this.initPluginMap();
            
        } else {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDmr4KjAGEvMjcmDdR7G6LdBIutoAAA2Yo&callback=MapPage.initBrowserMap';
            
            // console.dir(document.body);
            document.body.appendChild(script);
        }
    }

    initPluginMap = () => {
        var mapDiv = document.getElementById('map');

        let position = this.loadCameraPosition();
        let option = {
            'mapType': plugin.google.maps.MapTypeId.HYBRID,
            'controls': {
                'compass' : true,
                'zoom': true,
                'myLocationButton': true
            },
        }
        if (position) {
            option['camera'] = {
                'target' : {
                    lat: position.target.lat,
                    lng: position.target.lng
                },
                'zoom' : position.zoom
            }
        }

        MapPage.pluginMap = plugin.google.maps.Map.getMap(mapDiv, option);
        
        
        MapPage.pluginMap.on(plugin.google.maps.event.MAP_READY, () => {

            if (!position) {
                    let location = MapPage.pluginMap.getMyLocation({
                    enableHighAccuracy : true
                }, (result) => {
                    // console.dir(JSON.stringify(result));

                    MapPage.pluginMap.setOptions({
                        'camera' : {
                            'target' : {
                                lat: result.latLng.lat,
                                lng: result.latLng.lng
                            },
                            'zoom' : 18
                        }
                    });

                }, (err_msg) => {
                    console.log(JSON.stringify(err_msg));
                });
            }
        });

        MapPage.pluginMap.on(plugin.google.maps.event.CAMERA_MOVE_END, () =>{
            // console.log('Camera move ended.')
            let cameraPosition = MapPage.pluginMap.getCameraPosition();
            // console.log(JSON.stringify(cameraPosition.target));
            this.saveCameraPosition(cameraPosition);
            
        });
    }

    loadCameraPosition = () : any => {
        
        let storage = window.localStorage;

        let lat = storage.getItem(LATITUDE);
        if (!lat) {
            return null;
        }

        let lng = storage.getItem(LONGTUDE);
        if (!lng) {
            return null;
        }

        let zoom = storage.getItem(CAMERA_ZOOM);
        if (!zoom) {
            return null;
        }

        return {
            target : {
                lat : lat,
                lng : lng
            },
            zoom : zoom
        }
    }

    saveCameraPosition = (position : any) => {
        let storage = window.localStorage;
        storage.setItem(LATITUDE, position.target.lat);
        storage.setItem(LONGTUDE, position.target.lng);
        storage.setItem(CAMERA_ZOOM, position.zoom);
    }
}

new MapPage().initialize();