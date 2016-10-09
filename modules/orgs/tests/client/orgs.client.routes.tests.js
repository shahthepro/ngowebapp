(function () {
  'use strict';

  describe('Orgs Route Tests', function () {
    // Initialize global variables
    var $scope,
      OrgsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _OrgsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      OrgsService = _OrgsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('orgs');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/orgs');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          OrgsController,
          mockOrg;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('orgs.view');
          $templateCache.put('modules/orgs/client/views/view-org.client.view.html', '');

          // create mock Org
          mockOrg = new OrgsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Org Name'
          });

          // Initialize Controller
          OrgsController = $controller('OrgsController as vm', {
            $scope: $scope,
            orgResolve: mockOrg
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:orgId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.orgResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            orgId: 1
          })).toEqual('/orgs/1');
        }));

        it('should attach an Org to the controller scope', function () {
          expect($scope.vm.org._id).toBe(mockOrg._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/orgs/client/views/view-org.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          OrgsController,
          mockOrg;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('orgs.create');
          $templateCache.put('modules/orgs/client/views/form-org.client.view.html', '');

          // create mock Org
          mockOrg = new OrgsService();

          // Initialize Controller
          OrgsController = $controller('OrgsController as vm', {
            $scope: $scope,
            orgResolve: mockOrg
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.orgResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/orgs/create');
        }));

        it('should attach an Org to the controller scope', function () {
          expect($scope.vm.org._id).toBe(mockOrg._id);
          expect($scope.vm.org._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/orgs/client/views/form-org.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          OrgsController,
          mockOrg;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('orgs.edit');
          $templateCache.put('modules/orgs/client/views/form-org.client.view.html', '');

          // create mock Org
          mockOrg = new OrgsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Org Name'
          });

          // Initialize Controller
          OrgsController = $controller('OrgsController as vm', {
            $scope: $scope,
            orgResolve: mockOrg
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:orgId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.orgResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            orgId: 1
          })).toEqual('/orgs/1/edit');
        }));

        it('should attach an Org to the controller scope', function () {
          expect($scope.vm.org._id).toBe(mockOrg._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/orgs/client/views/form-org.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
