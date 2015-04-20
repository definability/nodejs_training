var assert = require("assert");
var Queue = require("../array.js").Queue;

describe('Queue', function(){
    describe('#push()', function(){
        it('should return undefined on push', function() {
            var q = new Queue();
            assert.equal(q.push(null), undefined);
            assert.equal(q.push(0), undefined);
        });
    });
    describe('#pop()', function(){
        it('should return undefined when empty', function() {
            var q = new Queue();
            assert.equal(q.pop(), undefined);
        });
        it('should return constructor arguments in direct order', function() {
            var q = new Queue(['a', 'b', 'c']);
            assert.equal(q.pop(), 'a');
            assert.equal(q.pop(), 'b');
            assert.equal(q.pop(), 'c');
        });
        it('should return first pushed value', function() {
            var q = new Queue();
            q.push(1);
            q.push(2);
            assert.equal(q.pop(), 1);
            assert.equal(q.pop(), 2);
        });
    });
});
