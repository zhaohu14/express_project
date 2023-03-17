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


var updata = (req, res, next, data, uuid) => {
  // upDataUuid
  console.log('updata', '------------------')
  pool.getConnection(function(err, connection) {
    var openid = data.openid
    var session_key = data.session_key
    if (err) {
      res.json({
        state: 'fail',
        msg: err
      })
    }
    connection.query(sql.upDataUuid(openid, uuid), function(err, result) {
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

var add = (req, res, next, data, uuid) => {
  // upDataUuid
  console.log('add', '------------------')
  pool.getConnection(function(err, connection) {
    var openid = data.openid
    var session_key = data.session_key
    if (err) {
      res.json({
        state: 'fail',
        msg: err
      })
    }
    connection.query(sql.addData(openid, uuid), function(err, result) {
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

module.exports = {
  // 查询openid用户是否存在
  openidJwtUuid (req, res, next, data) {
    console.log(req.body, '----')
    var openid = data.openid
    var session_key = data.session_key
    pool.getConnection(function(err, connection) {
      if (err) {
        res.json({
          state: 'fail',
          msg: err
        })
      }
      connection.query(sql.queryOpenid(openid), function(err, result) {
        if (err) {
          logger.error(err);
        }
        console.log(result, '-----')
        var uuid = jsonWebToken.sign({
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
  }
}