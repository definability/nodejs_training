#!/usr/bin/node
var WebSocket = require('ws');
var fs = require('fs');
var callChain = require('./chain-callbacks.js').callChain;

var Client = (function() {
    var constructor = function(host) {
        var filestream, ws, filename;
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
                //ws.close();
            });
            filestream.on('data', function (data) {
                buffer = new Buffer(data);
                ws.send(buffer);
            });
            filestream.on('end', function () {
                console.log('Cached');
                ws.send('+OK: end of file');
                //ws.close();
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
            filename = fileToUpload;
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

    var host, ws;

    host = process.argv[3] ? process.argv[3] : '127.0.0.1:8080';

    var client;
    client = new Client(host);
    client.transfer(filename);
    /*
    ws = new WebSocket('ws://'.concat(host));
     
    ws.on('error', function (error) {
        console.error(['Problem occured:', error].join(' '));
    });

    var readStream = require('fs').createReadStream(filename, {
        flags: 'r',
        encoding: 'binary',
    });
    readStream.on('open', function() {
        console.log('File opened!');
    });
    readStream.on('error', function (error) {
        console.error(['Problem occured:', error].join(' '));
    });

    ws.on('open', function() {
        readStream.removeAllListeners('error');
        readStream.on('error', function (error) {
            console.error(['Problem occured:', error].join(' '));
            ws.close();
        });
        ws.send(filename);
        ws.once('message', function (message) {
            console.log(message);
            if (message[0] === '+') {
                console.log('Successfully connected');
            } else {
                console.log('Cannot upload the file');
                return;
            }
            readStream.on('data', function (data) {
                var buffer = new Buffer(data);
                ws.send(buffer);
            });
            readStream.on('end', function () {
                console.log('Uploaded');
                ws.close();
            });
        });
    });
    */
} else {
}
