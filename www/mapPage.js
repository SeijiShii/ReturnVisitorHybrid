// 170906 次はロゴだ。
//  やはりorientationで切り分けてドロワとロゴの挙動を決める必要がある。また明日。
// 170907
//  ロゴボタンの初期化 
//  orientationで切り分ける。
var LATITUDE = 'latitude';
var LONGTUDE = 'longitude';
var CAMERA_ZOOM = 'camera_zoom';
var MapPage = /** @class */ (function () {
    function MapPage() {
        var _this = this;
        // private contentHeight: number;
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
            _this.initLognClickDialog();
            _this.fadeLongClickDialog(true);
            window.addEventListener('resize', function () {
                if (_this.resizeTimer !== false) {
                    clearTimeout(_this.resizeTimer);
                }
                _this.resizeTimer = setTimeout(function () {
                    console.log('Window resized!');
                    // this.refreshContentHeight();
                    _this.refreshMapFrame();
                    _this.fadeLogoButton(!_this.isWideScreen(), true);
                    _this.refreshDrawer();
                    _this.refreshOverlay(false);
                    // console.log('Drawer logo left: ' + this.drawerLogo.style.left.toString());
                }, 200);
            });
        };
        this.isWideScreen = function () {
            return window.innerWidth >= MapPage.BREAK_POINT_WIDTH;
        };
        this.initMapFrame = function () {
            _this.mapFrame = document.getElementById('map-frame');
            _this.refreshMapFrame();
        };
        this.refreshMapFrame = function () {
            _this.mapFrame.style.height = (window.innerHeight - 50) + 'px';
            // console.log('map frame height: ' + mapFrame.style.height);
            if (_this.isWideScreen()) {
                _this.mapFrame.style.width = (window.innerWidth - MapPage.DRAWER_WIDTH) + 'px';
                _this.mapFrame.style.left = MapPage.DRAWER_WIDTH + 'px';
            }
            else {
                _this.mapFrame.style.width = window.innerWidth + 'px';
                _this.mapFrame.style.left = '0';
            }
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
                // console.log('Camera move ended.')
                var cameraPosition = _this.pluginMap.getCameraPosition();
                // console.log(JSON.stringify(cameraPosition.target));
                _this.saveCameraPosition(cameraPosition);
            });
            _this.pluginMap.on(plugin.google.maps.event.MAP_LONG_CLICK, function (latLng) {
                // console.log('On map long click!')
                // console.dir(latLng);
                // long click地点へカメラ移動
                _this.pluginMap.animateCamera({
                    target: {
                        lat: latLng.lat,
                        lng: latLng.lng
                    },
                    duration: 300
                });
                // 操作選択ダイアログ
                _this.fadeLongClickDialog(true);
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
            _this.logoButton.addEventListener('click', _this.openCloseDrawer);
            _this.fadeLogoButton(!_this.isWideScreen(), true);
        };
        this.fadeLogoButton = function (fadeIn, animate) {
            if (animate) {
                if (fadeIn) {
                    console.log('fadeLogoButton called: Fade in, with animate');
                    // 170911 JQueryが読み込まれなくて何度もテストする  
                    // console.dir($);     
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
        this.overlayOpacity = 0.8;
        this.initOverlay = function () {
            _this.overlay = document.getElementById('overlay');
            _this.overlay.style.width = '0';
            _this.overlay.addEventListener('click', function () {
                if (_this.isDrawerOpen) {
                    _this.openCloseDrawer();
                }
                else if (_this.showLongClickDialog) {
                    _this.fadeLongClickDialog(false);
                }
            });
        };
        this.refreshOverlay = function (fadeIn) {
            console.log('Fade in overlay: ' + fadeIn);
            if (fadeIn) {
                // console.log('this.overlay.style.opacity: ' + this.overlay.style.opacity)
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
            _this.refreshDrawer();
        };
        this.refreshDrawer = function () {
            _this.drawer.style.height = (window.innerHeight - 50) + 'px';
            _this.isDrawerOpen = false;
            // console.log('Refresh drawer height! ' + this.drawer.style.height.toString());
            if (_this.isWideScreen()) {
                _this.drawer.style.left = '0';
            }
            else {
                _this.drawer.style.left = '-' + MapPage.DRAWER_WIDTH + 'px';
            }
        };
        this.openCloseDrawer = function () {
            // ポートレイトの時だけ有効
            if (!_this.isWideScreen()) {
                _this.isDrawerOpen = !_this.isDrawerOpen;
                // console.log('isDrawerOpen: ' + this.isDrawerOpen);
                if (_this.isDrawerOpen) {
                    $(_this.drawer).animate({ 'left': '0px' }, 'slow');
                }
                else {
                    $(_this.drawer).animate({ 'left': '-240px' }, 'slow');
                }
                _this.refreshOverlay(_this.isDrawerOpen);
            }
        };
        this.initDrawerLogo = function () {
            _this.drawerLogo = document.getElementById('drawer-logo');
            _this.drawerLogo.addEventListener('click', function () {
                if (!_this.isWideScreen()) {
                    _this.openCloseDrawer();
                }
            });
        };
        this.initLognClickDialog = function () {
            _this.longClickDialog = document.getElementById('on-map-long-click-dialog');
        };
        this.fadeLongClickDialog = function (fadeIn) {
            if (fadeIn) {
                // console.log('Fade in long click dialog!')
                $(_this.longClickDialog).fadeIn('slow');
                _this.showLongClickDialog = true;
                _this.refreshOverlay(true);
            }
            else {
                $(_this.longClickDialog).fadeOut('slow');
                _this.showLongClickDialog = false;
                _this.refreshOverlay(false);
            }
        };
    }
    MapPage.BREAK_POINT_WIDTH = 400;
    MapPage.DRAWER_WIDTH = 240;
    return MapPage;
}());
new MapPage().initialize();
//# sourceMappingURL=mapPage.js.map