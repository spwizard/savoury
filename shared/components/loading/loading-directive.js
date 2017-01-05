(function() {
  'use strict';

  angular
    .module('umami')
    .directive('loading', loading);

  function loading() {
    return {
      templateUrl: '/shared/components/loading/loading.html'
    };
  }
})();