#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect(function (err, conn) {
    var channelsCount = 0;
    function onChannelClosed (err) {
        if (err != null) {
            console.error(err);
        }
        channelsCount--;
        if (channelsCount < 1) {
            conn.close();
        }
    };
    if (process.argv.length > 3) {
        conn.createChannel(function(err, ch) {
            channelsCount++;
            var q = 'errors';
            var msg = process.argv[3];
            ch.assertQueue(q, {durable: false});

            ch.sendToQueue(q, new Buffer(msg));
            console.log(" [error] Sent '%s'", msg);
            ch.close(onChannelClosed);
            //return ch.close();
        });
    }
    if (process.argv.length > 2) {
        conn.createChannel(function(err, ch) {
            var q = 'messages';
            var msg = process.argv[2];
            ch.assertQueue(q, {durable: false});

            ch.sendToQueue(q, new Buffer(msg));
            console.log(" [message] Sent '%s'", msg);
            ch.close(onChannelClosed);
            //return ch.close();
        });
    } else {
        conn.close();
    }
});
