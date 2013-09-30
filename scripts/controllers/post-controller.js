;(function(ng) {
  'use strict';

  ng.module('tp')
    .directive('contenteditable', ['$timeout',
      function($timeout) {
        return {
          restrict: 'A', // only activate on element attribute ,
          require: '?ngModel', // get a hold of NgModelController
          link: function($scope, $element, $attrs, ngModel) {
            if (!ngModel) return; // do nothing if no ng-model

            // Specify how UI should be updated
            ngModel.$render = function() {
              $element.html(ngModel.$viewValue || '');
            };

            // Listen for change events to enable binding
            $element.on('blur keyup change', function() {
              $scope.$apply(read);
            });

            $timeout(function() {
              read();
            }, 0);

            // Write data to the model
            function read() {
              var html = $element.html();
              // When we clear the content editable the browser leaves a <br> behind
              // If strip-br attribute is provided then we strip this out
              if( $attrs.stripBr && html == '<br>' ) {
                html = '';
              }
              ngModel.$setViewValue(html);
            }
          }
        }
      }
    ])
    .controller('PostCtrl', ['$scope', '$routeParams', 'data',
      function($scope, $routeParams, dataProvider){
        var slug = $routeParams.slug;

        dataProvider
          .getPost(slug)
          .success(function(data) {
            $scope.global.pageTitle = data.title;
            $scope.post = data;
          });
      }
    ])
    .controller('PostEditCtrl', ['$scope', '$routeParams', 'data', '$location' ,
      function($scope, $routeParams, dataProvider, $location){
        var slug = $routeParams.slug;

        $scope.creator = [];

        dataProvider
          .getPost(slug)
          .success(function(data) {
            $scope.global.pageTitle = data.title;
            $scope.post = data;
            debugger;

            window.setTimeout(function(){
              editor.init();
            }, 0)
          });

        $scope.save = function(){
          console.log('save form');
        };
        $scope.cancel = function(){
          $location.path('/');
        };
      }
    ]);

})(angular);