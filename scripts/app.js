;(function(ng) {
  'use strict';

  ng.module('tp', ['ngCookies', 'ngResource', 'ngRoute', 'ngSanitize'])
    //
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
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
    .controller('AppCtrl', ['$scope', function($scope) {
      
    }]);


})(angular);