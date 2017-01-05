(function() {
  'use strict';
  angular
    .module('umami')
    .service('ApiService', ApiService);

  ApiService.$inject = ['$http', 'envService', 'StoreModelService'];

  function ApiService($http, envService, StoreModelService) {

    var API_BASE = envService.read('api');

    return {
      getAll: function(resourceName, filter) {
        return $http.get(API_BASE + resourceName + '/' + filter)
        .then(function(response) {
          return StoreModelService[resourceName] = response.data[resourceName];
        });
      },
      post: function(resourceName, payLoad) {
        return $http.post(API_BASE + resourceName, payLoad)
        .then(function(response) {
          return response;
        });
      },
    };
  }
})();