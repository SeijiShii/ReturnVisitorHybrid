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

    static BREAK_POINT_WIDTH = 400; 

    private contentHeight: number;
    

    initialize = () => {
        console.log('initialize called!');
        document.addEventListener('deviceready', this.onDeviceReady, false);
    }

    private resizeTimer: any;
    onDeviceReady = () => {
        console.log('Platform: ' + device.platform);

        this.initMapFrame();
        this.initPluginMap();
        this.initLogoButton();
        this.initOverlay();
        this.initDrawer();

        this.refreshContentHeight();
        this.refreshMapFrameHeight();
        this.refreshDrawerHeight();
        
        window.addEventListener('resize', () => {
            if (this.resizeTimer !== false) {
                clearTimeout(this.resizeTimer);
            }
            this.resizeTimer = setTimeout(() => {
                console.log('Window resized!');  
                this.refreshContentHeight();
                this.refreshMapFrameHeight();
                this.fadeLogoButton(!this.isWideScreen(), true);
    
                if (!this.isWideScreen()) {
                    if (this.isDrawerOpen) {
                        this.openCloseDrawer(false);                    
                    }
                } else {
                    if (this.isDrawerOpen) {
                        // ドロワの開いた状態で画面が回転した。
                        this.refreshOverlay(false);
                    }
                }              
            }, 200);
        });
    }

    private isWideScreen = ():boolean => {
        return window.innerWidth >= MapPage.BREAK_POINT_WIDTH;
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
        this.mapFrame.style.height = this.contentHeight.toString() + 'px';
        // console.log('map frame height: ' + mapFrame.style.height);
    }

    private mapFrame: any;
    private initMapFrame = () => {
        this.mapFrame = document.getElementById('map-frame');
    }

    private mapDiv: any;
    private pluginMap: any;
    private initPluginMap = () => {
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

        this.pluginMap = plugin.google.maps.Map.getMap(this.mapDiv, option);
        this.pluginMap.on(plugin.google.maps.event.MAP_READY, () => {

            if (!position) {
                    let location = this.pluginMap.getMyLocation({
                    enableHighAccuracy : true
                }, (result) => {
                    // console.dir(JSON.stringify(result));

                    this.pluginMap.setOptions({
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

        this.pluginMap.on(plugin.google.maps.event.CAMERA_MOVE_END, () =>{
            // console.log('Camera move ended.')
            let cameraPosition = this.pluginMap.getCameraPosition();
            // console.log(JSON.stringify(cameraPosition.target));
            this.saveCameraPosition(cameraPosition);
            
        });
    }

    private loadCameraPosition = () : any => {
        
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

    private saveCameraPosition = (position : any) => {
        let storage = window.localStorage;
        storage.setItem(LATITUDE, position.target.lat);
        storage.setItem(LONGTUDE, position.target.lng);
        storage.setItem(CAMERA_ZOOM, position.zoom);
    }

    private logoButton: any;
    private initLogoButton = () => {
        this.logoButton = document.getElementById('logo-button');
        this.fadeLogoButton(!this.isWideScreen(), true);
        
    }

    private fadeLogoButton = (fadeIn:boolean, animate: boolean) => {
        if (animate) {
            if (fadeIn) {
                console.log('fadeLogoButton called: Fade in, with animate');    
                // 170911 JQueryが読み込まれなくて何度もテストする  
                // console.dir($);     

                $(this.logoButton).fadeIn('slow');                
            } else {
                console.log('fadeLogoButton called: Fade out, with animate');                                
                $(this.logoButton).fadeOut('slow');
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

    private overlay: any;
    private overlayOpacity: number = 0.7; 
    private initOverlay = () => {
        this.overlay = document.getElementById('overlay');
        this.overlay.style.width = '0';
    }
    
    private refreshOverlay = (fadeIn: boolean) => {
        console.log('Fade in overlay: ' + fadeIn);
        if (fadeIn) {
            console.log('this.overlay.style.opacity: ' + this.overlay.style.opacity)
            if (this.overlay.style.opacity == 0) {
                this.overlay.style.width = '100%';
                $(this.overlay).fadeTo('slow', this.overlayOpacity);
            }
        } else {
            if (this.overlay.style.opacity == this.overlayOpacity) {
                $(this.overlay).fadeTo('slow', 0, () => {
                    this.overlay.style.width = '0';
                });
            }
        }
    }

    private drawer: any;
    private isDrawerOpen: boolean;
    private initDrawer = () => {
        this.drawer = document.getElementById('drawer');
        this.isDrawerOpen = false;

        this.initDrawerLogo();
    }

    private refreshDrawerHeight = () => {
        this.drawer.style.height = this.contentHeight.toString + 'px';
    }

    openCloseDrawer = (animate: boolean) => {
        // ポートレイトの時だけ有効
        if (!this.isWideScreen()) {

            this.isDrawerOpen = !this.isDrawerOpen;
            console.log('isDrawerOpen: ' + this.isDrawerOpen);

            if (animate) {
                if (this.isDrawerOpen) {
                    $(this.drawer).animate({'left' : '0px'}, 'slow');
                } else {
                    $(this.drawer).animate({'left' : '-240px'}, 'slow');
                }    
            } else {
                if (this.isDrawerOpen) {
                    this.drawer.style.left = '0px';
                } else {
                    this.drawer.style.left = '-240px';
                }
            }
            this.refreshOverlay(this.isDrawerOpen);
        }
    }

    private drawerLogo : any;
    private initDrawerLogo = () => {
        this.drawerLogo = document.getElementById('drawer-logo');
        this.drawerLogo.addEventListener('click', () => {
            if (!this.isWideScreen()) {
                this.openCloseDrawer(true);
            }
        });
    }
}

const onClickLogoButton = () => {
    console.log('Logo button clicked!');
    mapPage.openCloseDrawer(true);
}

const onClickOverlay = () => {
    console.log('Overlay clicked!');
    mapPage.openCloseDrawer(true);
}

const mapPage = new MapPage()
mapPage.initialize();
