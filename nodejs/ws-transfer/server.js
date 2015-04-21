var WebSocketServer = require('ws').Server;

var Server = (function() {
    var constructor = function() {
        var port, wss;
        this.getPort = function() {
            return port;
        }
        this.setPort = function (newPort) {
            port = newPort;
        }
        proto.init = function(port) {
            this.setPort(port);
            wss = new WebSocketServer({port: this.getPort()});
            wss.on('connection', function connection(ws) {
                var last = new Date(), current;
                var lastDisplayed = new Date();
                var transferred = 0;
                console.log('Connected');
                var fs = require('fs');
                var writeStream = fs.createWriteStream('./out.txt', {
                    flags: 'w',
                    encoding: 'binary',
                    mode: 0666
                });
                ws.on('message', function incoming(message) {
                    var messageLength = message.length/(1024*1024);
                    transferred += messageLength;
                    current = new Date();
                    if (current - lastDisplayed >= 1000) {
                        console.log('speed:', 1000*transferred/(current-last));
                        transferred = 0;
                        lastDisplayed = current;
                        last = current;
                    }
                    writeStream.write(message);
                });
                ws.on('close', function close() {
                    console.log('speed:', 1000*transferred/(current-last));
                    transferred = 0;
                    lastDisplayed = current;
                    last = current;
                    writeStream.end();
                    console.log('Disconnected');
                });
                   
                //ws.send('something');
            });
        };
    };
    var proto = constructor.prototype;
    return constructor;
})();

if (!module.parent) {
    var s = new Server();
    s.init(8080);
} else {
    module.exports = Server;
}
