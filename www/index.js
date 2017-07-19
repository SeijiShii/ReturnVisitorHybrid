console.log('index.js called!');

var browserMap, pluginMap;
var rvApp = {

    initialize : function () {
        console.log('initialize called!');
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady : function () {
        console.log('Platform: ' + device.platform);
        if (device.platform === 'iOS' || device.platform === 'Android') {
            initPluginMap;
            
        } else {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDmr4KjAGEvMjcmDdR7G6LdBIutoAAA2Yo&callback=initBrowserMap';
            
            // console.dir(document.body);
            document.body.appendChild(script);
        }
    }, 

    initBrowserMap : function() {
        browserMap = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 8,
            mapTypeId: 'hybrid',
            streetViewControl: false	
        });
    },

    initPluginMap : function() {
        var mapDiv = document.getElementById('map');
        pluginMap = plugin.google.maps.Map.getMap(mapDiv, {
            'mapType': plugin.google.maps.MapTypeId.HYBRID,
            'controls': {
            'compass': true,
                'myLocationButton': true, // you can specify this option, but app asks permission when it launches.
                'indoorPicker': true,
                'zoom': true
            },
            'gestures': {
                'scroll': true,
                'tilt': true,
                'rotate': true,
                'zoom': true
            },
            'camera': {
                'target':[
                    {lat: -34.397, lng: 150.644}
                ]
            }
        });
        pluginMap.one(plugin.google.maps.event.MAP_READY, function () {
            console.log("--> map : ready.");
        });
    }
}

rvApp.initialize();

