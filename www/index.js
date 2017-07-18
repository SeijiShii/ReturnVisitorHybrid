console.log('index.js called!');

let initialize = () => {
    console.log('initialize called!');
    document.addEventListener('deviceready', onDeviceReady, false);
}

let onDeviceReady = () => {
    console.log('Platform: ' + device.platform);
    if (device.platform === 'iOS' || device.platform === 'Android') {

        
    } else {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDmr4KjAGEvMjcmDdR7G6LdBIutoAAA2Yo&callback=initBrowserMap';
        
        // console.dir(document.body);
        document.body.appendChild(script);
    }
}

var map;
function initBrowserMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8,
        mapTypeId: 'hybrid',
        streetViewControl: false	
    });
}

initialize();

