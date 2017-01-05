(function() {
  'use strict';
  angular
    .module('umami')
    .service('CustomSortService', CustomSortService);

  CustomSortService.$inject = ['$filter'];

  function CustomSortService($filter) {
    return {
      restaurants: function() {
        return function(restaurant) {
          if (restaurant.providers[0].type === 'Domino’s') {
            return -4;
          }
          return -($filter('UniqueFilter')(restaurant.providers, 'type').length);
        }
      }
    }
  }
})();
