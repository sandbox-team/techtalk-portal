;(function(ng) {
  'use strict';

  ng.module('tp')
    .controller('CreateCtrl', ['$scope', '$location', 'data', 'appConfig',
      function($scope, $location, dataProvider, appConfig) {
        //duplicate
        var LOADING_MSG = '(Saving your data...)';

        $scope.global.pageTitle = 'Create new talk';
        $scope.loading = false;

        $scope.details = new dataProvider.Talk({
            lector: [],
            attendees: [],
            date: new Date(),
            location: 'K1-3'
          });

        $scope.save = function(callback) {
          var title = $scope.global.pageTitle;
          $scope.global.pageTitle = title + LOADING_MSG;
          $scope.loading = true;

          if ($scope.details._id) {

          }
          else {
            $scope.details.$save(function(data) {
              $scope.loading = false;
              $scope.global.pageTitle = title;
              $scope.global.talks[data._id] = data;
              $scope.details._id = data._id;
              ng.isFunction(callback) && callback(data);
            });
          }
        };

        $scope.saveAndClose = function() {
          $scope.loading = true;

          $scope.save($scope.goBack);
        };

        $scope.goBack = function() {
          $location.path($scope.previousUrl || appConfig.BASE_PATH);
        };
      }
    ]);
})(angular);