(function() {
  'use strict';

  angular
    .module('umami')
    .directive('error', error);

  function error() {
    return {
      templateUrl: '/shared/components/error/error.html'
    };
  }
})();