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
        this.pluginMap = plugin.google.maps.Map.getMap(mapDiv,{
             'mapType': plugin.google.maps.MapTypeId.HYBRID,
                    'controls': {
                        'compass' : true,
                        'zoom': true,
                        'myLocationButton': true
                    },
        });
        
        this.pluginMap.one(plugin.google.maps.event.MAP_READY, () => {
            console.log("--> map : ready.");
            let location = this.pluginMap.getMyLocation({
                enableHighAccuracy : true
            }, (result) => {
                console.dir(JSON.stringify(result));

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

        });
    }
}

new MapPage().initialize();