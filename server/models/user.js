//
// Copyright 2015, Yahoo Inc.
// Copyrights licensed under the New BSD License. See the
// accompanying LICENSE.txt file for terms.
//
"use strict";

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
        userid: {
            type: DataTypes.STRING(128),
            unique: true,
            allowNull: false
        },
        type: DataTypes.STRING(32),
        userkey: DataTypes.STRING(4096),
        name: DataTypes.STRING(128),
        createdBy: DataTypes.STRING(128),
        role: DataTypes.STRING(32),
        domain: DataTypes.STRING(32),
    });

    return User;
};