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
    .controller('EditCtrl', ['$scope', '$routeParams', 'data', '$location', 
      function($scope, $routeParams, dataProvider, $location) {
        var currentTalkId = $routeParams.talkId,
          LOADING_MSG = '(Saving your data...)';

        $scope.global.pageTitle = 'edit talk: ' + currentTalkId;
        $scope._id = currentTalkId;
        $scope.loading = false;

        if (ng.isDefined(currentTalkId)) {
          $scope.global.appPromise.then(function() {
            $scope.details = ng.copy($scope.global.talks[currentTalkId]);
            $scope.attendees = $scope.details.attendees;

            editor.init();
          });
        }

        $scope.save = function(callback) {
          var title = $scope.global.pageTitle;
          $scope.global.pageTitle = title + LOADING_MSG;
          $scope.loading = true;

          $scope.details.$save(function(data) {
            $scope.loading = false;
            $scope.global.pageTitle = title;
            $scope.global.talks[currentTalkId] = data;
            ng.isFunction(callback) && callback(data);
          });
        };

        $scope.saveAndClose = function() {
          $scope.loading = true;

          $scope.save($scope.goBack);
        };

        $scope.goBack = function() {
          $location.path('/details/' + currentTalkId);
        };
      }]);
})(angular);