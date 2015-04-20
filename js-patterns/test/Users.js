var assert = require("assert");
var Users = require("../private.js").Users;

describe('Users', function() {
    var u;
    beforeEach(function() {
        u = new Users();
    });
    describe('#_saltPassword(pass)', function() {
        it('should be unavailable from the outside', function() {
            assert.equal(u._saltPassword, undefined);
        });
    });
    describe('#setPassword(pass)', function() {
        it('should return undefined', function() {
            assert.equal(u.setPassword('pass'), undefined);
        });
    });
    describe('#checkPassword(pass)', function() {
        it('should return true on correct password', function() {
            u.setPassword('pass');
            assert.equal(u.checkPassword('pass'), true);
        });
        it('should return false on incorrect password', function() {
            u.setPassword('pass');
            assert.equal(u.checkPassword('pass'), true);
        });
    });
    describe('#getPasswordHash()', function() {
        it('should return different hashes for different users with equal passwords', function() {
            var John = new Users();
            var Jane = new Users();
            John.setPassword('Pass');
            Jane.setPassword('Pass');
            assert.equal(John.checkPassword('Pass'), true);
            assert.equal(Jane.checkPassword('Pass'), true);
            assert.notEqual(John.getPasswordHash(), Jane.getPasswordHash());
        });
    });
});
