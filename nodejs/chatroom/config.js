var MongoClient = require('mongodb').MongoClient;

var mongoURL = 'mongodb://localhost:27017/',
    DEFAULT_TABLE_NAME = 'chatroom',
    tableName = 'chatroom',
    dbURL = [mongoURL, tableName].join('/');

var connectMongoDB = function (callback) {
    MongoClient.connect(dbURL, callback);
};

var changeTableName = function (newTableName) {
    tableName = newTableName;
    dbURL = [mongoURL, tableName].join('/');
};

var resetTableName = function() {
    changeTableName(DEFAULT_TABLE_NAME);
};

module.exports = {connectMongoDB: connectMongoDB, changeTableName: changeTableName, resetTableName: resetTableName};
