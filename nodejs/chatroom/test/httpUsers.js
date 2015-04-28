var assert = require('assert'),
    http = require('http'),
    faker = require('faker');

var host = 'localhost',
    port = '3000',
    path = '/users',
    url = ['http://', host, ':', port, path].join('');

describe.only('HTTP server with Users', function() {
    var currentUser;
    var generateRequest = function (method, onEnd, pathAppendix) {
        if (pathAppendix === undefined) {
            pathAppendix = '';
        }
        var options = {
            host: host,
            port: port,
            path: [path, pathAppendix].join('/'),
            method: method
        };
        var request = http.request(options, function (res) {
            var chunks = [];

            res.on('data', function (chunk) {
                chunks.push(chunk);
            });
            res.on('end', function() {
                onEnd(chunks.join(''));
            });
        });
        request.setHeader('Content-Type', 'application/json');
        return request;
    };
    describe('#POST', function() {
        it('Should post blank user with error', function (done) {
            var request = generateRequest('POST', function (data) {
                assert.equal(JSON.parse(data).success, false);
                done();
            });
            request.end();
        });
        it('Should post user correctly', function (done) {
            currentUser = {
                name: faker.name.findName(),
                creationDate: Date.now(),
                email: faker.internet.email(),
                address: faker.address.streetAddress()
            };
            var request = generateRequest('POST', function (data) {
                dataJSON = JSON.parse(data);
                assert.equal(dataJSON.success, true);
                assert.equal(dataJSON.response.users.length, 1);
                currentUser._id = dataJSON.response.users[0]._id;
                assert.deepEqual(dataJSON.response.users[0], currentUser);
                done();
            });
            request.write(JSON.stringify(currentUser));
            request.end();
        });
    });
    describe('#GET', function() {
        it('Should return JSON', function (done) {
            var request = generateRequest('GET', function (data) {
                assert.doesNotThrow(function() { JSON.parse(data); });
                done();
            });
            request.end();
        });
        it('Should be success', function (done) {
            var request = generateRequest('GET', function (data) {
                assert.equal(JSON.parse(data).success, true);
                done();
            });
            request.end();
        });
        it('Should get previously user', function (done) {
            var request = generateRequest('GET', function (data) {
                dataJSON = JSON.parse(data);
                assert.equal(dataJSON.success, true);
                assert.equal(dataJSON.response.length, 1);
                assert.deepEqual(dataJSON.response[0], currentUser);
                done();
            }, currentUser._id);
            request.end();
        });
    });
    describe('#DELETE', function() {
        it('Should delete users got in previous tests without error', function (done) {
            var request = generateRequest('DELETE', function (data) {
                dataJSON = JSON.parse(data);
                assert.equal(dataJSON.success, true);
                assert.equal(dataJSON.response.count, 1);
                done();
            }, currentUser._id);
            request.end();
        });
        it('Deleted user should not exist anymore', function (done) {
            var request = generateRequest('GET', function (data) {
                dataJSON = JSON.parse(data);
                assert.equal(dataJSON.success, false);
                done();
            }, currentUser._id);
            request.end();
        });
    });
});
