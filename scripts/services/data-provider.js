;(function(ng) {
  'use strict';

  ng.module('tp.services')
  .provider('data', function() {
    

    this.$get = ['$http', '$q', function($http, $q) {
      return {
        getAll: function() {
          return $http({
            method: 'GET',
            url: '/data/all'
          });
        }
      };
  }];
});

})(angular);