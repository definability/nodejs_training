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
            if (!connected || reconnect) {
                connectMongoDB (function(err, db) {
                    if (err != null) {
                        callback(err);
                    } else {
                        database = db;
                        collection = database.collection(schema['name']);
                        connected = true;
                        callback(err, db);
                    }
                });
            } else {
                callback(null, database);
            }
        };
        this.close = function (callback) {
            database.close(function(err, result) {
                if (err != null) {
                    callback(err);
                } else {
                    callback(err, result);
                    connected = false;
                }
            });
        };
        this.isConnected = function() {
            return connected;
        };
        this.getSchema = function() {
            return schema;
        };
        this.rawCommand = function (callback) {
            var self = this;
            self.connect(function (err, db) {
                if (err != null) {
                    callback(err);
                } else {
                    callback(null, collection);
                }
            });
        }
    };
    var proto = constructor.prototype;
    proto.get = function (parameters, callback) {
        var self = this;
        self.connect(function(err) {
            assert.equal(err, null);
            if (parameters === undefined) {
                parameters = {};
            }
            self.rawCommand(function(err, collection) {
                if (err != null) {
                    callback(err);
                } else {
                    collection.find(parameters).toArray(callback);
                }
            });
        })
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
        var self = this;
        self.connect(function(err) {
            if (err != null) {
                callback(error);
            } else if (!Array.isArray(objects)) {
                callback(new Error('First argument should be an array'));
            } else if (callback === undefined) {
                callback(new Error('Callback field is mandatory'));
            } else {
                self.rawCommand(function (err, collection) {
                    if (err != null) {
                        callback(err);
                    } else {
                        collection.insert(objects.map(self.processObject, self), callback);
                    }
                });
            }
        });
    };
    proto.delete = function (parameters, callback) {
        var self = this;
        if (parameters === undefined) {
            parameters = {};
        }
        self.connect(function(err) {
            if (err != null) {
                callback(err);
            } else {
                self.rawCommand(function (err, collection) {
                    if (err != null) {
                        callback(err);
                    } else {
                        collection.remove(parameters, callback);
                    }
                });
            }
        });
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
