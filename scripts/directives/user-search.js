;(function(ng) {
  'use strict';

  ng.module('tp.directives')
    .directive('tpUserSearch', ['$filter', '$rootScope', '$document', '$timeout', '$http', '$q', 'data',
      function($filter, $rootScope, $document, $timeout, $http, $q, dataProvider) {
        return {
          replace: true,
          template: [
            '<div class="userSearch">',
              '<div class="$scope.selected">',
                '<span class="badge badge-success"',
                  'data-ng-repeat="user in selected | userData"',
                  'data-ng-click="unselect(user);"',
                  'data-ng-bind="user.name"></span>',
              '</div>',
              '<div class="searchWrap">',
                '<input type="text" id="{{fieldId}}" class="searchInput" data-ng-model="searchInput" data-ng-change="search();" />',
                '<ul class="dropdown-menu variants" data-dropdown="true" data-ng-show="focused && filtered.length">',
                  '<li href="" data-dropdown="true" data-ng-repeat="user in filtered | orderBy:\'name\'" data-ng-click="select(user);"><a href="" data-dropdown="true" data-ng-bind="user.name" ></a></li>',
                '</ul>',
              '</div>',
            '</div>'
          ].join(''),
          scope: {
            available: '=available',
            selected: '=selected',
            promise: '=promise'
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
                      var email = selectedUsers[i];
                      if (email === user.email) {
                        selectedUsers.splice(i, 1);
                        return false;
                      }
                      else {

                      }
                    }

                    return true;
                  });

                $scope.filtered = $scope.searchInput ? 
                    $filter('filter')(notSelected, {email: $scope.searchInput}) :
                    [];

                if (!$scope.filtered.length) {
                  requestCanceler && requestCanceler.resolve();
                  requestCanceler = $q.defer();

                  var searchResults = dataProvider.User.query({
                      email: $scope.searchInput
                    }, function() {
                      $scope.filtered = searchResults;
                      $rootScope.global.users = $rootScope.global.users.concat(searchResults);
                    });
                }
              };

              $scope.select = function(user) {
                $scope.filtered.splice($scope.filtered.indexOf(user), 1);
                $scope.available.splice($scope.available.indexOf(user), 1);
                $scope.selected.push(user.email);
              };

              $scope.unselect = function(user) {
                $scope.available.push($scope.selected.splice($scope.selected.indexOf(user), 1)[0]);
                $scope.search();
              };
            };
          }
        };
      }
    ]);
})(angular);