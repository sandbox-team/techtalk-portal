;(function(ng) {
  'use strict';

  ng.module('tp')
    .controller('EditCtrl', ['$scope', '$routeParams', 'data', '$location', 
      function($scope, $routeParams, dataProvider, $location) {
        var currentTalkId = $routeParams.talkId;

        $scope.global.pageTitle = 'edit talk: ' + currentTalkId;
        $scope._id = currentTalkId;

        if (ng.isDefined(currentTalkId)) {
          $scope.details = $scope.global.talks[currentTalkId];
          $scope.attendees = $scope.details.attendees;
        }

        editor.init();
      }]);
})(angular);