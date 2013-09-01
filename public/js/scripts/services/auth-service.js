;(function(ng) {
  'use strict';

  ng.module('tp.services')
    .factory('authService', ['$http', '$cookieStore', 'appConfig',
       function($http, $cookieStore, appConfig) {

        return {
          isAuthN: function() {
            var userSettings = $cookieStore.get(appConfig.userCookie);
            return userSettings && userSettings.authN;
          },
          login: function(data) {
            $cookieStore.put(appConfig.userCookie, {
              authN: true
            })
          }
        };
    }]);
})(angular);