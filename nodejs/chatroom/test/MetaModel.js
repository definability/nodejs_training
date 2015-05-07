var assert = require('assert'),
    MetaModel = require('../models/MetaModel.js'),
    ObjectId = require('mongodb').ObjectId,
    Validator = require('../models/Validator.js').Validator,
    defaultValidators = require('../models/Validator.js').defaultValidators,
    _ = require('lodash'),
    dbConnector = require('../db_connector/connector.js');

describe('MetaModel', function() {
    before(function (done) {
        dbConnector.connect(function (err, db) {
            assert.equal(err, null);
            done();
        });
    });
    after(function (done) {
        dbConnector.close(function (err, db) {
            assert.equal(err, null);
            done();
        });
    });
    describe('=Basic methods=', function() {
        describe('#constructor(schema, methods)', function() {
            var schema;
            before(function() {
                schema = {
                    name: 'test',
                    fields: []
                };
                idField = {name: '_id', validators: []};
            });
            it('can\'t create model without parameters', function() {
                assert.throws(function() { new MetaModel() });
            });
            it('can\'t create model with blank schema', function() {
                assert.throws(function() { new MetaModel({}) });
            });
            it('can\'t create model without fields array in schema', function() {
                assert.throws(function() { new MetaModel({name: 'test'}) });
            });
            it('can\'t create model without schema name', function() {
                assert.throws(function() { new MetaModel({fields: []}) });
            });
            it('can\'t create model if `fields\' is not an array', function() {
                assert.throws(function() { new MetaModel({fields: null}) });
            });
            it('creates test model with proper schema successfully', function() {
                assert.doesNotThrow(function() { new MetaModel(schema) });
            });
            it('extends model successfully', function(done) {
                var TestModel = new MetaModel(schema, {
                    testMethod: function() {
                        done();
                    }
                });
                var testInstance = new TestModel();
                testInstance.testMethod();
            });
            it('context in new model methods is correct', function() {
                var TestModel = new MetaModel(schema, {
                    testMethod: function() {
                        return this;
                    }
                });
                var testInstance = new TestModel();
                assert.strictEqual(testInstance.testMethod(), testInstance);
            });
            it('model is a singleton', function() {
                var TestModel = new MetaModel(schema);
                var test1 = new TestModel();
                var test2 = new TestModel();
                assert.strictEqual(test1, test2);
            });
        });
        describe('#getSchema()', function() {
            before(function() {
            });
            it('schema name stored correctly', function() {
                var schema = {
                    name: 'test',
                    fields: []
                };
                var idField = {name: '_id', validators: []};
                var TestModel = new MetaModel(schema);
                var testInstance = new TestModel();
                assert.equal(testInstance.getSchema()['name'], 'test');
            });
            it('model without fields specified has only _id field', function() {
                var schema = {
                    name: 'test',
                    fields: []
                };
                var idField = {name: '_id', validators: []};
                var TestModel = new MetaModel(schema);
                var testInstance = new TestModel();
                assert.deepEqual(testInstance.getSchema()['fields'], [idField]);
            });
            it('model with fields has _id field and new fields', function() {
                var schema = {
                    name: 'test',
                    fields: [{
                        name: 'first',
                        validators: []
                    }, {
                        name: 'second',
                        validators: []
                    }]
                };
                var idField = {name: '_id', validators: []};
                var TestModel = new MetaModel(schema);
                var testInstance = new TestModel();
                assert.deepEqual(testInstance.getSchema()['fields'].sort(), _.union([idField], schema.fields).sort());
            });
        });
        describe('#getObjectFields(object)', function() {
            it('returns only fields specified in schema', function() {
                var schema = {
                    name: 'test',
                    fields: [{
                        name: 'first',
                        validators: []
                    }, {
                        name: 'second',
                        validators: []
                    }]
                };
                var newObject, processedObject;
                var TestModel = new MetaModel(schema);
                var testInstance = new TestModel();
                newObject = {first: 'value1', unknownField: 'Unknown value'};
                processedObject = testInstance.getObjectFields(newObject);
                assert.notDeepEqual(processedObject, newObject);
                assert.deepEqual(processedObject, {first: 'value1'});
            });
        });
        describe('#validate(objects)', function() {
            it('validates mandatory field successfully if it exists', function() {
                var schema = {
                    name: 'test',
                    fields: [{
                        name: 'first',
                        validators: [defaultValidators.mandatory]
                    }]
                };
                var TestModel = new MetaModel(schema);
                var testInstance = new TestModel();
                assert.deepEqual(testInstance.validate({first: 'value'}), {});
            });
            it('mandatory field doesn\'t pass validation if it wasn\'t set', function() {
                var schema = {
                    name: 'test',
                    fields: [{
                        name: 'first',
                        validators: [defaultValidators.mandatory]
                    }]
                };
                var TestModel = new MetaModel(schema);
                var testInstance = new TestModel();
                assert.notDeepEqual(testInstance.validate({}), {});
                assert.notDeepEqual(testInstance.validate({second: 'value'}), {});
            });
        });
    });
    describe('=DataBase commands=', function() {
        var Test;
        before(function() {
            var schema = {
                name: 'test',
                fields: [{
                    name: 'first',
                    validators: [defaultValidators.mandatory]
                }]
            };
            var TestModel = new MetaModel(schema);
            Test = new TestModel();
        });
        describe('#rawCommand(callback)', function() {
            it('calls callback', function (done) {
                Test.rawCommand(function (err, collection) {
                    done();
                });
            });
            it('gets collection without errors', function (done) {
                Test.rawCommand(function (err, collection) {
                    assert.equal(err, null);
                    done();
                });
            });
            describe('-find', function() {
                it('works without errors', function (done) {
                    var command, onExecuted;
                    onExecuted = function (err, result) {
                        assert.equal(err, null);
                        done();
                    };
                    command = function (err, collection) {
                        assert.equal(err, null);
                        collection.find({}, onExecuted);
                    };
                    Test.rawCommand(command);
                });
            });
            describe('-insert', function() {
                it('works without errors', function (done) {
                    var command, onExecuted;
                    onExecuted = function (err, result) {
                        assert.equal(err, null);
                        done();
                    };
                    command = function (err, collection) {
                        assert.equal(err, null);
                        collection.insert([{key: 'value'}], onExecuted);
                    };
                    Test.rawCommand(command);
                });
                it('inserts document properly', function (done) {
                    var command, onExecuted;
                    onExecuted = function (err, results) {
                        assert.equal(err, null);
                        assert.equal(results.length, 1);
                        assert.equal(results[0].key, 'value');
                        done();
                    };
                    command = function (err, collection) {
                        assert.equal(err, null);
                        collection.find({}).toArray(onExecuted);
                    };
                    Test.rawCommand(command);
                });
            });
            describe('-update', function() {
                it('works without errors', function (done) {
                    var command, onExecuted;
                    onExecuted = function (err, result) {
                        assert.equal(err, null);
                        done();
                    };
                    command = function (err, collection) {
                        assert.equal(err, null);
                        collection.update({key: 'value'}, {$set: {key: 'new value'}}, {w: 1}, onExecuted);
                    };
                    Test.rawCommand(command);
                });
                it('updates document properly', function (done) {
                    var command, onExecuted;
                    onExecuted = function (err, results) {
                        assert.equal(err, null);
                        assert.equal(results.length, 1);
                        assert.equal(results[0].key, 'new value');
                        done();
                    };
                    command = function (err, collection) {
                        assert.equal(err, null);
                        collection.find({}).toArray(onExecuted);
                    };
                    Test.rawCommand(command);
                });
            });
            describe('-remove', function() {
                it('works without errors', function (done) {
                    var command, onExecuted;
                    onExecuted = function (err, result) {
                        assert.equal(err, null);
                        assert.equal(result.result.ok, 1);
                        assert.equal(result.result.n, 1);
                        done();
                    };
                    command = function (err, collection) {
                        assert.equal(err, null);
                        collection.remove({}, onExecuted);
                    };
                    Test.rawCommand(command);
                });
                it('removes documents', function (done) {
                    var command, onExecuted;
                    onExecuted = function (err, results) {
                        assert.equal(err, null);
                        assert.equal(results.length, 0);
                        done();
                    };
                    command = function (err, collection) {
                        assert.equal(err, null);
                        collection.find({}).toArray(onExecuted);
                    };
                    Test.rawCommand(command);
                });
            });
        });
        describe('#find(parameters, callback)', function() {
            it('doesn\'t work without callback', function() {
                assert.throws(function() { Test.find(null); });
            });
            it('works without errors', function (done) {
                var onExecuted;
                onExecuted = function (err, result) {
                    assert.equal(err, null);
                    done();
                };
                Test.find({}, onExecuted);
            });
            it('works if the only parameter is a callback', function (done) {
                var onExecuted;
                onExecuted = function (err, result) {
                    assert.equal(err, null);
                    done();
                };
                Test.find(onExecuted);
            });
            it('finds all entries if no search parameters were set', function (done) {
                var onInserted, onFound, onRemoved, command, entryId;
                onRemoved = function (callback) {
                    return function (err, result) {
                        assert.equal(err, null);
                        assert.equal(result.result.ok, 1);
                        assert.equal(result.result.n, 1);
                        callback();
                    };
                };
                onFound = function (callback) {
                    return function (err, result) {
                        assert.equal(result.length, 1);
                        assert.equal(ObjectId(result[0]['_id']).equals(entryId), true);
                        Test.removeById(entryId, callback);
                    };
                };
                onInserted = function (callback) {
                    return function (err, result) {
                        assert.equal(err, null);
                        entryId = result.ops[0]['_id'];
                        Test.find(callback);
                    };
                };
                command = function (callback) {
                    return function (err, collection) {
                        assert.equal(err, null);
                        collection.insert([{key: 'value'}], callback);
                    };
                };
                _.flowRight(Test.rawCommand, command, onInserted, onFound, onRemoved)(done);
            });
        });
        describe('#findById(id, callback)', function() {
            it('doesn\'t work without callback', function() {
                assert.throws(function() { Test.findById(null); });
            });
            it('throws an error if id is not valid', function (done) {
                var onExecuted;
                onExecuted = function (err, result) {
                    assert.notEqual(err, null);
                    done();
                };
                assert.throws(Test.findById('invalid id', onExecuted));
            });
            it('finds entry by id', function (done) {
                var onInserted, onFound, onRemoved, command, entryId;
                onRemoved = function (callback) {
                    return function (err, result) {
                        assert.equal(err, null);
                        assert.equal(result.result.ok, 1);
                        assert.equal(result.result.n, 1);
                        callback();
                    };
                };
                onFound = function (callback) {
                    return function (err, result) {
                        assert.equal(err, null);
                        assert.equal(result.length, 1);
                        assert.equal(ObjectId(result[0]['_id']).equals(entryId), true);
                        Test.removeById(entryId, callback);
                    };
                };
                onInserted = function (callback) {
                    return function (err, result) {
                        assert.equal(err, null);
                        entryId = result.ops[0]['_id'];
                        Test.findById(entryId, callback);
                    };
                };
                command = function (callback) {
                    return function (err, collection) {
                        assert.equal(err, null);
                        collection.insert([{key: 'value'}], callback);
                    };
                };
                _.flowRight(Test.rawCommand, command, onInserted, onFound, onRemoved)(done);
            });
        });
        describe('#insert(parameters, callback)', function() {
            it('doesn\'t work without callback', function() {
                assert.throws(function() { Test.insert(null); });
            });
            it('inserts nothing on blank array', function (done) {
                var onExecuted;
                onExecuted = function (err, result) {
                    assert.equal(err, null);
                    assert.equal(result.result.ok, 1);
                    assert.equal(result.result.n, 0);
                    done();
                };
                Test.insert([], onExecuted);
            });
            it('works without errors on valid object', function (done) {
                var onExecuted;
                onExecuted = function (err, result) {
                    assert.equal(err, null);
                    done();
                };
                Test.insert({first: 'value'}, onExecuted);
            });
            it('works without errors on valid array', function (done) {
                var onExecuted;
                onExecuted = function (err, result) {
                    assert.equal(err, null);
                    done();
                };
                Test.insert([{first: 'next value'}], onExecuted);
            });
            it('throws error if validation failed', function (done) {
                var onExecuted;
                onExecuted = function (err, result) {
                    assert.notEqual(err, null);
                    done();
                };
                Test.insert([{key: 'value'}], onExecuted);
            });
            it('inserts documents properly', function (done) {
                var onExecuted;
                onExecuted = function (err, results) {
                    assert.equal(err, null);
                    assert.equal(results.length, 2);
                    assert.equal(results[0].first, 'value');
                    done();
                };
                Test.find(onExecuted);
            });
        });
        describe('#rawUpdate(parameters, query, callback)', function() {
            it('doesn\'t work without callback', function() {
                assert.throws(function() { Test.rawUpdate(null); });
            });
            it('works without errors', function (done) {
                var onExecuted;
                onExecuted = function (err, result) {
                    assert.equal(err, null);
                    done();
                };
                Test.rawUpdate({first: 'value'}, {$set: {first: 'pretty value'}}, onExecuted);
            });
            it('updates document properly', function (done) {
                var onExecuted;
                onExecuted = function (err, results) {
                    assert.equal(err, null);
                    assert.equal(results.length, 1);
                    assert.equal(results[0].first, 'pretty value');
                    done();
                };
                Test.find({first: 'pretty value'}, onExecuted);
            });
        });
        describe('#update(parameters, values, callback)', function() {
            it('doesn\'t work without callback', function() {
                assert.throws(function() { Test.update(null); });
            });
            it('works without errors', function (done) {
                var onExecuted;
                onExecuted = function (err, result) {
                    assert.equal(err, null);
                    done();
                };
                Test.update({first: 'pretty value'}, {first: 'new value'}, onExecuted);
            });
            it('updates document properly', function (done) {
                var onExecuted;
                onExecuted = function (err, results) {
                    assert.equal(err, null);
                    assert.equal(results.length, 1);
                    assert.equal(results[0].first, 'new value');
                    done();
                };
                Test.find({first: 'new value'}, onExecuted);
            });
        });
        describe('#remove(parameters, callback)', function() {
            it('doesn\'t work without callback', function() {
                assert.throws(function() { Test.remove(null); });
            });
            it('works without errors', function (done) {
                var onExecuted;
                onExecuted = function (err, result) {
                    assert.equal(err, null);
                    assert.equal(result.result.ok, 1);
                    assert.equal(result.result.n, 2);
                    done();
                };
                Test.remove({}, onExecuted);
            });
            it('removes documents', function (done) {
                var onExecuted;
                onExecuted = function (err, results) {
                    assert.equal(err, null);
                    assert.equal(results.length, 0);
                    done();
                };
                Test.find(onExecuted);
            });
        });
        describe('#removeById(parameters, callback)', function() {
            it('doesn\'t work without callback', function() {
                assert.throws(function() { Test.removeById(null); });
            });
            it('cannot remove object by incorrect id', function (done) {
                var callback = function (err, result) {
                    assert.notEqual(err, null);
                    done();
                };
                Test.removeById({_id: '1'}, callback);
            });
        });
    });
});
