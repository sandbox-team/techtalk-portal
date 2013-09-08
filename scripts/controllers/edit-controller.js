;(function(ng) {
  'use strict';

  ng.module('tp')
    .controller('EditCtrl', ['$scope', '$routeParams', 'data', 
      function($scope, $routeParams, dataProvider) {
        var currentTalkId = $routeParams.talkId;

        console.log(currentTalkId);
        editor.init();
        //ui.init();
      }]);
})(angular);