//
// Copyright 2015, Yahoo Inc.
// Copyrights licensed under the New BSD License. See the
// accompanying LICENSE.txt file for terms.
// 
//   Created: 11/01/2015

"use strict";
var fs = require('fs');
var spartan = require('spartan');
var SpartanECDH = require('spartan/ecdh');
var request = require('request');
var svc_url = 'http://localhost:3001/v1/service/auth-test';

var privkey = fs.readFileSync('./keys/test-ES256-app-privkey.pem');

var ret = spartan.tokenSign({
                  sub: 'test-subject',
                  iss: 'self',
                  exp: 60, // 1 minute
                  alg: 'ES256'
                }, { test: 'test_data' }, privkey);

if (ret.success) {
  console.log('failed');
//  return;
}

var getCertCallback = function (error, certs) {
  console.log('Certs : ' + certs);

  if (error) {
    console.error('Error: failed to return certs from Attestation Service: ' +
      JSON.stringify(error));
    return;
  }

  var options = {
    uri: svc_url,
    method: 'POST',
    headers: {
      'x-spartan-auth-token': certs
    },

    json: {}
  };

  request(options, function (error, response, body) {
    if (error) {
      console.error('Error: service access error:', error);
      return;
    }

    if (response.statusCode !== 200) {
      console.error(response.statusCode + ' ' + JSON.stringify(body));
      return;
    }

    var resp = body;
    console.log(resp);
  });

};

var mkdirSync = function (path) {
  try {
    //fs.mkdirSync(path, 0o700);
    fs.mkdirSync(path, parseInt('0700', 8));
  } catch (e) {
    if (e.code !== 'EEXIST') { throw e; }
  }
};

// not great, but ok for testing. For prod, use an app specific dir
var home = process.env['HOME'],
  path = home + '/.spartan';

console.log('cache_path: ' + path);
mkdirSync(path);

spartan.getToken('SuperRole', {
  app_privkey: fs.readFileSync('./keys/test-ES256-app-privkey.pem'),
  app_pubkey: fs.readFileSync('./keys/test-ES256-app-pubkey.pem', 'utf8'),
  as_url: 'http://localhost:3000/v1/as/tokens',
  //token_type: 'app-svc-req'
  //token_type: 'as-app-token'
  cache_path: path
}, getCertCallback);
