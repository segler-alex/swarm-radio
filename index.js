'use strict';

const os = require('os');
const express = require('express');
const swarmLib = require('./swarm-lib.js');
const httpDetail = require('./http-detail.js');
const bodyParser = require('body-parser');
const request = require('request-promise-native');
const moira = require( 'moira' );
const geoip = require('geoip-lite');

var app = express();
app.use(bodyParser.json());

var localIp = null;
var country = null;
swarmLib.getIPs().then(function(result) {
    localIp = result.ownInternalIP;
}).catch(function(err) {
    console.error('could not cache local ip ' + err);
});

moira.getIP( function( err, ip, service ){
    if( err ) throw err;

    console.log( 'Your external IP address is ' + ip );
    console.log( 'The fastest service to return your IP address was ' + service );

    var geo = geoip.lookup(ip);
    console.log(geo);
    country = geo;
});

app.get('/', function(req, res) {
    swarmLib.getIPs().then(function(result) {
        res.send('Hello World!<br/>' +
            '<br/>Hostname:' + os.hostname() +
            '<br/>Own Internal IP:<pre>' + JSON.stringify(result.ownInternalIP, null, ' ') + '</pre>' +
            '<br/>Own IPs:<pre>' + JSON.stringify(result.ownIPs, null, ' ') + '</pre>' +
            '<br/>Found others:<pre>' + JSON.stringify(result.otherInternalIPs, null, ' ') + '</pre>');
    }).catch(function(err) {
        res.status(500).send(err);
    });
});

app.post('/checkall', function(req, res) {
    var url = req.body.url;
    var result;
    swarmLib.getIPs().then(function(_result) {
        result = _result;
        var list = [];
        for (var i = 0; i < result.allInternalIPs.length; i++) {
            list.push(request.post({
                url: 'http://' + result.allInternalIPs[i] + ':3000/check',
                json: {
                    url: url
                }
            }));
        }
        return Promise.all(list);
    }).then((data) => {
        res.json({
            ok: true,
            self: localIp,
            data: data
        });
    }).catch((err) => {
        res.status(400).send({
            ok: false,
            url: url,
            result: result,
            err: err
        });
    });
});

app.post('/check', function(req, res) {
    var url = req.body.url;
    console.log('check:' + url);
    if (!url) {
        console.log('check empty url');
        res.status(400).json({
            ok: false
        });
    } else {
        console.log('check url ok:' + url);
        httpDetail.getHeaderRecursive(url, {
            debug: true
        }).then((data) => {
            console.log('check url finished:' + url);
            res.json({
                ok: true,
                self: localIp,
                geo: country,
                result: data
            });
        }).catch((err) => {
            console.error(err);
            res.status(403).json({
                ok: false
            });
        });
    }
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
