var _ = require('lodash'),
    assert = require('assert'),
    ObjectId = require('mongodb').ObjectId,
    connectMongoDB = require('../config.js').connectMongoDB;

var MetaModel;

var Model = (function() {
    var constructor = function (schemaInfo) {
        var database, collection, connected = false;
        var schema = {
            name: schemaInfo.name,
            fields: ['_id']
        };
        Array.prototype.push.apply(schema.fields, schemaInfo.fields);
        Object.freeze(schema);
        this.connect = function (callback, reconnect) {
            var onConnect = function(err, db) {
                if (err != null) {
                    callback(err);
                } else {
                    database = db;
                    collection = database.collection(schema['name']);
                    connected = true;
                    callback(err, db);
                }
            };
            if (!connected || reconnect) {
                connectMongoDB (onConnect);
            } else {
                callback(null, database);
            }
        };
        this.close = function (callback) {
            var onClose = function(err, result) {
                if (err != null) {
                    callback(err);
                } else {
                    callback(err, result);
                    connected = false;
                }
            };
            database.close(onClose);
        };
        this.isConnected = function() {
            return connected;
        };
        this.getSchema = function() {
            return schema;
        };
        this.rawCommand = function (callback) {
            var self = this;
            var onConnect = function (err, db) {
                if (err != null) {
                    callback(err);
                } else {
                    callback(null, collection);
                }
            };
            self.connect(onConnect);
        }
    };
    var proto = constructor.prototype;
    proto.get = function (parameters, callback) {
        if (parameters === undefined) {
            parameters = {};
        }
        var command = function(err, collection) {
            if (err != null) {
                callback(err);
            } else {
                collection.find(parameters).toArray(callback);
            }
        };
        this.rawCommand(command);
    };
    proto.findById = function (id, callback) {
        var objectId;
        try {
            objectId = ObjectId(id);
        } catch (e) {
            callback(e);
            return;
        }
        this.get({_id: objectId}, callback);
    };
    proto.processObject = function (newObject) {
        return _.pick(newObject, this.getSchema().fields);
    }
    proto.post = function (objects, callback) {
        var self = this,
            command = function (err, collection) {
            if (err != null) {
                callback(err);
            } else {
                collection.insert(objects.map(self.processObject, self), callback);
            }
        };
        if (!Array.isArray(objects)) {
            callback(new Error('First argument should be an array'));
        } else if (callback === undefined) {
            callback(new Error('Callback field is mandatory'));
        } else {
            this.rawCommand(command);
        }
    };
    proto.delete = function (parameters, callback) {
        var command = function (err, collection) {
            if (err != null) {
                callback(err);
            } else {
                collection.remove(parameters, callback);
            }
        };
        if (parameters === undefined) {
            parameters = {};
        }
        this.rawCommand(command);
    };
    proto.deleteById = function (id, callback) {
        var objectId;
        try {
            objectId = ObjectId(id);
        } catch (e) {
            callback(e);
            return;
        }
        this.delete({_id: objectId}, callback);
    };
    return constructor;
})();

MetaModel = (function() {
    var constructor = function (schemaInfo) {
        return function() {
            return new Model(schemaInfo);
        };
    };
    return constructor;
})();

module.exports = {MetaModel: MetaModel};
