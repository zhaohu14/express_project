// 文章相关接口处理

var fs = require('fs-extra');
var common = require('./common');
var logger = require('../common/logger');
var sql = require('./articleDaoSqlMapping');
// 使用连接池，提升性能
var mysql = require('mysql');
var conf = require('../conf/db');
var pool = mysql.createPool(conf.mysql);
var jsonWebToken = require('jsonwebtoken');
const CONSTANT = require('../common/constant');

function getAllArticle (req, res, next) {
  pool.getConnection(function(err, connection) {
    if (err) {
      res.json({
        state: 'fail',
        msg: JSON.stringify(err)
      })
    }
    connection.query(sql.queryAllArticle(), function(err, result) {
      if (err) {
        logger.error(err);
        connection.release();
        return common.jsonWrite(res, ret);
      }
      let arr = JSON.parse(JSON.stringify(result))
      arr.map(e => {
        delete e.uuid
      })
      common.jsonWrite(res, {
        state: 'ok',
        list: arr
      })
    })
  })
}

module.exports = {
  getAllArticle
}