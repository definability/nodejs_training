var express = require('express'),
    _ = require('lodash'),
    assert = require('assert'),
    router = express.Router(),
    http = require('http'),
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

var sendError = function (response, statusName) {
    var statusCode = _.invert(http.STATUS_CODES)[statusName][0];
    response.status(statusCode).json({success: false, error: http.STATUS_CODES[statusCode]});
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
    var onUserNotFound = function (error) {
        sendError(response, 'Not Found');
    };
    connect(function(db) {
        var users;
        users = new Users();
        users.connect(db);
        users.findById(request.params.id, function (err, got) {
            if (err != null || got.length == 0) {
                onUserNotFound(err);
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
                response.json({success: result.result.ok == 1, response: {users: result.ops}});
            });
        } catch (e) {
            sendError(response, 'Bad Request');
        }
    });
});

router.delete('/', function(request, response, next) {
    sendError(response, 'Bad Request');
});

router.delete('/:id', function(request, response, next) {
    var onUserNotFound = function (error) {
        sendError(response, 'Not Found');
    };
    connect(function(db) {
        var users,
            userId;
        users = new Users();
        users.connect(db);
        users.deleteById(request.params.id, function (err, deleted) {
            if (err != null || deleted.length == 0) {
                onUserNotFound(err);
            } else {
                response.json({success: deleted.result.ok == 1, response: {count: deleted.result.n}});
            }
        });
    });
});

module.exports = router;
