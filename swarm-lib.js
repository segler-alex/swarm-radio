'use strict';

const dns = require('dns');
const os = require('os');
const bluebird = require('bluebird');

var lookup = bluebird.promisify(dns.lookup);

function getOwnIps() {
    var ownIPs = [];
    var ifs = os.networkInterfaces();
    for (var item in ifs) {
        var addresses = ifs[item];
        for (var i = 0; i < addresses.length; i++) {
            if (!addresses[i].internal && addresses[i].family === 'IPv4') {
                ownIPs.push(addresses[i].address);
            }
        }
    }
    ownIPs.sort();
    return ownIPs;
}

function getIPs() {
    var ownIPs = getOwnIps();
    var dnsOptions = {
        all: true
    };
    return lookup('tasks.mydemo', dnsOptions).then(function(addresses) {
        var self = null;
        var others = [];
        var all = [];
        for (var i = 0; i < addresses.length; i++) {
            var address = addresses[i].address;
            all.push(address);
            if (ownIPs.indexOf(address) < 0) {
                others.push(address);
            } else {
                self = address;
            }
        }
        others.sort();
        return {
            ownInternalIP: self,
            ownIPs: ownIPs,
            allInternalIPs: all,
            otherInternalIPs: others
        };
    });
}

module.exports = {
    'getIPs': getIPs
};
