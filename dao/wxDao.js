var fs = require('fs-extra');
var common = require('./common');
var logger = require('../common/logger');
var sql = require('./wxSqlMapping');
// 使用连接池，提升性能
var mysql = require('mysql');
var conf = require('../conf/db');
var pool = mysql.createPool(conf.mysql);
var jsonWebToken = require('jsonwebtoken');
const CONSTANT = require('../common/constant');

// 更新微信用户 openid uuid
var updata = (req, res, next, data, uuid) => {
  // upDataUuid
  pool.getConnection(function (err, connection) {
    var openid = data.openid
    var session_key = data.session_key
    if (err) {
      res.json({
        state: 'fail',
        msg: err
      })
    }
    connection.query(sql.upDataUuid(openid, uuid), function (err, result) {
      if (err) {
        logger.error(err);
        connection.release();
        return common.jsonWrite(res, ret);
      }
      common.jsonWrite(res, {
        state: 'ok',
        token: uuid
      });
      connection.release();
    })
  })
}
// 新建微信用户 openid uuid
var add = (req, res, next, data, uuid) => {
  // upDataUuid
  pool.getConnection(function (err, connection) {
    var openid = data.openid
    var session_key = data.session_key
    if (err) {
      res.json({
        state: 'fail',
        msg: err
      })
    }
    connection.query(sql.addData(openid, uuid), function (err, result) {
      if (err) {
        logger.error(err);
        connection.release();
        return common.jsonWrite(res, ret);
      }
      common.jsonWrite(res, {
        state: 'ok',
        token: uuid
      });
      connection.release();
    })
  })
}
// 查询手机号是否已被使用
var queryMobile = (req, res, next, openid, callback) => {
  const obj = req.body
  pool.getConnection((err, connection) => {
    if (err) {
      res.json({
        state: 'fail',
        msg: err
      })
    }
    connection.query(sql.queryMobile(obj.mobile), function (err, result) {
      if (err) {
        logger.error(err);
      }
      if (result.length > 0) {
        // lock = Promise.resolve();

        res.send({
          state: 'fail',
          msg: '手机号已被使用'
        })
        requestListDelete0()
      } else {
        addUserInfo(req, res, next, openid)
      }
      connection.release()
    })
  })
}

var addUserInfo = (req, res, next, openid, callback) => {
  var obj = req.body
  pool.getConnection(function (err, connection) {
    connection.query(sql.addUserInfo(openid, obj.userName, obj.mobile), function (err, result) {
      if (err) {
        logger.error(err);
        connection.release();
        return common.jsonWrite(res, ret);
      }
      common.jsonWrite(res, {
        state: 'ok',
        msg: '绑定成功'
      });
      requestListDelete0()
      connection.release();
    })
  })
}
/* ================================================================== */
// 创建递归
var creatDG = () => {
  let req = requestList[0].req
  let res = requestList[0].res
  let next = requestList[0].next
  let authorization = requestList[0].authorization
  const obj = req.body
  const openid = jsonWebToken.decode(authorization.split(' ')[1], CONSTANT.SECRET_KEY)
  pool.getConnection((err, connection) => {
    if (err) {
      res.json({
        state: 'fail',
        msg: err
      })
      requestListDelete0()
      return
    }
    connection.query(sql.queryUserName(obj.userName), function (err, result) {
      if (err) {
        logger.error(err);
      }
      if (result.length > 0) {
        res.send({
          state: 'fail',
          msg: '用户名已存在'
        })
        requestListDelete0()
      } else {
        queryMobile(req, res, next, openid.uid)
      }
      connection.release()
    })
  })
}
// 递归循环条件
var requestListDelete0 = () => {
  if (requestList.length === 0) {
    return workIng = false
  }
  if (requestList.length > 0) {
    requestList.splice(0, 1)
    if (requestList.length === 0) {
      return workIng = false
    } 
    creatDG()
  }
}



/* ================================================================== */
let requestList = []
let workIng = false
module.exports = {
  // 查询openid用户是否存在
  openidJwtUuid(req, res, next, data) {
    const openid = data.openid
    // const session_key = data.session_key
    pool.getConnection(function (err, connection) {
      if (err) {
        res.json({
          state: 'fail',
          msg: err
        })
      }
      connection.query(sql.queryOpenid(openid), function (err, result) {
        if (err) {
          logger.error(err);
        }
        const uuid = jsonWebToken.sign({
          uid: openid
        }, CONSTANT.SECRET_KEY, {
          expiresIn: 60 * 60 * 24 * 30
        })
        if (result.length > 0) {
          // 修改openid
          updata(req, res, next, data, uuid)
        } else {
          add(req, res, next, data, uuid)
        }
        connection.release();
      })
    })
  },
  // 获取绑定的用户信息
  getUserInfo(req, res, next, authorization) {
    // 解密 获取获取openid
    const openid = jsonWebToken.decode(authorization.split(' ')[1], CONSTANT.SECRET_KEY)
    pool.getConnection((err, connection) => {
      if (err) {
        res.json({
          state: 'fail',
          msg: err
        })
      }
      connection.query(sql.queryUserInfoOpenid(openid.uid), function (err, result) {
        if (err) {
          logger.error(err);
        }
        if (result.length > 0) {
          res.send({
            state: 'ok',
            obj: {
              userName: result[0].userName,
              patId: result[0].patId,
              mobile: result[0].mobile,
              grade: result[0].grade
            }
          })
        } else {
          res.send({
            state: 'fail',
            obj: '暂未绑定用户信息'
          })
        }
        connection.release()
      })
    })
  },
  // 验证用户，通过则创建
  // bindUserInfoQuery(req, res, next, authorization) {
  //   const obj = req.body
  //   const openid = jsonWebToken.decode(authorization.split(' ')[1], CONSTANT.SECRET_KEY)
  //   pool.getConnection((err, connection) => {
  //     if (err) {
  //       res.json({
  //         state: 'fail',
  //         msg: err
  //       })
  //     }
  //     connection.query(sql.queryUserName(obj.userName), function (err, result) {
  //       if (err) {
  //         logger.error(err);
  //       }
  //       if (result.length > 0) {
  //         res.send({
  //           state: 'fail',
  //           msg: '用户名已存在'
  //         })
  //       } else {
  //         queryMobile(req, res, next, openid.uid)
  //       }
  //       connection.release()
  //     })
  //   })
  // }
  bindUserInfoQuery(req, res, next, authorization) {
    requestList.push({ req, res, next, authorization })
    if (workIng) {
      return
    }
    workIng = true
    creatDG()
  }
}