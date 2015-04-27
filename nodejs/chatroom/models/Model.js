var createModel;

createModel = function (schemaInfo) {
    var constructor = function (res, next) {
        var db, collection;
        var schema = {
            name: schemaInfo.name,
            fields: ['_id']
        };
        Array.prototype.push.apply(schema.fields, schemaInfo.fields);
        Object.freeze(schema);
        this.showResults = function() {
            var results = this.getResults(parameters);
            if (results === undefined) {
                var err = new Error('Not Found');
                err.status = 404;
                next(err);
                return;
            } else {
                res.json(results);
            }
        };
        this.connect = function (db) {
            collection = db.collection(schema['name']);
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
        this.getCollection().find(parameters, callback);
    };
    proto.post = function (objects, callback) {
        if (Object.isObject(objects)) {
            objects = [objects];
        } else if (!Array.isArray(objects)) {
            throw Error('Bad type of parameters');
        } else {
            collection.insert(objects, callback);
        }
    };
    return constructor;
};

module.exports = {createModel: createModel};
