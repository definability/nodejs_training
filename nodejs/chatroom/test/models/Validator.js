var assert = require('assert'),
    Validator = require('../../models/Validator.js').Validator,
    defaultValidators = require('../../models/Validator.js').defaultValidators;

describe('Validator', function() {
    describe('#constructor(validate)', function() {
        it('should successfully create validator without parameters', function() {
            assert.doesNotThrow(function() {
                var v = new Validator();
            });
        });
        it('should successfully create validator with parameter', function() {
            assert.doesNotThrow(function() {
                var validate = function() {
                    return true;
                };
                var v = new Validator(validate);
            });
        });
    });
    describe('#validate(field)', function() {
        it('should validate anything if created without parameters', function() {
            var v = new Validator();
            assert.equal(v.validate(undefined), true);
        });
        it('should execute validation function when created with parameter', function() {
            var v = new Validator(function(field) {
                return false;
            });
            assert.equal(v.validate(undefined), false);
        });
        it('validation result depends on validation parameter', function() {
            var v = new Validator(function(field) {
                return field === undefined;
            });
            assert.equal(v.validate(undefined), true);
            assert.equal(v.validate(null), false);
        });
    });
});
describe('defaultValidators', function() {
    describe('#mandatory', function() {
        it('exists', function() {
            assert.notStrictEqual(defaultValidators['mandatory'], undefined);
        })
        it('checks wether field value exists or not', function() {
            var dict = {
                existing: 'value'
            };
            assert.equal(defaultValidators.mandatory.validate(dict['existing']), true);
            assert.equal(defaultValidators.mandatory.validate(dict['notExisting']), false);
        });
    });
});
