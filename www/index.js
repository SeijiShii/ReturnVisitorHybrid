console.log('index.js called!');

let initialize = () => {
    console.log('initialize called!');
    document.addEventListener('deviceready', onDeviceReady, false);
}

let onDeviceReady = () => {
    console.log(device.platform);
    if (device.platform !== 'iOS' && device.platform !== 'Android') {

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDmr4KjAGEvMjcmDdR7G6LdBIutoAAA2Yo&callback=initMap';
        
        console.dir(document.body);
        document.body.appendChild(script);
        // currentScript.parentNode.insertBefore(script, document.currentScript);
    }
}

var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });
}

initialize();

