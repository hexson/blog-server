var express = require('express');
var router = express.Router();
var $u = require('../../utils');
var db = require('../../schema');


router.get('/get', function(req, res, next) {
  db.$id.find({}, function(err, doc){
    if (err) return res.send(err);
    res.send(doc);
  })
  .sort({_id: -1})
});

router.post('/add', function(req, res, next) {
  let { table_name } = req.body;
  if (!table_name) return res.send({code: 0, msg: '表名不能为空'});
  db.$id.count({table_name: table_name}, function(e, n){
    if (e) return res.send(e);
    if (n > 0) return res.send({code: 0, msg: '要创建的实例已经存在'});
    let $id = new db.$id({
      table_name: table_name,
      sequence_value: 0,
      created_at: $u.now()
    });
    $id.save()
    .then((r) => {
      res.send({
        code: 1,
        data: r
      });
    })
    .catch((e) => {
      res.send(e);
    })
  })
});

module.exports = router;