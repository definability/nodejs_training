var express = require('express'),
    _ = require('lodash'),
    assert = require('assert'),
    router = express.Router(),
    http = require('http'),
    httpStatus = require('http-status'),
    MongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectId,
    Users = require('../models/Users.js'),
    debug = require('debug')('users');

var sendError = function (response, statusCode) {
    response.status(statusCode).json({success: false, error: httpStatus[statusCode]});
};

router.get('/', function(request, response, next) {
    var users = new Users();
    users.get({}, function (err, got) {
        if (err != null) {
            console.error(err);
            sendError(response, httpStatus.INTERNAL_SERVER_ERROR);
            return;
        }
        response.json({success: true, response: got});
    });
});

router.get('/:id', function(request, response, next) {
    var users = new Users();
    users.findById(request.params.id, function (err, got) {
        if (err != null) {
            console.error(err);
            sendError(response, httpStatus.INTERNAL_SERVER_ERROR);
            return;
        } else if (got.length == 0) {
            sendError(response, httpStatus.NOT_FOUND);
            return;
        }
        response.json({success: true, response: got});
    });
});

router.post('/', function(request, response, next) {
    var users = new Users();
    if (Object.keys(request.body).length == 0) {
        sendError(response, httpStatus.BAD_REQUEST);
        return;
    }
    users.post([request.body], function (err, result) {
        assert.equal(err, null);
        response.json({success: result.result.ok == 1, response: {users: result.ops}});
    });
});

router.delete('/', function(request, response, next) {
    sendError(response, httpStatus.BAD_REQUEST);
});

router.delete('/:id', function(request, response, next) {
    var users = new Users();
    users.deleteById(request.params.id, function (err, deleted) {
        if (err != null) {
            console.error(err);
            sendError(response, httpStatus.INTERNAL_SERVER_ERROR);
            return;
        } else if (deleted.length == 0) {
            sendError(response, httpStatus.NOT_FOUND);
            return;
        }
        response.json({success: deleted.result.ok == 1, response: {count: deleted.result.n}});
    });
});

module.exports = router;
