app.service('restaurantService', function($http, $rootScope, APP_CONFIG) {
  return {
    get: function() {
      return $http({
        method: 'GET',
        url: APP_CONFIG.PLACES_URL +
             'key=' + APP_CONFIG.API_KEY +
             '&radius=500' +
             '&type=restaurant' +
             '&location=51.523164,-0.15687704'
      });
    }
  };
});