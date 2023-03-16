var fs = require('fs-extra');
var common = require('./common');
var logger = require('../common/logger');
var sql = require('./videoSqlMapping');
// 使用连接池，提升性能
var mysql = require('mysql');
var conf = require('../conf/db');
var pool = mysql.createPool(conf.mysql);

var http = require("http");
/*
callback(is_success, data/erro)
*/
// function http_get(ip, port, url, params, callback){
//     //创建一个http.ClientRequest对象
//     var options = {
//         host : ip,
//         port : port,
//         path : url+"?"+params,
//         method : "GET",
//     };
//     var request = http.request(options,function(incoming_msg){
//         console.log("get respones");
//     });
//     //发送这个请求
//     request.end();
// }
// http_get("127.0.0.1", 6080, "/login", "uname=jadeshu&upw=123456", function(is_ok,data){
// });
module.exports = {
  http_get(ip, port, url, params) {
    return new Promise((resolve, reject) => {
      var options = {
          host : ip,
          port : port,
          path : url+"?"+params,
          method : "GET"
      }
      var request = http.request(options,resolve)
      request.end()
    })
  }
  // http_get
}