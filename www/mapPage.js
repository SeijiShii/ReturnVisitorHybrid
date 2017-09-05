var LATITUDE = 'latitude';
var LONGTUDE = 'longitude';
var CAMERA_ZOOM = 'camera_zoom';
var contentHeight;
var MapPage = (function () {
    function MapPage() {
        var _this = this;
        this.initialize = function () {
            console.log('initialize called!');
            document.addEventListener('deviceready', _this.onDeviceReady, false);
        };
        this.onDeviceReady = function () {
            console.log('Platform: ' + device.platform);
            _this.initContentHeight();
            _this.initMapHeight();
            _this.initPluginMap();
        };
        this.initContentHeight = function () {
            var contentFrame = document.getElementById('content-frame');
            // console.log('window.innerHeight(): ' + window.innerHeight);
            contentHeight = window.innerHeight - 50;
            console.log('content height: ' + contentHeight + 'px');
            contentFrame.style.height = contentHeight.toString() + 'px';
        };
        this.initMapHeight = function () {
            var mapFrame = document.getElementById('map-frame');
            mapFrame.style.height = contentHeight.toString() + 'px';
            console.log('map frame height: ' + mapFrame.style.height);
        };
        this.initPluginMap = function () {
            var mapDiv = document.getElementById('map');
            mapDiv.style.height = contentHeight.toString() + 'px';
            // mapDiv.style.height = '100px';
            console.log('map div height: ' + mapDiv.style.height);
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
    return MapPage;
}());
new MapPage().initialize();
