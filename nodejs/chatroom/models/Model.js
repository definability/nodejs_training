var _ = require('lodash'),
    ObjectId = require('mongodb').ObjectId;

var MetaModel;

MetaModel = (function() {
    var metaConstructor = function (schemaInfo) {
        var constructor = function (res, next) {
            var database, collection, connected = false;
            var schema = {
                name: schemaInfo.name,
                fields: ['_id']
            };
            Array.prototype.push.apply(schema.fields, schemaInfo.fields);
            Object.freeze(schema);
            this.connect = function (db) {
                if (db !== undefined) {
                    database = db;
                }
                collection = database.collection(schema['name']);
                connected = true;
            };
            this.close = function (callback) {
                database.close(callback);
                connected = false;
            };
            this.isConnected = function() {
                return connected;
            };
            this.getSchema = function() {
                return schema;
            };
            this.getCollection = function() {
                return collection;
            }
        };
        var proto = constructor.prototype;
        proto.get = function (parameters, callback) {
            if (parameters === undefined) {
                parameters = {};
            }
            this.getCollection().find(parameters).toArray(callback);
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
            var error = null;
            if (!Array.isArray(objects)) {
                error = new Error('First argument should be an array');
            } else if (callback === undefined) {
                error = new Error('Callback field is mandatory');
            } else {
                this.getCollection().insert(objects.map(this.processObject, this), callback);
            }
            if (error != null) {
                callback(error);
            }
        };
        proto.delete = function (parameters, callback) {
            if (parameters === undefined) {
                parameters = {};
            }
            this.getCollection().remove(parameters, callback);
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
    }
    return metaConstructor;
})();

module.exports = {MetaModel: MetaModel};
