'use strict';

describe('Orgs E2E Tests:', function () {
  describe('Test Orgs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/orgs');
      expect(element.all(by.repeater('org in orgs')).count()).toEqual(0);
    });
  });
});
