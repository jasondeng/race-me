function initMap() {

    // Instantiate a directions service.
    var directionsService = new google.maps.DirectionsService;

    // Create a map and center it on Manhattan.
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: {lat: 40.771, lng: -73.974}
    });

    // Create a renderer for directions and bind it to the map.
    var directionsDisplay = new google.maps.DirectionsRenderer({
        draggable:true,
        map: map,
        panel: document.getElementById('right-panel')
    });
    var directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true,
        map: map,
        panel: document.getElementById('right-panel')
    });
    directionsDisplay.addListener('directions_changed', function() {
        console.log('directions_changed');
        computeTotalDistance(directionsDisplay.getDirections());
    });

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

            displayRoute(pos, pos, directionsService, directionsDisplay)
            // directionsService.route({
            //     origin: pos,
            //     destination: pos,
            //     waypoints: [{location:secPos, stopover:true}, {location:newPos, stopover: true}],
            //     provideRouteAlternatives: true,
            //     travelMode: google.maps.TravelMode.WALKING,
            //     unitSystem: google.maps.UnitSystem.METRIC
            // }, function (response, status) {
            //     if (status === google.maps.DirectionsStatus.OK) {
            //         directionsDisplay.setDirections(response);
            //         console.log('route', response)
            //     } else {
            //         window.alert('Directions request failed due to ' + status);
            //     }
            // });
        })
    }
    else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function displayRoute(origin, destination, service, display) {
    var newPos = getLocation(origin.lng, origin.lat, 3000);
    var secPos = getLocation(newPos.lng, newPos.lat, 3000);
    console.log('secPos: ', secPos);
    service.route({
        origin: origin,
        destination: destination,
        waypoints: [{location:newPos, stopover:true}, {location:secPos, stopover: true}],
        travelMode: google.maps.TravelMode.WALKING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidTolls: true
    }, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
        display.setDirections(response);
        } else {
        alert('Could not display directions due to: ' + status);
        }
    });
}

function computeTotalDistance(result) {
    var total = 0;
    var myroute = result.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
    }
    total = total / 1000;
    document.getElementById('total').innerHTML = total + ' km';
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

