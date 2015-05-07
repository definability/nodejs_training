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
            throw new Error('`fields\' in schema should be an array');
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
        if (_.isFunction(parameters)) {
            callback = parameters;
            parameters = {};
        }
        if (callback === undefined) {
            throw new Error('callback is mandatory');
        }
        var command = function(err, collection) {
            if (err != null) {
                callback(err);
                return;
            }
            collection.find(parameters).toArray(callback);
        };
        this.rawCommand(command.bind(this));
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
        if (Array.isArray(objects)) {
            var isInvalid = function (validationResult) {
                return Object.keys(validationResult).length > 0;
            };
            return objects.map(this.validate, this).filter(isInvalid);
        }
        var validateField = function (result, field) {
            var valid = field.validators.reduce(function (result, currentValidator) {
                return result && currentValidator.validate(objects[field.name]);
            }, true);
            if (!valid) {
                result[field.name] = valid;
            }
            return result;
        };
        return this.getSchema()['fields'].reduce(validateField, {});
    };
    proto.insert = function (objects, callback) {
        if (callback === undefined) {
            throw Error('Callback field is mandatory');
        }
        if (!Array.isArray(objects)) {
            objects = [objects];
        }
        var command = function (err, collection) {
            if (err != null) {
                callback(err);
                return;
            }
            var errors = this.validate(objects.map(this.getObjectFields, this));
            if (errors.length > 0) {
                callback(new Error(['Validation errors occured:', errors].join(' ')));
                return;
            }
            collection.insert(objects, callback);
        }
        this.rawCommand(command.bind(this));
    };
    proto.remove = function (parameters, callback) {
        if (callback === undefined) {
            throw new Error('callback is mandatory');
        }
        var command = function (err, collection) {
            if (err != null) {
                callback(err);
                return;
            }
            collection.remove(parameters, callback);
        };
        this.rawCommand(command.bind(this));
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
    proto.rawUpdate = function (parameters, query, callback) {
        this.rawCommand(function (err, collection) {
            if (err != null) {
                callback(err);
                return;
            }
            collection.update(parameters, query, {w: 1}, callback);
        });
    };
    proto.update = function (parameters, values, callback) {
        this.rawUpdate(parameters, {$set: values}, callback);
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
