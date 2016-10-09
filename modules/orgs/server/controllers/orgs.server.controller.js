'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Org = mongoose.model('Org'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Org
 */
exports.create = function(req, res) {
  var org = new Org(req.body);
  org.user = req.user;

  org.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(org);
    }
  });
};

/**
 * List of Orgs
 */
exports.list = function(req, res) {
  Org.find().sort('-created').limit(100).exec(function(err, orgs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(orgs);
    }
  });
};

/**
 * Search Orgs
 */
exports.search = function(req, res) {
  var colID = req.columnID;
  var searchText = req.searchText;
  console.log('SEarchText' + req.body.searchText);
  Org.find({ colID: new RegExp('[^]*' + searchText + '[^]*', 'i') }).exec(function(err, orgs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(orgs);
    }
  });
};

/**
 * Org middleware
 */
exports.orgByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Org is invalid'
    });
  }

  Org.findById(id).populate('user', 'displayName').exec(function (err, org) {
    if (err) {
      return next(err);
    } else if (!org) {
      return res.status(404).send({
        message: 'No Org with that identifier has been found'
      });
    }
    req.org = org;
    next();
  });
};
