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
            _this.refreshContentHeight();
            _this.refreshMapFrameHeight();
            _this.initPluginMap();
            _this.initLogoButton();
            window.addEventListener('orientationchange', function () {
                console.log('screen.orientation.type: ' + screen.orientation.type);
                _this.refreshContentHeight();
                _this.refreshMapFrameHeight();
                _this.fadeLogoButton(_this.isPortrait(), true);
            });
        };
        this.refreshContentHeight = function () {
            var contentFrame = document.getElementById('content-frame');
            _this.contentHeight = window.innerHeight - 50;
            console.log('content height: ' + _this.contentHeight + 'px');
            contentFrame.style.height = _this.contentHeight.toString() + 'px';
        };
        this.refreshMapFrameHeight = function () {
            var mapFrame = document.getElementById('map-frame');
            mapFrame.style.height = _this.contentHeight.toString() + 'px';
            console.log('map frame height: ' + mapFrame.style.height);
        };
        this.initPluginMap = function () {
            _this.mapDiv = document.getElementById('map');
            var position = _this.loadCameraPosition();
            var option = {
                'mapType': plugin.google.maps.MapTypeId.HYBRID,
                'controls': {
                    'compass': true,
                    'zoom': true,
                    'myLocationButton': true
                },
                'preferences': {
                    'padding': {
                        top: 50
                    }
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
            MapPage.pluginMap = plugin.google.maps.Map.getMap(_this.mapDiv, option);
            MapPage.pluginMap.on(plugin.google.maps.event.MAP_READY, function () {
                if (!position) {
                    var location_1 = MapPage.pluginMap.getMyLocation({
                        enableHighAccuracy: true
                    }, function (result) {
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
                var cameraPosition = MapPage.pluginMap.getCameraPosition();
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
        this.initLogoButton = function () {
            _this.logoButton = document.getElementById('logo-button');
            _this.fadeLogoButton(_this.isPortrait(), true);
        };
        this.fadeLogoButton = function (fadeIn, animate) {
            if (animate) {
                if (fadeIn) {
                    console.log('fadeLogoButton called: Fade in, with animate');
                    $('#logo-button').fadeIn('slow');
                }
                else {
                    console.log('fadeLogoButton called: Fade out, with animate');
                    $('#logo-button').fadeOut('slow');
                }
            }
            else {
                if (fadeIn) {
                    console.log('fadeLogoButton called: Fade in, No animate');
                    _this.logoButton.style.opacity = 1;
                }
                else {
                    console.log('fadeLogoButton called: Fade out, No animate');
                    _this.logoButton.style.opacity = 0;
                }
            }
        };
        this.isPortrait = function () {
            console.log('isPortrait called!');
            return screen.orientation.type === 'portrait-primary' || screen.orientation.type === 'portrait-secondary';
        };
    }
    return MapPage;
}());
var onClickLogoButton = function () {
    console.log('Logo button clicked!');
};
new MapPage().initialize();
//# sourceMappingURL=mapPage.js.map