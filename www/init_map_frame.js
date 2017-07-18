var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });
}

var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDmr4KjAGEvMjcmDdR7G6LdBIutoAAA2Yo&callback=initMap';
console.dir(document)
console.dir(document.currentScript)
console.dir(document.currentScript.parentNode);

document.currentScript.parentNode.insertBefore(script, document.currentScript);