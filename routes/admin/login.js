var express = require('express');
var router = express.Router();
var $u = require('../../utils');
var db = require('../../schema');


router.post('/', function(req, res, next) {
  let { account, password } = req.body;
  db.Admin.findOne({
    account: account,
    password: password
  }, function(err, doc){
    if (err) return res.send(err);
    if (!doc) res.send({code: 0, msg: '用户名或密码不正确'});
    if (doc){
      $u.token = $u.getRandomStr(32, true);
      res.send({code: 1, msg: '登录成功', token: $u.getRandomStr(32, 1)});
    }
  })
});

module.exports = router;