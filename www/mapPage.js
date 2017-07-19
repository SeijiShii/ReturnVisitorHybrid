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
                    'zoom': true,
                    'myLocationButton': true
                }
            });
            _this.pluginMap.one(plugin.google.maps.event.MAP_READY, function () {
                console.log("--> map : ready.");
                var location = _this.pluginMap.getMyLocation({
                    enableHighAccuracy: true
                }, function (result) {
                    console.dir(JSON.stringify(result));
                    _this.pluginMap.setOptions({
                        'camera': {
                            'target': {
                                lat: result.latLng.lat,
                                lng: result.latLng.lng
                            },
                            'zoom': 18
                        }
                    });
                }, function (err_msg) {
                    console.log(JSON.stringify(err_msg));
                });
            });
        };
    }
    return MapPage;
}());
new MapPage().initialize();
