var express = require('express');
var router = express.Router();
var http = require("http");
// var HttpUtil = require('../util/http');
// import { get } from '../util/http'
// import HttpUtil from '../util/http'

var get = function (url, success, error) {
  console.log(url, '123456')
  http.get(url, function (res) {
    console.log(res, '++++++')
    var result = "";
    res.setEncoding("UTF-8");
    res.on("data", function (data) {
      result += data;
    });
    res.on('error', error);
    res.on('end', function () {
      success(result);
    });
  }).on('error', this.requestError);
}


router.post('/', function (req, res, next) {
  res.json({
    state: 'fail',
    msg: '404'
  })
});

router.post('/wxLogin', function (req, res, next) {
  console.log(req.body.code)
  const secret = '771ee1e2a3d551b40475d229e4b7f3ef'
  const appid = 'wxcea2d7b703289eb7'
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${req.body.code}&grant_type=authorization_code`
  console.log(url, '--------')
  get(url, (ret) => {
    console.log(ret,'微信获取权限返回')
  }, (err => {
    console.log(err, '微信错误返回')
  }))
  // http.get(url, (ret) => {
  //   console.log(ret)
  // }, (err => {}))
});

module.exports = router;