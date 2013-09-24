;(function(ng) {
  'use strict';

  ng.module('tp.directives')
    .directive('tpUserSearch', ['$filter', '$rootScope', '$document', '$timeout',
      function($filter, $rootScope, $document, $timeout) {
        return {
          replace: true,
          template: [
            '<div class="userSearch">',
              '<div class="selectedUsers">',
                '<span class="badge badge-success"',
                  'data-ng-repeat="id in selected"',
                  'data-ng-click="unselect(id);"',
                  'data-ng-bind="global.users[id].full_name"></span>',
              '</div>',
              '<div class="searchWrap">',
                '<input type="text" id="{{fieldId}}" class="searchInput" data-ng-model="searchInput" data-ng-change="search();" />',
                '<ul class="dropdown-menu variants" data-dropdown="true" data-ng-show="focused && filtered.length">',
                  '<li href="" data-dropdown="true" data-ng-repeat="user in filtered | orderBy:\'name\'" data-ng-click="select(user);"><a href="" data-dropdown="true" data-ng-bind="user.fullName" ></a></li>',
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
              var selectedUsers = $scope.selected,
                availableUsers = _getUserArray($scope.available);

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

              $scope.focused = false;
              $scope.global = $rootScope.global;
              $scope.fieldId = $attrs['tpUserSearch'];

              $scope.search = function() {
                $scope.filtered = $scope.searchInput ? $filter('filter')(availableUsers, {id: $scope.searchInput}) : [];
              };

              $scope.select = function(user) {
                $scope.filtered.splice($scope.filtered.indexOf(user), 1);
                availableUsers.splice(availableUsers.indexOf(user), 1);
                selectedUsers.push(user.id);
              };

              $scope.unselect = function(userId) {
                selectedUsers.splice(selectedUsers.indexOf(userId), 1);
                availableUsers.push({
                  id: userId,
                  fullName: $rootScope.global.users[userId].full_name
                });
                $scope.search();
              };

              function _isSelected(id) {
                for (var i = 0, selectedNumber = selectedUsers.length; i < selectedNumber; i++) {
                  if (id === selectedUsers[i])  {
                    return true;
                  }
                }
                return false;
              }

              function _getUserArray(Obj) {
                var result = [];

                ng.forEach(Obj, function(value, key) {
                  if (!_isSelected(key)) {
                    result.push({
                      id: key,
                      fullName: value.full_name
                    });
                  }
                });

                return result;
              }
            };
          }
        };
      }
    ]);
})(angular);