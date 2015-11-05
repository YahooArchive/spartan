//
// Copyright 2015, Yahoo Inc.
// Copyrights licensed under the New BSD License. See the
// accompanying LICENSE.txt file for terms.
//
var models = require('../models');
var express = require('express');
var router = express.Router();
var router_utils = require('./router-utils');
var auth = require('./user-auth');

router.post('/create', [auth.verify], function (req, res) {
  var name = req.body.name,
    description = req.body.description,
    createdBy = req.token.sub,
    updatedBy = createdBy,
    userGroup = req.body.usergroup;

  if (name && createdBy && updatedBy && userGroup) { //mandatory fields
    models.UserInGroup.findOne({
        where: {
          userGroupName: userGroup,
          userid: createdBy
        }
      })
      .then(function (row) {
        if (row) {
          models.App.create({
            name: name,
            description: description,
            createdBy: createdBy,
            updatedBy: updatedBy,
            ownedByUserGroup: userGroup
          }).then(function () {
            return router_utils.sendSuccessResponse(res, {
              'msg': 'created ' + name
            }, 201);
          }).catch(function (e) {
            console.log("unable to create record..");
            console.log(e);
            return router_utils.sendErrorResponse(res, {
              'msg': 'Unable to create app'
            }, 500);
          });
        } else {
          return router_utils.sendErrorResponse(res, {
            'msg': 'Not allowed to create app'
          }, 403);
        }
      })
      .catch(function (e) {
        console.log("unable to create app..");
        console.log(e);
        return router_utils.sendErrorResponse(res, {
          'msg': 'Unable to create app'
        }, 500);
      });
  } else {
    router_utils.sendErrorResponse(res, {
      'msg': 'Mandatory field(s) missing'
    });
  }
});


router.post('/update', [auth.verify, auth.authzUserApp], function (req, res) {
  var name = req.body.app,
    description = req.body.description,
    userGroup = req.body.usergroup,
    requestor = req.token.sub;

  // TODO: also add check to validate that requestor belongs to new usergroup ?
  if (name && requestor) { //mandatory fields
    models.App.find({
      name: name,
    }).then(function (appGroup) {
      if (appGroup) {
        appGroup.updateAttributes({
          description: description || appGroup.description,
          ownedByUserGroup: userGroup || appGroup.ownedByUserGroup,
          updatedBy: requestor
        }).then(function () {
          return router_utils.sendSuccessResponse(res, {
            'msg': 'updated data for ' + name
          });
        }).catch(function (e) {
          return router_utils.sendErrorResponse(res, {
            'msg': 'unable to update record'
          }, 500);
        });
      } else {
        router_utils.sendErrorResponse(res, {
          'msg': 'Not allowed to update app group'
        }, 403);
      }
    }).catch(function (e) {
      console.log("unable to update record..");
      console.log(e);
      return router_utils.sendErrorResponse(res, {
        'msg': 'Unable to update app group'
      }, 500);
    });
  } else {
    router_utils.sendErrorResponse(res, {
      'msg': 'Mandatory field(s) missing'
    });
  }
});



router.post('/delete', [auth.verify, auth.authzUserApp], function (req, res) {
  var name = req.body.app,
    requestor = req.token.sub;

  if (name) {
    models.App.destroy({
      where: {
        name: name
      }
    }).then(function () {
      return router_utils.sendSuccessResponse(res, {
        'msg': 'deleted ' + name
      });
    }).catch(function (e) {
      console.log("unable to delete record..");
      console.log(e);
      return router_utils.sendErrorResponse(res, {
        'msg': 'Unable to delete app group'
      }, 500);
    });
  } else {
    router_utils.sendErrorResponse(res, {
      'msg': 'Mandatory field(s) missing'
    });
  }
});


router.delete('/:app', [auth.verify, auth.authzUserApp], function (req, res) {
  var name = req.params.app,
    requestor = req.token.sub;

  if (name) {
    models.App.destroy({
      where: {
        name: name
      }
    }).then(function () {
      return router_utils.sendSuccessResponse(res, {
        'msg': 'deleted ' + name
      });
    }).catch(function (e) {
      console.log("unable to delete record..");
      console.log(e);
      return router_utils.sendErrorResponse(res, {
        'msg': 'Unable to delete app group'
      }, 500);
    });
  } else {
    router_utils.sendErrorResponse(res, {
      'msg': 'Mandatory field(s) missing'
    });
  }
});


router.get('/all/', [auth.verify], function (req, res) {
  models.App.findAll().then(function (appGroups) {
    return router_utils.sendSuccessResponseWObj(res, appGroups);
  }).catch(function (e) {
    console.log("unable to get app group records..");
    console.log(e);
    return router_utils.sendErrorResponse(res, {
      'msg': 'Unable to get any app group'
    }, 500);
  });
});


router.get('/:appgroup', [auth.verify], function (req, res) {
  var name = req.params.appgroup;
  if (name) {
    models.App.findAll({
      where: {
        name: name
      }
    }).then(function (appGroup) {
      return router_utils.sendSuccessResponseWObj(res, appGroup);
    }).catch(function (e) {
      console.log("unable to get record..");
      console.log(e);
      return router_utils.sendErrorResponse(res, {
        'msg': 'Unable to get app group'
      }, 500);
    });

  } else {
    router_utils.sendErrorResponse(res, {
      'msg': 'Mandatory field(s) missing'
    });
  }

});

router.post('/addmember', [auth.verify, auth.authzUserApp], function (req, res) {
  var identity = req.body.identity,
    identityType = req.body.type,
    appName = req.body.app,
    requestor = req.token.sub,
    role = req.body.role;

  if (identity && appName && requestor) {
    models.MemberInApp.create({
      identity: identity,
      appName: appName,
      identityType: identityType || 'SHA256-Fingerprint',
      role: role || 'DEFAULT',
      createdBy: requestor
    }).then(function () {
      return router_utils.sendSuccessResponse(res, {
        'msg': 'added ' + identity + ' to ' + appName
      });
    }).catch(function (e) {
      console.log("unable to create record..");
      console.log(e);
      return router_utils.sendErrorResponse(res, {
        'msg': 'Unable to add to app group'
      }, 500);
    });
  } else {
    router_utils.sendErrorResponse(res, {
      'msg': 'Mandatory field(s) missing'
    });
  }
});


router.post('/removemember', [auth.verify, auth.authzUserApp], function (req,
  res) {
  var identity = req.body.identity,
    identityType = req.body.type,
    requestor = req.token.sub;

  if (identity && requestor) {
    models.MemberInApp.destroy({
      where: {
        identity: identity,
        identityType: identityType || 'SHA256-Fingerprint'
      }
    }).then(function () {
      return router_utils.sendSuccessResponse(res, {
        'msg': 'removed ' + identity
      });
    }).catch(function (e) {
      console.log("unable to delete record..");
      console.log(e);
      return router_utils.sendErrorResponse(res, {
        'msg': 'Unable to remove app member'
      }, 500);
    });
  } else {
    router_utils.sendErrorResponse(res, {
      'msg': 'Mandatory field(s) missing'
    });
  }
});

module.exports = router;
