var express = require('express');
var $u = require('../utils');
var db = require('../schema');
var router = express.Router();


// router.all('*', function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   if (req.method == 'OPTIONS'){
//     res.send(200);
//   }else next();
// });
router.all('*', function(req, res, next) {
  if (req.url.indexOf('/admin/') >= 0 && req.url.indexOf('/login') < 0 && req.headers.token != $u.token){
    res.send({code: 9, msg: '非法请求'});
  }else {
    next();
  }
});


router.get('/', function(req, res, next) {
  res.send('<body style="padding: 50px;font: 14px \'Lucida Grande\', Helvetica, Arial, sans-serif;"><h1>api.hexson.cn</h1><p>Welcome to my site</p></body>');
});


module.exports = router;
