#!/usr/bin/node
var WebSocketServer = require('ws').Server;
var fs = require('fs');
var Cache = require('./module');

var log = function(message, filename) {
    if (filename === undefined) {
        console.log(['[', Date.now(), '] ', message].join(''));
    } else {
        console.log(['[', Date.now(), '] ', filename, ': ', message].join(''));
    }
};

var Server = (function() {
    var constructor = function() {
        var port, wss, cache;

        var SPEED_CHECK_PERIOD = 1000,
            MILLISECONDS_IN_SECOND = 1000,
            BYTES_IN_MB = 1024*1024;
        cache = new Cache();

        this.getPort = function() {
            return port;
        }
        this.setPort = function (newPort) {
            port = newPort;
        };

        var getSpeed = function (filename) {
            var currentTime = Date.now();
            var info = cache.get(filename);
            return info.size/(currentTime - info.time) * MILLISECONDS_IN_SECOND;
        };
        var displaySpeed = function (filename) {
            log([getSpeed(filename)/BYTES_IN_MB, ' MB/s'].join(''), filename);
        };
        /*
        var onFileTransferred = function (filename, filestream) {
            var result = function () {
                cache.get(filename).connection.send(['+OK: file', filename, 'uploaded'].join(' '));
                displaySpeed(filename);
                console.log([filename, 'transferred'].join(' '));
                filestream.end();
                cache.delete(filename);
            };
            return result;
        };
        */
        var onFileTransferred = function (filename, filestream) {
            var ws = cache.get(filename).connection;
            ws.send(['+OK: file', filename, 'uploaded'].join(' '));
            displaySpeed(filename);
            log('file transferred', filename);
            filestream.end();
            ws.close();
            cache.delete(filename);
        };
        var onChunkReceived = function (filename, filestream) {
            var result = function (chunk) {
                if (typeof(chunk) === 'string') {
                    //cache.get(filename).connection.close();
                    onFileTransferred(filename, filestream);
                    return;
                }
                //console.log(typeof chunk);
                var currentTime = Date.now();
                var info = cache.get(filename);
                if (currentTime - info.time >= SPEED_CHECK_PERIOD) {
                    displaySpeed(filename);
                    info.time = currentTime;
                    info.size = 0;
                    cache.update(filename, info);
                } else {
                    info.size += chunk.length;
                    cache.update(filename, info);
                }
                filestream.write(chunk);
            };
            return result;
        };
        var getFileErrorMessage = function (filename) {
            return ['-ERR: file', filename, 'cannot be uploaded.'].join(' ');
        };
        var getFileOkMessage = function (filename) {
            return ['+OK: file', filename, 'can be uploaded.'].join(' ');
        };
        var onClientConnected = function (ws) {
            ws.once('message', function (filename) {
                try {
                    cache.add(filename, '');
                } catch (e) {
                    ws.send(getFileErrorMessage(filename));
                    ws.close();
                    log('connection refused', filename);
                    return;
                }
                log('client connected', filename);
                var filestream = fs.createWriteStream(['uploads', filename].join('/'), {
                    flags: 'w',
                    encoding: 'binary',
                    mode: 0666
                });
                filestream.on('error', function (error) {
                    ws.send(getFileErrorMessage(filename));
                    ws.close();
                    console.error(['Problem occured:', error].join(' '));
                });
                filestream.once('open', function() {
                    log('file transfer started', filename);
                    ws.send(getFileOkMessage(filename));
                    cache.update(filename, {time: Date.now(), size: 0, connection: ws});
                    ws.on('message', onChunkReceived(filename, filestream));
                    //ws.on('close', onFileTransferred(filename, filestream));
                });
            });
        };

        proto.init = function(port, onSuccess) {
            this.setPort(port);
            wss = new WebSocketServer({port: this.getPort()});
            wss.on('open', function() {
                console.log('Opened');
            });
            log(['Successfully connected to ', wss.options.host, ':', wss.options.port].join(''));
            wss.on('error', function (error) {
                console.error(['Problem occured:', error].join(' '));
            });
            wss.on('', function() {
                log(['Successfully connected to port', port].join(' '));
            });
            wss.on('connection', onClientConnected);
            if (onSuccess !== undefined) {
                onSuccess();
            }
        };
    };
    var proto = constructor.prototype;
    return constructor;
})();

if (!module.parent) {
    var s = new Server();
    var port = process.argv[2] ? process.argv[2] : '8080';
    s.init(port);
} else {
    module.exports = Server;
}
