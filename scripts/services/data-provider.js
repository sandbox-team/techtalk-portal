;(function(ng) {
  'use strict';

  ng.module('tp.services')
    .provider('data', function() {

      this.$get = ['$http', '$q', 'helper', '$resource',
        function($http, $q, helper, $resource) {
          return {
            talksResource: $resource('/data/talks/:id', {
                cardId:'@id'
              }, {
                charge: {
                  method:'POST',
                  params:{charge:true}
                }
              }
            ),
            getTalks: function() {
              return $http({
                method: 'GET',
                url: '/data/talks'
              });
            },
            getUsers: function() {
              var defer = $q.defer(),
                cachedUsers = helper.storage.get('users');

              if (!cachedUsers) {
                $http({
                    method: 'GET',
                    url: '/data/users'
                  })
                  .then(function(response) {
                    helper.storage.set('users', response.data);
                    defer.resolve(response.data);
                  });
              }

              return cachedUsers ? $q.when(cachedUsers) : defer.promise;
            },
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