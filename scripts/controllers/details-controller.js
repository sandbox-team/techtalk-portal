;(function(ng) {
  'use strict';

  ng.module('tp')
    .controller('DetailsCtrl', ['$scope', '$routeParams', 'data', 
      function($scope, $routeParams, dataProvider) {
        var currentTalkId = $routeParams.talkId,
          talkDate;

        $scope.global.pageTitle = 'talk: ' + currentTalkId;
        $scope._id = currentTalkId;

        if (ng.isDefined(currentTalkId)) {
          $scope.details = $scope.global.talks[currentTalkId]; 
		      talkDate = new Date($scope.details.date);
          $scope.details.date = talkDate;		  
        }
      }]);
})(angular);