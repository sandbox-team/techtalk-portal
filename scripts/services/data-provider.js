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
            getNewsPage: function(page) {
              return $http({
                method: 'GET',
                url: '/news/' + parseInt(page)
              });
            },
            getPost: function(slug){
              return $http({
                method: 'GET',
                url: '/new/' + encodeURI(slug)
              });
            }
          };
      }];
  });

})(angular);