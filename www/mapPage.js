// 170906 次はロゴだ。
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
            // this.refreshMapHeight();
            window.addEventListener('orientationchange', function () {
                console.log('screen.orientation.type: ' + screen.orientation.type);
                // 170906 
                // 当初、screen.orientation.typeでorientationを取得しようとすると
                //  そのようなプロパティは存在しないと怒られる。
                // interfaceでScreenにorientationを追加するとコンパイラの怒りが静まる。
                // 結果  console.log('window.orientation: ' + window.orientation);で取得するのはやめる。
                // なんでもwindow.orientationは標準化されていないとMDNに注意書きがされていた。
                // 170906 以下はorientationによって切り分ける必要があるかと思って追加したが、
                //      随時高さ計測なので現時点では不必要。
                // switch (screen.orientation.type) {
                //     case 'portrait-primary':
                //     case 'portrait-secondary':
                //         console.log('orientation: portrait')
                //         break;
                //     case 'landscape-primary':
                //     case 'landscape-secondary':
                //         console.log('orientation: landscape')
                //         break;
                // }
                _this.refreshContentHeight();
                _this.refreshMapFrameHeight();
                // this.refreshMapHeight();
            });
        };
        this.refreshContentHeight = function () {
            var contentFrame = document.getElementById('content-frame');
            // console.log('window.innerHeight(): ' + window.innerHeight);
            _this.contentHeight = window.innerHeight - 50;
            // 170906 当初 contentHeight = window.screen.heightで高さを取得しようとしたら
            //   Androidでステータスバーの高さを見落としていた。
            //   contentHeight = window.innerHeight - 50 でwebViewの高さが取得できるが、
            //   iOSではどのような挙動になるか確認する必要がある。
            console.log('content height: ' + _this.contentHeight + 'px');
            contentFrame.style.height = _this.contentHeight.toString() + 'px';
        };
        this.refreshMapFrameHeight = function () {
            var mapFrame = document.getElementById('map-frame');
            mapFrame.style.height = _this.contentHeight.toString() + 'px';
            console.log('map frame height: ' + mapFrame.style.height);
        };
        // 170906 added
        // 170906 cssで指定してあるから要らなくね？ってなった。
        // refreshMapHeight = () => {
        //     this.mapDiv.style.height = this.contentHeight.toString() + 'px';
        //     // mapDiv.style.height = '100px';
        //     // このコードがmapDivの高さに影響を与えているのか検証するために追加した
        //     console.log('map div height: ' + this.mapDiv.style.height);
        // }
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
var onClickLogoButton = function () {
    console.log('Logo button clicked!');
};
