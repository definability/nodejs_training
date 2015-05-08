var assert = require('assert'),
    _ = require('lodash'),
    async = require('async'),
    Users = require('../models/Users.js'),
    dbConnector = require('../db_connector/connector.js');
    faker = require('faker');

describe('Users', function() {
    var users, getNewUsers;
    before(function (done) {
        getNewUsers = function(n) {
            if (n !== undefined) {
                var result = [];
                for (var i=0; i<n; i++) {
                    result.push(getNewUsers());
                }
                return result;
            }
            return {name: faker.name.findName(), createdOn: Date.now(), email: faker.internet.email(),
                    address: faker.address.streetAddress()};
        };
        dbConnector.connect(function (err, db) {
            assert.equal(err, null);
            done();
        });
    });
    after(function (done) {
        dbConnector.close(function (err, db) {
            assert.equal(err, null);
            done();
        });
    });
    beforeEach(function() {
        users = new Users();
    });
    describe('#insert(objects, callback)', function() {
        beforeEach(function(done) {
            users.remove({}, function(err, result) {
                assert.equal(err, null);
                done();
            });
        });
        afterEach(function(done) {
            users.remove({}, function(err, result) {
                assert.equal(err, null);
                done();
            });
        });
        it('inserts list of users correctly', function(done) {
            var onPost, checkUser, newUsers;
            newUsers = getNewUsers(3);
            checkUser = function (user, callback) {
                var onUserFound = function(err, documents) {
                    assert.equal(err, null);
                    assert.equal(documents.length, 1);
                    callback();
                };
                users.find(user, onUserFound);
            };
            onPost = function(err, result) {
                assert.equal(err, null);
                assert.equal(result.result.n, 3);
                async.map(newUsers, checkUser, function (err, result) {
                    assert.equal(err, null);
                    done();
                });
            };
            users.insert(newUsers, onPost);
        });
    });
});
