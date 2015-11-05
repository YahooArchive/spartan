//
// Copyright 2015, Yahoo Inc.
// Copyrights licensed under the New BSD License. See the
// accompanying LICENSE.txt file for terms.
//
"use strict";

module.exports = function(sequelize, DataTypes) {
    var UserInGroup = sequelize.define("UserInGroup", {
        userType: DataTypes.STRING(128),
        role: DataTypes.STRING(32),
    }, {
        classMethods: {
            associate: function(models) {
                UserInGroup.belongsTo(models.UserGroup, {
                    foreignKey: 'userGroupName',
                    targetKey: 'name'
                });
                UserInGroup.belongsTo(models.User, {
                    foreignKey: 'userid',
                    targetKey: 'userid'
                });
                UserInGroup.belongsTo(models.User, {
                    foreignKey: 'createdBy',
                    targetKey: 'userid'
                });
            }
        }
    });


    return UserInGroup;
};