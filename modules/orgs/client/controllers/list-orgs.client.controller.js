(function () {
  'use strict';

  angular
    .module('orgs')
    .controller('OrgsListController', OrgsListController);

  OrgsListController.$inject = ['$scope', 'OrgsService', '$http'];

  function OrgsListController($scope, OrgsService, $http) {
    var vm = this;

    vm.searchInProgress = false;
    vm.hasMoreResults = false;
    vm.paged = 0;
    vm.lastColID = '';
    vm.lastSearchText = '';

    vm.searchResults = [];

    vm.firstSearchDone = false;

    vm.doSearch = function(colID, searchText) {
      vm.lastColID = colID;
      vm.lastSearchText = searchText;
      vm.paged = 1;
      performSearch(colID, searchText, 1);
    };

    vm.loadMoreResults = function() {
      vm.paged = vm.paged + 1;
      performSearch(vm.lastColID, vm.lastSearchText, vm.paged);
    };

    function performSearch(colID, searchText, pageNo) {
      vm.firstSearchDone = true;
      vm.hasMoreResults = false;
      vm.searchInProgress = true;
      $http.post('/api/orgs/search', { 'columnID': colID, 'searchText': searchText, 'paged': pageNo }).then(function(result) {
        vm.searchInProgress = false;
        if (pageNo === 1) {
          vm.searchResults = result.data;
        } else {
          vm.searchResults = vm.searchResults.concat(result.data);
        }
        vm.hasMoreResults = result.data.length === 10;
      });
    }

  }
}());
