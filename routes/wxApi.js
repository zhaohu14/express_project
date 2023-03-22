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
})

router.post('/wxLogin', function (req, res, next) { // 微信登录接口
  const secret = '771ee1e2a3d551b40475d229e4b7f3ef'
  const appid = 'wxcea2d7b703289eb7'
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${req.body.code}&grant_type=authorization_code`
  axios.get(url).then(ret => {
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
})

router.get('/getUserInfo', function (req, res, next) { // 获取用户信息
  wxDao.getUserInfo(req, res, next, req.headers.authorization)
})


router.post('/bindUserInfo', async (req, res, next) => {
  wxDao.bindUserInfoQuery(req, res, next, req.headers.authorization)
})


module.exports = router;

