;(function(ng) {
  'use strict';

  ng.module('tp.directives')
    .directive('tpUserSearch', ['$filter', '$rootScope', '$document', '$timeout', '$http', '$q', 'data', 'appConfig',
      function($filter, $rootScope, $document, $timeout, $http, $q, dataProvider, appConfig) {
        return {
          replace: true,
          template: [
            '<div class="userSearch">',
              '<div class="$scope.selected">',
                '<span class="badge badge-success"',
                  'data-ng-repeat="user in selected | userData"',
                  'data-ng-click="unselect(user, $index);"',
                  '>{{user.name}}</span>',
              '</div>',
              '<div class="searchWrap">',
                '<input type="text" id="{{fieldId}}" class="searchInput" data-ng-model="searchInput" data-ng-change="search();" />',
                '<ul class="dropdown-menu variants" data-dropdown="true" data-ng-show="focused && filtered.length">',
                  '<li href="" data-dropdown="true" data-ng-repeat="user in filtered | orderBy:\'name\'" data-ng-click="select(user, $index);">',
                      '<a href="" data-dropdown="true">{{user.name}}</a>',
                  '</li>',
                '</ul>',
              '</div>',
            '</div>'
          ].join(''),
          scope: {
            available: '=available',
            selected: '=selected'
          },
          require: '?ngModel',
          compile: function(element, attr, linker) {
            return function($scope, $element, $attrs) {
              var requestCanceler;

              $scope.focused = false;
              $scope.fieldId = $attrs['tpUserSearch'];

              $element.find('input').on('focus', function() {
                var close = function(e) {
                  var $this = ng.element(e.target);
                  if (!$this.data('dropdown') && !$this.hasClass('searchInput')) {
                    $scope.$apply(function() {
                      $scope.focused = false;
                    });
                    $document.off('click', close);
                  }
                };

                $scope.$apply(function() {
                  $scope.focused = true;
                });
                $document.on('click', close);
              });

              $scope.search = function() {
                var selectedUsers = $scope.selected.concat([]),
                  notSelected = $filter('filter')($scope.available, function(user) {
                    var i = 0,
                      selectedNumber = selectedUsers.length;  
                    
                    for(; i < selectedNumber; i++) {
                      var id = selectedUsers[i];
                      if (id === user._id) {
                        selectedUsers.splice(i, 1);
                        return false;
                      }
                    }

                    return true;
                  });

                $scope.filtered = $scope.searchInput ?
                    $filter('filter')(notSelected, {email: $scope.searchInput}) :
                    [];

                if (!$scope.filtered.length && ~$scope.searchInput.indexOf(appConfig.EMAIL_SUFFIX)) {
                  requestCanceler && requestCanceler.resolve();
                  requestCanceler = $q.defer();

                  var searchResults = dataProvider.User.query({
                      email: $scope.searchInput
                    }, function() {
                      Array.prototype.push.apply($rootScope.global.users, searchResults);
                      $scope.search();
                    });
                }
              };

              $scope.select = function(user) {
                $scope.filtered.splice($scope.filtered.indexOf(user), 1);
                $scope.selected.push(user._id);
              };

              $scope.unselect = function(user, index) {
                $scope.selected.splice(index, 1);
                $scope.search();
              };
            };
          }
        };
      }
    ]);
})(angular);