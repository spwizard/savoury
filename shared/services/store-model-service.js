(function() {
  'use strict';
  angular
    .module('umami')
    .service('StoreModelService', StoreModelService);

  StoreModelService.$inject = ['$filter', '_'];

  function StoreModelService($filter, _) {

    return {
      restaurants: {
        results: [],
        location: {},
        created_at: null
      },
      getCategories: function() {
        var results = this.restaurants.results;
        var allCategories = [].concat.apply([], results.map(function(value) {
          return value.cuisines;
        }));
        var minCategories = _.uniqBy(results.map(function(value) {
          return value.cuisines.reduce(function(previous, current) {
            return previous.priority < current.priority ? previous : current;
          });
        }), 'name');
        var priorityCategories = (_.uniqBy(allCategories, 'name')).filter(function(value) {
          return value.priority === 1;
        });
        var displayCategories = _.uniqBy(minCategories.concat(priorityCategories), 'name');
        var categories = [];
        for (var i = 0, len = displayCategories.length; i < len; i++) {
          var displayCategory = displayCategories[i];
          categories.push({
            name: displayCategory.name,
            slug: displayCategory.slug,
            count: allCategories.reduce(function(n, category) {
              return n + (category.name === displayCategory.name);
            }, 0)
          });
        }
        return $filter('orderBy')(categories, 'count', true);
      },
      getCategoryBySlug: function(slug) {
        if (!slug || slug === 'all') {
          return {name: 'All restaurants', slug: 'all', type: 'ALL'};
        }
        return this.getCategories().filter(function(obj) {
          return obj.slug === slug;
        })[0];
      },
      getRestaurantBySlug: function(slug) {
        var restaurant = this.restaurants.results.filter(function(obj) {
          return obj.slug === slug;
        })[0];

        // TODO: providerUrls shape should be returned from api
        if (!restaurant) {
          return false;
        }
        restaurant.detail = {};
        restaurant.detail.name = restaurant.name;
        var providers = _.groupBy(restaurant.providers, 'type');
        var providerUrls = [];
        for (var property in providers) {
          if (providers.hasOwnProperty(property)) {
            var details = providers[property];
            var urls = [];
            for (var i = 0, len = details.length; i < len; i++) {
              urls.push(details[i].url);
            }
            providerUrls.push({
              provider: $filter('SlugifyFilter')(property),
              urls: urls,
            });
          }
        }
        restaurant.detail.providerUrls = providerUrls;

        return restaurant;
      },
      getRestaurantsByCategorySlug: function(slug) {
        if (slug === 'all') {
          return this.restaurants.results;
        }
        return this.restaurants.results.filter(function(obj) {
          return obj.cuisines.filter(function(obj){
            return obj.slug === slug;
          }).length;
        });
      }
    }
  }
})();
