//
// Copyright 2015, Yahoo Inc.
// Copyrights licensed under the New BSD License. See the
// accompanying LICENSE.txt file for terms.
//
"use strict";

module.exports = function(sequelize, DataTypes) {
    var Role = sequelize.define("Role", {
        name: {
            type: DataTypes.STRING(128),
            unique: true,
            allowNull: false
        },
        roleType: DataTypes.STRING(128),
        roleHandle: DataTypes.STRING(128),
        description: DataTypes.STRING(512),
    }, {
        classMethods: {
            associate: function(models) {
                Role.belongsTo(models.User, {
                    foreignKey: 'createdBy',
                    targetKey: 'userid'
                });
                Role.belongsTo(models.User, {
                    foreignKey: 'updatedBy',
                    targetKey: 'userid'
                });
                Role.belongsTo(models.UserGroup, {
                    foreignKey: 'ownedByUserGroup',
                    targetKey: 'name'
                });
                Role.belongsTo(models.App, {
                    foreignKey: 'ownedByApp',
                    targetKey: 'name'
                });
            }
        }
    });

    return Role;
};