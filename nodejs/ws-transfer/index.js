#!/usr/bin/node
Server = require('./server.js');
Client = require('./client.js');
if (!module.parent) {
    var printUsage = function() {
        console.log('Usage:', [process.argv[0], process.argv[1], 'filename1 [filename2 [filename3 ...]]'].join(' '));
    };
    var server = new Server(),
        port = '8080',
        host = '127.0.0.1:8080';
    var filenames = process.argv.slice(2);
    if (filenames.length === 0) {
        console.error('Filenames must be specified!');
        printUsage();
        return;
    }
    var clients = filenames.map(function(filename) {
        return new Client(host, filename);
    });
    server.init(port, function() {
        clients.map(function(client) { return client.transfer(); });
    });
} else {
    module.exports = {Server: Server, Client: Client};
}
