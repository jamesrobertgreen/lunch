app.controller('lunchController', function ($scope, $rootScope, restaurantService) {
    $scope.setAddress = function (lat, lng) {
        var geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({
            'latLng': latlng
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    $scope.geopos.address = results[1].formatted_address;
                }
                else {
                    console.log('Location not found');
                }
            }
            else {
                console.log('Geocoder failed due to: ' + status);
            }
        });
    };
    $scope.geopos = {
        lat: 51.523164
        , lng: -0.15687704
        , address: ""
    };
    $scope.selected = {
        lat: ""
        , lng: ""
        , address: ""
    };
    $scope.lunches = [];
    $scope.useCurrentLocation = function () {
        // set geopos.lat,lng and address based on call to mobile location.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                $scope.$apply(function () {
                    $scope.selected.lat = position.coords.latitude;
                    $scope.selected.lng = position.coords.longitude;
                    $scope.setAddress($scope.selected.lat,$scope.selected.lng);
                    $scope.selected.address = $scope.geopos.address;
                });
            });
        }
    };
    $scope.findLunches = function (localLat, localLng, maxResults) {
        // given a latitude and longitude find lunches in the area.
        $scope.lunches = [];
        var map;
        var infowindow;
        var loc = new google.maps.LatLng(localLat, localLng);
        map = new google.maps.Map(document.getElementById('map'), {
            center: loc
            , zoom: 15
        });
        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
            location: loc
            , radius: 500
            , type: ['food']
        }, function (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length && i < maxResults; i++) {
                    $scope.lunches.push(results[i]);
                }
                $scope.$apply();
            }
        });
    };
    $scope.selectRandomLunch = function () {
        // look at the list of lunches retrieved and select one at random
        var numberOfPlaces = $scope.lunches.length;
        var rand = Math.floor((Math.random() * numberOfPlaces));
        $scope.randomLunch = $scope.lunches[rand];
    };
});