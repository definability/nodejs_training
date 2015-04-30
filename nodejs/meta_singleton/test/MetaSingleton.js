var assert = require("assert"),
    MetaSingleton = require("../MetaSingleton.js");

var Singleton, SecondSingleton;
(function() {

    var ExampleClass = (function() {
        var constructor = function() {
        };
        var self = constructor.prototype;
        self.something = 'something';
        return constructor;
    })();
    var SecondClass = (function() {
        var constructor = function() {
        };
        var self = constructor.prototype;
        self.another = 'another thing';
        return constructor;
    })();

    Singleton = new MetaSingleton(ExampleClass);
    SecondSingleton = new MetaSingleton(SecondClass);
})();

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
        it('works fine with two singletons', function() {
            //console.log(new Singleton(), new SecondSingleton());
            assert.strictEqual(new Singleton(), new Singleton());
            assert.strictEqual(new SecondSingleton(), new SecondSingleton());
            assert.notStrictEqual(new Singleton(), new SecondSingleton());
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
