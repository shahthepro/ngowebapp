(function () {
  'use strict';

  angular
    .module('orgs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('home', {
        abstract: true,
        url: '/',
        template: '<ui-view/>'
      })
      .state('orgs', {
        abstract: true,
        url: '/',
        template: '<ui-view/>'
      })
      .state('orgs.list', {
        url: '',
        templateUrl: 'modules/orgs/client/views/list-orgs.client.view.html',
        controller: 'OrgsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Orgs List'
        }
      });
  }

  getOrg.$inject = ['$stateParams', 'OrgsService'];

  function getOrg($stateParams, OrgsService) {
    return OrgsService.get({
      orgId: $stateParams.orgId
    }).$promise;
  }

  newOrg.$inject = ['OrgsService'];

  function newOrg(OrgsService) {
    return new OrgsService();
  }
}());
