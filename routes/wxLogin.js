var express = require('express');
var router = express.Router();
var http = require("http");
// import axios from 'axios'
var axios = require('axios')
var wxDao = require('../dao/wxDao')


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
  // console.log(url, '--------')
  axios.get(url).then(ret => {
    console.log(ret.data, '-----')
    const data = ret.data
    if (data.errcode) {
      return res.json({
        state: 'fail',
        msg: data.errmsg
      })
    }
    wxDao.openidJwtUuid(req, res, next, data)
    // res.json({
    //   state: 'ok', 
    //   obj: data
    // })
  })
  
});

module.exports = router;