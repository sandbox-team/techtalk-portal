;(function(ng) {
  'use strict';

  ng.module('tp.services')
    .provider('data', function() {

      this.$get = ['$http', '$q', 'helper', '$resource',
        function($http, $q, helper, $resource) {
          return {
            Talk: $resource('/portal/api/techtalk/:id', {id: '@id'}, {
              update: {method: 'PUT'}
            }),
            User: $resource('/portal/api/user/:email', {
              email: '@email'
            }),
            Post: $resource('/portal/api/news?id=:id', {id: '@id'}, {
              update: {method: 'PUT'}
            }),

            getNewsPage: function(page) {
              return $http({
                method: 'GET',
                url: '/portal/api/news/',
                params: {
                  page: page
                }
              });
            }
          };
      }];
  });

})(angular);