(function (module) {

    var EventEmitter = require('events').EventEmitter;
    var https = require('https');
    var http = require('http');
    var msgpack = require('msgpack');

    // Constructor
    var msapi = function (options,cb) {
        this.init(options);
        this.cb = cb;
    }

    msapi.prototype.rpc = function(args,cb) {
        var data = msgpack.pack(args);
        var clength = Buffer.byteLength(data.toString('ascii'));

        var options = {
            hostname: this.host,
            port: this.port,
            rejectUnauthorized:false,
            path: this.apiPath+this.apiVersion,
            method: 'POST',
            headers:{
                'content-type':'binary/message-pack',
                'content-length':clength
            }
        }

        var req = https.request(options, function(res) {
            var bufs = [];
            var data = new Buffer(0);

            res.on('data', function(chunk) {
                bufs.push(chunk);
            });

            res.on('end',function() {
                var res = msgpack.unpack(Buffer.concat(bufs));
                if (res.error) return cb(res.error_message,res);
                return cb(null,res);
            });
        });

        req.write(data);

        req.end();

        req.on('error', function(e) {
            e.error_message = e.message;
            cb(e);
        });
    }

    msapi.prototype.authLogin = function() {
        this.rpc([
            'auth.login',
            this.login,
            this.password
        ],this.onAuthLogin.bind(this));
    }

    msapi.prototype.onAuthLogin = function(err,r) {
        if (!err && r && r.token) this.token = r.token;
        this.emit('connected',err,r);
    }

    msapi.prototype.init = function(options) {
        this.protocol = options.protocol || 'https';
        this.host = options.host || 'localhost';
        this.port = options.port || '55553';
        this.apiVersion = options.apiVersion || '1.0';
        this.apiPath = options.apiPath || '/api/';
        this.login = options.login || null;
        this.password = options.password || null;
        this.eventEmitter = new EventEmitter();
        msapi.prototype.on = this.eventEmitter.on;
        msapi.prototype.emit = this.eventEmitter.emit;
        this.authLogin();
    }

    msapi.prototype.exec = function(args,cb) {
        var arr = [];
        arr.push(args.shift());
        arr.push(this.token);
        if (args.length) {
            args.forEach(function(arg) {
                arr.push(arg);
            })
        }
        this.rpc(arr,cb);
    }

    module.exports = msapi;

}(module))
