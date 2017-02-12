'use strict';
module.exports = function(sequelize, DataTypes) {
    var Station = sequelize.define('Station', {
        StationID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Name: DataTypes.STRING,
        Url: DataTypes.STRING,
        Homepage: DataTypes.STRING,
        Favicon: DataTypes.STRING,
        Creation: DataTypes.NOW,
        Country: DataTypes.STRING,
        Language: DataTypes.STRING,
        Tags: DataTypes.STRING,
        Votes: DataTypes.INTEGER,
        Subcountry: DataTypes.STRING,
        clickcount: DataTypes.INTEGER,
        ClickTrend: DataTypes.INTEGER,
        ClickTimestamp: DataTypes.DATE,
        Codec: DataTypes.STRING,
        LastCheckOK: DataTypes.BOOLEAN,
        LastCheckTime: DataTypes.DATE,
        Bitrate: DataTypes.INTEGER,
        UrlCache: DataTypes.STRING,
        LastCheckOKTime: DataTypes.DATE
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            },
            findCountries: function(name) {
                return Station.findAll({
                    attributes: [
                        ['Country', 'value'],
                        [sequelize.fn('COUNT', sequelize.col('Country')), 'stationcount']
                    ],
                    group: ["Country"],
                    where: {
                        $and: [{
                                Country: {
                                    $not: null
                                }
                            },
                            {
                                Country: {
                                    $not: ''
                                }
                            },
                            {
                                Country: {
                                    $like: '%' + name + '%'
                                }
                            }
                        ]
                    },
                    order: 'value'
                });
            },
            findCodecs: function(name) {
                return Station.findAll({
                    attributes: [
                        ['Codec', 'value'],
                        [sequelize.fn('COUNT', sequelize.col('Codec')), 'stationcount']
                    ],
                    group: ["Codec"],
                    where: {
                        $and: [{
                                Codec: {
                                    $not: null
                                }
                            },
                            {
                                Codec: {
                                    $not: ''
                                }
                            },
                            {
                                Codec: {
                                    $like: '%' + name + '%'
                                }
                            }
                        ]
                    },
                    order: 'value'
                });
            },
            findLanguages: function(name) {
                return Station.findAll({
                    attributes: [
                        ['Language', 'value'],
                        [sequelize.fn('COUNT', sequelize.col('Language')), 'stationcount']
                    ],
                    group: ["Language"],
                    where: {
                        $and: [{
                                Language: {
                                    $not: null
                                }
                            },
                            {
                                Language: {
                                    $not: ''
                                }
                            },
                            {
                                Language: {
                                    $like: '%' + name + '%'
                                }
                            }
                        ]
                    },
                    order: 'value'
                });
            },
            findStates: function(name, country) {
                var and = [{
                        Subcountry: {
                            $not: null
                        }
                    },
                    {
                        Subcountry: {
                            $not: ''
                        }
                    },
                    {
                        Subcountry: {
                            $like: '%' + name + '%'
                        }
                    }
                ];
                if (country) {
                    and.push({
                        Country: {
                            $eq: country
                        }
                    });
                }
                return Station.findAll({
                    attributes: [
                        ['Subcountry', 'value'],
                        ['Country', 'country'],
                        [sequelize.fn('COUNT', sequelize.col('Subcountry')), 'stationcount']
                    ],
                    group: ["Subcountry", "Country"],
                    where: {
                        $and: and
                    },
                    order: 'value'
                });
            }
        },
        tableName: 'Station'
    });
    return Station;
};
