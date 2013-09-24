;(function(ng) {
  'use strict';

  ng.module('tp.services', []);
  ng.module('tp.directives', []);

  ng.module('tp', [
      'ngCookies', 'ngResource', 'ngRoute', 'ngSanitize', 'ngAnimate',
      'tp.services', 'tp.directives'
    ])
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

        $routeProvider
          .when('/', {
            controller: 'CalendarCtrl',
            templateUrl: 'views/calendar-page'
          })
          .when('/calendar/:month/:year', {
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
          .when('/post/:slug', {
            controller: 'PostCtrl',
            templateUrl: 'views/post'
          })
          .when('/post/:slug/edit', {
            controller: 'PostEditCtrl',
            templateUrl: 'views/post-edit'
          })
          .otherwise({
            templateUrl: 'views/404'
          });
      }
    ])
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
        data: {},
        selected: []
      };

      $scope.auth = {};

      dataProvider.talksResource.query(function(data) {
        $rootScope.global.talks = data;
      });

      dataProvider.getUsers().then(function(users) {
        $rootScope.global.users = users;
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
      };
    }]);
 })(angular);