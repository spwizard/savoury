(function() {
  'use strict';
  angular
    .module('lodash', [])
    .service('_', _);

  function _() {
    return window._;
  }
})();