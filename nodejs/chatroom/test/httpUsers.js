var assert = require('assert'),
    http = require('http'),
    querystring = require('querystring'),
    faker = require('faker');

var host = 'localhost',
    port = '3000',
    path = '/users',
    url = ['http://', host, ':', port, path].join('');

describe.only('HTTP server with Users', function() {
    it('Should return JSON', function(done) {
        http.get(url, function (res) {
            var data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function() {
                assert.doesNotThrow(function() { JSON.parse(data); });
                done();
            });
        });
    });
    it('Should post user correctly', function(done) {
        var postData = querystring.stringify({
            name: faker.name.findName(),
            creationDate: Date.now(),
            email: faker.internet.email(),
            address: faker.address.streetAddress()
        });
        var postOptions = {
            host: host,
            port: port,
            path: path,
            method: 'POST',
        };
        var postRequest = http.request(postOptions, function (res) {
            var data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function() {
                console.log(data);
                done();
            });
        });
        postRequest.write(postData);
        postRequest.end();
    });
});
