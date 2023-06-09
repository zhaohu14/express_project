var http = require("http");
var urlUtil = require('url');
var file = require("./file");
var querystring = require('querystring');
// var HttpUtil = {
//get提交url，返回html数据
var get = function (url, success, error) {
  http.get(url, function (res) {
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
var post = function (hostname, port, path, body, acceptType, contentType, success, error) {
  var bodyString = "";
  if (body != null && contentType == "application/json") {
    bodyString = JSON.stringify(body);
  }
  else if (body != null && contentType == "application/x-www-form-urlencoded") {
    bodyString = querystring.stringify(body);
  }
  var opts = {
    hostname: hostname,
    port: port,
    path: path,
    method: 'post',
    headers: {
      'Accept': acceptType,
      'Content-Type': contentType,
      'Content-Length': bodyString.length
    }
  }

  var req = http.request(opts, function (res) {

    var result = "";
    res.setEncoding("UTF-8");
    res.on("data", function (data) {
      result += data;
    });
    res.on('error', error);
    res.on('end', function () {
      success(result);
    });

  });
  req.on('error', this.requestError);
  // file.writeInFile(req);
  // req.write(bodyString);
  req.end();
}
//提交表单参数，并返回html内容
var postAndReturnHtml = function (url, body, success, error) {
  var urlConfig = urlUtil.parse(url);
  var contentType = "application/x-www-form-urlencoded";
  var acceptType = "text/html";
  this.post(urlConfig.hostname, urlConfig.port, urlConfig.path, body, acceptType, contentType, success, this.responseError);
}
//get提交url参数，并返回json数据
var getAndReturnJson = function (url, success, error) {
  this.get(url, function (data) {
    var data = JSON.parse(data);
    success(data);
  }, this.responseError(error));
}
//提交json参数，并返回json
var postAndReturnJson = function (url, body, success, error) {
  var contentType = "application/json";
  var acceptType = "application/json";
  var urlConfig = urlUtil.parse(url);
  this.post(urlConfig.hostname, urlConfig.port, urlConfig.path, body, acceptType, contentType, function (data) {
    var data = JSON.parse(data);
    success(data);
  }, this.responseError(error));
}
var requestError = function (error) {
  console.log("请求失败--" + error.message);
}
var responseError = function (error) {
  return error || function (e) {
    console.log("响应失败--" + e.message);
  };
}
// }

// module.exports = HttpUtil;
export { get, post, postAndReturnHtml, getAndReturnJson, postAndReturnJson, requestError, responseError }