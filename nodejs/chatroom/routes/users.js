var express = require('express'),
    assert = require('assert'),
    router = express.Router(),
    MongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectId,
    Users = require('../models/Users.js'),
    debug = require('debug')('users');

var url = 'mongodb://localhost:27017/chatroom',
    connect = function (callback) {
            MongoClient.connect(url, function(err, db) {
            assert.equal(err, null);
            callback(db);
        });
    };

router.get('/', function(request, response, next) {
    connect(function(db) {
        var users = new Users();
        users.connect(db);
        users.get({}, function (err, got) {
            assert.equal(err, null);
            response.json({success: true, response: got});
        });
    });
});

router.get('/:id', function(request, response, next) {
    connect(function(db) {
        var users,
            userId;
        try {
            userId = ObjectId(request.params.id);
        } catch (e) {
        }
        users = new Users();
        users.connect(db);
        users.get({_id: userId}, function (err, got) {
            assert.equal(err, null);
            if (got.length == 0) {
                response.status(404).json({success: false, error: 'Not found'});
            } else {
                response.json({success: true, response: got});
            }
        });
    });
});

router.post('/', function(request, response, next) {
    var users = new Users();
    connect(function (db) {
        users.connect(db);
        try {
            if (Object.keys(request.body).length == 0) {
                throw new Error('Wrong');
            }
            users.post([request.body], function (err, result) {
                assert.equal(err, null);
                users.close();
                response.json({success: result.result.ok == 1, response: {users: result.ops}});
            });
        } catch (e) {
            response.status(400).json({success: false, error: 'Wrong user data'});
        }
    });
});

router.delete('/', function(request, response, next) {
    var users = new Users();
    connect(function (db) {
        users.connect(db);
        users.delete(request.body, function (err, result) {
            assert.equal(err, null);
            users.close();
            response.json({success: result.result.ok == 1});
        });
    });
});

router.delete('/:id', function(request, response, next) {
    connect(function(db) {
        var users,
            userId;
        try {
            userId = ObjectId(request.params.id);
        } catch (e) {
        }
        users = new Users();
        users.connect(db);
        users.delete({_id: userId}, function (err, deleted) {
            assert.equal(err, null);
            if (deleted.length == 0) {
                response.status(404).json({success: false, error: 'Not found'});
            } else {
                response.json({success: deleted.result.ok == 1, response: {count: deleted.result.n}});
            }
        });
    });
});

module.exports = router;
