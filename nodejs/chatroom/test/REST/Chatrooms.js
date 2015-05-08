var assert = require('assert'),
    http = require('http'),
    ObjectId = require('mongodb').ObjectId,
    Users = require('../../models/Users.js')(),
    dbConnector = require('../../db_connector/connector.js');

var host = 'localhost',
    port = '3000',
    path = '/chatrooms';

describe('HTTP server with Chatrooms', function() {
    var currentChatroom, generateRequest, users, firstUsersPortion, secondUsersPortion;
    before(function(done) {
        generateRequest = function (method, onEnd, pathAppendix) {
            if (pathAppendix === undefined) {
                pathAppendix = '';
            }
            var options = {
                host: host,
                port: port,
                path: [path, pathAppendix].join('/'),
                method: method
            };
            var request = http.request(options, function (res) {
                var chunks = [];
                res.on('data', function (chunk) {
                    chunks.push(chunk);
                });
                res.on('end', function() {
                    onEnd(chunks.join(''));
                });
            });
            request.setHeader('Content-Type', 'application/json');
            return request;
        };
        dbConnector.connect(function (dbErr, db) {
            assert.equal(dbErr);
            Users.insert(Users.generateRandomModels(3), function (err, answer) {
                assert.equal(err, null);
                assert.equal(answer.result.ok, 1);
                assert.equal(answer.result.n, 3);
                users = answer.ops;
                firstUsersPortion = users.slice(0, users.length-1);
                secondUsersPortion = users.slice(users.length-1);
                currentChatroom = {
                    name: 'Test chatroom',
                    users: firstUsersPortion
                };
                done();
            });
        });
    });
    after(function(done) {
        Users.remove({}, function (err, answer) {
            assert.equal(err, null);
            assert.equal(answer.result.ok, 1);
            assert.equal(answer.result.n, 3);
            done();
        });
    });
    describe('#POST', function() {
        it('should post chatroom correctly', function(done) {
            var request = generateRequest('POST', function (data) {
                dataJSON = JSON.parse(data);
                assert.equal(dataJSON.success, true);
                assert.equal(dataJSON.response.chatrooms.length, 1);
                //currentChatroom._id = dataJSON.response.chatrooms[0]._id;
                currentChatroom = dataJSON.response.chatrooms[0];
                assert.deepEqual(dataJSON.response.chatrooms[0], currentChatroom);
                done();
            });
            request.write(JSON.stringify(currentChatroom));
            request.end();
        });
    });
    describe('#GET', function() {
        it('should get previously added chatroom', function (done) {
            var request = generateRequest('GET', function (data) {
                dataJSON = JSON.parse(data);
                assert.equal(dataJSON.success, true);
                assert.equal(dataJSON.response.length, 1);
                assert.deepEqual(dataJSON.response[0], currentChatroom);
                done();
            }, currentChatroom._id);
            request.end();
        });
    });
    describe('Users', function() {
        var pathAppendix;
        before(function() {
            pathAppendix = [currentChatroom._id, 'users'].join('/');
        });
        describe('#POST', function() {
            it('should add new user to the chatroom correctly', function(done) {
                var request = generateRequest('POST', function (data) {
                    dataJSON = JSON.parse(data);
                    assert.equal(dataJSON.success, true);
                    assert.equal(dataJSON.response.n, 1);
                    currentChatroom.users = users;
                    done();
                }, pathAppendix);
                request.write(JSON.stringify(secondUsersPortion));
                request.end();
            });
        });
        describe('#GET', function() {
            it('should get previously added user', function (done) {
                var request = generateRequest('GET', function (data) {
                    dataJSON = JSON.parse(data);
                    assert.equal(dataJSON.success, true);
                    assert.equal(dataJSON.response.length, users.length);
                    assert.deepEqual(JSON.stringify(dataJSON.response), JSON.stringify(currentChatroom.users));
                    done();
                }, pathAppendix);
                request.end();
            });
        });
        describe('#DELETE', function() {
            it('should delete last added user successfully', function (done) {
                var request = generateRequest('DELETE', function (data) {
                    dataJSON = JSON.parse(data);
                    assert.equal(dataJSON.success, true);
                    assert.equal(dataJSON.response.count, 1);
                    done();
                }, [pathAppendix, users[users.length-1]._id].join('/'));
                request.end();
            });
        });
    });
    describe('#DELETE', function() {
    });
});
