;(function(ng) {
  'use strict';

  ng.module('tp', ['ngCookies', 'ngResource', 'ngRoute', 'ngSanitize', 'tp.services'])
    //
    .config(['$routeProvider', '$locationProvider', '$provide',
     function($routeProvider, $locationProvider, $provide) {
      $provide.constant('appConfig', {
        userCookie: 'user_settings',
        responseStatus: {
          SUCCESS: 'success',
          ERROR: 'error'
        }
      });

      $locationProvider
        .html5Mode(true)
        .hashPrefix('!');

      $routeProvider.when('/', {
          controller: 'CalendarCtrl',
          templateUrl: 'views/calendar-page'
        })
        .when('/details/:talkId', {
          controller: 'DetailsCtrl',
          templateUrl: 'views/details-page'
        })
        .when('/edit/:talkId', {
          controller: 'EditCtrl',
          templateUrl: 'views/edit-page'
        })
        .otherwise({redirectTo: '/'});
    }])
    .run(function() {
      
    })
    /**
     * 
     */
    .controller('AppCtrl', ['$rootScope', '$scope', 'authService', 'data', 
      function($rootScope, $scope, authService, dataProvider) {
        $rootScope.global = {
          isAuthN: authService.isAuthN(),
          authService: authService,
          users: {}
        };

        $scope.auth = {};

        dataProvider.getUser().then(function(data) {
          $rootScope.global.users = data;
        });

        $scope.signin = function() {
          $scope.authInProgress = true;

          authService.login({
              login: $scope.auth.login,
              password: $scope.auth.password
            })
            .then(function() {
              
            }, function(msg) {
              alert(msg);
            })
            ['finally'](function() {
              $scope.authInProgress = false;
            });
        }; 

        $scope.logout = function() {
          authService.logout(); 
        } 
      }]);


})(angular);