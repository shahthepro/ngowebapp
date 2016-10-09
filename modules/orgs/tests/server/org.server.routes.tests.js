'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Org = mongoose.model('Org'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  org;

/**
 * Org routes tests
 */
describe('Org CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Org
    user.save(function () {
      org = {
        name: 'Org name'
      };

      done();
    });
  });

  it('should be able to save a Org if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Org
        agent.post('/api/orgs')
          .send(org)
          .expect(200)
          .end(function (orgSaveErr, orgSaveRes) {
            // Handle Org save error
            if (orgSaveErr) {
              return done(orgSaveErr);
            }

            // Get a list of Orgs
            agent.get('/api/orgs')
              .end(function (orgsGetErr, orgsGetRes) {
                // Handle Orgs save error
                if (orgsGetErr) {
                  return done(orgsGetErr);
                }

                // Get Orgs list
                var orgs = orgsGetRes.body;

                // Set assertions
                (orgs[0].user._id).should.equal(userId);
                (orgs[0].name).should.match('Org name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Org if not logged in', function (done) {
    agent.post('/api/orgs')
      .send(org)
      .expect(403)
      .end(function (orgSaveErr, orgSaveRes) {
        // Call the assertion callback
        done(orgSaveErr);
      });
  });

  it('should not be able to save an Org if no name is provided', function (done) {
    // Invalidate name field
    org.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Org
        agent.post('/api/orgs')
          .send(org)
          .expect(400)
          .end(function (orgSaveErr, orgSaveRes) {
            // Set message assertion
            (orgSaveRes.body.message).should.match('Please fill Org name');

            // Handle Org save error
            done(orgSaveErr);
          });
      });
  });

  it('should be able to update an Org if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Org
        agent.post('/api/orgs')
          .send(org)
          .expect(200)
          .end(function (orgSaveErr, orgSaveRes) {
            // Handle Org save error
            if (orgSaveErr) {
              return done(orgSaveErr);
            }

            // Update Org name
            org.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Org
            agent.put('/api/orgs/' + orgSaveRes.body._id)
              .send(org)
              .expect(200)
              .end(function (orgUpdateErr, orgUpdateRes) {
                // Handle Org update error
                if (orgUpdateErr) {
                  return done(orgUpdateErr);
                }

                // Set assertions
                (orgUpdateRes.body._id).should.equal(orgSaveRes.body._id);
                (orgUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Orgs if not signed in', function (done) {
    // Create new Org model instance
    var orgObj = new Org(org);

    // Save the org
    orgObj.save(function () {
      // Request Orgs
      request(app).get('/api/orgs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Org if not signed in', function (done) {
    // Create new Org model instance
    var orgObj = new Org(org);

    // Save the Org
    orgObj.save(function () {
      request(app).get('/api/orgs/' + orgObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', org.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Org with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/orgs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Org is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Org which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Org
    request(app).get('/api/orgs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Org with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Org if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Org
        agent.post('/api/orgs')
          .send(org)
          .expect(200)
          .end(function (orgSaveErr, orgSaveRes) {
            // Handle Org save error
            if (orgSaveErr) {
              return done(orgSaveErr);
            }

            // Delete an existing Org
            agent.delete('/api/orgs/' + orgSaveRes.body._id)
              .send(org)
              .expect(200)
              .end(function (orgDeleteErr, orgDeleteRes) {
                // Handle org error error
                if (orgDeleteErr) {
                  return done(orgDeleteErr);
                }

                // Set assertions
                (orgDeleteRes.body._id).should.equal(orgSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Org if not signed in', function (done) {
    // Set Org user
    org.user = user;

    // Create new Org model instance
    var orgObj = new Org(org);

    // Save the Org
    orgObj.save(function () {
      // Try deleting Org
      request(app).delete('/api/orgs/' + orgObj._id)
        .expect(403)
        .end(function (orgDeleteErr, orgDeleteRes) {
          // Set message assertion
          (orgDeleteRes.body.message).should.match('User is not authorized');

          // Handle Org error error
          done(orgDeleteErr);
        });

    });
  });

  it('should be able to get a single Org that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Org
          agent.post('/api/orgs')
            .send(org)
            .expect(200)
            .end(function (orgSaveErr, orgSaveRes) {
              // Handle Org save error
              if (orgSaveErr) {
                return done(orgSaveErr);
              }

              // Set assertions on new Org
              (orgSaveRes.body.name).should.equal(org.name);
              should.exist(orgSaveRes.body.user);
              should.equal(orgSaveRes.body.user._id, orphanId);

              // force the Org to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Org
                    agent.get('/api/orgs/' + orgSaveRes.body._id)
                      .expect(200)
                      .end(function (orgInfoErr, orgInfoRes) {
                        // Handle Org error
                        if (orgInfoErr) {
                          return done(orgInfoErr);
                        }

                        // Set assertions
                        (orgInfoRes.body._id).should.equal(orgSaveRes.body._id);
                        (orgInfoRes.body.name).should.equal(org.name);
                        should.equal(orgInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Org.remove().exec(done);
    });
  });
});
