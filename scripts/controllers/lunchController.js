app.controller('lunchController', function ($scope, $rootScope, restaurantService) {
    $scope.lunches = [];
    $scope.useCurrentLocation = function () {
        // set geopos.lat,lng and address based on call to mobile location.
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
            , type: ['restaurant']
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