#!/usr/bin/env node

var assert = require('assert');
var metasploitClient = require('../metasploitJSClient');

var onConnect = function(err,r) {
    if (err) {
        console.log(err.error_message);
        process.exit(0);
    }
    assert.notEqual(r.token,null);
    metasploitVersion();
}

var metasploitVersion = function() {

    client.exec(['core.version'],function(err,r) {

        if (err) return console.log('Error: '+err);

        assert.notEqual(r.version,null);
        //console.log('-> Version: '+r.version);
        //console.log('-> Api: '+r.api);
        //console.log('-> Ruby: '+r.ruby);

    });

}


var client = new metasploitClient({
    login:'myLogin',
    password:'myPassword',
    host:'localhost',   // optional
    port:55553,         // optional
    protocol:'https',   // optional
    apiVersion:'1.0',   // optional
    apiPath:'/api/'     // optional
});

client.on('connected',onConnect);

