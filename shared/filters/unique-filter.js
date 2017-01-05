(function() {
  'use strict';

  angular
    .module('umami')
    .filter('UniqueFilter', UniqueFilter);

  function UniqueFilter() {
    return function(items, filterOn) {
      if (filterOn === false) {
        return items;
      }
      if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
        var hashCheck = {};
        var newItems = [];
        var extractValueToCompare = function(item) {
          if (angular.isObject(item) && angular.isString(filterOn)) {
            return item[filterOn];
          } else {
            return item;
          }
        };
        angular.forEach(items, function(item) {
          var valueToCheck;
          var isDuplicate = false;
          for (var i = 0, len = newItems.length; i < len; i++) {
            if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
              isDuplicate = true;
              break;
            }
          }
          if (!isDuplicate) {
            newItems.push(item);
          }
        });
        items = newItems;
      }
      return items;
    }
  }
})();
