(function() {
  'use strict';
  angular.module('civic.services')
    .factory('AssertionsResource', AssertionsResource)
    .factory('Assertions', AssertionsService);

  // @ngInject
  function AssertionsResource($resource, $cacheFactory) {
    var cache = $cacheFactory.get('$http');

    return $resource('/api/assertions',
      {},
      {
        query: {
          url: '/api/assertions',
          method: 'GET',
          isArray: true,
          cache: cache
        },
        get: {
          url: '/api/assertions/:assertionId',
          method: 'GET',
          isArray: false,
          cache: cache
        },
        add: {
          method: 'POST',
          cache: false
        },
        accept: {
          url: '/api/assertions/:assertionId/accept',
          params: {
            assertionId: '@assertionId'
          },
          method: 'POST',
          cache: false
        },
        reject: {
          url: '/api/assertions/:assertionId/reject',
          params: {
            assertionId: '@assertionId'
          },
          method: 'POST',
          cache: false
        },
        queryAcmgCodes: {
          url: '/api/acmg_codes',
          method: 'GET',
          isArray: true,
          cache: true
        }
      }
    );
  }

  // @ngInject
  function AssertionsService(AssertionsResource, $cacheFactory) {
    var cache = $cacheFactory.get('$http');

    var collection = { };
    var item = { };
    var acmg_codes = [];

    return {
      data: {
        item: item,
        collection: collection,
        acmg_codes: acmg_codes
      },
      query: query,
      get: get,
      add: add,
      accept: accept,
      reject: reject,
      queryAcmgCodes: queryAcmgCodes
    };

    function query() {
      return AssertionsResource.query().$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }

    function get(id) {
      return AssertionsResource.get({assertionId: id}).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }

    function add(reqObj) {
      return AssertionsResource.add(reqObj).$promise
        .then(function(response) {
          return response.$promise;
        });
    }

    function accept(id) {
      return AssertionsResource.accept({ assertionId: id}).$promise
        .then(function(response) {
          // flush cached assertion and variant
          cache.remove('/api/assertions');
          cache.remove('/api/assertions/' + response.id);
          cache.remove('/api/variants/' + response.variant.id);

          // reload assertion
          get(response.id);

          return response.$promise;
        });
    }

    function reject(id) {
      return AssertionsResource.reject({ assertionId: id }).$promise
        .then(function(response) {
          // flush cached assertion and variant
          cache.remove('/api/assertions');
          cache.remove('/api/assertions/' + response.id);
          cache.remove('/api/variants/' + response.variant.id);

          // reload assertion
          get(response.id);

          return response.$promise;
        });
    }

    function queryAcmgCodes() {
      return AssertionsResource.queryAcmgCodes().$promise
        .then(function(response) {
          angular.copy(response, acmg_codes);
          return response.$promise;
        });
    }
  }
})();
