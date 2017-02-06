'use strict';

const express = require('express');
var router = express.Router();
var models = null;

function findCountries(req, res, format, filter) {
    filter = filter || '';
    models.Station.findCountries(filter).then((result) => {
        if (format === 'xml') {
            res.send(result);
        } else if (format === 'json') {
            res.json(result);
        } else {
            res.status(400).json({
                'ok': false,
                'msg': 'wrong format ' + format
            });
        }
    }).catch((err) => {
        res.status(500).json({
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

module.exports = function(_models){
    models = _models;
    return router;
};
