;(function(ng) {
  'use strict';

  ng.module('tp')
    .controller('DetailsCtrl', ['$scope', '$routeParams', 'data', 'helper',
      function($scope, $routeParams, dataProvider, helper) {
        var currentTalkId = $routeParams.talkId;

        $scope.global.pageTitle = 'talk: ' + currentTalkId;
        $scope._id = currentTalkId;

        if (ng.isDefined(currentTalkId)) {
          $scope.global.appPromise.then(function() {
            $scope.details = $scope.global.talks[currentTalkId]; 
            $scope.details.date = new Date($scope.details.date);
            $scope.locationReturn = '/calendar/' + $scope.details.date.getDate() + '/' + helper.getMonthName($scope.details.date.getMonth(), true) + '/' + $scope.details.date.getFullYear();
          });
        }
      }]);
})(angular);