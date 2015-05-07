var assert = require('assert'),
    _ = require('lodash'),
    Users = require('../models/Users.js'),
    dbConnector = require('../db_connector/connector.js');
    faker = require('faker');

describe('Users', function() {
    var users;
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
        users = new Users();
    });
    describe('#post(objects, callback)', function() {
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
            onPost = function(err, result) {
                assert.equal(err, null);
                assert.equal(result.result.n, 3);
                var actions = newUsers.map(function (user) {
                    return checkUser(user);
                });
                _(actions).reduceRight(_.wrap, done)();
            };
            checkUser = function (user) {
                var result = function (callback) {
                    users.find(user, function(err, documents) {
                        assert.equal(err, null);
                        assert.equal(documents.length, 1);
                        callback();
                    });    
                };
                return result;
            };
            newUsers = [
                {name: faker.name.findName(), createdOn: Date.now(),
                    email: faker.internet.email(), address: faker.address.streetAddress()},
                {name: faker.name.findName(), createdOn: Date.now(),
                    email: faker.internet.email(), address: faker.address.streetAddress()},
                {name: faker.name.findName(), createdOn: Date.now(),
                    email: faker.internet.email(), address: faker.address.streetAddress()}
            ];
            users.insert(newUsers, onPost);
        });
    });
});
