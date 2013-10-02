;(function(ng) {
  'use strict';

  ng.module('tp.services')
    .provider('data', function() {

      this.$get = ['$http', '$q', 'helper', '$resource',
        function($http, $q, helper, $resource) {
          return {
            Talk: $resource('/api/techtalk/:id', {id: '@id'}, {
              update: {method: 'PUT'}
            }),
            User: $resource('/api/user/:email', {
              email: '@email'
            }),
            Post: $resource('/api/news?id=:id', {id: '@id'}, {
              update: {method: 'PUT'}
            }),

            getNewsPage: function(page) {
              return $http({
                method: 'GET',
                url: '/api/news/',
                params: {
                  page: page
                }
              });
            }
          };
      }];
  });

})(angular);