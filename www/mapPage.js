var LATITUDE = 'latitude';
var LONGTUDE = 'longitude';
var CAMERA_ZOOM = 'camera_zoom';
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
                script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDmr4KjAGEvMjcmDdR7G6LdBIutoAAA2Yo&callback=MapPage.initBrowserMap';
                // console.dir(document.body);
                document.body.appendChild(script);
            }
        };
        this.initPluginMap = function () {
            var mapDiv = document.getElementById('map');
            var position = _this.loadCameraPosition();
            var option = {
                'mapType': plugin.google.maps.MapTypeId.HYBRID,
                'controls': {
                    'compass': true,
                    'zoom': true,
                    'myLocationButton': true
                }
            };
            if (position) {
                option['camera'] = {
                    'target': {
                        lat: position.target.lat,
                        lng: position.target.lng
                    },
                    'zoom': position.zoom
                };
            }
            MapPage.pluginMap = plugin.google.maps.Map.getMap(mapDiv, option);
            MapPage.pluginMap.on(plugin.google.maps.event.MAP_READY, function () {
                if (!position) {
                    var location_1 = MapPage.pluginMap.getMyLocation({
                        enableHighAccuracy: true
                    }, function (result) {
                        // console.dir(JSON.stringify(result));
                        MapPage.pluginMap.setOptions({
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
                }
            });
            MapPage.pluginMap.on(plugin.google.maps.event.CAMERA_MOVE_END, function () {
                // console.log('Camera move ended.')
                var cameraPosition = MapPage.pluginMap.getCameraPosition();
                // console.log(JSON.stringify(cameraPosition.target));
                _this.saveCameraPosition(cameraPosition);
            });
        };
        this.loadCameraPosition = function () {
            var storage = window.localStorage;
            var lat = storage.getItem(LATITUDE);
            if (!lat) {
                return null;
            }
            var lng = storage.getItem(LONGTUDE);
            if (!lng) {
                return null;
            }
            var zoom = storage.getItem(CAMERA_ZOOM);
            if (!zoom) {
                return null;
            }
            return {
                target: {
                    lat: lat,
                    lng: lng
                },
                zoom: zoom
            };
        };
        this.saveCameraPosition = function (position) {
            var storage = window.localStorage;
            storage.setItem(LATITUDE, position.target.lat);
            storage.setItem(LONGTUDE, position.target.lng);
            storage.setItem(CAMERA_ZOOM, position.zoom);
        };
    }
    MapPage.initBrowserMap = function () {
        MapPage.browserMap = new google.maps.Map(document.getElementById('map'), {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8,
            mapTypeId: 'hybrid',
            streetViewControl: false
        });
    };
    return MapPage;
}());
new MapPage().initialize();
