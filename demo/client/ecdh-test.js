//
// Copyright 2015, Yahoo Inc.
// Copyrights licensed under the New BSD License. See the
// accompanying LICENSE.txt file for terms.
// 
//   Author: Binu Ramakrishnan
//   Created: 11/01/2015

"use strict";
var fs = require('fs');
var spartan = require('spartan');
var SpartanECDH = require('spartan/ecdh');
var request = require('request');
var svc_uri = 'http://localhost:3001/v1/service/ecdh';

spartan.getToken('SuperRole', {
    app_privkey: fs.readFileSync('./keys/test-ES256-app-privkey.pem'),
    app_pubkey: fs.readFileSync('./keys/test-ES256-app-pubkey.pem', 'utf8'),
    //                             as_pubkey: null, //fs.readFileSync('./as-public-key.pem'),
    as_url: 'http://localhost:3000/v1/as/tokens'
  },
  function (error, certs) {

    if (error) {
      console.error(
        'Error: failed to return certs from Attestation Service: ' + error);
      return;
    }

    var ecdh = new SpartanECDH(),
        options = {
          uri: svc_uri,
          method: 'POST',
          json: {
            spartantoken: certs,
            public_key: ecdh.getPublicKey()
          }
        };

    request(options, function (error, response, body) {
      if (error) {
        console.error('Error: service access error:', error);
        return;
      }

      if (response.statusCode !== 200) {
        console.error(body);
        return;
      }

      console.log('Secret: ' + ecdh.getSharedSecret(body.public_key));

    });

  });
