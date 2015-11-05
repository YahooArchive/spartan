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
    type = 'E',
    role = 'ADMIN';

  if (name && createdBy && updatedBy) { //mandatory fields
    models.sequelize.transaction(function (t) {
      return models.UserGroup.create({
        name: name,
        description: description,
        createdBy: createdBy,
        updatedBy: updatedBy
      }, {
        transaction: t
      }).then(function (user) {
        return models.UserInGroup.create({
          userType: type,
          role: role,
          userGroupName: name,
          userid: createdBy,
          createdBy: createdBy
        }, {
          transaction: t
        });
      });
    }).then(function () {
      //committed
      console.log("transaction committed");
      return router_utils.sendSuccessResponse(res, {
        'msg': 'created ' + name
      }, 201);
    }).catch(function (err) {
      console.log("transaction had an error, rolling back.. ");
      console.log(err);
      return router_utils.sendErrorResponse(res, {
        'msg': 'Unable to create user group'
      }, 500);
    });

  } else {
    router_utils.sendErrorResponse(res, {
      'msg': 'Mandatory field(s) missing'
    });
  }
});


router.post('/update', [auth.verify], function (req, res) {
  var name = req.body.name,
    description = req.body.description,
    updatedBy = req.token.sub;

  if (name && updatedBy) { //mandatory fields
    models.UserInGroup.findOne({
        where: {
          role: 'ADMIN',
          userGroupName: name,
          userid: updatedBy
        }
      })
      .then(function (row) {
        if (row) {
          models.UserGroup.find({
            name: name,
          }).then(function (userGroup) {
            if (userGroup) {
              userGroup.updateAttributes({
                description: description || userGroup.description,
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
          });
        } else {
          return router_utils.sendErrorResponse(res, {
            'msg': 'Not allowed to delete to user group'
          }, 403);
        }
      }).catch(function (e) {
        console.log("unable to update record..");
        console.log(e);
        return router_utils.sendErrorResponse(res, {
          'msg': 'Unable to update user group'
        }, 500);
      });

  } else {
    router_utils.sendErrorResponse(res, {
      'msg': 'Mandatory field(s) missing'
    });
  }
});


router.post('/delete', [auth.verify], function (req, res) {
  var name = req.body.name,
    requestor = req.token.sub;

  if (name) {
    models.UserInGroup.findOne({
        where: {
          role: 'ADMIN',
          userGroupName: name,
          userid: requestor
        }
      })
      .then(function (row) {
        if (row) {
          models.UserGroup.destroy({
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
              'msg': 'Unable to delete user group'
            }, 500);
          });
        } else {
          return router_utils.sendErrorResponse(res, {
            'msg': 'Not allowed to delete to user group'
          }, 403);
        }
      }).catch(function (e) {
        console.log("unable to delete record..");
        console.log(e);
        return router_utils.sendErrorResponse(res, {
          'msg': 'Unable to delete user group'
        }, 500);
      });
  } else {
    router_utils.sendErrorResponse(res, {
      'msg': 'Mandatory field(s) missing'
    });
  }
});


router.delete('/:usergroup', [auth.verify], function (req, res) {
  var name = req.params.usergroup,
    requestor = req.token.sub;

  // Also delete all corresponding entries in UserInGroup - ideally via sql cascade
  if (name) {
    models.UserInGroup.findOne({
        where: {
          role: 'ADMIN',
          userGroupName: name,
          userid: requestor
        }
      })
      .then(function (row) {
        if (row) {
          models.UserGroup.destroy({
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
              'msg': 'Unable to delete user group'
            }, 500);
          });
        } else {
          return router_utils.sendErrorResponse(res, {
            'msg': 'Not allowed to delete to user group'
          }, 403);
        }
      });
  } else {
    router_utils.sendErrorResponse(res, {
      'msg': 'Mandatory field(s) missing'
    });
  }

});


router.get('/all/', [auth.verify], function (req, res) {
  models.UserGroup.findAll().then(function (users) {
    return router_utils.sendSuccessResponseWObj(res, users);
  }).catch(function (e) {
    console.log("unable to get user group records..");
    console.log(e);
    return router_utils.sendErrorResponse(res, {
      'msg': 'Unable to get any user group'
    }, 500);
  });
});


router.get('/:usergroup', [auth.verify], function (req, res) {
  var name = req.params.usergroup;
  if (name) {
    models.UserGroup.findAll({
      where: {
        name: name
      }
    }).then(function (userGroups) {
      return router_utils.sendSuccessResponseWObj(res, userGroups);
    }).catch(function (e) {
      console.log("unable to get record..");
      console.log(e);
      return router_utils.sendErrorResponse(res, {
        'msg': 'Unable to get user group'
      }, 500);
    });
  } else {
    router_utils.sendErrorResponse(res, {
      'msg': 'Mandatory field(s) missing'
    });
  }
});

router.post('/adduser', [auth.verify], function (req, res) {
  var userid = req.body.userid;
  var group = req.body.group;
  var createdBy = req.token.sub;
  var role = req.body.role;
  var type = req.body.usertype;
  if (group && userid && createdBy) {
    models.UserInGroup.findOne({
        where: {
          role: 'ADMIN',
          userGroupName: group,
          userid: createdBy
        }
      })
      .then(function (row) {
        if (row) {
          models.UserInGroup.findOrCreate({
              where: {
                userid: userid,
                userGroupName: group
              },
              defaults: {
                userType: type || 'E',
                role: role || 'MEMBER', // we only have special logic associated to 'ADMIN'
                createdBy: createdBy
              }
            })
            .then(function () {
              return router_utils.sendSuccessResponse(res, {
                'msg': 'added ' + userid + ' to ' + group
              });
            })
            .catch(function (e) {
              console.log("unable to create record..");
              console.log(e);
              return router_utils.sendErrorResponse(res, {
                'msg': 'Unable to add to user group'
              }, 500);
            });
        } else {
          return router_utils.sendErrorResponse(res, {
            'msg': 'Not allowed to add to user group'
          }, 403);
        }
      })
      .catch(function (e) {
        console.log("unable to create record..");
        console.log(e);
        return router_utils.sendErrorResponse(res, {
          'msg': 'Unable to add to user group'
        }, 500);
      });
  } else {
    router_utils.sendErrorResponse(res, {
      'msg': 'Mandatory field(s) missing'
    });
  }
});

router.post('/removeuser', [auth.verify], function (req, res) {
  var userid = req.body.userid;
  var group = req.body.group;
  var requestor = req.token.sub;
  if (group && userid) {
    models.UserInGroup.findOne({
        where: {
          role: 'ADMIN',
          userGroupName: group,
          userid: requestor
        }
      })
      .then(function (row) {
        if (row) {
          models.UserInGroup.destroy({
            where: {
              userGroupName: group,
              userid: userid
            }
          }).then(function () {
            return router_utils.sendSuccessResponse(res, {
              'msg': 'removed ' + userid + ' from ' + group
            });
          }).catch(function (e) {
            console.log("unable to delete record..");
            console.log(e);
            return router_utils.sendErrorResponse(res, {
              'msg': 'Unable to remove from user group'
            }, 500);
          });
        } else {
          return router_utils.sendErrorResponse(res, {
            'msg': 'Not allowed to remove from user group'
          }, 403);
        }
      })
      .catch(function (e) {
        console.log("unable to create record..");
        console.log(e);
        return router_utils.sendErrorResponse(res, {
          'msg': 'Unable to add to user group'
        }, 500);
      });
  } else {
    router_utils.sendErrorResponse(res, {
      'msg': 'Mandatory field(s) missing'
    });
  }
});


module.exports = router;
