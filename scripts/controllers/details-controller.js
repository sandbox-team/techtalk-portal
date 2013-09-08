;(function(ng) {
  'use strict';

  ng.module('tp')
    .controller('DetailsCtrl', ['$scope', '$routeParams', 'data', 
      function($scope, $routeParams, dataProvider) {
        var currentTalkId = $routeParams.talkId;

        $scope.global.pageTitle = 'talk: ' + currentTalkId;

        if (ng.isDefined(currentTalkId)) {
          dataProvider
            .getTechtalkData(currentTalkId)
            .success(function(data) {
              $scope.details = data;    
            })
            .error(function() {

            });  
        }
      }]);
})(angular);