var express = require('express'),
    _ = require('lodash'),
    assert = require('assert'),
    router = express.Router(),
    http = require('http'),
    httpStatus = require('http-status'),
    MongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectId,
    Chatrooms = new require('../models/Chatrooms.js')(),
    debug = require('debug')('Users');

var sendError = function (response, statusCode) {
    response.status(statusCode).json({success: false, error: httpStatus[statusCode]});
};

router.param('chatroom_id', function (request, response, next, chatroom_id) {
    Chatrooms.findById(chatroom_id, function (err, got) {
        if (err != null) {
            console.error(err);
            sendError(response, httpStatus.INTERNAL_SERVER_ERROR);
        }
        request.chatrooms = got;
        return next();
    });
});

router.get('/', function(request, response, next) {
    Chatrooms.find({}, function (err, got) {
        if (err != null) {
            console.error(err);
            sendError(response, httpStatus.INTERNAL_SERVER_ERROR);
            return;
        }
        response.json({success: true, response: got});
    });
});

router.get('/:chatroom_id', function(request, response, next) {
    if (request.chatrooms.length == 0) {
        sendError(response, httpStatus.NOT_FOUND);
        return;
    }
    response.json({success: true, response: request.chatrooms});
});

router.use('/:chatroom_id/users', require('./chatrooms/users.js'));

router.post('/', function(request, response, next) {
    if (Object.keys(request.body).length == 0) {
        sendError(response, httpStatus.BAD_REQUEST);
        return;
    }
    Chatrooms.insert([request.body], function (err, result) {
        assert.equal(err, null);
        response.json({success: result.result.ok == 1, response: {chatrooms: result.ops}});
    });
});

router.delete('/', function(request, response, next) {
    sendError(response, httpStatus.BAD_REQUEST);
});

router.delete('/:id', function(request, response, next) {
    Chatrooms.removeById(request.params.id, function (err, deleted) {
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
