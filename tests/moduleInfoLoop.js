#!/usr/bin/env node
var assert = require('assert');
var metasploitClient = require('../metasploitJSClient');

var q = new require('qjobs');
q.setConcurrency(10); // do not flood msfrpcd ! (

var onConnect = function(err,token) {
    if (err) {
        console.log(err.error_message);
        process.exit(0);
    }
    fetchModuleExploits();
}

var query = function(moduleName,next) {

    client.exec(['module.info','exploit',moduleName],function(err,r) {
        if (err) return console.log('Error: '+err);
        assert.notEqual(r,null);
        //console.log(r.name);
        next();
    });

}

var fetchModuleExploits = function() {
    client.exec(['module.exploits'],function(err,r) {

        if (err) return console.log('Error: '+err);
        assert.notEqual(r.modules,null);

        r.modules.forEach(function(mod,i) {
            // only work on the first 50 returned items
            if (i<10) q.add(query,mod);
        });
        q.run();
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

