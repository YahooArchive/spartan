//
// Copyright 2015, Yahoo Inc.
// Copyrights licensed under the New BSD License. See the
// accompanying LICENSE.txt file for terms.
//
"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var config = require('../config.js');
var sequelize = new Sequelize(config.db_name, config.db_user, config.db_passwd, {
    host: config.db_host,
    logging: console.log,
    dialect: config.db_dialect,
    omitNull: true,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});


var db = {};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;