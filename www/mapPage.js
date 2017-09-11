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
            _this.initOverlay();
            _this.initDrawer();
            window.addEventListener('orientationchange', function () {
                console.log('screen.orientation.type: ' + screen.orientation.type);
                _this.refreshContentHeight();
                _this.refreshMapFrameHeight();
                _this.fadeLogoButton(_this.isPortrait(), true);
                if (_this.isPortrait()) {
                    if (_this.isDrawerOpen) {
                        _this.openCloseDrawer(false);
                    }
                }
                else {
                    if (_this.isDrawerOpen) {
                        _this.refreshOverlay(false);
                    }
                }
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
                    $(_this.logoButton).fadeIn('slow');
                }
                else {
                    console.log('fadeLogoButton called: Fade out, with animate');
                    $(_this.logoButton).fadeOut('slow');
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
        this.overlayOpacity = 0.7;
        this.initOverlay = function () {
            _this.overlay = document.getElementById('overlay');
            _this.overlay.style.width = '0';
        };
        this.refreshOverlay = function (fadeIn) {
            console.log('Fade in overlay: ' + fadeIn);
            if (fadeIn) {
                console.log('this.overlay.style.opacity: ' + _this.overlay.style.opacity);
                if (_this.overlay.style.opacity == 0) {
                    _this.overlay.style.width = '100%';
                    $(_this.overlay).fadeTo('slow', _this.overlayOpacity);
                }
            }
            else {
                if (_this.overlay.style.opacity == _this.overlayOpacity) {
                    $(_this.overlay).fadeTo('slow', 0, function () {
                        _this.overlay.style.width = '0';
                    });
                }
            }
        };
        this.initDrawer = function () {
            _this.drawer = document.getElementById('drawer');
            _this.isDrawerOpen = false;
        };
        this.openCloseDrawer = function (animate) {
            if (_this.isPortrait()) {
                _this.isDrawerOpen = !_this.isDrawerOpen;
                console.log('isDrawerOpen: ' + _this.isDrawerOpen);
                if (animate) {
                    if (_this.isDrawerOpen) {
                        $(_this.drawer).animate({ 'left': '0px' }, 'slow');
                    }
                    else {
                        $(_this.drawer).animate({ 'left': '-240px' }, 'slow');
                    }
                }
                else {
                    if (_this.isDrawerOpen) {
                        _this.drawer.style.left = '0px';
                    }
                    else {
                        _this.drawer.style.left = '-240px';
                    }
                }
                _this.refreshOverlay(_this.isDrawerOpen);
            }
        };
    }
    return MapPage;
}());
var onClickLogoButton = function () {
    console.log('Logo button clicked!');
    mapPage.openCloseDrawer(true);
};
var onClickOverlay = function () {
    console.log('Overlay clicked!');
    mapPage.openCloseDrawer(true);
};
var mapPage = new MapPage();
mapPage.initialize();
//# sourceMappingURL=mapPage.js.map