var express = require('express'),
    _ = require('lodash'),
    assert = require('assert'),
    router = express.Router(),
    http = require('http'),
    httpStatus = require('http-status'),
    MongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectId,
    Users = new require('../../models/Users.js')(),
    Chatrooms = new require('../../models/Chatrooms.js')(),
    debug = require('debug')('Chatrooms/Users');

var sendError = function (response, statusCode) {
    response.status(statusCode).json({success: false, error: httpStatus[statusCode]});
};

router.param('user_id', function (request, response, next, user_id) {
    request.users = [];
    Users.findById(user_id, function (err, got) {
        if (err != null) {
            console.error(err);
            sendError(response, httpStatus.INTERNAL_SERVER_ERROR);
            //request.error = httpStatus.INTERNAL_SERVER_ERROR;
        }
        request.users = got;
        return next();
    });
});

router.get('/', function(request, response, next) {
    if (request.chatrooms.length == 0) {
        sendError(response, httpStatus.NOT_FOUND);
    }
    Chatrooms.getUsers(request.chatrooms[0]._id, function (err, users) {
        if (err != null) {
            console.log(err);
            sendError(response, httpStatus.INTERNAL_SERVER_ERROR);
            return;
        }
        response.json({success: true, response: request.chatrooms[0].users});
    });
});

router.post('/', function(request, response, next) {
    if (Object.keys(request.body).length == 0) {
        sendError(response, httpStatus.BAD_REQUEST);
        return;
    }
    Chatrooms.addUsers(request.chatrooms[0]._id, request.body, function (err, result) {
        response.json({success: result.result.ok == 1, response: {n: result.result.n}});
    });
});

router.delete('/:user_id', function(request, response, next) {
    Chatrooms.removeUsers(request.chatrooms[0]._id, [{_id: request.params.user_id}], function (err, result) {
        response.json({success: result.result.ok == 1, response: {count: result.result.n}});
    });
});


module.exports = router;
