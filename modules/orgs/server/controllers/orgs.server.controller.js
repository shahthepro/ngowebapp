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

exports.bulkinsert = function(req, res) {
  var docs = JSON.parse(req.body.documents);
  // console.log(docs);
  var orgs_docs = [];
  docs.forEach(function(doc, inedx) {
    orgs_docs.push(new Org(doc));
  });
  Org.insertMany(orgs_docs, function(err, orgs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      return res.status(200).send();
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
  var colID = req.body.columnID;
  var searchText = req.body.searchText;
  var paged = req.body.paged * 10;

  if (colID === undefined || colID === '' || searchText === undefined || searchText === '') {
    Org.find().limit(10).skip(paged).exec(function(err, orgs) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(orgs);
      }
    });
  } else {

    var terms = searchText.split(' ');
    var regexString = '';
    for (var i = 0; i < terms.length; i++) {
      regexString += terms[i];
      if (i < terms.length - 1) regexString += '|';
    }
    var escapeSeq = '[.\\w\\W\\s\\S]*';
    regexString = escapeSeq + regexString + escapeSeq;
    var re = new RegExp(regexString, 'igm');
    if (colID === 'name') {
      Org.find().or({ 'name': re }).limit(10).skip(paged).exec(function(err, orgs) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(orgs);
        }
      });
    } else if (colID === 'regn') {
      Org.find().or({ 'regn': re }).limit(10).skip(paged).exec(function(err, orgs) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(orgs);
        }
      });
    } else if (colID === 'address') {
      Org.find().or({ 'address': re }).limit(10).skip(paged).exec(function(err, orgs) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(orgs);
        }
      });
    } else if (colID === 'chief') {
      Org.find().or({ 'chief': re }).limit(10).skip(paged).exec(function(err, orgs) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(orgs);
        }
      });
    } else if (colID === 'sectors') {
      Org.find().or({ 'sectors': re }).limit(10).skip(paged).exec(function(err, orgs) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(orgs);
        }
      });
    }
  }
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
