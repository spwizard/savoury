(function() {
  'use strict';

  angular
    .module('umami')
    .directive('geolocate', geolocate);

  geolocate.$inject = ['$http', '$state', '$window'];

  function geolocate($http, $state, $window) {
    return {
      link: function(scope, element) {
        var domElement = element[0];
        var text = domElement.getElementsByClassName('Geolocate-text')[0];
        var success = function success(position) {
          text.innerHTML = 'D e t e c t i n g …';
          var coords = position.coords;
          return $http.get('https://api.postcodes.io/postcodes?lon=' + coords.longitude + '&lat=' + coords.latitude)
          .then(function(response) {
            if (response.status === 200) {
              if (response.data.result) {
                domElement.className = 'Geolocate';
                return $state.go('umami.location.categories', {
                  out: (response.data.result[0].outcode).toLowerCase(),
                  in: (response.data.result[0].incode).toLowerCase(),
                });
              }
              throw new Error('No postcode found');
            }
          })
          .catch(function(error) {
            domElement.className = 'Geolocate';
            text.innerHTML = 'N o t&nbsp; a v a i l a b l e';
            if (error.data && error.data.error) {
              throw new Error(error.data.error);
            }
          });
        };
        var error = function error(positionError) {
          domElement.className = 'Geolocate';
          text.innerHTML = 'N o t&nbsp; a v a i l a b l e';
          throw new Error(positionError.message);
        };
        domElement.onclick = function getPosition() {
          if (!$window.navigator.geolocation) {
            text.innerHTML = 'N o t&nbsp; a v a i l a b l e';
            return false;
          }
          domElement.className += ' is-locating';
          if ($window.navigator.permissions) {
            $window.navigator.permissions.query({
              name: 'geolocation'
            })
            .then(function(result) {
              if (result.state === 'granted') {
                text.innerHTML = 'D e t e c t i n g …';
              } else {
                text.innerHTML = 'P l e a s e&nbsp; a u t h o r i s e …';
              }
              result.onchange = function() {
                if (result.state === 'granted') {
                  text.innerHTML = 'D e t e c t i n g …';
                }
              }
              $window.navigator.geolocation.getCurrentPosition(success, error);
            });
          } else {
            text.innerHTML = 'P l e a s e&nbsp; a u t h o r i s e …';
            $window.navigator.geolocation.getCurrentPosition(success, error);
          }
        };
      }
    };
  }
})();
