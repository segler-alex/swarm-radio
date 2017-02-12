'use strict';

const express = require('express');
const xml = require('xml');
var router = express.Router();
var models = null;

function findStates(req, res, format, filter, country) {
    filter = filter || '';
    models.Station.findStates(filter, country).then((items) => {
        if (format === 'xml') {
            var converted = {
                result: items.map((item) => {
                    var realItem = item.get({
                        plain: true
                    });
                    return {
                        country: {
                            _attr: {
                                value: realItem.value,
                                country: realItem.country,
                                stationcount: realItem.stationcount
                            }
                        }
                    };
                })
            };
            res.type('text/xml').send(xml(converted, {
                declaration: true
            }));
        } else if (format === 'json') {
            res.type('application/json').json(items);
        } else {
            res.status(400).type('application/json').json({
                'ok': false,
                'msg': 'wrong format ' + format
            });
        }
    }).catch((err) => {
        res.status(500).type('application/json').json({
            'ok': false,
            'msg': err
        });
    });
}

router.get('/webservice/:format/states', function(req, res) {
    var filter = '';
    var format = req.params.format;
    var country = null;

    findStates(req, res, format, filter, country);
});

router.post('/webservice/:format/states', function(req, res) {
    var filter = req.body.filter;
    var format = req.params.format;
    var country = null;

    findStates(req, res, format, filter, country);
});

router.get('/webservice/:format/states/:filter', function(req, res) {
    var filter = req.params.filter;
    var format = req.params.format;
    var country = null;

    findStates(req, res, format, filter, country);
});

router.get('/webservice/:format/states/:country/:filter', function(req, res) {
    var filter = req.params.filter;
    var format = req.params.format;
    var country = req.params.country;

    findStates(req, res, format, filter, country);
});

module.exports = function(_models) {
    models = _models;
    return router;
};
