;(function(ng) {
  'use strict';

  ng.module('tp.services')
    .factory('authService', ['$http', '$q', '$cookieStore', '$rootScope', 'helper', 'appConfig',
      function($http, $q, $cookieStore, $rootScope, helper, appConfig) {
        var USER_KEY = 'user',
            _user = helper.storage.get(USER_KEY);

        return {
          isAuthN: function() {
            var userSettings = $cookieStore.get(appConfig.userCookie);
            return userSettings && userSettings.authN;
          },
          login: function(data) {
            return $http({
                method: 'POST',
                url: '/portal/auth',
                data: data
              }).then(function(response) {
                var data = response.data;
                if (data.status === appConfig.responseStatus.SUCCESS) {
                  $cookieStore.put(appConfig.userCookie, {
                    authN: true
                  });
                  _user = data.user;
                  $rootScope.global.isAuthN = true;
                  $rootScope.global.currentUser = _user;

                  helper.storage.set(USER_KEY, _user);
                }
                else {
                  return $q.reject(data);
                }
              });
          },
          getUserData: function() {
            return _user;
          },
          logout: function() {
            $cookieStore.remove(appConfig.userCookie); 
            $rootScope.global.isAuthN = false;
            $rootScope.global.currentUser = null;
            _user = null;
            helper.storage.remove(USER_KEY);

            $http({
              method: 'POST',
              url: '/portal/logout'
            });
          }
        };
    }]);
})(angular);