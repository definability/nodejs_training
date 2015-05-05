var assert = require('assert'),
    _ = require('lodash'),
    UsersModel = require('../models/Users.js'),
    ChatroomsModel = require('../models/Chatrooms.js'),
    ObjectId = require('mongodb').ObjectId,
    dbConnector = require('../db_connector/connector.js');
    faker = require('faker');


describe('Chatrooms', function() {
    var Users, Chatrooms, newUsers;
    before(function (done) {
        Users = new UsersModel();
        Chatrooms = new ChatroomsModel();
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
    describe('#post(objects, callback)', function() {
        it('successfully creates new chatroom without users', function(done) {
            Chatrooms.post([{name: 'Userless chat'}], function(err, result) {
                assert.equal(err, null);
                assert.equal(result.result.n, 1);
                done();
            });
        });
        it('successfully creates new chatroom with users', function(done) {
            var onChatroomPost = function(err, result) {
                assert.equal(err, null);
                assert.equal(result.result.n, 1);
                done();
            };
            onUsersPost = function (users) {
                Chatrooms.post([{name: 'Real chat', users: users}], onChatroomPost);
            };
            newUsers = [
                {name: faker.name.findName(), createdOn: Date.now(),
                    email: faker.internet.email(), address: faker.address.streetAddress()},
                {name: faker.name.findName(), createdOn: Date.now(),
                    email: faker.internet.email(), address: faker.address.streetAddress()},
            ];
            Users.post(newUsers, function (err, result) {
                assert.equal(err, null);
                assert.equal(result.result.n, 2);
                for (var user in result.ops) {
                    newUsers[user]['_id'] = ObjectId(result.ops[user]['_id']);
                }
                onUsersPost(result.ops);
            });
        });
    });
    describe('#put(parameters, values, callback', function() {
        it('successfully updates', function (done) {
            newUsers.push({name: faker.name.findName(), createdOn: Date.now(),
                           email: faker.internet.email(), address: faker.address.streetAddress()});
            Users.post([newUsers[newUsers.length-1]], function (err, result) {
                assert.equal(err, null);
                assert.equal(result.result.n, 1);
                newUsers[newUsers.length-1]['_id'] = ObjectId(result.ops[0]['_id']);
                Chatrooms.put({name: 'Real chat'}, {users: newUsers}, function (err, result) {
                    assert.equal(err, null);
                    done();
                });
            });
        });
    });
    describe('#addUsers(id, newUsers, callback', function() {
        it('successfully adds new user', function (done) {
            newUsers.push({name: faker.name.findName(), createdOn: Date.now(),
                           email: faker.internet.email(), address: faker.address.streetAddress()});
            newUsers.push({name: faker.name.findName(), createdOn: Date.now(),
                           email: faker.internet.email(), address: faker.address.streetAddress()});
            Users.post(newUsers.slice(newUsers.length-2), function (err, result) {
                assert.equal(err, null);
                assert.equal(result.result.n, 2);
                newUsers[newUsers.length-2]['_id'] = ObjectId(result.ops[0]['_id']);
                newUsers[newUsers.length-1]['_id'] = ObjectId(result.ops[1]['_id']);
                Chatrooms.get({name: 'Real chat'}, function (err, result) {
                    assert.equal(err, null);
                    Chatrooms.addUsers(result[0]['_id'], newUsers.slice(newUsers.length-2), function (err, res) {
                        assert.equal(err, null);
                        assert.equal(res.result.n, 1);
                        done();
                    });
                });
            });
        });
    });
    describe('#getUsers(id, callback', function() {
        it('gets proper list of users', function (done) {
            Chatrooms.get({name: 'Real chat'}, function (err, result) {
                assert.equal(err, null);
                Chatrooms.getUsers(result[0]['_id'], function(err, users) {
                    assert.deepEqual(users.sort(), newUsers.sort());
                    done();
                });
            });
        });
    });
    describe('#delete(objects, callback)', function() {
        it('successfully deletes userless chatroom', function(done) {
            Chatrooms.delete({name: 'Userless chat'}, function(err, result) {
                assert.equal(err, null);
                assert.equal(result.result.n, 1);
                done();
            });
        });
        it('successfully deletes chatroom with users', function(done) {
            Chatrooms.delete({name: 'Real chat'}, function(err, result) {
                assert.equal(err, null);
                assert.equal(result.result.n, 1);
                Users.delete({}, function(err, result) {
                    assert.equal(err, null);
                    assert.equal(result.result.n, 5);
                    done();
                });
            });
        });
    });
});
