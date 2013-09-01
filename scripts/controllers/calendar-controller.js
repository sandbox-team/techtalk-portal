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
          daysNumber = getDaysInMonth(monthIndex, year),
          i = 1,
          periodDescription = [];

        while(i <= daysNumber) {
          periodDescription.push({
            date: i,
            month: monthName,
            year: year
          });
        }
debugger;
        return periodDescription;
      }

      //if you are using the format(first month has 1 index) set useHumanReadableMonthBase to true
      function getDaysInMonth(month, year, useHumanReadableMonthBase) {
        return new Date(year, month + useHumanReadableMonthBase ? 0 : 1, 0).getDate();
      }
    }]);

})(angular);