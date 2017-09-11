// 170906 次はロゴだ。
//  やはりorientationで切り分けてドロワとロゴの挙動を決める必要がある。また明日。
// 170907
//  ロゴボタンの初期化 
//  orientationで切り分ける。

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
        this.initLogoButton();
        // this.refreshMapHeight();

        window.addEventListener('orientationchange', () =>{
            
            console.log('screen.orientation.type: ' + screen.orientation.type); 
            // 170906 
            // 当初、screen.orientation.typeでorientationを取得しようとすると
            //  そのようなプロパティは存在しないと怒られる。
            // interfaceでScreenにorientationを追加するとコンパイラの怒りが静まる。
            // 結果  console.log('window.orientation: ' + window.orientation);で取得するのはやめる。
            // なんでもwindow.orientationは標準化されていないとMDNに注意書きがされていた。

            
            this.refreshContentHeight();
            this.refreshMapFrameHeight();
            // this.refreshMapHeight();
            this.fadeLogoButton(this.isPortrait(), true);
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
            'preferences': {
                'padding': {
                    top: 50
                }
            }
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

    private logoButton: any;
    private initLogoButton = () => {
        this.logoButton = document.getElementById('logo-button');
        this.fadeLogoButton(this.isPortrait(), true);
        
    }

    private fadeLogoButton = (fadeIn:boolean, animate: boolean) => {
        if (animate) {
            if (fadeIn) {
                console.log('fadeLogoButton called: Fade in, with animate');    
                // 170911 JQueryが読み込まれなくて何度もテストする  
                // console.dir($);     

                $('#logo-button').fadeIn('slow');
            } else {
                console.log('fadeLogoButton called: Fade out, with animate');                                
                $('#logo-button').fadeOut('slow');
            }
        } else {
            if (fadeIn) {
                console.log('fadeLogoButton called: Fade in, No animate');
                this.logoButton.style.opacity = 1;
            } else {
                console.log('fadeLogoButton called: Fade out, No animate');                
                this.logoButton.style.opacity = 0;
            }
        }
    }

    private isPortrait = ():boolean => {
        console.log('isPortrait called!')
        return screen.orientation.type === 'portrait-primary' || screen.orientation.type === 'portrait-secondary'
    }
    
}

const onClickLogoButton = () => {
    console.log('Logo button clicked!');
}

new MapPage().initialize();
