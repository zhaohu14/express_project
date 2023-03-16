var express = require('express');
var router = express.Router();

var tokenDao = require('../dao/tokenDao');

router.use('/adminLogin', function (req, res, next) {
  console.log(req.query, req.body, req.params)
  if (!req.body.uid) {
    res.send({
      state: 'fail',
      msg: '请输入正确用户名'
    })
    return
  }
  if (req.method === 'OPTIONS') {
    res.send('GET,HEAD');
  } else {
    tokenDao.getToken('admin', req, res, next);
  }
});

router.use('/', function (req, res, next) {
  if (req.method === 'OPTIONS') {
    res.send('GET,HEAD');
  } else {
    tokenDao.getToken('teacher', req, res, next);
  }
});
module.exports = router;
