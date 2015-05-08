var MetaModel = require('./MetaModel.js'),
    defaultValidators = require('./Validator.js').defaultValidators,
    ObjectId = require('mongodb').ObjectId,
    _ = require('lodash');
var Chatrooms;

Chatrooms = (function() {
    var constructor = new MetaModel({
        name: 'chatrooms',
        fields: [{
            name: 'name',
            validators: [defaultValidators.mandatory]
        }, {
            name: 'users',
            validators: [defaultValidators.mandatory, defaultValidators.arrayNotLessThan(2)]
        }]
    }, {
        getUsers: function (id, callback) {
            var onFound = function (err, collection) {
                if (collection.length == 0) {
                    callback(new Error('Chatroom does not exist'));
                    return;
                }
                callback(null, collection[0].users);
            };
            this.findById(id, onFound);
        },
        addUsers: function (id, users, callback) {
            var query;
            if (_.isArray(users)) {
                query = {$addToSet: {users: {$each: users}}};
            } else if (_.isObject(users)) {
                query = {$addToSet: {users: users}};
            } else {
                callback(new Error(['Invalid type of users:', typeof(users)].join(' ')));
                return;
            }
            this.rawUpdate({_id: id}, query, callback);
        },
        removeUsers: function (id, users, callback) {
            var ids = _.indexBy(users, '_id');
            var onUsersFound = function (cb) {
                var willRemove, willNotRemove;
                willNotRemove = function (user) {
                    return ids[ObjectId(user['_id'])] === undefined;
                };
                return (function (err, result) {
                    var usersLeft = result.filter(willNotRemove);
                    if (usersLeft.length < 2) {
                        cb(new Error('There should be at lest two users left'));
                    }
                    this.update({_id: id}, {users: usersLeft}, cb);
                }).bind(this);;
            };
            _.flowRight(_.wrap(id, this.getUsers).bind(this), onUsersFound.bind(this))(callback);
        }
    });
    return constructor;
})();

module.exports = Chatrooms;
