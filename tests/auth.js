//
// Copyright 2015, Yahoo Inc.
// Copyrights licensed under the New BSD License. See the
// accompanying LICENSE.txt file for terms.
//
var auth = require('../routes/auth');


console.log(auth.hashGen('AABBCCEEDDFF'));
var hash = auth.hashGen('AABBCCEEDDFF');

// Load hash from your password DB. 
if (auth.hashCompare('AABBCCEEDDFF', hash)) {
    console.log('pass');
} else {
    console.log('fail');
}

// Load hash from your password DB. 
if (auth.hashCompare('AABBCCEEDDFF_123', hash)) {
    console.log('pass');
} else {
    console.log('fail');
}