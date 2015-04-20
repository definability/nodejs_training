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
        it('should work without errors', function() {
            assert.doesNotThrow(function() { u.setPassword('pass'); });
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
        it('should return different values for different passwords for one user', function() {
            u.setPassword('pass');
            var pass = u.getPasswordHash();
            assert.equal(u.checkPassword('pass'), true);
            u.setPassword('new pass');
            assert.equal(u.checkPassword('new pass'), true);
            assert.equal(u.checkPassword('pass'), false);
            var newPass = u.getPasswordHash();
            assert.notEqual(pass, newPass);
        });
    });
});
