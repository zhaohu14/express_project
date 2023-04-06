var express = require('express');
var router = express.Router();

var articleDao = require('../dao/articleDao');
var common = require('../dao/common.js');

router.get('/getAllArticle', function(req, res, next) { // 获取文章列
  articleDao.getAllArticle(req, res, next)
})

module.exports = router;