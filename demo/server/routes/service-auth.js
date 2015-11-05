//
// Copyright 2015, Yahoo Inc.
// Copyrights licensed under the New BSD License. See the
// accompanying LICENSE.txt file for terms.
// 
//   Created: 11/01/2015

"use strict";
var fs = require('fs');
var express = require('express');
var router = express.Router();
var spartan = require('spartan');
var SpartanECDH = require('spartan/ecdh');
var config = require('../config');
var utils = require('./router-utils');

// Attestation server public key.
// TODO: Need to support multiple public keys and versioning
var as_pubkey = fs.readFileSync(config.asPubKey, 'utf8');

// Parameters to pass for auth
var sp_options = {
  as_pubkey: as_pubkey,
  role: config.role,
  token_type: 'app-svc-req' // other options is 'as-app-token'
};

var sp_handlr = new spartan.RouteHandler(sp_options);

var roleAuthz = function (req, res, next) {
  if (req.authz_token.role === config.role) {
    console.log(req.authz_token.sub + ' is authorized to access ' + req.authz_token
      .role);
    next();
  } else {
    return res.status(401).json({
      msg: 'app is not authorized to acccess this resource'
    });
  }
};

// This is sample on how to authenticate client using express route handler
router.post('/auth-test', [sp_handlr.svcAuth.bind(sp_handlr), roleAuthz],
  function (req, res) {

    // If you reach here, that means you are authorized to access this endpoint
    return res.status(200).json({
      msg: 'app is authenticated!'
    });
  });

// This is sample on how to authenticate client without
// using express route handler
router.post('/auth-test2', function (req, res) {

  // check header or url parameters or post parameters for token
  var token = req.body.spartantoken ||
              req.query.spartantoken ||
              req.headers['x-spartan-auth-token'],
      options = sp_options,
      ret;
  options.remote_ip = req.connection.remoteAddress;

  ret = spartan.tokenAuth(token, options);

  if (ret.success) {
    // In case you want, or you can directly access decoded token from ret.data
    /*if (ret.data.auth_token) {
      req.auth_token = ret.data.auth_token;
    }

    if (ret.data.authz_token) {
      req.authz_token = ret.data.authz_token;
    }*/

    // you are now authenticated and authorized!
    return res.status(200).json({
      msg: 'app is authenticated!'
    });

  }
    
  return utils.sendErrorResponse(res, {
      msg: ret.msg
    }, ret.return_code);

});

var sp_ecdh_handlr = new spartan.RouteHandler({
  as_pubkey: as_pubkey,
  role: 'SuperRole',
});

// TODO experimental, not ready for production yet!
router.post('/ecdh', [sp_ecdh_handlr.svcAuth.bind(sp_ecdh_handlr)],
  function (req, res) {

    var ecdh = new SpartanECDH(),
        secret = ecdh.getSharedSecret(req.body.public_key);

    console.log('Secret: ' + secret);

    // TODO add mutual auth support
    return res.status(200).json({
      public_key: ecdh.getPublicKey()
    });
  });

module.exports = router;
