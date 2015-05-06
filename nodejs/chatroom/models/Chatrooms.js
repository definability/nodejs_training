var MetaModel = require('./MetaModel.js'),
    defaultValidators = require('./Validator.js').defaultValidators;
var Chatrooms;

Chatrooms = (function() {
    var constructor = new MetaModel({
        name: 'chatrooms',
        fields: [{
            name: 'name',
            validators: [defaultValidators.mandatory]
        }, {
            name: 'users',
            validators: []
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
        addUsers: function (id, newUsers, callback) {
            var self = this;
            self.getUsers(id, function (err, users) {
                if (err != null) {
                    callback(err);
                    return;
                }
                Array.prototype.push.apply(users, newUsers);
                self.put({_id: id}, {users: users}, callback);
            });
        }
    });
    return constructor;
})();

module.exports = Chatrooms;
