;(function(ng) {
  'use strict';

  ng.module('tp')
    .controller('PostCtrl', ['$scope', '$routeParams', 'data',
      function($scope, $routeParams, dataProvider){
        var slug = $routeParams.slug;

        dataProvider
          .getPost(slug)
          .success(function(data) {
            $scope.post = data;
          });
      }
    ])
    .controller('PostEditCtrl', ['$scope', '$routeParams', 'data',
      function($scope, $routeParams, dataProvider){
        var slug = $routeParams.slug;

        dataProvider
          .getPost(slug)
          .success(function(data) {
            $scope.post = data;
          });

        $scope.save = function(){
          console.log('save form');
        };
        $scope.cancel = function(){
          console.log('cancelled');

        };
      }
    ]);;

})(angular);