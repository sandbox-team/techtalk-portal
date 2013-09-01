;(function(ng) {
  'use strict';

  ng.module('tp')
    .controller('CalendarCtrl', ['$scope', 'helper', 'data', function($scope, helper, dataProvider) {
      var now = new Date(),
        monthIndex = now.getMonth(),
        year = now.getFullYear(),
        monthName = helper.getMonthName(monthIndex),
        daysNumber = helper.getDaysInMonth(monthIndex, year),
        i = 1,
        periodDescription = {
          month: monthName,
          year: year,
          dates: []
        };


      dataProvider
        .getSchedule()
        .success(function(data) {
          console.log(data);
          while(i <= daysNumber) {
            var techtalkData = data[i],
              dayDescription = {
                date: i
              };

            techtalkData && (dayDescription.data = techtalkData);  
            periodDescription.dates.push(dayDescription);
            i += 1;
          }

          //FETCH
          $scope.schedule = periodDescription;
        })
        .error(function() {
          console.log('ERROR: ', arguments);
        });

    }]);

})(angular);