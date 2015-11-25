//
// Copyright 2015, Yahoo Inc.
// Copyrights licensed under the New BSD License. See the
// accompanying LICENSE.txt file for terms.
//
// spartan configuration file
// listen host
exports.host = "<server hostname>"

// listen ports
exports.port = 3000;
exports.adminPort = 2999;

// TLS settings
// 1 => TLS enabled, (highly recommended)
// 0 => TLS disabled (no TLS),
exports.tls = 0;
exports.tlsKey = '/path/to/tls/private/key';
exports.tlsCert = '/path/to/tls/public/cert';

// admin is running on localhost interface,so this may not be required.
exports.adminTlsKey = '/path/to/tls/private/key';
exports.adminTlsCert = '/path/to/tls/public/cert';

// database
exports.db_dialect = 'mysql'; // possible values: mysql, mariadb, sqlite, postgres, mssql
exports.db_host = '127.0.0.1';
exports.db_name = 'spartan';
exports.db_user = '<user>';
exports.db_passwd = '<password>';

// ECDSA settings
// NOTE replace this keys when use in production.
// This key as important as root CA signing key, so keep it safe!
// TODO guildelines to secure private key
exports.ecdsaPrivateKey = __dirname + '/keys/test-ES256-AS-privkey.pem';
exports.ecdsaPublicKey = __dirname + '/keys/test-ES256-AS-pubkey.pem';

// Identity Provider's (IP) public key.
// If the IP is spartan, then provide private key
exports.IPPrivateKey= __dirname + '/keys/test-ES256-AS-privkey.pem';
// Public key of the IP
exports.IPPublicKey= __dirname + '/keys/test-ES256-AS-pubkey.pem';

// cert/token expiry - 24 hours
exports.expiresIn = 86400;
exports.algorithm = 'ES256';

// options { 'prod', 'dev' } 
exports.environment = 'prod';
