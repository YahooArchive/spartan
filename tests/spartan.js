//
// Copyright 2015, Yahoo Inc.
// Copyrights licensed under the New BSD License. See the
// accompanying LICENSE.txt file for terms.
//
var a = require('../lib/client/spartan');

a.init('./test-priv.key', './test-pub.key');
a.getCert('SuperRole', function(certs) {
    //var c = JSON.parse(certs);
    //console.log('Certs : ' + JSON.stringify(certs, null, 4))
    console.log('Certs : ' + certs)
});