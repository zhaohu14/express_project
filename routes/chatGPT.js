var express = require('express');
var router = express.Router();
var http = require("http");
// import axios from 'axios'
var axios = require('axios')





router.post('/setMessage', function (req, res, next) { 
  console.log('==========================================')
  const key = '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'
  const API_URL = 'https://api.openai.com/v1/';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${key}`
  };
  const requestData = {
    prompt: 'Hello,',
    temperature: 0.7,
    max_tokens: 50,
    n: 1
  };
  axios.post(`${API_URL}engines/davinci-codex/completions`, requestData, { headers }).then(ret => {
    const data = ret.data
    console.log(data, '------')
    res.json(ret.data)
    // if (data.errcode) {
    //   return res.json({
    //     state: 'fail',
    //     msg: data.errmsg
    //   })
    // }
    // res.json({
    //   state: 'ok', 
    //   obj: data
    // })
  })
})


module.exports = router;

