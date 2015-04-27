var createModel;

createModel = function (schemaInfo) {
    var constructor = function (res, next) {
        var database, collection;
        var schema = {
            name: schemaInfo.name,
            fields: ['_id']
        };
        var toJSON = function(record) {
            return schema.fields.reduce(function(result, field) {
                result[field] = record[field];
                return result;
            }, {});
        };
        var parsers = {
            json: toJSON
        };
        Array.prototype.push.apply(schema.fields, schemaInfo.fields);
        Object.freeze(schema);
        this.connect = function (db) {
            if (db !== undefined) {
                database = db;
            }
            collection = database.collection(schema['name']);
        };
        this.close = function (forced) {
            if (forced === undefined) {
                forced = false;
            }
            if (forced) {
                try {
                    database.close();
                } catch(e) {
                }
            } else if (database !== undefined) {
                database.close();
            } else {
                throw Error('You have not connected to database yet');
            }
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
        return this.getSchema()['fields'].reduce(function (result, field) {
            if (newObject[field] !== undefined) {
                result[field] = newObject[field];
            }
            return result;
        }, {});
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
