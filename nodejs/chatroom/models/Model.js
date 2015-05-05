var _ = require('lodash'),
    assert = require('assert'),
    ObjectId = require('mongodb').ObjectId,
    getDBCollection = require('../db_connector/connector.js').getCollection,
    MetaSingleton = require('MetaSingleton');

var MetaModel;

var Model = (function() {
    var instance = null;
    var constructor = function (schemaInfo, methods) {
        var schema = {
                name: schemaInfo.name,
                fields: [{name: '_id', validators: []}]
            };
        Array.prototype.push.apply(schema.fields, schemaInfo.fields);
        Object.freeze(schema);
        this.getSchema = function() {
            return schema;
        };
        this.rawCommand = function (callback) {
            callback(null, getDBCollection(schema['name']));
        };
        if (methods !== undefined) {
            for (var m in methods) {
                this[m] = methods[m].bind(this);
            }
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
    proto.processObject = function (object) {
        return _.pick(object, _.pluck(this.getSchema()['fields'], 'name'));
    }
    proto.validate = function (object) {
        var result = {};
        for (var key in this.getSchema()['fields']) {
            var field = this.getSchema()['fields'][key];
            var name = field['name'];
            var validators = field['validators'];
            var value = object[key];
            result[name] = validators.reduce(function (result, currentValidator) {
                return result & currentValidator.validate(value);
            }, true);
        }
        return result;
    };
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
            objects = objects.map(self.processObject, self);
            var errors = objects.reduce(function (result, currentObject) {
                var validationResult = self.validate(currentObject);
                if (_.invert(validationResult, true)[false] !== undefined) {
                    result.push({object: currentObject, validation: validationResult});
                }
                return result;
            }, []);
            if (errors.length > 0) {
                callback(new Error(['Validation errors occured:', errors].join(' ')));
                return;
            }
            collection.insert(objects, callback);
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
    proto.put = function (parameters, values, callback) {
        if (parameters === undefined) {
            parameters = {};
        }
        this.rawCommand(function (err, collection) {
            if (err != null) {
                callback(err);
                return;
            }
            collection.update(parameters, {$set: values}, {w: 1}, callback);
        });
    };
    return constructor;
})();

MetaModel = (function() {
    var constructor = function (schemaInfo, methods) {
        var ModelSingleton = new MetaSingleton(function() {
            // This singleton calls constructor with parameters
            return new Model(schemaInfo, methods);
        });
        var concreteModelSingleton = new ModelSingleton();
        return function() {
            return concreteModelSingleton;
        };
    };
    return constructor;
})();

module.exports = MetaModel;
