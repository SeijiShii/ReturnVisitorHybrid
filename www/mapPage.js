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
            _this.initMapFrame();
            _this.initPluginMap();
            _this.initLogoButton();
            _this.initOverlay();
            _this.initDrawer();
            _this.refreshContentHeight();
            _this.refreshMapFrameHeight();
            _this.refreshDrawerHeight();
            window.addEventListener('resize', function () {
                if (_this.resizeTimer !== false) {
                    clearTimeout(_this.resizeTimer);
                }
                _this.resizeTimer = setTimeout(function () {
                    console.log('Window resized!');
                    _this.refreshContentHeight();
                    _this.refreshMapFrameHeight();
                    _this.fadeLogoButton(!_this.isWideScreen(), true);
                    if (!_this.isWideScreen()) {
                        if (_this.isDrawerOpen) {
                            _this.openCloseDrawer(false);
                        }
                    }
                    else {
                        if (_this.isDrawerOpen) {
                            _this.refreshOverlay(false);
                        }
                    }
                }, 200);
            });
        };
        this.isWideScreen = function () {
            return window.innerWidth >= MapPage.BREAK_POINT_WIDTH;
        };
        this.refreshContentHeight = function () {
            var contentFrame = document.getElementById('content-frame');
            _this.contentHeight = window.innerHeight - 50;
            console.log('content height: ' + _this.contentHeight + 'px');
            contentFrame.style.height = _this.contentHeight.toString() + 'px';
        };
        this.refreshMapFrameHeight = function () {
            _this.mapFrame.style.height = _this.contentHeight.toString() + 'px';
        };
        this.initMapFrame = function () {
            _this.mapFrame = document.getElementById('map-frame');
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
            _this.pluginMap = plugin.google.maps.Map.getMap(_this.mapDiv, option);
            _this.pluginMap.on(plugin.google.maps.event.MAP_READY, function () {
                if (!position) {
                    var location_1 = _this.pluginMap.getMyLocation({
                        enableHighAccuracy: true
                    }, function (result) {
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
                }
            });
            _this.pluginMap.on(plugin.google.maps.event.CAMERA_MOVE_END, function () {
                var cameraPosition = _this.pluginMap.getCameraPosition();
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
            _this.fadeLogoButton(!_this.isWideScreen(), true);
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
            _this.initDrawerLogo();
        };
        this.refreshDrawerHeight = function () {
            _this.drawer.style.height = _this.contentHeight.toString + 'px';
        };
        this.openCloseDrawer = function (animate) {
            if (!_this.isWideScreen()) {
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
        this.initDrawerLogo = function () {
            _this.drawerLogo = document.getElementById('drawer-logo');
            _this.drawerLogo.addEventListener('click', function () {
                if (!_this.isWideScreen()) {
                    _this.openCloseDrawer(true);
                }
            });
        };
    }
    MapPage.BREAK_POINT_WIDTH = 400;
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