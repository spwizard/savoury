(function() {
  'use strict';

  angular
    .module('umami')
    .filter('FriendlyUrlFilter', FriendlyUrlFilter);

  function FriendlyUrlFilter() {
    return function(value) {
      if (value.indexOf('hungryhouse.co.uk') != -1) {
        return '';
      }
      return value.toString().toLowerCase()
      .replace('http://', '')
      .replace('https://', '')
      .replace(/\/$/, '');
    };
  }
})();