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
        var checkAuth = ['authService', '$location', function(authService, $location) {
            if (!authService.isAuthN()) {
              $location.path('/portal')
            } 
          }];

        $provide.constant('appConfig', {
          userCookie: 'user_settings',
          responseStatus: {
            SUCCESS: 'success',
            ERROR: 'error'
          },
          BASE_PATH: '/portal',
          EMAIL_SUFFIX: '@epam.com'
        });

        $locationProvider
          .html5Mode(true)
          .hashPrefix('!');

        $routeProvider.when('/portal', {
            controller: 'CalendarCtrl',
            templateUrl: '/portal/views/calendar-page'
          })
          .when('/portal/calendar/:day/:month/:year', {
             controller: 'CalendarCtrl',
             templateUrl: '/portal/views/calendar-page'
          })
          .when('/portal/details/:talkId', {
            controller: 'DetailsCtrl',
            templateUrl: '/portal/views/details-page'
          })
          .when('/portal/edit/:talkId', {
            controller: 'EditCtrl',
            templateUrl: '/portal/views/edit-page',
            resolve: {
              checkAuth: checkAuth
            }
          })
          .when('/portal/new', {
            controller: 'CreateCtrl',
            templateUrl: '/portal/views/edit-page',
            resolve: {
              checkAuth: checkAuth
            }
          })
          .when('/portal/post/', {
            controller: 'PostNewCtrl',
            templateUrl: '/portal/views/post-edit'
          })
          .when('/portal/post/:slug', {
            controller: 'PostCtrl',
            templateUrl: '/portal/views/post'
          })
          .when('/portal/post/:slug/edit', {
            controller: 'PostEditCtrl',
            templateUrl: '/portal/views/post-edit'
          })
          .otherwise({redirectTo: '/portal'});
      }])
      .run(['$rootScope', '$q', 'authService', 'helper', function($rootScope, $q, authService, helper) {
        $rootScope.$on('$locationChangeStart', function(event, newLocation, oldLocation) {
          $rootScope.previousUrl = oldLocation;
        });

        return $q.all([
          authService.checkAuthN()
        ]);
      }])
  /**
   *
   */
   .controller('AppCtrl', ['$rootScope', '$scope', '$q', 'authService', 'data',
    function($rootScope, $scope, $q, authService, dataProvider) {
      var global = {
          isAuthN: authService.isAuthN(),
          currentUser: authService.getUserData(),
          users: dataProvider.User.query(),
          talks: dataProvider.Talk.query(),
          selected: [],
          errorStack: []
        };

      global.appPromise = $q.all([global.users.$promise, global.talks.$promise]);

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
            userData = helper.getUser(ids[i].email);
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
    ])
    .filter('htmlToPlaintext', function() {
      return function(text) {
        return String(text).replace(/<(?:.|\n)*?>/gm, ' ');
      }
    });
 })(angular);