;(function(ng) {
  'use strict';

  ng.module('tp')
    .controller('EditCtrl', ['$scope', '$routeParams', 'data', 
      function($scope, $routeParams, dataProvider) {
	  //init for zenpen
	  /* head.js(
              "/js/zenpen/js/utils.js",
              "/js/zenpen/js/ui.js",
              "/js/zenpen/js/editor.js",
              function(){
                  // Initiate ZenPen
                  editor.init();
                  ui.init();
              }
          );*/
        var currentTalkId = $routeParams.talkId;

        $scope.global.pageTitle = 'edit talk: ' + currentTalkId;
        $scope._id = currentTalkId;

        if (ng.isDefined(currentTalkId)) {
          $scope.details = $scope.global.data.talks[currentTalkId];    
        }

      }]);
})(angular);