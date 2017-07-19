var MapPage = (function () {
    function MapPage() {
        var _this = this;
        this.initialize = function () {
            console.log('initialize called!');
            document.addEventListener('deviceready', _this.onDeviceReady, false);
        };
        this.onDeviceReady = function () {
            console.log('Platform: ' + device.platform);
            if (device.platform === 'iOS' || device.platform === 'Android') {
                _this.initPluginMap();
            }
            else {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDmr4KjAGEvMjcmDdR7G6LdBIutoAAA2Yo&callback=initBrowserMap';
                // console.dir(document.body);
                document.body.appendChild(script);
            }
        };
        this.initBrowserMap = function () {
            _this.browserMap = new google.maps.Map(document.getElementById('map'), {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 8,
                mapTypeId: 'hybrid',
                streetViewControl: false
            });
        };
        this.initPluginMap = function () {
            var mapDiv = document.getElementById('map');
            _this.pluginMap = plugin.google.maps.Map.getMap(mapDiv, {
                'mapType': plugin.google.maps.MapTypeId.HYBRID,
                'controls': {
                    'compass': true,
                    'myLocationButton': true,
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
                    'target': [
                        { lat: -34.397, lng: 150.644 }
                    ]
                }
            });
            _this.pluginMap.one(plugin.google.maps.event.MAP_READY, function () {
                console.log("--> map : ready.");
            });
        };
    }
    return MapPage;
}());
new MapPage().initialize();
