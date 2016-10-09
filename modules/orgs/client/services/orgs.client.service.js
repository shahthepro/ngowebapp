// Orgs service used to communicate Orgs REST endpoints
(function () {
  'use strict';

  angular
    .module('orgs')
    .factory('OrgsService', OrgsService);

  OrgsService.$inject = ['$resource'];

  function OrgsService($resource) {
    return $resource('api/orgs/:orgId', {
      orgId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
