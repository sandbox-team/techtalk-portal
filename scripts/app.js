;(function(ng) {
  'use strict';

  ng.module('tp.services', []);
  ng.module('tp.directives', []);

  ng.module('tp', [
      'ngCookies', 'ngResource', 'ngRoute', 'ngSanitize', 'ngAnimate',
      'ui.bootstrap.collapse',
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
          },
          EMAIL_SUFFIX: '@epam.com'
        });

        $locationProvider
          .html5Mode(true)
          .hashPrefix('!');

          $routeProvider.when('/', {
              controller: 'CalendarCtrl',
              templateUrl: 'views/calendar-page'
            })
            .when('/calendar/:day/:month/:year', {
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
            .otherwise({redirectTo: '/'});
        }])
      .run(function() {

    })
  /**
   *
   */
   .controller('AppCtrl', ['$rootScope', '$scope', '$q', 'authService', 'data',
    function($rootScope, $scope, $q, authService, dataProvider) {
      var appDefer = $q.defer(),
        global = {
          isAuthN: authService.isAuthN(),
          currentUser: authService.getUserData(),
          appPromise: appDefer.promise,
          users: dataProvider.User.query(),
          talks: dataProvider.Talk.query(),
          selected: [],
          errorStack: []
        };

      $q.all([global.users.$promise, global.talks.$promise])
        .then(function() {
          appDefer.resolve();
        });

      $rootScope.global = global;
      $scope.auth = {};

      $scope.signin = function() {
        $scope.authInProgress = true;

        authService.login({
            login: $scope.auth.login,
            password: $scope.auth.password
          })
          .then(function() {

          }, function(error) {
            $rootScope.global.errorStack.push(error);
            console.error(error.errorCode, error.message);
          })
          ['finally'](function() {
            $scope.authInProgress = false;
          });
      };

      $scope.logout = function() {
        authService.logout();
      };
    }])
    .filter('userData', ['$rootScope', 'appConfig', 'helper',
      function($rootScope, appConfig, helper) {
        return function(ids) {
          if (!ids) return;

          var out = [],
              i = 0,
              length = ids.length,
              userData;

          for (; i < length; i++) {
            userData = helper.getUser(ids[i]);
            userData && out.push(userData);
          }

          return out;
        };
      }
    ])
    .filter('userParam', ['$rootScope', 'appConfig', 'helper',
      function($rootScope, appConfig, helper) {
        return function(id, paramName) {
          return (helper.getUser(id) || {})[paramName];
        };
      }
    ]);
 })(angular);