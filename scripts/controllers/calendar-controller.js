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
        return $scope.global.data.users[id];
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
        var i = 1;

        while(i <= daysNumber) {
          periodDescription.dates.push({
            date: i,
            data: []
          });
          i += 1;
        }

        for (var key in $scope.global.data.talks) {
          var talk = $scope.global.data.talks[key];
          var talkDate = new Date(talk.date),
            date = talkDate.getDate();

          if(talkDate.getFullYear() == year && talkDate.getMonth() == month) {
            periodDescription.dates[date].data.push({
              _id: key,
              description: talk
            });
          }
        }

        //FETCH
        $scope.schedule = periodDescription;
      }

    }])
    .controller('NewsCtrl', ['$scope', 'helper', 'data', function($scope, helper, dataProvider){
      var page = 0,
          getPage;

      getPage = function(page){
          dataProvider
              .getNewsPage(page)
              .success(function(data) {
                  if(!data.length){
                      $scope.noMoreNews = true
                  }

                  $scope.news = $scope.news.concat(data);
              });
      }

      $scope.news = [];
      $scope.noMoreNews = false;
      $scope.viewMore = function($scope){
          page++;
          getPage(page);
      }

      getPage(page);
    }]);
  ;

})(angular);