//
// Copyright 2015, Yahoo Inc.
// Copyrights licensed under the New BSD License. See the
// accompanying LICENSE.txt file for terms.
//
//   Author: Binu Ramakrishnan
//   Created: 11/01/2015

"use strict";
var bcrypt = require('bcrypt');
var spartan = require('spartan');
var fs = require('fs');
var config = require('../config');
var as_pubkey = fs.readFileSync(config.ecdsaPublicKey);
var utils = require('./router-utils');
var models = require('../models');


module.exports = {

  hashGen: function (passwd) {
    // TODO error handling
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(passwd, salt);
    // Store hash in your password DB. 
    return hash;
  },


  hashCompare: function (passwd, hash) {
    return bcrypt.compareSync(passwd, hash);
  },

  // Use this function for APIs that are protected using JWT.
  // Example usage - check routes/ca-server.js
  verify: function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers[
        'x-spartan-auth-token'],
      decoded;

    if (token) {
      decoded = spartan.tokenVerify(token, as_pubkey);
      if (decoded.success === true) {
        req.token = decoded.data;
        next();
      } else {
        return utils.sendErrorResponse(res, {
          'msg': 'token verify failed'
        }, 403);
      }

    } else {
      return utils.sendErrorResponse(res, {
        'msg': 'no token found'
      }, 403);
    }

  },

  authzUserApp: function (req, res, next) {
    var requestor = req.token.sub,
      app = req.body.app || req.params.app;

    if (requestor && app) {
      models.sequelize.query(
          "SELECT name FROM Apps WHERE name= :app AND ownedByUserGroup in (select userGroupName from UserInGroups where userid= :userid)", {
            replacements: {
              app: app,
              userid: requestor
            },
            type: models.sequelize.QueryTypes.SELECT
          })
        .then(function (apps) {
          if (apps && apps.length > 0) {
            // user is authorized!
            next();
          } else {
            return utils.sendErrorResponse(res, {
              'msg': 'Not authorized to do this operation on the app'
            }, 403);
          }
        })
        .catch(function (e) {
          console.error("unable to authorize request..");
          console.error(e);
          return utils.sendErrorResponse(res, {
            'msg': 'Unable to authorize request'
          }, 500);
        });
    } else {
      return utils.sendErrorResponse(res, {
        'msg': 'Mandatory field(s) missing'
      });
    }
  },

  authzUserRole: function (req, res, next) {
    var requestor = req.token.sub,
      role = req.body.role || req.params.role;

    if (requestor && role) {
      models.sequelize.query(
          "SELECT name FROM Roles WHERE name= :role AND ownedByUserGroup in (select userGroupName from UserInGroups where userid= :userid)", {
            replacements: {
              role: role,
              userid: requestor
            },
            type: models.sequelize.QueryTypes.SELECT
          })
        .then(function (roles) {
          if (roles && roles.length > 0) {
            // user is authorized!
            next();
          } else {
            return utils.sendErrorResponse(res, {
              'msg': 'Not authorized to do this operation on the role'
            }, 403);
          }
        })
        .catch(function (e) {
          console.error("unable to authorize request..");
          console.error(e);
          return utils.sendErrorResponse(res, {
            'msg': 'Unable to authorize request'
          }, 500);
        });
    } else {
      return utils.sendErrorResponse(res, {
        'msg': 'Mandatory field(s) missing'
      });
    }
  }

};
