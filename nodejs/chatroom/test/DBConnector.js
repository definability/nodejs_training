var assert = require('assert'),
    dbConnector = require('../db_connector/connector.js');

describe('dbConnector', function() {
    it('connects successfully', function (done) {
        var callback = function (err, db) {
            assert.equal(err, null);
            done();
        };
        dbConnector.connect(callback);
    });
    it('disconnects successfully', function (done) {
        var callback = function (err, db) {
            assert.equal(err, null);
            done();
        };
        dbConnector.close(callback);
    });
    it('cannot close connection if it\'t not opened', function (done) {
        var callback = function (err, db) {
            assert.notEqual(err, null);
            done();
        };
        dbConnector.close(callback);
    });
});
