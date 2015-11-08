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
var config = require('../config.js');
var models = require('../models');
var auth = require('./user-auth');
var spartan = require('spartan');
var SpartanECDH = require('spartan/ecdh');

var crypto = require('crypto');

// identity provider public key.
// TODO support more than one identity provider
var IP_privkey = fs.readFileSync(config.IPPrivateKey);
var IP_pubkey = fs.readFileSync(config.IPPublicKey);

// exchange password to get a JWT token. This is ideally inmplemented by
// as part of your single sign-on. Ideally this functionality should be 
// implemented by corp employee auth servers. To keep it easy for our users,
// the auth is based on a sharet secret.
// example: curl -X POST -d 'user=user@example.com&passwd=ABCDEFGHIJ' localhost:2999/v1/auth/token
router.post('/v1/auth/token', function (req, res) {

  if ((!req.body.userid) || (!req.body.passwd)) {
    return res.status(400).json({
      msg: 'invalid parameters passed',
      userid: req.body.userid
    });
  }

  models.User.find({
    attributes: ['userkey'],
    where: {
      userid: req.body.userid
    }
  }).then(function (user) {
    if (user && user.dataValues && auth.hashCompare(req.body.passwd,
        user.dataValues.userkey)) {
      var data = {
          ver: 1,
          type: 'user-token',
          ip: req.connection.remoteAddress
        },
        resp = spartan.tokenSign({
          sub: req.body.userid,
          iss: 'spartan-domain',
          exp: config.expiresIn,
          alg: config.algorithm
        }, data, IP_privkey);

      if (resp.success) {
        return res.json({
          userid: req.body.userid,
          token: resp.token
        });
      }

      return res.status(401).json({
        msg: 'token creation failed',
        userid: req.body.userid
      });

    }

    res.status(401).json({
      msg: 'passwd is incorrect',
      userid: req.body.userid
    });

    return;

  });
});

module.exports = router;
