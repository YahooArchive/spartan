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

var as_privkey = fs.readFileSync(config.ecdsaPrivateKey);
var as_pubkey = fs.readFileSync(config.ecdsaPublicKey);

var spartan_handlr = new spartan.RouteHandler({
  as_url: 'http://localhost:3000/v1/as/tokens',
  as_pubkey: as_pubkey,
  role: 'SuperRole'
});


// exchange password to get a JWT token. This is ideally inmplemented by
// as part of your single sign-on. Ideally this functionality should be 
// implemented by corp employee auth servers. To keep it easy for our users,
// the auth is based on a sharet secret.
// example: curl -X POST -d 'user=rbinu@yahoo-inc.com&passwd=ASADFVEFVSERNMUHBSEFIHHDRVV' localhost:3000/v1/auth/token
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
        }, data, as_privkey);

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

// Experimental ECDHE. 
// Given that we can authenticate both client and server
// the client can make a request to server and negotiate a secret  
// between client and server over an insecure channel. This secret
// can be used to encrypt contents or generate secure short tokens.
// The client code is at lib/client/ecdhe.js
// Modified version of:
// https://gist.github.com/moshest/7d27848b2bbc45c40d67
router.post('/v1/auth/ecdh', [spartan_handlr.svcAuth], function (req, res) {

  var ecdh = new SpartanECDH(),
    secret = ecdh.getSharedSecret(req.body.public_key);

  //console.log('Secret: ' + secret);

  // TODO we also need to pass service (role's) cert token
  // back to client for server authentication.
  res.status(200).json({
    token: 'server token placeholder',
    public_key: ecdh.getPublicKey()
  });
});

module.exports = router;
