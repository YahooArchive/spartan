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
    roleType = req.body.roletype,
    roleHandle = req.body.rolehandle,
    createdBy = req.token.sub,
    updatedBy = createdBy,
    userGroup = req.body.usergroup;

  // TODO: add check to validate that requestor belongs to usergroup
  if (name && createdBy && updatedBy && userGroup) { //mandatory fields
    models.UserInGroup.findOne({
        where: {
          userGroupName: userGroup,
          userid: createdBy
        }
      })
      .then(function (row) {
        if (row) {
          models.Role.create({
            name: name,
            roleType: roleType || '',
            roleHandle: roleHandle || '',
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
              'msg': 'Unable to create role'
            }, 500);
          });
        } else {
          return router_utils.sendErrorResponse(res, {
            'msg': 'Not allowed to create role'
          }, 403);
        }
      })
      .catch(function (e) {
        console.log("unable to create role..");
        console.log(e);
        return router_utils.sendErrorResponse(res, {
          'msg': 'Unable to create role'
        }, 500);
      });
  } else {
    router_utils.sendErrorResponse(res, {
      'msg': 'Mandatory field(s) missing'
    });
  }
});


router.post('/update', [auth.verify, auth.authzUserRole], function (req, res) {
  var name = req.body.role,
    description = req.body.description,
    userGroup = req.body.usergroup,
    roleType = req.body.roletype,
    roleHandle = req.body.rolehandle,
    updatedBy = req.token.sub;

  // TODO: add check to validate that requestor belongs to BOTH old and new usergroup
  if (name && updatedBy) { //mandatory fields
    models.Role.find({
      name: name,
    }).then(function (role) {
      if (role) {
        role.updateAttributes({
          description: description || role.description,
          roleType: roleType || role.roleType,
          roleHandle: roleHandle || role.roleHandle,
          ownedByUserGroup: userGroup || role.ownedByUserGroup,
          updatedBy: updatedBy
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
        return router_utils.sendErrorResponse(res, {
          'msg': 'Not found'
        }, 404);
      }
    }).catch(function (e) {
      console.log("unable to update record..");
      console.log(e);
      return router_utils.sendErrorResponse(res, {
        'msg': 'Unable to update role'
      }, 500);
    });

  } else {
    router_utils.sendErrorResponse(res, {
      'msg': 'Mandatory field(s) missing'
    });
  }
});



router.post('/delete', [auth.verify, auth.authzUserRole], function (req, res) {
  var name = req.body.role;

  if (name) {
    models.Role.destroy({
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
        'msg': 'Unable to delete role'
      }, 500);
    });
  } else {
    router_utils.sendErrorResponse(res, {
      'msg': 'Mandatory field(s) missing'
    });
  }

});


router.delete('/:role', [auth.verify, auth.authzUserRole], function (req, res) {
  var name = req.params.role;

  if (name) {
    models.Role.destroy({
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
        'msg': 'Unable to delete role'
      }, 500);
    });
  } else {
    router_utils.sendErrorResponse(res, {
      'msg': 'Mandatory field(s) missing'
    });
  }

});


router.get('/all/', [auth.verify], function (req, res) {
  models.Role.findAll().then(function (roles) {
    return router_utils.sendSuccessResponseWObj(res, roles);
  }).catch(function (e) {
    console.log("unable to get role records..");
    console.log(e);
    return router_utils.sendErrorResponse(res, {
      'msg': 'Unable to get any role'
    }, 500);
  });
});


router.get('/:role', [auth.verify, auth.authzUserRole], function (req, res) {
  var name = req.params.role;
  if (name) {
    models.Role.findAll({
      where: {
        name: name
      }
    }).then(function (role) {
      return router_utils.sendSuccessResponseWObj(res, role);
    }).catch(function (e) {
      console.log("unable to get record..");
      console.log(e);
      return router_utils.sendErrorResponse(res, {
        'msg': 'Unable to get role'
      }, 500);
    });

  } else {
    router_utils.sendErrorResponse(res, {
      'msg': 'Mandatory field(s) missing'
    });
  }

});

router.post('/addmember', [auth.verify, auth.authzUserRole], function (req, res) {
  var appName = req.body.appname,
    createdBy = req.token.sub,
    roleName = req.body.role,
    attribute = req.body.attribute;
  if (roleName && appName && createdBy) {
    models.AppInRole.create({
      roleName: roleName,
      appName: appName,
      attribute: attribute || '',
      createdBy: createdBy
    }).then(function () {
      return router_utils.sendSuccessResponse(res, {
        'msg': 'added ' + appName + ' to ' + roleName
      });
    }).catch(function (e) {
      console.log("unable to create record..");
      console.log(e);
      return router_utils.sendErrorResponse(res, {
        'msg': 'Unable to add to role group'
      }, 500);
    });
  } else {
    router_utils.sendErrorResponse(res, {
      'msg': 'Mandatory field(s) missing'
    });
  }
});

router.post('/removemember', [auth.verify, auth.authzUserRole], function (req,
  res) {
  var appName = req.body.appname,
    roleName = req.body.role
  requestor = req.token.sub;
  if (roleName && appName && requestor) {
    models.AppInRole.destroy({
      where: {
        roleName: roleName,
        appName: appName
      }
    }).then(function () {
      return router_utils.sendSuccessResponse(res, {
        'msg': 'removed ' + roleName + ": " + appName +
          ' association'
      });
    }).catch(function (e) {
      console.log("unable to delete record..");
      console.log(e);
      return router_utils.sendErrorResponse(res, {
        'msg': 'Unable to remove role member'
      }, 500);
    });
  } else {
    router_utils.sendErrorResponse(res, {
      'msg': 'Mandatory field(s) missing'
    });
  }
});

module.exports = router;
