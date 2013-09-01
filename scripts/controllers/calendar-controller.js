;(function(ng) {
  'use strict';

  ng.module('tp')
    .controller('CalendarCtrl', ['$scope', 'helper', function($scope, helper) {
      $scope.dates = getPeriodDescription();

      function getPeriodDescription() {
        var now = new Date(),
          monthIndex = now.getMonth(),
          year = now.getFullYear(),
          monthName = helper.getMonthName(monthIndex),
          daysNumber = helper.getDaysInMonth(monthIndex, year),
          i = 1,
          periodDescription = [];

        while(i <= daysNumber) {
          periodDescription.push({
            date: i,
            month: monthName,
            year: year
          });
        }

        return periodDescription;
      }
    }]);

})(angular);