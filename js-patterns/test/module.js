var assert = require("assert");
var Validation = require("../module.js").Validation;

describe('Users', function() {
    describe('#_isValid(value, regexp)', function() {
        it('is private', function() {
            assert.equal(Validation._isValid, undefined);
        });
    });
    describe('#isEmail(value)', function() {
        it('accepts example@host.com', function() {
            assert.equal(Validation.isEmail('example@host.com'), true);
        });
        it('doesn\'t accept blank string', function() {
            assert.equal(Validation.isEmail(''), false);
        });
        it('doesn\'t accept @host.com', function() {
            assert.equal(Validation.isEmail('@host.com'), false);
        });
        it('doesn\'t accept host.com', function() {
            assert.equal(Validation.isEmail('host.com'), false);
        });
        it('doesn\'t accept example@host', function() {
            assert.equal(Validation.isEmail('example@host'), false);
        });
        it('doesn\'t accept string with wrong trailing and leading characters', function() {
            assert.equal(Validation.isEmail('#example@host.com#'), false);
        });
    });
    describe('#isUUID(value)', function() {
        it('accepts 11223344-1122-3344-5566-aabbccddeeff', function() {
            assert.equal(Validation.isUUID('11223344-1122-3344-5566-aabbccddeeff'), true);
        });
        it('doesn\'t accept blank string', function() {
            assert.equal(Validation.isUUID(''), false);
        });
        it('doesn\'t accept string with non-hex characters', function() {
            assert.equal(Validation.isUUID('qqwweerr-1122-3344-5566-aabbccddeeff'), false);
        });
        it('doesn\'t accept string with wrong trailing and leading characters', function() {
            assert.equal(Validation.isUUID('#11223344-1122-3344-5566-aabbccddeeff#'), false);
        });
    });
    describe('#isPhone(value)', function() {
        it('accepts 000-11-22', function() {
            assert.equal(Validation.isPhone('000-11-22'), true);
        });
        it('doesn\'t accept string without hyphens', function() {
            assert.equal(Validation.isPhone('0001122'), false);
        });
        it('doesn\'t accept blank string', function() {
            assert.equal(Validation.isPhone(''), false);
        });
        it('doesn\'t accept string with letters', function() {
            assert.equal(Validation.isPhone('000-11-aa'), false);
        });
        it('doesn\'t accept string with wrong trailing and leading characters', function() {
            assert.equal(Validation.isPhone('#000-11-22#'), false);
        });
    });
    describe('#isURL(value)', function() {
        it('accepts http://example.com', function() {
            assert.equal(Validation.isURL('http://example.com'), true);
        });
        it('accepts https://example.com', function() {
            assert.equal(Validation.isURL('https://example.com'), true);
        });
        it('accepts example.com', function() {
            assert.equal(Validation.isURL('example.com'), true);
        });
        it('doesn\'t accept blank string', function() {
            assert.equal(Validation.isURL(''), false);
        });
        it('doesn\'t accept string with wrong trailing and leading characters', function() {
            assert.equal(Validation.isURL('#http://example.com#'), false);
        });
    });
});

