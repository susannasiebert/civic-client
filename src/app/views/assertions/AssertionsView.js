(function() {
  'use strict';
  angular.module('civic.assertions')
    .config(assertionsConfig);

  // @ngInject
  function assertionsConfig($stateProvider) {
    $stateProvider
      .state('assertions', {
        abstract: true,
        url: '/assertions/:assertionId',
        template: '<ui-view id="assertions-view"></ui-view>',
        data: {
          titleExp: '"Assertions"',
          navMode: 'sub'
        }
      })
      .state('assertions.summary', {
        url: '/summary',
        templateUrl: 'app/views/assertions/summary/assertionsSummary.tpl.html',
        controller: 'AssertionsSummaryController',
        data: {
          titleExp: '"Assertion " + assertion.name',
          navMode: 'sub'
        },
        resolve: /* @ngInject */ {
          assertion: function(Assertions, $stateParams) {
            return Assertions.get($stateParams.assertionId);
          },
          myVariantInfo: function(assertion, Variants) {
            return Variants.getMyVariantInfo(assertion.variant.id);
          }
        }
      });
  }

})();
