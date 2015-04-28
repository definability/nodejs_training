var _ = require('lodash');

var createModel;

createModel = function (schemaInfo) {
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
        this.close = function (forced) {
            database.close();
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
    proto.processObject = function (newObject) {
        return _.pick(newObject, this.getSchema().fields);
    }
    proto.post = function (objects, callback) {
        if (!Array.isArray(objects)) {
            throw Error('First argument should be an array');
        } else if (callback === undefined) {
            throw Error('Callback field is mandatory');
        } else {
            this.getCollection().insert(objects.map(this.processObject, this), callback);
        }
    };
    proto.delete = function (parameters, callback) {
        if (parameters === undefined) {
            parameters = {};
        }
        this.getCollection().remove(parameters, callback);
    };
    return constructor;
};

module.exports = {createModel: createModel};
