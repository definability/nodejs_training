var express = require('express'),
    assert = require('assert'),
    router = express.Router(),
    MongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectId,
    Users = require('../models/Users.js');

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
            response.json(got);
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
                response.status(404).send('Not found');
            } else {
                response.json(got);
            }
        });
    });
});

router.post('/', function(request, response) {
    var users = new Users();
    connect(function (db) {
        users.connect(db);
        users.post([request.body], function (err, result) {
            assert.equal(err, null);
            users.close();
            response.json(result.result);
        });
    });
});

module.exports = router;
