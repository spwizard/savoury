(function() {
  'use strict';

  angular
    .module('umami')
    .controller('CategoryCtrl', CategoryCtrl);

  CategoryCtrl.$inject = ['$scope', '$state', '$stateParams', 'StoreModelService', 'CustomSortService'];

  function CategoryCtrl($scope, $state, $stateParams, StoreModelService, CustomSortService) {
    $scope.vm = {};
    $scope.vm.location = StoreModelService.restaurants.location;
    $scope.vm.category = StoreModelService.getCategoryBySlug($stateParams.category);
    $scope.vm.restaurants = StoreModelService.getRestaurantsByCategorySlug($stateParams.category);
    $scope.restaurantsOrder = CustomSortService.restaurants;

    if (!$scope.vm.category) {
      $state.go('umami.location.categories');
    }
  }
})();