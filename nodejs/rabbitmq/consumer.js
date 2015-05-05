#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect(function(err, conn) {
    conn.createChannel(function(err, ch) {
        ch.assertQueue('messages', {durable: false});
        ch.assertQueue('errors', {durable: false});
        console.log(' [*] Waiting for messages. To exit press CTRL+C');

        ch.consume('messages', function(msg) {
            console.log(" [message] Received '%s'", msg.content.toString());
        }, {noAck: true});
        ch.consume('errors', function(msg) {
            console.log(" [error] Received '%s'", msg.content.toString());
        }, {noAck: true});
    });
});
