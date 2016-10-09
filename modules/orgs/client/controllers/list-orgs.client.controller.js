(function () {
  'use strict';

  angular
    .module('orgs')
    .controller('OrgsListController', OrgsListController);

  OrgsListController.$inject = ['$scope', 'OrgsService', 'DTOptionsBuilder', 'DTColumnBuilder', '$http', '$q'];

  function OrgsListController($scope, OrgsService, DTOptionsBuilder, DTColumnBuilder, $http, $q) {
    var vm = this;

    vm.completedata = {};
    vm.dataLoaded = true;
    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
      var defer = $q.defer();
      $http.get('/api/orgs').then(function(result) {
        defer.resolve(result.data);
        vm.completedata = result.data;
      });
      return defer.promise;
    }).withPaginationType('full_numbers').withOption('searching', false);

    vm.dtColumns = [
      DTColumnBuilder.newColumn('name').withTitle('Name'),
      DTColumnBuilder.newColumn('regn').withTitle('Reg. No., State & City'),
      DTColumnBuilder.newColumn('chief').withTitle('Chief'),
      DTColumnBuilder.newColumn('address').withTitle('Address'),
      DTColumnBuilder.newColumn('sectors').withTitle('Sectors')
    ];

    vm.orgs = OrgsService.query();
    vm.SearchByCol = function (colID, searchText) {
      // vm.dtInstance.DataTable.search('searchText').draw();
      vm.dataLoaded = false;
      if (searchText === '' || searchText.length < 1 || searchText === undefined) {
        vm.dtInstance.changeData(function() {
          var defer = $q.defer();
          $http.get('/api/orgs/').then(function(result) {
            defer.resolve(result.data);
            vm.dataLoaded = true;
          });
          return defer.promise;
        });
      } else {
        vm.dtInstance.changeData(function() {
          var defer = $q.defer();
          $http.post('/api/orgs/search/', { columnID: colID, searchText: searchText }).then(function(result) {
            defer.resolve(result.data);
            vm.dataLoaded = true;
          });
          return defer.promise;
        });
      }
    };

    vm.dtInstance = {};

    vm.dtInstanceCallback = function(dtInstance) {
      vm.dtInstance = dtInstance;
    };

  }
}());
