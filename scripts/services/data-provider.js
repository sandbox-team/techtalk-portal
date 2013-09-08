;(function(ng) {
  'use strict';

  ng.module('tp.services')
  .provider('data', function() {
    

    this.$get = ['$http', '$q', function($http, $q) {
      var users;

      return {
       getSchedule: function(year, month) {
        return $http({
          method: 'GET',
          url: 'talks/' + year + '/' + month
        });
      },
      getTechtalkData: function(id) {
        return $http({
          method: 'GET',
          url: '/details/' + id
        });
      },
      getUser: function() {
        var defer = $q.defer();

        if (!users) {
          $http({
              method: 'GET',
              url: '/user'
            })
            .success(function(data) {
              users = data;
              defer.resolve(users);
            });
        }

        return defer.promise;
      }
    };
  }];
});

})(angular);