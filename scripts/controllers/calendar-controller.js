;(function(ng) {
  'use strict';

  ng.module('tp')
    .controller('CalendarCtrl', ['$scope', 'helper', 'data', '$location', '$routeParams', function($scope, helper, dataProvider, $location, $routeParams) {
      var now = new Date(),
        activeDate = new Date(),
        monthIndex = now.getMonth(),
        year, monthName, daysNumber, periodDescription;
        $scope.indexWeek = 0;
        $scope.global.pageTitle = 'Calendar view';

      $scope.getUserDescription = function(id) {
        return $scope.global.data.users[id];
      };
          $scope.next= function () {
              $scope.indexWeek++;
          }
          $scope.prev = function () {
              $scope.indexWeek--;
          }
        _change();

          function _change() {
              if ($location.path() == '/'){
                  $scope.indexDay = 1;
              } else {
                  var path = $location.path().split('/');
                  if(helper.getMonthIndex(path[3]) == '-1' || path[4] > 2099 || path[4] < 2011 || isNaN(path[4]) ||
                  isNaN(path[2]) || path[2] > 31 || path[2] < 1){
                    $location.path('/')
                  }
                  $scope.indexDay = path[2];
                  activeDate.setMonth(helper.getMonthIndex(path[3]));
                  activeDate.setYear(path[4]);
              }

              $scope.nextMonthUrl = helper.getMonthName(activeDate.getMonth() + 1, true);
              $scope.prevMonthUrl = helper.getMonthName(activeDate.getMonth() - 1, true);
              $scope.month = helper.getMonthName(activeDate.getMonth(), true);
              $scope.year = activeDate.getFullYear();
              $scope.nextYearUrl = activeDate.getFullYear();
              $scope.prevYearUrl = activeDate.getFullYear();
              if (!$scope.prevMonthUrl){
                  $scope.prevMonthUrl = 'Dec';
                  $scope.prevYearUrl -= 1
              }
              if (!$scope.nextMonthUrl){
                  $scope.nextMonthUrl = 'Jan';
                  $scope.nextYearUrl += 1
              }

              _update();
          }


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
            var i = 0;

            while(i <= daysNumber) {
                var date = new Date(i + helper.getMonthName(month, true) + year);
              periodDescription.dates.push({
                date: i,
                data: [],
                day: helper.getDayName(date.getDay())
              });
              i += 1;
            }

            delete periodDescription.dates[0];

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
             _initWeeks();
          }

          function _initWeeks () {
              var k = 0;

              $scope.week = [[],[],[],[],[],[]];

              for (var i = 1; i < $scope.schedule.dates.length; i ++){
                  if(! (~$scope.schedule.dates[i].day.indexOf('Sun'))){
                      $scope.week[k].push($scope.schedule.dates[i])
                  } else {
                      $scope.week[k].push($scope.schedule.dates[i])
                      k++;
                  }
              }
              for (var i = $scope.week.length-1; i > 3; i--){
                  if ($scope.week[i].length == 0){
                      $scope.week.length = i;
                  }
              }
                if ($scope.week[0].length != 7){
                    for (var i = $scope.week[0].length; i < 7; i++ ){
                        var fakeObj = {data: {},date: '-'};
                        fakeObj.day = helper.getDayName(7-i);
                        $scope.week[0].unshift(fakeObj);
                    }
                }
                  if ($scope.week[$scope.week.length-1].length != 7){
                      for (var i = $scope.week[$scope.week.length-1].length; i < 7; i++ ){
                          var fakeObj = {data: {},date: '-'};
                          fakeObj.day = helper.getDayName(7-i);
                          $scope.week[$scope.week.length-1].push(fakeObj);
                      }
                  }
              $scope.indexWeek = _getWeekNumber($scope.indexDay);
              if ($scope.week[$scope.indexWeek+1]){
                  $scope.nextIndexWeek = $scope.week[$scope.indexWeek+1][0].date;
              } else {
                  $scope.nextIndexWeek = 31;
              }
              if ($scope.week[$scope.indexWeek-1]){
                  $scope.prevIndexWeek = $scope.week[$scope.indexWeek-1][6].date;
              } else {
                  $scope.prevIndexWeek = 1;
              }
          }

          function _getWeekNumber (k) {
              console.log($scope.week[2][0]);
              for (var i = 0; i < $scope.week.length; i ++){
                  for (var j = 0; j < 7; j ++){
                    if($scope.week[i][j].date == k){
                        return i;
                    }
                  }
              }
          }

          function _setWeek () {
            $scope.currentWeek = $scope.week[$scope.indexWeek];
          }
          $scope.$watch('indexWeek', _setWeek)


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