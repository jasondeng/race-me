function initMap() {

    // Instantiate a directions service.
    var directionsService = new google.maps.DirectionsService;

    // Create a map and center it on Manhattan.
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: {lat: 40.771, lng: -73.974}
    });

    // Create a renderer for directions and bind it to the map.
    var directionsDisplay = new google.maps.DirectionsRenderer({map: map});
    directionsDisplay.setPanel(document.getElementById('right-panel'));

    var onClickHandler = function () {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    };

    document.getElementById('newRoute').addEventListener('click', onClickHandler);

}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };


            console.log("running get location");
            var newPos = getLocation(pos.lng, pos.lat, 1000);


            directionsService.route({
                origin: pos,
                destination: newPos,
                travelMode: google.maps.TravelMode.WALKING,
                unitSystem: google.maps.UnitSystem.METRIC
            }, function (response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    console.log('route', response)
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        })
    }
    else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

function getLocation(lng, lat, radius) {
    // Convert radius from meters to degrees
    var radiusInDegrees = radius / 111300;

    var u = Math.random();
    var v = Math.random();
    var w = radiusInDegrees * Math.sqrt(u);
    var t = 2 * Math.PI * v;
    var x = w * Math.cos(t);
    var y = w * Math.sin(t);

    // Adjust the x-coordinate for the shrinking of the east-west distances
    var new_x = x / Math.cos(lat);

    var new_lat = y + lat;
    var new_lng = new_x + lng;

    var newPos = {
        lat: new_lat,
        lng: new_lng
    };

    //lat is y

    console.log(newPos);
    console.log(new_lat, new_lng);

    return newPos;
}

