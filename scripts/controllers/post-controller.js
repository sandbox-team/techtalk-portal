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
    .controller('PostCtrl', ['$scope', '$routeParams', 'data', '$location',
      function($scope, $routeParams, dataProvider, $location){
        var slug = $routeParams.slug;

        var post = dataProvider.Post.get({id: slug}, function(){
          $scope.global.pageTitle = post.title;
          $scope.post = post;
        });

        $scope.edit = function(){
          if($scope.post && $scope.global.isAuthN){
            $location.path('/post/' + $scope.post._id + '/edit');
          }
        };

        $scope.delete = function(){
          if($scope.post && $scope.global.isAuthN && confirm('Sure you want to delete this post?')){
            $scope.post.$delete({id: $scope.post._id});
            $location.path('/');
          }
        };
      }
    ])
    .controller('PostEditCtrl', ['$scope', '$routeParams', 'data', '$location' ,
      function($scope, $routeParams, dataProvider, $location){
        var slug = $routeParams.slug;

        var post = dataProvider.Post.get({id: slug}, function(){
          $scope.global.pageTitle = post.title;
          $scope.post = post;
        });

        $scope.save = function(){
          $scope.post.$update({id: $scope.post._id});
          $location.path('/');
        };

        $scope.cancel = function(){
          $location.path('/');
        };

        $scope.delete = function(){
          if($scope.post && $scope.global.isAuthN && confirm('Sure you want to delete this post?')){
            $scope.post.$delete({id: $scope.post._id});
            $location.path('/');
          }
        };
      }
    ])
    .controller('PostNewCtrl', ['$scope', '$routeParams', 'data', '$location', 'authService',
      function($scope, $routeParams, dataProvider, $location, authService){
        var slug = $routeParams.slug;

        var user = authService.getUserData();
        var now = Date.now();
        var post = new dataProvider.Post({
          title: '',
          author: user,
          date: now,
          content: ''
        });
        $scope.global.pageTitle = 'Add new post';
        $scope.post = post;

        $scope.save = function(){
          $scope.post.$save();
          $location.path('/');
        };

        $scope.cancel = function(){
          $location.path('/');
        };
      }
    ]);

})(angular);