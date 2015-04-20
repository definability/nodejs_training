var assert = require("assert");
var Stack = require("../array.js").Stack;

describe('Stack', function(){
    describe('#push()', function(){
        it('should return undefined on push', function() {
            var s = new Stack();
            assert.equal(s.push(null), undefined);
            assert.equal(s.push(0), undefined);
        });
    });
    describe('#pop()', function(){
        it('should return undefined when empty', function() {
            var s = new Stack();
            assert.equal(s.pop(), undefined);
        });
        it('should return constructor arguments in reversed order', function() {
            var s = new Stack(['a', 'b', 'c']);
            assert.equal(s.pop(), 'c');
            assert.equal(s.pop(), 'b');
            assert.equal(s.pop(), 'a');
        });
        it('should return last pushed value', function() {
            var s = new Stack();
            s.push(1);
            s.push(2);
            assert.equal(s.pop(), 2);
            assert.equal(s.pop(), 1);
        });
    });
});
