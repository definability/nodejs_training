var WebSocket = require('ws');

if (!module.parent) {

    var filename
    filename = process.argv[2];
    if (!filename) {
        console.error('Filename must be specified!');
        return;
    }

    var host, ws;

    host = process.argv[3] ? process.argv[3] : '127.0.0.1:8080';
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
} else {
}
