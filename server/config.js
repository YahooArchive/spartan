//
// Copyright 2015, Yahoo Inc.
// Copyrights licensed under the New BSD License. See the
// accompanying LICENSE.txt file for terms.
//
// spartan configuration file
// listen host
exports.host = "<server hostname>"

// this is for the admin interface
// be careful if you want to open this for non-localhost
exports.hostInternal = "127.0.0.1"

// listen ports
exports.port = 3000;
exports.portInternal = 2999;
// TLS settings
// 1 => TLS enabled, (highly recommended)
// 0 => TLS disabled (no TLS),
exports.tls = 1;
exports.tlsKey = '/path/to/tls/private/key';
exports.tlsCert = '/path/to/tls/public/cert';
exports.internalTlsKey = 'local.key';
exports.internalTlsCert = 'local.crt';

// database
exports.db_dialect = 'mysql'; // possible values: mysql, mariadb, sqlite, postgres, mssql
exports.db_host = '<host>';
exports.db_name = 'spartan';
exports.db_user = '<user>';
exports.db_passwd = '<password>';

// ECDSA settings
// NOTE replace this keys when use in production.
// This key as important as root CA signing key, so keep it safe!
// TODO guildelines to secure private key
exports.ecdsaPrivateKey = './keys/test-ES256-AS-privkey.pem';
exports.ecdsaPublicKey = './keys/test-ES256-AS-pubkey.pem';

// cert/token expiry - 24 hours
exports.expiresIn = 86400;
exports.algorithm = 'ES256';

// options { 'prod', 'dev' } 
exports.environment = 'dev';

