#!/usr/bin/node
var WebSocket = require('ws');
var fs = require('fs');
var callChain = require('./module/chain-callbacks.js').callChain;

var Client = (function() {
    var constructor = function(host, filename) {
        if (host === undefined) {
            console.error('host wasn\'t specified');
            return;
        }
        if (filename === undefined) {
            filename = '';
        }
        var filestream, ws;
        var onMessage = function (message) {
            console.log(message);
            if (message[0] === '+') {
                console.log('Connected');
            } else {
                console.log('Cannot upload the file');
                return;
            }
            var buffer;
            ws.on('message', function(end) {
                console.log(end);
            });
            filestream.on('data', function (data) {
                buffer = new Buffer(data);
                ws.send(buffer);
            });
            filestream.on('end', function () {
                console.log('Cached');
                ws.send('+OK: end of file');
            });
        };
        var uploadFile = function() {
            filestream.removeAllListeners('error');
            filestream.on('error', function (error) {
                console.error(['Problem occured:', error].join(' '));
                ws.close();
            });
            ws.send(filename);
            ws.once('message', onMessage);
        };
        var establishConnection = function(onSuccess) {
            ws = new WebSocket('ws://'.concat(host));
            ws.on('error', function (error) {
                console.error(['Problem occured:', error].join(' '));
            });
            ws.on('open', onSuccess);
        };
        var openFilestream = function(onSuccess) {
            filestream = require('fs').createReadStream(filename, {
                flags: 'r',
                encoding: 'binary',
            });
            filestream.on('open', onSuccess);
            filestream.on('error', function (error) {
                console.error(['Problem occured:', error].join(' '));
            });
        };
        this.transfer = function(fileToUpload) {
            if (fileToUpload !== undefined) {
                filename = fileToUpload;
            }
            var functions = [openFilestream, establishConnection, uploadFile];
            callChain(functions);
        };
    };
    return constructor;
})();

if (!module.parent) {
    var filename
    filename = process.argv[2];
    if (!filename) {
        console.error('Filename must be specified!');
        return;
    }
    var host;
    host = process.argv[3] ? process.argv[3] : '127.0.0.1:8080';
    var client;
    client = new Client(host);
    client.transfer(filename);
} else {
    module.exports = Client;
}
