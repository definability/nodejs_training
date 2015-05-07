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
        if (schemaInfo.fields === undefined) {
            throw new Error('`fields\' in schema is a mandatory field');
        } else if (!Array.isArray(schemaInfo.fields)) {
            throw new Error('`fields\' in schema should be array');
        } else if (schemaInfo.name === undefined) {
            throw new Error('`name\' in schema is a mandatory field');
        }
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
    proto.find = function (parameters, callback) {
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
        this.find({_id: objectId}, callback);
    };
    proto.getObjectFields = function (object) {
        return _.pick(object, _.pluck(this.getSchema()['fields'], 'name'));
    }
    proto.validate = function (objects) {
        var self = this;
        if (Array.isArray(objects)) {
            var result = [];
            for (var i in objects) {
                var v = this.validate(objects[i]);
                if (Object.keys(v).length > 0) {
                    result.push(v);
                }
            }
            return result;
        }
        var validationResults = {};
        for (var key in this.getSchema()['fields']) {
            var field = this.getSchema()['fields'][key];
            var name = field['name'];
            var validators = field['validators'];
            var value = objects[name];

            var currentFieldValidation = validators.reduce(function (result, currentValidator) {
                return result && currentValidator.validate(value);
            }, true);
            if (currentFieldValidation !== true) {
                validationResults[name] = currentFieldValidation;
            }
        }
        return validationResults;
    };
    proto.insert = function (objects, callback) {
        if (callback === undefined) {
            callback(new Error('Callback field is mandatory'));
            return;
        }
        if (!Array.isArray(objects)) {
            objects = [objects];
        }
        var self = this;
        self.rawCommand(function (err, collection) {
            if (err != null) {
                callback(err);
                return;
            }
            objects = objects.map(self.getObjectFields, self);
            var errors = self.validate(objects);
            if (errors.length > 0) {
                callback(new Error(['Validation errors occured:', errors].join(' ')));
                return;
            }
            collection.insert(objects, callback);
        });
    };
    proto.remove = function (parameters, callback) {
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
    proto.removeById = function (id, callback) {
        var objectId;
        try {
            objectId = ObjectId(id);
        } catch (e) {
            callback(e);
            return;
        }
        this.remove({_id: objectId}, callback);
    };
    proto.update = function (parameters, values, callback) {
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
