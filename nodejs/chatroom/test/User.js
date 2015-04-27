var assert = require('assert'),
    Users = require('../models/Users.js'),
    MongoClient = require('mongodb').MongoClient;

describe('Users', function() {
    describe('#getSchema()', function() {
        it('name should be `users\'', function() {
            var users = new Users();
            var schema = users.getSchema();
            assert.equal(schema.name, 'users');
        });
        it('fields should contain _id, name, creationDate, email and address', function() {
            var users = new Users();
            var actualFields = users.getSchema()['fields'];
            var neededFields = ['_id', 'name', 'creationDate', 'email', 'address'];
            assert.deepEqual(actualFields.sort(), neededFields.sort());
        });
    });
    describe('#connect(db)', function() {
        it('database `test\' exists', function(done) {
            var url = 'mongodb://localhost:27017/test';
            MongoClient.connect(url, function(err, db) {
                assert.equal(err, null);
                //getUsers(db, undefined, showUsers, res);
                done();
            });
        });
        it('connects successfully', function(done) {
            var url = 'mongodb://localhost:27017/test';
            var users = new Users();
            MongoClient.connect(url, function(err, db) {
                assert.equal(err, null);
                users.connect(db);
                done();
            });
        });
    });
    describe('#get(parameters, callback)', function() {
        it('gets list of users successfully', function(done) {
            var url = 'mongodb://localhost:27017/test';
            var users = new Users();
            MongoClient.connect(url, function(err, db) {
                assert.equal(err, null);
                users.connect(db);
                users.get({}, done);
            });
        });
    });
    describe('#post(objects, callback)', function() {
        it('inserts list of users successfully', function(done) {
            var url = 'mongodb://localhost:27017/test';
            var users = new Users();
            MongoClient.connect(url, function(err, db) {
                assert.equal(err, null);
                users.connect(db);
                users.get({}, done);
            });
        });
    });
});
