var dbConfig = require('config').dbConfig,
    MongoClient = require('mongodb').MongoClient;

var mongoDB,
    connectionAddress = [dbConfig.url, dbConfig.database].join('');
var connectMongoDB = function (callback) {
    MongoClient.connect(connectionAddress, function(err, db) {
        if (err != null) {
            callback(err);
            return;
        }
        mongoDB = db;
        callback(null, db);
    });
};

var getCollection = function (name) {
    return mongoDB.collection(name);
};

var closeMongoDB = function (callback) {
    if (mongoDB === undefined) {
        callback(new Error('You have not connected to the database yet'));
    }
    mongoDB.close(function (err, result) {
        if (err != null) {
            callback(err);
        }
        callback(null, result);
    });
};

module.exports = {connect: connectMongoDB, close: closeMongoDB,
                  getCollection: getCollection};
