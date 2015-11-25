//
// Copyright 2015, Yahoo Inc.
// Copyrights licensed under the New BSD License. See the
// accompanying LICENSE.txt file for terms.
// 
//   Author: Binu Ramakrishnan
//   Created: 11/01/2015

"use strict";

var fs = require('fs');
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var spartan = require('spartan-api');
var config = require('../config.js');
var models = require('../models');
var router_utils = require('./router-utils');

var as_privkey = fs.readFileSync(config.ecdsaPrivateKey);
var as_pubkey = fs.readFileSync(config.ecdsaPublicKey, 'utf8');

var sp_handlr = new spartan.RouteHandler({
  as_pubkey: as_pubkey
});

/**
 * Return tokens for the requested app. The app is authenticated
 * with a token, self signed by the app. The token is passed
 * using HTTP header - x-spartan-auth-token
 * @returns {JSON} tokens - tokens for the app based of its role membership
 */
router.get('/tokens', [sp_handlr.asAuth.bind(sp_handlr)], function (req, res) {

  var query = 'select distinct roleName, attribute from AppInRoles where appName in' +
              ' (select appName from MemberInApps where identity= :identity )';

  models.sequelize.query(query, {
      replacements: {
        identity: req.token.sub
      },
      type: models.sequelize.QueryTypes.SELECT
    }).then(function (roles) {

    if (roles.length === 0) {
      return router_utils.sendErrorResponse(res, {
        'msg': 'No roles found for the requested app'
      }, 404);
    }

    var tokens = {
        tokens: []
      },
      data,
      ret,
      i,
      j,
      cond;

    var uroles = [];

    for (i in roles) {
      cond = false;
      if (roles.hasOwnProperty(i)) {
        //console.log(roles[i].roleName);
        //console.log(roles[i].attribute);
        for (j = 0; j < uroles.length; j++) {
          if (uroles[j].role === roles[i].roleName) {
            uroles[j].attr.push(roles[i].attribute);
            cond = true;
            break;
          }
        }

        if (cond) {
          cond = false;
          continue;
        }

        data = {
          ver: 1,
          type: 'as-app-token',
          role: roles[i].roleName,
          attr: [ roles[i].attribute ],
          ip: req.connection.remoteAddress
        };

        uroles.push(data);
      }
    }

    for (i in uroles) {
      if (uroles.hasOwnProperty(i)) {
        //console.log(uroles[i].role);
        console.log(JSON.stringify(uroles[i]));

        ret = spartan.tokenSign({
          sub: req.token.sub,
          iss: 'spartan-domain',
          exp: config.expiresIn, //TODO: exp should be min(config.expiresIn, expiry of identity)
          algorithm: config.algorithm
        }, uroles[i], as_privkey);

        if (ret.success) {
          console.log(ret.token);
          tokens.tokens.push({
            role: roles[i].roleName,
            astoken: ret.token
          });
        }

        return router_utils.sendSuccessResponseJSON(res, tokens);
      }
    }

    console.log(JSON.stringify(tokens, null, 4));
  }).catch(function (e) {
    console.error("unable to get record..");
    console.error(e);
    return router_utils.sendErrorResponse(res, {
      'msg': 'Unable to get appName'
    }, 500);
  });

});

/**
 * Attestation service public key
 * @returns text/plain public key
 */
router.get('/publickey', function (req, res) {
  return router_utils.sendSuccessResponseText(res, as_pubkey, 200);
});

module.exports = router;
