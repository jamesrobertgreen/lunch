app.controller('locationModalController', function ($scope, $modal, $rootScope) {
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
    $scope.zoom = 20;
    $scope.selectLocation = function () {
        $scope.open('lg', 'location-modal-template.html');
    };
    $scope.open = function (size, modalTemplate) {
        var modalInstance = $modal.open({
            templateUrl: modalTemplate
            , controller: 'ModalInstanceCtrl'
            , size: size
            , scope: $scope
            , resolve: {
                lat: function () {
                    return $scope.geopos.lat;
                }
                , lng: function () {
                    return $scope.geopos.lng;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {}, function () {});
    };
});
// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, lat, lng) {
    var opts = {
        zoom: 20
        , center: {
            lat: $scope.geopos.lat
            , lng: $scope.geopos.lng
        }
        , mapTypeControl: true
        , mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
            , position: google.maps.ControlPosition.TOP_RIGHT
        }
    };
    $scope.geopos.lat = lat;
    $scope.geopos.lng = lng;
    $scope.render = true;
    $scope.validation_text = "";
    $scope.$on('mapInitialized', function (evt, evtMap) {
        $scope.map = evtMap;
        $scope.map.setOptions(opts);
        var initLatLng = new google.maps.LatLng($scope.geopos.lat, $scope.geopos.lng);
        $scope.map.panTo(initLatLng);
        $scope.marker = new google.maps.Marker({
            position: initLatLng
            , map: $scope.map
        });
        google.maps.event.trigger($scope.map, 'resize');
        $scope.map.setCenter(initLatLng);
        var input = document.getElementById("keyword");
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo("bounds", $scope.map);
        autocomplete.addListener("place_changed", function () {
            var place = autocomplete.getPlace();
            if (place.geometry.viewport) {
                $scope.map.fitBounds(place.geometry.viewport);
            }
            else {
                $scope.map.setCenter(place.geometry.location);
                $scope.map.setZoom($scope.zoom);
            }
            $scope.marker.setPosition(place.geometry.location);
            $scope.geopos.lat = place.geometry.location.lat();
            $scope.geopos.lng = place.geometry.location.lng();
            setAddress($scope.geopos.lat, $scope.geopos.lng);
        });
        $scope.click = function (evt) {
            var latitude = evt.latLng.lat().toPrecision(8);
            var longitude = evt.latLng.lng().toPrecision(8);
            $scope.validation_text = "";
            $scope.marker.setPosition(evt.latLng);
            $scope.map.panTo(evt.latLng);
            $scope.map.setZoom($scope.zoom);
            $scope.geopos.lat = latitude;
            $scope.geopos.lng = longitude;
            setAddress(evt.latLng.lat(), evt.latLng.lng());
        }
        setAddress($scope.geopos.lat, $scope.geopos.lng);
    });
    var setAddress = function (lat, lng) {
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
    $scope.ok = function () {
        $scope.selected.lat = $scope.geopos.lat;
        $scope.selected.lng = $scope.geopos.lng;
        $scope.selected.address = $scope.geopos.address;
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.close();
    };
});