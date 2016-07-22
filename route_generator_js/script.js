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

        })
    }
    else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function displayRoute(origin, destination, service, display) {

    var wayPoints = rectangleRoute(6000, origin);

    service.route({
        origin: origin,
        destination: destination,
        waypoints: wayPoints,
        travelMode: google.maps.TravelMode.WALKING,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        avoidHighways: true,
        avoidTolls: true
    }, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
        display.setDirections(response);
        console.log("RESPONSE: ", response);
        } else {
        alert('Could not display directions due to: ' + status);
        }
    });
}

function computeTotalDistance(result) {
    var total = 0;
    var duration = 0;
    var myroute = result.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
        duration += myroute.legs[i].duration.value;
    }
    total = total / 1000;
    duration = moment.duration(duration, 'seconds');
    var hours =  duration.hours();
    var mins =  duration.minutes();
    var seconds = duration.seconds();
    document.getElementById('total').innerHTML = total + ' miles';
    document.getElementById('duration').innerHTML = hours + " hours " + mins + " mins " + seconds + " seconds";
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

function rectangleRoute(length, BaseLocation) {
    /*  
        The algorithm was created based on the answers from these two stackoverflow links
        http://stackoverflow.com/questions/2187657/calculate-second-point-knowing-the-starting-point-and-distance
        http://stackoverflow.com/questions/30002372/given-point-of-latitude-longitude-distance-and-bearing-how-to-get-the-new-la
    */

    var pointArray = [];
    var width = length / (Math.random() + 7);
    var height = width * 2;
    var diagonal = Math.sqrt(width * width + height * height);
    var theta = Math.acos(height / diagonal);
    var direction = Math.random() * 2 * Math.PI;
    var angle = 0 + direction;
    var dx = height * Math.cos(angle);
    var dy = height * Math.sin(angle);

    // One degree of latitude on the Earth's surface equals 110540 meters.
    // One degree of longitude equals 111320 meters (at the equator)
    var delta_lat = dy / 110540;
    // BaseLocation.lat * Math.PI / 180 = conversion of latitude from degrees to radians.
    var delta_lng = dx / (111320 * Math.cos(BaseLocation.lat * Math.PI / 180));
    pointArray[0] = new google.maps.LatLng(BaseLocation.lat + delta_lat,BaseLocation.lng + delta_lng);

    angle = -1 * theta + direction;
    dx = diagonal * Math.cos(angle);
    dy = diagonal * Math.sin(angle);
    delta_lat = dy / 110540;
    delta_lng = dx / (111320 * Math.cos(BaseLocation.lat * Math.PI / 180));
    pointArray[1] = new google.maps.LatLng(BaseLocation.lat + delta_lat,BaseLocation.lng + delta_lng);

    angle = -1 * Math.PI / 2 + direction;
    dx = width * Math.cos(angle);
    dy = width * Math.sin(angle);
    delta_lat = dy / 110540;
    delta_lng = dx / (111320 * Math.cos(BaseLocation.lat * Math.PI / 180));
    pointArray[2] = new google.maps.LatLng(BaseLocation.lat + delta_lat,BaseLocation.lng + delta_lng);
    
    var wayPoints = [];
    for (var i = 0; i < pointArray.length; i++) {
        wayPoints.push({
            location: pointArray[i],
            stopover: true
        });
    }
    console.log(wayPoints);
    return wayPoints;
}
