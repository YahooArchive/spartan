//
// Copyright 2015, Yahoo Inc.
// Copyrights licensed under the New BSD License. See the
// accompanying LICENSE.txt file for terms.
//
//   Created: 11/01/2015
// spartan demo server configuration file

// listen port
exports.port = 3001;

exports.asPubKey = '../../server/keys/test-ES256-AS-pubkey.pem'
exports.role = 'SuperRole'

// ECDSA settings
//exports.ecdsaKey='./pri.pem';
//exports.ecdsaCert='./pub.pem';

// options { 'prod', 'dev' } 
exports.environment = 'dev';
