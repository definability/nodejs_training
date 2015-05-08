var assert = require('assert'),
    _ = require('lodash'),
    async = require('async'),
    UsersModel = require('../../models/Users.js'),
    dbConnector = require('../../db_connector/connector.js');
    faker = require('faker');

describe('Users', function() {
    var Users;
    before(function (done) {
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
        Users = new UsersModel();
    });
    describe('#insert(objects, callback)', function() {
        beforeEach(function(done) {
            Users.remove({}, function(err, result) {
                assert.equal(err, null);
                done();
            });
        });
        afterEach(function(done) {
            Users.remove({}, function(err, result) {
                assert.equal(err, null);
                done();
            });
        });
        it('inserts list of users correctly', function(done) {
            var onPost, checkUser, newUsers;
            newUsers = Users.generateRandomModels(3);
            checkUser = function (user, callback) {
                var onUserFound = function(err, documents) {
                    assert.equal(err, null);
                    assert.equal(documents.length, 1);
                    callback();
                };
                Users.find(user, onUserFound);
            };
            onPost = function(err, result) {
                assert.equal(err, null);
                assert.equal(result.result.n, 3);
                async.map(newUsers, checkUser, function (err, result) {
                    assert.equal(err, null);
                    done();
                });
            };
            Users.insert(newUsers, onPost);
        });
    });
});
