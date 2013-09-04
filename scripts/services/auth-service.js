;(function(ng) {
  'use strict';

  ng.module('tp.services')
    .factory('authService', ['$http', '$q', '$cookieStore', '$rootScope', 'appConfig',
      function($http, $q, $cookieStore, $rootScope, appConfig) {

        return {
          isAuthN: function() {
            var userSettings = $cookieStore.get(appConfig.userCookie);
            return userSettings && userSettings.authN;
          },
          login: function(data) {
            return $http({
                method: 'POST',
                url: 'auth',
                data: data
              }).then(function(response) {
                var data = response.data;
                if (data.status === appConfig.responseStatus.SUCCESS) {
                  $cookieStore.put(appConfig.userCookie, {
                    authN: true
                  });
                  $rootScope.global.isAuthN = true;  
                }
                else {
                  return $q.reject(data.message);
                }
              });
          },
          logout: function() {
            $cookieStore.remove(appConfig.userCookie); 
            $rootScope.global.isAuthN = false;  
          }
        };
    }]);
})(angular);