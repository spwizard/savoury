(function() {
  'use strict';

  angular
    .module('umami')
    .controller('RestaurantCtrl', RestaurantCtrl);

  RestaurantCtrl.$inject = ['$scope', '$state', '$stateParams', 'StoreModelService', 'restaurant'];

  function RestaurantCtrl($scope, $state, $stateParams, StoreModelService, restaurant) {
    $scope.vm = {};
    $scope.vm.location = StoreModelService.restaurants.location;
    $scope.vm.category = StoreModelService.getCategoryBySlug($stateParams.category);
    $scope.vm.restaurant = restaurant;

    console.log(restaurant)

    if (!$scope.vm.restaurant) {
      $state.go('umami.location.categories');
    }
  }
})();
