//
// Copyright 2015, Yahoo Inc.
// Copyrights licensed under the New BSD License. See the
// accompanying LICENSE.txt file for terms.
//
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
  sendSuccessResponseJSON: function (res, obj, code) {
    res.set({
        'Content-Type': 'application/json;charset=utf-8'
      })
      .status(code || 200)
      .send(obj);
  },

  sendSuccessResponseText: function (res, text, code) {
    res.set({
        'Content-Type': 'text/plain'
      })
      .status(code || 200)
      .send(text);
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
