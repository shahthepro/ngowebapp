'use strict';

/**
 * Module dependencies
 */
var orgs = require('../controllers/orgs.server.controller');

module.exports = function(app) {
  // Orgs Routes
  app.route('/api/orgs')
    .get(orgs.list)
    .post(orgs.create);

  app.route('/api/orgs/search').post(orgs.search);

  // Finish by binding the Org middleware
  app.param('orgId', orgs.orgByID);
};
