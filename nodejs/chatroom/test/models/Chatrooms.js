var assert = require('assert'),
    _ = require('lodash'),
    UsersModel = require('../../models/Users.js'),
    ChatroomsModel = require('../../models/Chatrooms.js'),
    ObjectId = require('mongodb').ObjectId,
    dbConnector = require('../../db_connector/connector.js');
    faker = require('faker');


describe('Chatrooms', function() {
    var Users, Chatrooms, users, chatroom, getNewUser;
    before(function (done) {
        Users = new UsersModel();
        Chatrooms = new ChatroomsModel();
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
        var onUsersCreated = function (callback) {
            return function (err, result) {
                assert.equal(err, null);
                assert.equal(result.ops.length, users.length);
                users = result.ops;
                callback();
            };
        };
        var createUsers = function (callback) {
            return function () {
                users = getNewUsers(3);
                Users.insert(users, callback);
            };
        };
        var onChatroomCreated = function (callback) {
            return function (err, result) {
                assert.equal(err, null);
                assert.equal(result.ops.length, 1);
                chatroom = result.ops[0];
                callback();
            };
        };
        var createChatroom = function (callback) {
            return function () {
                chatroom = {name: 'Real chat', users: users};
                Chatrooms.insert([chatroom], callback);
            };
        };
        var onConnect = function (callback) {
            return function (err, db) {
                assert.equal(err, null);
                callback();
            }
        };
        _.flowRight(dbConnector.connect, onConnect, createUsers, onUsersCreated, createChatroom, onChatroomCreated)(done);
    });
    after(function (done) {
        dbConnector.close(function (err, db) {
            assert.equal(err, null);
            done();
        });
    });
    describe('#insert(parameters, callback)', function() {
        it('field `name\' is mandatory', function (done) {
            var callback = function (err, result) {
                assert.notEqual(err, null);
                done();
            };
            Chatrooms.insert({users: users}, callback);
        });
        it('field `users\' is mandatory', function (done) {
            var callback = function (err, result) {
                assert.notEqual(err, null);
                done();
            };
            Chatrooms.insert({name: 'New chat'}, callback);
        });
        it('cannot create chatroom with less than two users', function (done) {
            var callback = function (err, result) {
                assert.notEqual(err, null);
                done();
            };
            Chatrooms.insert({name: 'New chat', users: []}, callback);
        });
    });
    describe('#addUsers(id, users, callback', function() {
        it('can add only list of users of users objects', function (done) {
            var callback = function (err, result) {
                assert.notEqual(err, null);
                done();
            }
            Chatrooms.addUsers(chatroom['_id'], null, callback);
        });
        it('successfully adds new user', function (done) {
            var lastUser, insertUser, onUserInserted;
            onUsersAdded = function (callback) {
                return function (err, result) {
                    assert.equal(err, null);
                    assert.equal(result.result.ok, 1);
                    assert.equal(result.result.n, 1);
                    callback();
                };
            };
            addUsers = function (callback) {
                return function() {
                    Chatrooms.addUsers(chatroom['_id'], users[lastUser], callback);
                };
            };
            onUserInserted = function (callback) {
                return function (err, result) {
                    assert.equal(err, null);
                    assert.equal(result.ops.length, 1);
                    lastUser = users.length - 1;
                    users[lastUser] = result.ops[0];
                    callback();
                };
            };
            insertUser = function (callback) {
                    var newUser = getNewUsers(); 
                    users.push(newUser);
                    Users.insert([newUser], callback);
            };
            _.flowRight(insertUser, onUserInserted, addUsers, onUsersAdded)(done);
        });
        it('does nothing when trying to add existing users', function (done) {
            var lastUser, insertUser, onUserInserted, checkUsersCount;
            checkUsersCount = function (callback) {
                return function (err, result) {
                    assert.equal(err,null);
                    assert.equal(result[0]['users'].length, users.length);
                    callback();
                };
            };
            onUsersAdded = function (callback) {
                return function (err, result) {
                    assert.equal(err, null);
                    assert.equal(result.result.ok, 1);
                    assert.equal(result.result.n, 1);
                    Chatrooms.findById(chatroom['_id'], callback);
                };
            };
            addUsers = function(callback) {
                Chatrooms.addUsers(chatroom['_id'], users, callback);
            };
            _.flowRight(addUsers, onUsersAdded, checkUsersCount)(done);
        });
    });
    describe('#getUsers(id, callback', function() {
        it('cannot get users from not existing chatroom', function (done) {
            Chatrooms.getUsers(null, function(err, gotUsers) {
                assert.notEqual(err, null);
                done();
            });
        });
        it('gets proper list of users', function (done) {
            Chatrooms.getUsers(chatroom['_id'], function(err, gotUsers) {
                assert.equal(err, null);
                assert.deepEqual(gotUsers.sort(), users.sort());
                done();
            });
        });
    });
    describe('#removeUsers(id, users, callback', function() {
        it('removes nothing without errors', function (done) {
            Chatrooms.removeUsers(chatroom['_id'], [], function(err, result) {
                assert.equal(err, null);
                assert.equal(result.result.ok, 1);
                done();
            });
        });
        it('removes users without errors', function (done) {
            Chatrooms.removeUsers(chatroom['_id'], users.slice(users.length-2), function(err, result) {
                assert.equal(err, null);
                assert.equal(result.result.ok, 1);
                done();
            });
        });
        it('cannot leave less than two users in a chatroom', function (done) {
            Chatrooms.removeUsers(chatroom['_id'], users.slice(users.length-4), function(err, result) {
                assert.notEqual(err, null);
                done();
            });
        });
    });
    describe('#remove(objects, callback)', function() {
        it('successfully removes chatroom with users', function(done) {
            var onChatroomRemoved, onUsersRemoved;
            onUsersRemoved = function (callback) {
                return function(err, removedUsers) {
                    assert.equal(err, null);
                    assert.equal(removedUsers.result.n, users.length);
                    callback();
                };
            };
            onChatroomRemoved = function (callback) {
                return function(err, removedChatrooms) {
                    assert.equal(err, null);
                    assert.equal(removedChatrooms.result.ok, 1);
                    assert.equal(removedChatrooms.result.n, 1);
                    Users.remove({}, callback);
                };
            };
            _.flowRight(_.wrap(chatroom['_id'], Chatrooms.removeById).bind(Chatrooms), onChatroomRemoved, onUsersRemoved)(done);
        });
    });
});
