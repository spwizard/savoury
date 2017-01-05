(function() {
  angular
  .module('umami', [
    'ui.router',
    'lodash',
    'environment'
  ])
  .config([
    '$compileProvider',
    '$httpProvider',
    '$locationProvider',
    '$stateProvider',
    '$urlRouterProvider',
    'envServiceProvider',
    function($compileProvider,
             $httpProvider,
             $locationProvider,
             $stateProvider,
             $urlRouterProvider,
             envServiceProvider) {

      envServiceProvider.config({
        domains: {
          local: ['localhost'],
          live: [
            'savory.frfrm.com'
          ]
        },
        vars: {
          local: {
            api: 'http://localhost:8081/api/'
          },
          live: {
            api: 'https://umami-api.frfrm.com/api/'
          }
        }
      });

      envServiceProvider.check();

      //$compileProvider.debugInfoEnabled(false);

      /*$httpProvider.defaults.cache = false;

      if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
      }

      $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';*/

      $locationProvider.html5Mode({
        enabled: true,
        hashPrefix: '!',
        requireBase: false
      });

      $stateProvider
      .state('umami', {
        url: '/',
        views: {
          'main@': {
            templateUrl: '/views/home/home.html',
            controller: 'HomeCtrl'
          }
        }
      })
      .state('umami.location', {
        url: 'location/:out/?in',
        abstract: true,
        resolve: {
          restaurants: [
            '$rootScope', '$stateParams', 'ApiService',
            function($rootScope, $stateParams, ApiService) {
              var location = $stateParams.out + ($stateParams.in ? ('/' + $stateParams.in) : '');
              $rootScope.isError = false;
              $rootScope.isLoading = true;
              return ApiService.getAll('restaurants', location)
              .then(function(response) {
                $rootScope.isLoading = false;
                return response;
              })
              .catch(function(error) {
                $rootScope.isLoading = false;
                handleRouteError(error);
              });
            }
          ]
        },
      })
      .state('umami.location.categories', {
        url: 'categories/',
        views: {
          'main@': {
            templateUrl: '/views/categories/categories.html',
            controller: 'CategoriesCtrl'
          }
        }
      })
      .state('umami.location.categories.category', {
        url: ':category/',
        views: {
          'main@': {
            templateUrl: '/views/categories/category/category.html',
            controller: 'CategoryCtrl'
          }
        }
      })
      .state('umami.location.restaurant', {
        url: 'restaurants/:restaurant/',
        views: {
          'main@': {
            templateUrl: '/views/restaurant/restaurant.html',
            controller: 'RestaurantCtrl'
          }
        },
        params: {
          category: null
        },
        resolve: {
          restaurant: [
            '$rootScope', '$stateParams', 'ApiService', 'StoreModelService', 'restaurants',
            function($rootScope, $stateParams, ApiService, StoreModelService, restaurants) {
              var restaurant = StoreModelService.getRestaurantBySlug($stateParams.restaurant);
              $rootScope.isLoading = true;
              return ApiService.post('restaurants/detail', restaurant.detail)
              .then(function(response) {
                $rootScope.isLoading = false;
                restaurant.providers = response.data.results;
                restaurant.factual = response.data.factual && response.data.factual[0];
                return restaurant;
              })
              .catch(function(error) {
                $rootScope.isLoading = false;
                handleRouteError(error);
              });
            }
          ]
        },
      });

      $urlRouterProvider
      .rule(function ($injector, $location) {
        var path = $location.url();

        if (path[path.length - 1] === '/' || path.indexOf('/?') > -1) {
          return;
        }

        if (path.indexOf('?') > -1) {
          return path.replace('?', '/?');
        }

        return path + '/';
      })
      .otherwise('/');
    }
  ])
  .run([
    '$rootScope', '$state', '$location', '$timeout', '$window', '$anchorScroll',
    function($rootScope, $state, $location, $timeout, $window, $anchorScroll) {

      var scrollState = {};
      var saveScrollState = true;
      var scrollOffset = 0;
      var popped = false;

      $window.onpopstate = function() {
        popped = true;
      };

      $window.onscroll = function() {
        if (saveScrollState) {
          scrollState[$location.path()] = $window.pageYOffset;
        }
      };

      $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState) {
          saveScrollState = false;
        }
      );

      $rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams) {

          $rootScope.viewName = (toState.name).replace(/\./g, '-');

          if (fromState.name) {
            $rootScope.navigated = true;
          }

          $timeout(function() {
            var path;
            if (popped) {
              $location.search('anchor', null);
              path = $location.path();
              $window.scrollTo(0, scrollState[path] ? scrollState[path] : 0);
              popped = false;
            } else {
              if (toParams.anchor) {
                $anchorScroll.yOffset = scrollOffset;
                $anchorScroll(toParams.anchor);
              } else {
                $window.scrollTo(0, 0);
              }
            }
            saveScrollState = true;
          });
        }
      );

      $rootScope.$on('$stateChangeError',
        function (event, toState, toParams, fromState, fromParams, error) {
          if (error.message === 'Not available' ||
              error.message === 'Postcode service unavailable') {
            // fail whale!
            $rootScope.isError = error.message
            return $state.go('umami');
          }
          if (error.message === 'Invalid postcode') {
            $rootScope.isError = error.message;
            return $state.go('umami');
          }
          throw error;
        }
      );
    }
  ]);

  function handleRouteError(error) {
    throw new Error((error.data && error.data.errors && error.data.errors[0].detail) || 'Not available');
  }
})();
