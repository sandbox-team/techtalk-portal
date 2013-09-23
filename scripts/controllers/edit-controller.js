;(function(ng) {
  'use strict';

  ng.module('tp')
    .controller('EditCtrl', ['$scope', '$routeParams', 'data', '$location', 
      function($scope, $routeParams, dataProvider, $location) {
        var currentTalkId = $routeParams.talkId,
          LOADING_MSG = '(Saving your data...)';

        $scope.global.pageTitle = 'edit talk: ' + currentTalkId;
        $scope._id = currentTalkId;
        $scope.loading = false;

        if (ng.isDefined(currentTalkId)) {
          $scope.details = $scope.global.talks[currentTalkId];
          $scope.attendees = $scope.details.attendees;

          editor.init();
        }

        $scope.save = function(callback) {
          var title = $scope.global.pageTitle;
          $scope.global.pageTitle = title + LOADING_MSG;
          $scope.loading = true;

          $scope.details.description = document.getElementById('talkContent').innerHTML;

          $scope.details.$save(function(data) {
            $scope.loading = false;
            $scope.global.pageTitle = title;
            ng.isFunction(callback) && callback(data);
          });
        };

        $scope.saveAndClose = function() {
          $scope.loading = true;

          $scope.save($scope.goBack);
        };

        $scope.goBack = function() {
          $location.path('/details/' + currentTalkId);
        };
      }]);
})(angular);