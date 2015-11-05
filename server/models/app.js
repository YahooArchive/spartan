//
// Copyright 2015, Yahoo Inc.
// Copyrights licensed under the New BSD License. See the
// accompanying LICENSE.txt file for terms.
//
"use strict";

module.exports = function(sequelize, DataTypes) {
    var App = sequelize.define("App", {
        name: {
            type: DataTypes.STRING(128),
            unique: true,
            allowNull: false
        },
        description: DataTypes.STRING(512),
    }, {
        classMethods: {
            associate: function(models) {
                App.belongsTo(models.User, {
                    foreignKey: 'createdBy',
                    targetKey: 'userid'
                });
                App.belongsTo(models.User, {
                    foreignKey: 'updatedBy',
                    targetKey: 'userid'
                });
                App.belongsTo(models.UserGroup, {
                    foreignKey: 'ownedByUserGroup',
                    targetKey: 'name'
                });
            }
        }
    });

    return App;
};