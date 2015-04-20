var assert = require("assert");
var Cache = require("../cache.js").Cache;

describe('Cache', function() {
    var c;
    beforeEach(function() {
        c = new Cache();
    });
    describe('#add(key, value)', function(){
        it('should return undefined on success add', function() {
            assert.equal(c.add('key', 'value'), undefined);
        });
        it('should throw an error if `value\' is not set', function() {
            assert.throws(function() { c.add('key') });
        });
        it('should throw an error if `key\' is not set', function() {
            assert.throws(function() { c.add() });
        });
        it('should throw an error if `key\' is not unique', function() {
            c.add('key', 'value');
            assert.throws(function() { c.add('key') });
        });
    });
    describe('#get(key)', function(){
        it('should return undefined on get from blank cache', function() {
            assert.equal(c.get('key'), undefined);
        });
        it('should properly get values from cache', function() {
            c.add('key', 'value');
            assert.equal(c.get('key'), 'value');
            c.add('root', 1024);
            assert.equal(c.get('root'), 1024);
            assert.equal(c.get('key'), 'value');
        });
    });
    describe('#update(key, value)', function(){
        it('should return undefined on success add (if key wasn\'t exist in the cache)', function() {
            assert.equal(c.update('key', 'value'), undefined);
        });
        it('should throw an error if `value\' is not set', function() {
            assert.throws(function() { c.update('key') });
        });
        it('should throw an error if `key\' is not set', function() {
            assert.throws(function() { c.update() });
        });
        it('should change the value if key exists in the cache', function() {
            c.add('key', 'value');
            c.update('key', 'another value');
            assert.equal(c.get('key'), 'another value');
        });
    });
    describe('#delete(key)', function(){
        it('should return undefined', function() {
            assert.equal(c.delete('key'), undefined);
            c.add('key', 'value');
            assert.equal(c.delete('key'), undefined);
        });
        it('should delete value assigned to `key\'', function() {
            c.add('key', 'value');
            assert.equal(c.get('key'), 'value');
            c.delete('key');
            assert.equal(c.get('key'), undefined);
        });
    });
    describe('#find(query)', function(){
        it('should return blank array if no matches found', function() {
            assert.deepEqual(c.find('key'), []);
        });
        it('should return array of matches if they were found', function() {
            c.add('valuableKey', 'value');
            c.add('nextKey', 'next value');
            c.add('ordinaryKey', 'ordinary value');
            c.add('somethingElse', 'else');
            c.add('and more', 'more');
            assert.deepEqual(c.find('value'), [
                    {valuableKey: 'value'},
                    {nextKey: 'next value'},
                    {ordinaryKey: 'ordinary value'}
                ]);
        });
    });
    describe('#count([key])', function(){
        it('should return 0 if cache is blank', function() {
            assert.equal(c.count(), 0);
        });
        it('should return 0 if key doesn\'t exist', function() {
            c.add('key', 'value');
            assert.equal(c.count('wrong key'), 0);
        });
        it('should return value length if key exists', function() {
            c.add('key', '123');
            assert.equal(c.count('key'), 3);
        });
        it('should return all values lengths if key wasn\'t set', function() {
            c.add('word', '123');
            c.add('number', 123);
            assert.equal(c.count(), 6);
        });
    });
});
