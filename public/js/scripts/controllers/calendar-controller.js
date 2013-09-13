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

      $scope.global.pageTitle = 'Calendar view';

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

})(angular);