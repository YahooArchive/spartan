//
// Copyright 2015, Yahoo Inc.
// Copyrights licensed under the New BSD License. See the
// accompanying LICENSE.txt file for terms.
//
var express = require('express');
var router = express.Router();
var models = require('../models');
var router_utils = require('./router-utils');
var auth = require('./user-auth');

router.post('/create', function (req, res) {
  // TODO: add JWT middleware here
  var userid = req.body.userid,
    type = req.body.type,
    userkey = req.body.userkey,
    name = req.body.name,
    createdBy = req.body.createdBy, // TODO: get this from JWT or else where
    role = req.body.role;

  if (userid && userkey && createdBy) { //mandatory fields
    models.User.create({
      userid: userid,
      userkey: auth.hashGen(userkey),
      name: name,
      createdBy: createdBy,
      role: role || 'ADMIN', // default is ADMIN
      type: type || 'E'
    }).then(function () {
      return router_utils.sendSuccessResponse(res, {
        'msg': 'created ' + userid
      }, 201);
    }).catch(function (e) {
      console.log("unable to create record..");
      console.log(e);
      return router_utils.sendErrorResponse(res, {
        'msg': 'Unable to create user'
      }, 500);
    });

  } else {
    router_utils.sendErrorResponse(res, {
      'msg': 'Mandatory field(s) missing'
    });
  }
});


router.post('/update', function (req, res) {
  // TODO: add JWT middleware here
  var userid = req.body.userid,
    type = req.body.type,
    userkey = req.body.userkey,
    name = req.body.name,
    role = req.body.role;

  if (userid) { //mandatory fields
    models.User.find({
      userid: userid,
    }).then(function (user) {
      if (user) {
        user.updateAttributes({
          userkey: userkey || user.userkey,
          name: name || user.name,
          role: role || user.role,
          type: type || user.type
        }).then(function () {
          return router_utils.sendSuccessResponse(res, {
            'msg': 'updated data for ' + userid
          });
        }).catch(function (e) {
          return router_utils.sendErrorResponse(res, {
            'msg': 'unable to update record'
          }, 500);
        });
      } else {
        return router_utils.sendErrorResponse(res, {
          'msg': 'Not found'
        }, 404);
      }
    }).catch(function (e) {
      console.log("unable to update record..");
      console.log(e);
      return router_utils.sendErrorResponse(res, {
        'msg': 'Unable to update user'
      }, 500);
    });

  } else {
    router_utils.sendErrorResponse(res, {
      'msg': 'Mandatory field(s) missing'
    });
  }
});


router.post('/delete', function (req, res) {
  // TODO: add JWT middleware here
  var userid = req.body.userid;

  if (userid) {
    models.User.destroy({
      where: {
        userid: userid
      }
    }).then(function () {
      return router_utils.sendSuccessResponse(res, {
        'msg': 'deleted ' + userid
      });
    }).catch(function (e) {
      console.log("unable to delete record..");
      console.log(e);
      return router_utils.sendErrorResponse(res, {
        'msg': 'Unable to delete user'
      }, 500);
    });
  } else {
    router_utils.sendErrorResponse(res, {
      'msg': 'Mandatory field(s) missing'
    });
  }

});


router.delete('/:userid', function (req, res) {
  // TODO: add JWT middleware here
  var userid = req.params.userid;

  if (userid) {
    models.User.destroy({
      where: {
        userid: userid
      }
    }).then(function () {
      return router_utils.sendSuccessResponse(res, {
        'msg': 'deleted ' + userid
      });
    }).catch(function (e) {
      console.log("unable to delete record..");
      console.log(e);
      return router_utils.sendErrorResponse(res, {
        'msg': 'Unable to delete user'
      }, 500);
    });
  } else {
    router_utils.sendErrorResponse(res, {
      'msg': 'Mandatory field(s) missing'
    });
  }

});


router.get('/all/', function (req, res) {
  models.User.findAll().then(function (users) {
    return router_utils.sendSuccessResponseWObj(res, users);
  }).catch(function (e) {
    console.log("unable to get user record..");
    console.log(e);
    return router_utils.sendErrorResponse(res, {
      'msg': 'Unable to get any user'
    }, 500);
  });
});


router.get('/:userid', function (req, res) {
  var userid = req.params.userid;
  if (userid) {
    models.User.findAll({
      where: {
        userid: userid
      }
    }).then(function (users) {
      return router_utils.sendSuccessResponseWObj(res, users);
    }).catch(function (e) {
      console.log("unable to get record..");
      console.log(e);
      return router_utils.sendErrorResponse(res, {
        'msg': 'Unable to get user'
      }, 500);
    });

  } else {
    router_utils.sendErrorResponse(res, {
      'msg': 'Mandatory field(s) missing'
    });
  }

});

module.exports = router;
