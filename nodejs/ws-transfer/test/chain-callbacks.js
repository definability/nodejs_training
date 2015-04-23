var assert = require("assert");
var chain = require("../chain-callbacks.js");

var makeChain = chain.makeChain,
    callChain = chain.callChain;

describe('Chain callbacks', function() {
    var functions;
    beforeEach(function() {
        functions = [];
    });
    describe('#makeChain(functions)', function() {
        it('returns blank function if called without parameters', function() {
            assert.equal(makeChain()(), undefined);
        });
        it('returns blank function if functions array is blank', function() {
            assert.equal(makeChain(functions)(), undefined);
        });
        it('returns one function if it\'s the only entry in array', function() {
            var getZero = function() {
                return 0;
            };
            functions = [getZero];
            assert.equal(makeChain(functions)(), 0);
        });
        it('returns function which returns value returned by the first function (not undefined)', function() {
            functions.push(function (callback) {
                return 0;
            });
            functions.push(function() {
            });
            assert.equal(makeChain(functions)(), 0);
        });
        it('calls second function inside the first (right order)', function() {
            functions.push(function (callback) {
                return ['1', callback()].join('');
            });
            functions.push(function() {
                return '2';
            });
            assert.equal(makeChain(functions)(), '12');
        });
        it('calls three functions in proper order', function() {
            functions.push(function (callback) {
                return ['1', callback()].join('');
            });
            functions.push(function (callback) {
                return ['2', callback()].join('');
            });
            functions.push(function() {
                return '3';
            });
            assert.equal(makeChain(functions)(), '123');
        });
    });
    describe('#callChain(functions)', function() {
        it('returns `undefined\' if called without parameters', function() {
            assert.equal(callChain(), undefined);
        });
        it('returns `undefined\' if functions array is blank', function() {
            assert.equal(callChain(functions), undefined);
        });
        it('returns calling result of one function if it\'s the only entry in array', function() {
            var getZero = function() {
                return 0;
            };
            functions = [getZero];
            assert.equal(callChain(functions), 0);
        });
        it('returns value returned by the first function (not undefined)', function() {
            functions.push(function (callback) {
                return 0;
            });
            functions.push(function() {
            });
            assert.equal(callChain(functions), 0);
        });
        it('calls second function inside the first (right order)', function() {
            functions.push(function (callback) {
                return ['1', callback()].join('');
            });
            functions.push(function() {
                return '2';
            });
            assert.equal(callChain(functions), '12');
        });
        it('calls three functions in proper order', function() {
            functions.push(function (callback) {
                return ['1', callback()].join('');
            });
            functions.push(function (callback) {
                return ['2', callback()].join('');
            });
            functions.push(function() {
                return '3';
            });
            assert.equal(callChain(functions), '123');
        });

    });
});
