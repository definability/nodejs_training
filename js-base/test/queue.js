var assert = require("assert");
var Queue = require("../array.js").Queue;

describe('Queue', function(){
    var q;
    beforeEach(function() {
        q = new Queue();
    });
    describe('#push(value)', function(){
        it('should return undefined on pushing null', function() {
            assert.equal(q.push(null), undefined);
        });
        it('should return undefined on pushing 0', function() {
            assert.equal(q.push(0), undefined);
        });
    });
    describe('#pop()', function(){
        it('should return undefined when empty', function() {
            assert.equal(q.pop(), undefined);
        });
        it('should return constructor arguments in direct order', function() {
            q = new Queue(['a', 'b', 'c']);
            assert.equal(q.pop(), 'a');
            assert.equal(q.pop(), 'b');
            assert.equal(q.pop(), 'c');
        });
        it('should return first pushed value', function() {
            q.push(1);
            q.push(2);
            assert.equal(q.pop(), 1);
            assert.equal(q.pop(), 2);
        });
    });
});
