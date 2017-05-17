var express = require('express');
var $u = require('../utils');
var db = require('../schema');
var router = express.Router();


router.post('/get', function(req, res, next) {
  db.Tag.find({}, {_id: 0}, function(err, doc){
    if (err) return res.send(err);
    res.send(doc);
  })
});

router.post('/create', function(req, res, next) {
  let { name, auth } = req.body;
  if (auth != '123456') return res.send({code: 0, msg: '非法请求'});
  if (!name) return res.send({code: 0, msg: '标签名不能为空'});
  db.$id.findOneAndUpdate({table_name: 'tags'}, {$inc: {sequence_value: 1}}, {new: true}, function(err, doc){
    if (err) return res.send(err);
    let tags = new db.Tag({
      id: doc.sequence_value,
      name: name,
      updated_at: null,
      created_at: $u.now()
    });
    tags
    .save()
    .then((r) => {
      res.send(r);
    })
    .catch((e) => {
      res.send(e);
    })
  })
});

module.exports = router;