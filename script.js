// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

var circles = [];
var col;
var aso;
var afo;
var map;
var pos;
var marker;
var liveMarker;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 42.9813845, lng: -81.2395378},
        zoom: 17,
        disableDefaultUI: true,
        scrollwheel: false,
        disableDoubleClickZoom: true,
        clickableIcons: false
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            map.setCenter(pos);

            marker = new google.maps.Marker({
                map: map,
                draggable: true,
                animation: google.maps.Animation.DROP,
                position: pos
            });

            startLiveMarker();

            google.maps.event.addListener(marker, 'dragend', function () {
                clearInterval(liveMarker);
                pos = marker.getPosition();
            });

        }, function () {
            handleLocationError(true, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, map.getCenter());
    }

    map.addListener('click', function (e) {
        clearInterval(liveMarker);
        pos = e.latLng;
        marker.setPosition(pos);
    });

    var locatelink = document.querySelector('#locate');
    locatelink.addEventListener('click', function () {

        document.querySelector('#locate i').className = "fa fa-cog fa-spin";

        navigator.geolocation.getCurrentPosition(function (position, link) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            marker.setPosition(pos);
            startLiveMarker();

            document.querySelector('#locate i').className = "fa fa-map-marker";
        });


    });
    var buttons = document.getElementsByTagName('button');
    for (i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function () {
            col = '#FF0000';
            aso = 1.0;
            afo = 0.8;

            var circle;

            if (this.getAttribute('id') == 'see-it') {
                //regardless, it's not within 70m diameter of current location
                //otherwise we'd see it!
                circle = new google.maps.Circle({
                    strokeColor: col,
                    strokeOpacity: aso,
                    strokeWeight: 2,
                    fillColor: col,
                    fillOpacity: afo,
                    map: map,
                    center: pos,
                    radius: 35,
                    clickable: false
                });
                circles.push(circle);

                col = '#00FF00';
                aso = 0.8;
                afo = 0.1;
            }

            circle = new google.maps.Circle({
                strokeColor: col,
                strokeOpacity: aso,
                strokeWeight: 2,
                fillColor: col,
                fillOpacity: afo,
                map: map,
                center: pos,
                radius: 200,
                clickable: false
            });
            circles.push(circle);


        }, function () {
            handleLocationError(true, map.getCenter());
        });

    }
}

function handleLocationError(browserHasGeolocation, pos) {
    var infoWindow = new google.maps.InfoWindow({map: map});
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

function startLiveMarker() {
    liveMarker = setInterval(function(){
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            marker.setPosition(pos);
        });
    }, 2000);
}
