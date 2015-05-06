var assert = require('assert'),
    MetaModel = require('../models/MetaModel.js'),
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
        it('creates test model with proper schema successfully', function() {
            assert.doesNotThrow(function() { new MetaModel(schema) });
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
