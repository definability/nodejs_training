var express = require('express');
var assert = require('assert');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectId;

var insertTestUsers = function(db) {
    var collection = db.collection('users');
    collection.insert([
        {name: 'Ivan', creationDate: Date.now(), email: 'e@mail.com', address: 'Address St. 1'},
        {name: 'Valisy', creationDate: Date.now(), email: 'em@ail.com', address: 'Address St. 2'},
        {name: 'Petr', creationDate: Date.now(), email: 'ema@il.com', address: 'Address St. 3'},
        ], function(err, result) {
            assert.equal(err, null);
            console.log(result.result.n, result.ops);
        });
};

var getUsers = function(db, id, callback, res) {
    var collection = db.collection('users');
    var findDictionary = {};
    if (id !== undefined) {
        try {
            findDictionary['_id'] = ObjectId(id);
        } catch(e) {
            callback(undefined, res);
            return;
        }
    }
    collection.find(findDictionary).toArray(function(err, docs) {
        assert.equal(err, null);
        callback(docs, res);
    });
};

var showUsers = function(users, res) {
    //console.log('users', users);
    if (users === undefined) {
        res.send("Error");
        return;
    } else {
        var userNames = users.map(function(user) {
            //console.log(user.name);
            return user;
        });
        res.json(userNames);
    }
};

/* GET users listing. */
router.get('/', function(req, res, next) {
    var url = 'mongodb://localhost:27017/chatroom';
    MongoClient.connect(url, function(err, db) {
        assert.equal(err, null);
        getUsers(db, undefined, showUsers, res);
    });
});

router.get('/:id', function(req, res, next) {
    var url = 'mongodb://localhost:27017/chatroom';
    MongoClient.connect(url, function(err, db) {
        assert.equal(err, null);
        //console.log(req.params.id);
        getUsers(db, req.params.id, showUsers, res);
    });
});

module.exports = router;
