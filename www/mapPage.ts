const LATITUDE: string = 'latitude';
const LONGTUDE: string = 'longitude';
const CAMERA_ZOOM: string = 'camera_zoom';

declare var device, google, plugin: any;

class MapPage {

    browserMap: any; 
    pluginMap: any; 

    initialize = () => {
        console.log('initialize called!');
        document.addEventListener('deviceready', this.onDeviceReady, false);
    }

    onDeviceReady = () => {
        console.log('Platform: ' + device.platform);
        if (device.platform === 'iOS' || device.platform === 'Android') {
            this.initPluginMap();
            
        } else {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDmr4KjAGEvMjcmDdR7G6LdBIutoAAA2Yo&callback=initBrowserMap';
            
            // console.dir(document.body);
            document.body.appendChild(script);
        }
    }

    initBrowserMap = () => {
        this.browserMap = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 8,
            mapTypeId: 'hybrid',
            streetViewControl: false	
        });
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

        this.pluginMap = plugin.google.maps.Map.getMap(mapDiv, option);
        
        
        this.pluginMap.on(plugin.google.maps.event.MAP_READY, () => {

            if (!position) {
                            let location = this.pluginMap.getMyLocation({
                    enableHighAccuracy : true
                }, (result) => {
                    // console.dir(JSON.stringify(result));

                    this.pluginMap.setOptions({
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

        this.pluginMap.on(plugin.google.maps.event.CAMERA_MOVE_END, () =>{
            // console.log('Camera move ended.')
            let cameraPosition = this.pluginMap.getCameraPosition();
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