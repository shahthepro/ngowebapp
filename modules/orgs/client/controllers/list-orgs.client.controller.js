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
    }).withPaginationType('full_numbers').withOption('searching', true).withOption('initComplete', function() {
      $('.dataTables_filter').append('<select style="margin: 0px 10px; padding: 1px; height: 24px; border: 1px solid #E4E4E4; border-radius: 3px;" id="searchByCol">' +
        '<option value="-1">--- Search By ---</option>' +
        '<option value="0">Name</option>' +
        '<option value="1">Registration no., City & State</option>' +
        '<option value="2">Chief</option>' +
        '<option value="3">Address</option>' +
        '<option value="4">Sectors</option>' +
        '</select>');
      $('<button/>').text('Search').attr('id', 'new-search').attr('style', 'margin: 0px 5px; height: 24px; padding: 1px 12px; border: 1px solid #E4E4E4; border-radius: 3px;').appendTo('.dataTables_filter');
      $('.dataTables_filter input').unbind();
      $('#new-search').on('click', function() {
        if ($('#searchByCol').val() === '-1' || $('#searchByCol').val() < 0) {
          vm.dtInstance.DataTable.search($('.dataTables_filter input').val()).draw();
        } else {
          vm.dtInstance.DataTable.column($('#searchByCol').val()).search($('.dataTables_filter input').val()).draw();
        }
      });
    });

    vm.dtColumns = [
      DTColumnBuilder.newColumn('name').withTitle('Name'),
      DTColumnBuilder.newColumn('regn').withTitle('Reg. No., State & City'),
      DTColumnBuilder.newColumn('chief').withTitle('Chief'),
      DTColumnBuilder.newColumn('address').withTitle('Address'),
      DTColumnBuilder.newColumn('sectors').withTitle('Sectors')
    ];
    vm.dtInstance = {};
    vm.orgs = OrgsService.query();
    vm.SearchByCol = function (colID, searchText) {
      vm.dtInstance.DataTable.search(searchText).draw();
    };

    vm.dtInstance = {};

    vm.dtInstanceCallback = function(dtInstance) {
      vm.dtInstance = dtInstance;
    };

  }
}());
