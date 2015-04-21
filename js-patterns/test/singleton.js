var assert = require("assert");
var Singleton = require("../singleton.js").Singleton;

describe('Singleton', function() {
    describe('#constructor()', function() {
        it('should not be undefined', function() {
            var s = new Singleton();
            assert.notEqual(s, undefined);
        });
        it('should not be blank', function() {
            var s = new Singleton();
            assert.notDeepEqual(s, {});
        });
        it('should give equal instances on each constructor call', function() {
            var firstSingleton = new Singleton();
            var secondSingleton = new Singleton();
            assert.deepEqual(firstSingleton, secondSingleton);
        });
        it('should give only one instance on each constructor call', function() {
            var firstSingleton = new Singleton();
            var secondSingleton = new Singleton();
            assert.strictEqual(firstSingleton, secondSingleton);
        });
        it('changes in one instance should provoke equal changes in other instances', function() {
            var firstSingleton = new Singleton();
            var secondSingleton = new Singleton();
            firstSingleton.a = 0;
            assert.deepEqual(firstSingleton, secondSingleton);
        });
        it('changes in one instance should provoke equal changes in new instances', function() {
            var firstSingleton = new Singleton();
            firstSingleton.a = 0;
            var secondSingleton = new Singleton();
            assert.deepEqual(firstSingleton, secondSingleton);
        });
    });
    describe('#constructor(reset)', function() {
        it('Field __test_field__ should be undefined', function() {
            var s = new Singleton();
            assert.equal(s.__test_field__, undefined);
        });
        it('Field __test_field__ should be modifiable', function() {
            var s = new Singleton();
            s.__test_field__ = 'test value';
            assert.equal(s.__test_field__, 'test value');
        });
        it('Changes in__test_field__ should be valid in further tests', function() {
            var s = new Singleton();
            assert.equal(s.__test_field__, 'test value');
        });
        it('should return __test_field__ to undefined when `reset\' is true', function() {
            var s = new Singleton(true);
            assert.equal(s.__test_field__, undefined);
        });
    });
    describe('#__constProperties', function() {
        it('should exist', function() {
            var s = new Singleton();
            assert.notEqual(s.__constProperties, undefined);
        });
        describe('#isSingleton', function() {
            it('should exist', function() {
                var s = new Singleton();
                assert.notEqual(s.__constProperties.isSingleton, undefined);
            });
            it('should be true', function() {
                var s = new Singleton();
                assert.equal(s.__constProperties.isSingleton, true);
            });
            it('cannot be changed directly', function() {
                var s = new Singleton();
                s.__constProperties.isSingleton = false;
                assert.equal(s.__constProperties.isSingleton, true);
            });
            it('can be changed via __constProperties replacing', function() {
                var s = new Singleton();
                s.__constProperties = {
                    isSingleton: false
                };
                assert.equal(s.__constProperties.isSingleton, false);
            });
            it('changes are valid between different tests', function() {
                var s = new Singleton();
            });
            it('can be frozen again via __constProperties replacing', function() {
                var s = new Singleton();
                s.__constProperties = Object.freeze({
                    isSingleton: true
                });
                s.__constProperties.isSingleton = false;
                assert.equal(s.__constProperties.isSingleton, true);
            });
        });
    });
}); 
