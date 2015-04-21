var WebSocket = require('ws');
var ws = new WebSocket('ws://127.0.0.1:8080');
 
ws.on('open', function open() {
    /*
    var array = new Float32Array(5);
    for (var i = 0; i < array.length; ++i) {
        array[i] = i / 2;
    }
    */
    var readStream = require('fs').createReadStream('./zeros.txt', {
        flags: 'r',
        encoding: 'binary',
    });
    readStream.on('data', function (data) {
        var buffer = new Buffer(data);
        //var buffer = new Buffer("Sent");
        ws.send(buffer);
        // console.log("read", buffer);
    });
    readStream.on('end', function () {
        ws.close();
    });
});
