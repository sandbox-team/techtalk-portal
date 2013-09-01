;(function(ng) {
  'use strict';

  ng.module('tp.services')
  .provider('data', function() {

   this.$get = ['$http', function($http) {
    return {
     getSchedule: function() {
      return $http({
        method: 'GET',
        url: 'test'
      });
    },
    getTechtalkData: function(id) {
      return $http({
        method: 'GET',
        url: '/details/' + id
      });
    }
  };
}];
});

})(angular);