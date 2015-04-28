var assert = require('assert'),
    _ = require('lodash'),
    Users = require('../models/Users.js'),
    MongoClient = require('mongodb').MongoClient,
    faker = require('faker');

describe('Users', function() {
    var users,
        url = 'mongodb://localhost:27017/test',
        connect = function (callback) {
                MongoClient.connect(url, function(err, db) {
                assert.equal(err, null);
                callback(db);
            });
        };
    beforeEach(function() {
        users = new Users();
    });
    describe('#getSchema()', function() {
        it('name should be `users\'', function() {
            var schema = users.getSchema();
            assert.equal(schema.name, 'users');
        });
        it('fields should contain _id, name, creationDate, email and address', function() {
            var actualFields = users.getSchema()['fields'],
                neededFields = ['_id', 'name', 'creationDate', 'email', 'address'];
            assert.deepEqual(actualFields.sort(), neededFields.sort());
        });
    });
    describe('#processObject(newObject)', function() {
        it('returns only schema fields', function() {
            var newObject, processObject;
            newObject = {name: 'Peter', unknownField: 'Unknown value'};
            processedObject = users.processObject(newObject);
            assert.notDeepEqual(processedObject, newObject);
            assert.deepEqual(processedObject, {name: 'Peter'});
        });
    });
    describe('#connect(db)', function() {
        it('database `test\' exists', function(done) {
            connect(function (db) {
                done();
            });
        });
        it('connects successfully', function(done) {
            connect(function (db) {
                users.connect(db);
                done();
            });
        });
    });
    describe('#close(callback)', function() {
        it('sucessfully closes connection', function(done) {
            connect(function (db) {
                users.connect(db);
                users.close(function(err, result) {
                    assert.equal(err, null);
                    done();
                });
            });
        });
    });
    describe('#get(parameters, callback)', function() {
        it('gets list of users successfully', function(done) {
            connect(function (db) {
                users.connect(db);
                users.get({}, done);
            });
        });
        it('does not work without callback', function(done) {
            var newUsers = [];
            connect(function (db) {
                users.connect(db);
                assert.throws(function() { users.get({}); });
                done();
            });
        });
        it('gets users list properly', function(done) {
            var onInsert, onGet, currentUser, collection, currentUser;
            onInsert = function (err, result) {
                assert.equal(err, null);
                users.get({}, onGet);
            };
            onGet = function(err, got) {
                assert.equal(err, null);
                assert.equal(got.length, 1);
                assert.deepEqual(currentUser, got[0]);
                done();
            };
            connect(function (db) {
                users.connect(db);
                collection = users.getCollection();
                currentUser = {name: faker.name.findName(), creationDate: Date.now(),
                    email: faker.internet.email(), address: faker.address.streetAddress()};
                collection.insert([currentUser], onInsert);
            });
        });
    });
    describe('#delete(parameters, callback)', function() {
        it('deletes all users successfully', function(done) {
            var onDelete = function(err, result) {
                assert.equal(err, null);
                done();
            };
            connect(function (db) {
                users.connect(db);
                users.delete({}, onDelete);
            });
        });
        it('deletes concrete users successfully', function(done) {
            var onInsert, onDelete, collection, currentUser;
            onInsert = function (err, result) {
                assert.equal(err, null);
                users.delete({}, onDelete);
            };
            onDelete = function(err, deleted) {
                assert.equal(err, null);
                assert.equal(deleted.result.n, 1);
                done();
            }
            connect(function (db) {
                users.connect(db);
                collection = users.getCollection();
                currentUser = {name: faker.name.findName(), creationDate: Date.now(),
                    email: faker.internet.email(), address: faker.address.streetAddress()};
                collection.insert([currentUser], onInsert);
            });
        });
    });
    describe('#post(objects, callback)', function() {
        beforeEach(function(done) {
            connect(function (db) {
                users.connect(db);
                users.delete({}, function(err, result) {
                    assert.equal(err, null);
                    users.close();
                    done();
                });
            });
        });
        afterEach(function(done) {
            connect(function (db) {
                users.connect(db);
                users.delete({}, function(err, result) {
                    assert.equal(err, null);
                    users.close();
                    done();
                });
            });
        });
        it('inserts list of users successfully', function(done) {
            var onGet, onDelete, newUsers;
            onGet = function(err, documents) {
                users.delete({}, onDelete);
            };
            onDelete = function(err, deleted) {
                assert.equal(err, null);
                assert.equal(deleted.result.n, 3);
                done();
            };
            newUsers = [
                {name: faker.name.findName(), creationDate: Date.now(),
                    email: faker.internet.email(), address: faker.address.streetAddress()},
                {name: faker.name.findName(), creationDate: Date.now(),
                    email: faker.internet.email(), address: faker.address.streetAddress()},
                {name: faker.name.findName(), creationDate: Date.now(),
                    email: faker.internet.email(), address: faker.address.streetAddress()}
            ];
            connect(function (db) {
                users.connect(db);
                users.post(newUsers, function(err, result) {
                    assert.equal(err, null);
                    assert.equal(result.result.n, 3);
                    users.get({}, onGet);
                });
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
                        users.get(user, function(err, documents) {
                        assert.equal(err, null);
                        assert.equal(documents.length, 1);
                        callback();
                    });
                };
                return result;
            };
            newUsers = [
                {name: faker.name.findName(), creationDate: Date.now(),
                    email: faker.internet.email(), address: faker.address.streetAddress()},
                {name: faker.name.findName(), creationDate: Date.now(),
                    email: faker.internet.email(), address: faker.address.streetAddress()},
                {name: faker.name.findName(), creationDate: Date.now(),
                    email: faker.internet.email(), address: faker.address.streetAddress()}
            ];
            connect(function (db) {
                users.connect(db);
                users.post(newUsers, onPost);
            });
        });
        it('works with empty array', function(done) {
            var newUsers = [],
                onPost;
            onPost = function(err, result) {
                assert.equal(err, null);
                assert.equal(result.result.n, 0);
                done();
            };
            connect(function (db) {
                users.connect(db);
                users.post(newUsers, onPost);
            });
        });
        it('does not work without callback', function(done) {
            var newUsers = [];
            connect(function (db) {
                users.connect(db);
                assert.throws(function() {
                    users.post(newUsers);
                });
                done();
            });
        });
        it('gives error to callback function when trying to insert not an array', function(done) {
            var newUsers = undefined;
            connect(function (db) {
                users.connect(db);
                users.post(newUsers, function(err, result) {
                    assert.notEqual(err, null);
                    done();
                });
            });
        });
    });
});
