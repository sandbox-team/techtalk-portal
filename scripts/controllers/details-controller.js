;(function(ng) {
  'use strict';

  ng.module('tp')
    .controller('DetailsCtrl', ['$scope', '$routeParams', 'data', 
      function($scope, $routeParams, dataProvider) {
        var currentTalkId = $routeParams.techtalkId;

        $scope.global.pageTitle = 'details view';

        if (ng.isDefined(currentTalkId)) {
          dataProvider
            .getTechtalkData($routeParams.techtalkId)
            .success(function(data) {
              $scope.details = data;    
            })
            .error(function() {

            });  
        }
      }]);
})(angular);