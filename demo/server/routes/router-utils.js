//
// Copyright 2015, Yahoo Inc.
// Copyrights licensed under the New BSD License. See the
// accompanying LICENSE.txt file for terms.
// 
//   Created: 11/01/2015

module.exports = {

  sendSuccessResponse: function (res, obj, code) {
    res.set({
        'Content-Type': 'application/json;charset=utf-8'
      })
      .status(code || 200)
      .send({
        'msg': obj.msg || 'OK'
      });
  },
  sendSuccessResponseWObj: function (res, obj, code) {
    res.set({
        'Content-Type': 'application/json;charset=utf-8'
      })
      .status(code || 200)
      .send(obj);
  },
  sendErrorResponse: function (res, obj, code) {
    res.set({
        'Content-Type': 'application/json;charset=utf-8'
      })
      .status(code || 400)
      .send({
        'msg': obj.msg || 'Bad Request'
      });
  }
};
