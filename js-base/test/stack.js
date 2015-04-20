var assert = require("assert");
var Stack = require("../array.js").Stack;

describe('Stack', function() {
    var s;
    beforeEach(function() {
        s = new Stack();
    });
    describe('#push(value)', function() {
        it('should return undefined on pushing null', function() {
            assert.equal(s.push(null), undefined);
        });
        it('should return undefined on pushing 0', function() {
            assert.equal(s.push(0), undefined);
        });
    });
    describe('#pop()', function(){
        it('should return undefined when empty', function() {
            assert.equal(s.pop(), undefined);
        });
        it('should return constructor arguments in reversed order', function() {
            s = new Stack(['a', 'b', 'c']);
            assert.equal(s.pop(), 'c');
            assert.equal(s.pop(), 'b');
            assert.equal(s.pop(), 'a');
        });
        it('should return last pushed value', function() {
            s.push(1);
            s.push(2);
            assert.equal(s.pop(), 2);
            assert.equal(s.pop(), 1);
        });
    });
});
