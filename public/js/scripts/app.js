;(function(ng) {
  'use strict';

  ng.module('tp', ['ngCookies', 'ngResource', 'ngRoute', 'ngSanitize', 'tp.services'])
    //
    .config(['$routeProvider', '$locationProvider', '$provide',
     function($routeProvider, $locationProvider, $provide) {
      $provide.constant('appConfig', {
        userCookie: 'user_settings'
      });

      $locationProvider
        .html5Mode(true)
        .hashPrefix('!');

      $routeProvider.when('/', {
        controller: 'CalendarCtrl',
        templateUrl: 'views/calendar-page'
      });
    }])
    /**
     * 
     */
    .controller('AppCtrl', ['$rootScope', '$scope', 'authService', 
      function($rootScope, $scope, authService) {
        $rootScope.global = {
          isAuthN: authService.isAuthN(),
          authService: authService,
          user: {
            firstName: 'asd'
          }
        };

        $scope.signin = function() {
          var userData = {
            login: $scope.auth.login,
            password: $scope.auth.password
          };
        };  
      }]);


})(angular);