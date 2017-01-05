/* is image directive */

(function() {
  'use strict';

  angular
    .module('umami')
    .directive('isImage', isImage);

  function isImage() {
    return {
      link: function(scope, element, attrs) {

        var image = new Image(),
            domElement = element[0];

        image.src = attrs.img;

        image.onerror = function() {
          element.remove();
        };
        image.onload = function() {
          image.className = attrs.klass;
          domElement.appendChild(image);

          // TO DO break images
          domElement.parentNode.parentNode.className = 'CategoryList-item';
        };
      }
    };
  }
})();