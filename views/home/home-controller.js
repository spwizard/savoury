(function() {
  'use strict';

  angular
    .module('umami')
    .controller('HomeCtrl', HomeCtrl);

  HomeCtrl.$inject = ['$scope', '$rootScope', '$state', '$filter', 'FormService'];

  function HomeCtrl($scope, $rootScope, $state, $filter, FormService) {
    $scope.searchPostcode = function searchPostcode($event) {
      $rootScope.isError = false;
      if ($scope.PostcodeSearchForm.$invalid) {
        FormService.invalidSubmission($event.target);
        return;
      }
      var postcode = $scope.postcode.replace(/ /g,'').toLowerCase();
      $state.go('umami.location.categories', {
        out: postcode.substring(0, postcode.length - 3),
        in: postcode.substring(postcode.length - 3),
      });
    };
  }
})();
