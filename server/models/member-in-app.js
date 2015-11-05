//
// Copyright 2015, Yahoo Inc.
// Copyrights licensed under the New BSD License. See the
// accompanying LICENSE.txt file for terms.
//
"use strict";

module.exports = function(sequelize, DataTypes) {
    var MemberInApp = sequelize.define("MemberInApp", {
        identity: {
            type: DataTypes.STRING(1024),
            unique: true,
            allowNull: false
        },
        identityType: {
            type: DataTypes.TEXT
        },
        role: DataTypes.STRING(32),
        expiry: {
            type: DataTypes.DATE
        },
    }, {
        classMethods: {
            associate: function(models) {
                MemberInApp.belongsTo(models.App, {
                    foreignKey: 'appName',
                    targetKey: 'name'
                });
                MemberInApp.belongsTo(models.User, {
                    foreignKey: 'createdBy',
                    targetKey: 'userid'
                });
            }
        }
    });

    return MemberInApp;
};