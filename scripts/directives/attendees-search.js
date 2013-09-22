;(function(ng) {
  'use strict';

  ng.module('tp.directives')
    .directive('tpAttendeesSearch', ['$filter', '$rootScope',
      function($filter, $rootScope) {
        return {
          replace: false,
          template: [
            '<div>',
              '<span class="badge badge-success"', 
                'data-ng-repeat="user in selected | orderBy:\'name\'"',
                'data-ng-click="remove(user);"', 
                'data-ng-bind="user.name"></span>',
            '</div>',
            '<div class="searchWrap">',
              '<input type="text" data-ng-model="searchInput" data-ng-change="search();"/>',
              '<div class="well" data-ng-show="filtered.length">',
                '<a href="" data-ng-repeat="user in filtered | orderBy:\'name\'" data-ng-bind="user.name" data-ng-click="select(user);"></a>',
              '</div>',  
            '</div>'
          ].join(''),
          scope: {
            available: '=tpAutocomplete',
            selected: '=selected'
          },
          compile: function(element, attr, linker) {
            return function($scope, $element, $attr) {
              var availableArray = _getUserArray($scope.available);

              $scope.selected = _processSelectedAttendees($scope.selected);

              $scope.search = function() {
                $scope.filtered = $scope.searchInput ? $filter('filter')(availableArray, {name: $scope.searchInput}) : [];
              };

              $scope.select = function(user) {
                availableArray.splice(availableArray.indexOf(user), 1);
                $scope.search();
                $scope.selected.push(user);
              };

              $scope.remove = function(user) {
                $scope.selected.splice($scope.selected.indexOf(user), 1);
                availableArray.push(user);
              };

              function _getUserArray(Obj) {
                var result = [];

                ng.forEach(Obj, function(value, key) {
                  result.push({
                    id: key,
                    name: value.full_name
                  })  
                });

                return result;
              }

              function _processSelectedAttendees(attendees) {
                var result = [];

                ng.forEach(attendees, function(value, i) {
                  result.push({
                    id: value,
                    name: $rootScope.global.users[value].full_name
                  })  
                });

                return result;  
              }
            };
          }
        };
      }
    ]);
})(angular);