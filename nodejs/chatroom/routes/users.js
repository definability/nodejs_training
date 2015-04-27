var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    assert = require('assert'),
    router = express.Router(),
    MongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectId,
    Users = require('../models/Users.js');

app.use(bodyParser.urlencoded({ extended: false }));

var url = 'mongodb://localhost:27017/chatroom',
    connect = function (callback) {
            MongoClient.connect(url, function(err, db) {
            assert.equal(err, null);
            callback(db);
        });
    };

router.get('/', function(request, response, next) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(err, null);
        var users = new Users();
        users.connect(db);
        users.get({}, function (err, got) {
            assert.equal(err, null);
            response.json(got);
        });
    });
});

router.get('/:id', function(request, response, next) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(err, null);
        var users = new Users();
        users.connect(db);
        users.get({_id: ObjectId(request.params.id)}, function (err, got) {
            assert.equal(err, null);
            response.json(got);
        });
    });
});

app.post('/', function(request, response) {
    var users = new Users();
    connect(function (db) {
        users.connect(db);
        users.post(request.body, function (err, result) {
            assert.equal(err, null);
            users.close();
            response.json(result.result);
        });
    });
});

module.exports = router;
