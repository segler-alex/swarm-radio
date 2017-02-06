'use strict';

const express = require('express');
const xml = require('xml');
var router = express.Router();
var models = null;

function findCountries(req, res, format, filter) {
    filter = filter || '';
    models.Station.findCountries(filter).then((items) => {
        if (format === 'xml') {
            var converted = {
                result: items.map((item) => {
                    var realItem = item.get({plain:true});
                    return {
                        country: {
                            _attr: {
                                value: realItem.value,
                                stationcount: realItem.stationcount
                            }
                        }
                    };
                })
            };
            res.type('text/xml').send(xml(converted, { declaration: true }));
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

router.get('/webservice/:format/countries', function(req, res) {
    var filter = '';
    var format = req.params.format;

    findCountries(req, res, format, filter);
});

router.post('/webservice/:format/countries', function(req, res) {
    var filter = req.body.filter;
    var format = req.params.format;

    findCountries(req, res, format, filter);
});

router.get('/webservice/:format/countries/:filter', function(req, res) {
    var filter = req.params.filter;
    var format = req.params.format;

    findCountries(req, res, format, filter);
});

module.exports = function(_models) {
    models = _models;
    return router;
};
