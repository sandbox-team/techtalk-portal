;(function(ng) {
  'use strict';

  ng.module('tp')
    .controller('CalendarCtrl', ['$scope', 'helper', 'data', function($scope, helper, dataProvider) {
      var now = new Date(),
        activeDate = new Date(),
        monthIndex = now.getMonth(),
        year, monthName, daysNumber, periodDescription;

      $scope.global.pageTitle = 'Calendar view';

      $scope.prevMonth = function() {
        activeDate.setMonth((monthIndex -= 1));
        _update();
        return monthIndex % 12;
      };

      $scope.nextMonth = function() {
        activeDate.setMonth((monthIndex += 1));
        _update();
        return monthIndex % 12;
      };

      $scope.getUserDescription = function(id) {
        var user;
        dataProvider.getUser().then(function(data) {
          user = data[id];
        });

        return user;
      };

      _update();

      function _update() {
        monthIndex = activeDate.getMonth();
        year = activeDate.getFullYear();
        monthName = helper.getMonthName(monthIndex);
        daysNumber = helper.getDaysInMonth(monthIndex, year);
        periodDescription = {
          month: monthName,
          year: year,
          dates: []
        };

        _initPeriod(year, monthIndex);
      }

      function _initPeriod(year, month) {

        dataProvider
          .getSchedule(year, month)
          .success(function(data) {
            var i = 1;
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
      }

    }]);

})(angular);