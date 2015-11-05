//
// Copyright 2015, Yahoo Inc.
// Copyrights licensed under the New BSD License. See the
// accompanying LICENSE.txt file for terms.
//
"use strict";

module.exports = function(sequelize, DataTypes) {
    var AppInRole = sequelize.define("AppInRole", {
        attribute: DataTypes.STRING(32),
    }, {
        classMethods: {
            associate: function(models) {
                AppInRole.belongsTo(models.User, {
                    foreignKey: 'createdBy',
                    targetKey: 'userid'
                });
                AppInRole.belongsTo(models.App, {
                    foreignKey: 'appName',
                    targetKey: 'name'
                });
                AppInRole.belongsTo(models.Role, {
                    foreignKey: 'roleName',
                    targetKey: 'name'
                });
            }
        }
    });



    return AppInRole;
};