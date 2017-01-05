(function() {
  'use strict';

  angular
    .module('umami')
    .controller('CategoriesCtrl', CategoriesCtrl);

  CategoriesCtrl.$inject = ['$scope', 'StoreModelService'];

  function CategoriesCtrl($scope, StoreModelService) {
    $scope.vm = {};
    $scope.vm.location = StoreModelService.restaurants.location;
    $scope.vm.restaurants = StoreModelService.restaurants.results;
    $scope.vm.categories = StoreModelService.getCategories();
  }
})();
