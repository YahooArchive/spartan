//
// Copyright 2015, Yahoo Inc.
// Copyrights licensed under the New BSD License. See the
// accompanying LICENSE.txt file for terms.
// 
//   Created: 11/01/2015

var models = require('./models');
models.sequelize.sync({
  force: true,
  logging: console.log
}).then(function () {
  console.log("DB Sync done..");
});
