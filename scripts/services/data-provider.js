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
        },
        getNewsPage: function(page) {
            return $http({
                method: 'GET',
                url: '/news/' + parseInt(page)
            })
        },
        getPost: function(slug){
            return $http({
                method: 'GET',
                url: '/new/' + encodeURI(slug)
            })
        }
      };
  }];
});

})(angular);