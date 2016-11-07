app.controller('lunchController', function ($scope, $rootScope,restaurantService) {
    
    $scope.lunches=[];
    
    $scope.useCurrentLocation = function () {
        // set geopos.lat,lng and address based on call to mobile location.
    };
    $scope.findLunches = function (lat, lng) {
        // given a latitude and longitude find lunches in the area.
        restaurantService.get().then(function(result){
            $scope.lunches = result;
        },function(error){
            console.log('Error from google api' + error);
        });
//        $scope.lunches = [{
//            "Name": "Tesco"
//            , "Location": "1,1"
//            , "Price": "1"
//            }, {
//            "Name": "Pret"
//            , "Location": "2,2"
//            , "Price": "1"
//        }];
    };
    $scope.selectRandomLunch = function () {
        // look at the list of lunches retrieved and select one at random
        var numberOfPlaces = $scope.lunches.length;
        var rand = Math.floor((Math.random() * numberOfPlaces));
        $scope.randomLunch = $scope.lunches[rand];
    };
});