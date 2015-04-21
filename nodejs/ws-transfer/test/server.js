assert = require('assert');
Server = require('../server.js');

describe('Server', function() {
    var s;
    beforeEach(function() {
        s = new Server();
    });
    describe('#getPort()', function() {
        it('exists', function() {
            assert.notStrictEqual(s.getPort, undefined);
        });
        it('default port is undefined', function() {
            assert.strictEqual(s.getPort(), undefined);
        });
    });
    describe('#setPort(port)', function() {
        it('exists', function() {
            assert.notStrictEqual(s.setPort, undefined);
        });
        it('doesn\'t throw any errors', function() {
            assert.doesNotThrow(function() { s.setPort(0) }, undefined);
        });
        it('changes the port number', function() {
            assert.strictEqual(s.getPort(), undefined);
            s.setPort(0);
            assert.strictEqual(s.getPort(), 0);
        });
    });
    describe('#init(port)', function() {
        it('exists', function() {
            assert.notStrictEqual(s.init, undefined);
        });
        it('doesn\'t throw any errors', function() {
            assert.doesNotThrow(function() { s.init(0) }, undefined);
        });
        it('changes the port number', function() {
            assert.strictEqual(s.getPort(), undefined);
            s.init(0);
            assert.strictEqual(s.getPort(), 0);
        });
    });
});
