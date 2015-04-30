var _ = require('lodash'),
    assert = require('assert'),
    ObjectId = require('mongodb').ObjectId,
    getDBCollection = require('../db_connector/connector.js').getCollection;

var MetaModel;

var Model = (function() {
    var constructor = function (schemaInfo) {
        var schema = {
                name: schemaInfo.name,
                fields: ['_id']
            };
        Array.prototype.push.apply(schema.fields, schemaInfo.fields);
        Object.freeze(schema);
        this.getSchema = function() {
            return schema;
        };
        this.rawCommand = function (callback) {
            callback(null, getDBCollection(schema['name']));
        };
    };
    var proto = constructor.prototype;
    proto.get = function (parameters, callback) {
        if (parameters === undefined) {
            parameters = {};
        }
        var command = function(err, collection) {
            if (err != null) {
                callback(err);
                return;
            }
            collection.find(parameters).toArray(callback);
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
        if (!Array.isArray(objects)) {
            callback(new Error('First argument should be an array'));
            return;
        } else if (callback === undefined) {
            callback(new Error('Callback field is mandatory'));
            return;
        }
        var self = this;
        self.rawCommand(function (err, collection) {
            if (err != null) {
                callback(err);
                return;
            }
            collection.insert(objects.map(self.processObject, self), callback);
        });
    };
    proto.delete = function (parameters, callback) {
        if (parameters === undefined) {
            parameters = {};
        }
        this.rawCommand(function (err, collection) {
            if (err != null) {
                callback(err);
                return;
            }
            collection.remove(parameters, callback);
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
        var ModelSingleton = new MetaSingleton(function() {
            // This singleton calls constructor with parameters
            return new Model(schemaInfo);
        });
        var concreteModelSingleton = new ModelSingleton();
        return function() {
            return concreteModelSingleton;
        };
    };
    return constructor;
})();

module.exports = {MetaModel: MetaModel};
