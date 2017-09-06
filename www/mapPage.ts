const LATITUDE: string = 'latitude';
const LONGTUDE: string = 'longitude';
const CAMERA_ZOOM: string = 'camera_zoom';

declare var device, google, plugin: any;
interface Screen {
    orientation: any;
}

class MapPage {

    static browserMap: any; 
    static pluginMap: any; 

    private contentHeight: number;
    private mapDiv: any;
    

    initialize = () => {
        console.log('initialize called!');
        document.addEventListener('deviceready', this.onDeviceReady, false);
    }

    onDeviceReady = () => {
        console.log('Platform: ' + device.platform);

        this.refreshContentHeight();
        this.refreshMapFrameHeight();
        this.initPluginMap();
        this.refreshMapHeight

        window.addEventListener('orientationchange', () =>{
            
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
            this.refreshContentHeight();
            this.refreshMapFrameHeight();
            this.refreshMapHeight();
        });
    }

    
    refreshContentHeight = () => {
        let contentFrame = document.getElementById('content-frame');
        // console.log('window.innerHeight(): ' + window.innerHeight);
        this.contentHeight = window.innerHeight - 50;
        // 170906 当初 contentHeight = window.screen.heightで高さを取得しようとしたら
        //   Androidでステータスバーの高さを見落としていた。
        //   contentHeight = window.innerHeight - 50 でwebViewの高さが取得できるが、
        //   iOSではどのような挙動になるか確認する必要がある。
        console.log('content height: ' + this.contentHeight + 'px');
        contentFrame.style.height = this.contentHeight.toString() + 'px'; 
    }

    refreshMapFrameHeight = () => {
        let mapFrame = document.getElementById('map-frame');
        mapFrame.style.height = this.contentHeight.toString() + 'px';
        console.log('map frame height: ' + mapFrame.style.height);
    }

    // 170906 added
    refreshMapHeight = () => {
        this.mapDiv.style.height = this.contentHeight.toString() + 'px';
        // mapDiv.style.height = '100px';
        // このコードがmapDivの高さに影響を与えているのか検証するために追加した
        console.log('map div height: ' + this.mapDiv.style.height);
    }

    initPluginMap = () => {
        this.mapDiv = document.getElementById('map');

        let position = this.loadCameraPosition();
        let option = {
            'mapType': plugin.google.maps.MapTypeId.HYBRID,
            'controls': {
                'compass' : true,
                'zoom': true,
                'myLocationButton': true
            },
        }
        if (position) {
            option['camera'] = {
                'target' : {
                    lat: position.target.lat,
                    lng: position.target.lng
                },
                'zoom' : position.zoom
            }
        }

        MapPage.pluginMap = plugin.google.maps.Map.getMap(this.mapDiv, option);
        
        
        MapPage.pluginMap.on(plugin.google.maps.event.MAP_READY, () => {

            if (!position) {
                    let location = MapPage.pluginMap.getMyLocation({
                    enableHighAccuracy : true
                }, (result) => {
                    // console.dir(JSON.stringify(result));

                    MapPage.pluginMap.setOptions({
                        'camera' : {
                            'target' : {
                                lat: result.latLng.lat,
                                lng: result.latLng.lng
                            },
                            'zoom' : 18
                        }
                    });

                }, (err_msg) => {
                    console.log(JSON.stringify(err_msg));
                });
            }
        });

        MapPage.pluginMap.on(plugin.google.maps.event.CAMERA_MOVE_END, () =>{
            // console.log('Camera move ended.')
            let cameraPosition = MapPage.pluginMap.getCameraPosition();
            // console.log(JSON.stringify(cameraPosition.target));
            this.saveCameraPosition(cameraPosition);
            
        });
    }

    loadCameraPosition = () : any => {
        
        let storage = window.localStorage;

        let lat = storage.getItem(LATITUDE);
        if (!lat) {
            return null;
        }

        let lng = storage.getItem(LONGTUDE);
        if (!lng) {
            return null;
        }

        let zoom = storage.getItem(CAMERA_ZOOM);
        if (!zoom) {
            return null;
        }

        return {
            target : {
                lat : lat,
                lng : lng
            },
            zoom : zoom
        }
    }

    saveCameraPosition = (position : any) => {
        let storage = window.localStorage;
        storage.setItem(LATITUDE, position.target.lat);
        storage.setItem(LONGTUDE, position.target.lng);
        storage.setItem(CAMERA_ZOOM, position.zoom);
    }
}

new MapPage().initialize();