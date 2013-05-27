msfnode
=======

**msfnode is a metasploit RPC client for nodejs**

It make RPC calls using http/https webservices of msfrpcd daemon.

Metasploit API is really well done, it's not necessary to develop a wrapper for each API functions. Just RTMF : [Metasploit Remote API Documentation](https://community.rapid7.com/search.jspa?view=content&resultTypes=document&dateRange=all&q=Remote+API&rankBy=relevance&contentType=document&containerType=&container=&containerName=&userID=&numResults=15 "Metasploit Remote API Documentation")

Usage sample
=========

```
var metasploitClient = require('metasploitJSClient');


var onConnect = function(err,token) {
    if (err) {
        console.log(err.error_message);
        process.exit(0);
    }
    metasploitVersion();
}

var metasploitVersion = function() {

    // Next line is the interesting part.
    //
    // Do not care about token, it will automaticaly
    // be added as the second arguments
    //
    // The first item of the array if the RPC call
    // you want to fire, as described in the
    // metasploit remote api documentation

    var args = ['core.version'];

    client.exec(args,function(err,r) {

        if (err) return console.log('Error: '+err);

        console.log('-> Version: '+r.version);
        console.log('-> Api: '+r.api);
        console.log('-> Ruby: '+r.ruby);
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

```

Have good hacks !
=======

The tests directory contains more examples.

Just by curiosity, if you are using this module, **please star it** !



Thank you
=======
Special thanks to the authors of theses nodejs modules :
* msgpack
* qjobs



