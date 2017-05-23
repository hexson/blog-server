var express = require('express');
var router = express.Router();
var $u = require('../../utils');
var db = require('../../schema');


router.get('/get', function(req, res, next) {
  let { limit, page, name } = req.query;
  limit = limit > 0 ? +limit : 10;
  page = page > 0 ? +page : 1;
  let query = name ? {name: {$regex: name, $options: 'i'}} : {};
  db.Tag.count({}, function(e, n){
    if (e) return res.send(e);
    db.Tag.find(query, {_id: 0}, function(err, doc){
      if (err) return res.send(err);
      res.send({
        totalPage: Math.ceil(n / limit),
        currentPage: page,
        data: doc
      });
    }).sort({id: -1}).skip(limit * (page - 1)).limit(limit)
  })
});

router.get('/get/:id', function(req, res, next) {
  let { id } = req.params;
  db.Tag.findOne({id: id}, {_id: 0}, function(err, doc){
    if (err) return res.send(err);
    if (doc) res.send({code: 1, data: doc});
    else res.send({code: 0, msg: '没有查询到该条数据'});
  })
});

router.post('/add', function(req, res, next) {
  let { name } = req.body;
  if (!name) return res.send({code: 0, msg: '标签名不能为空'});
  db.Tag.count({name: name}, function(e, n){
    if (e) return res.send(e);
    if (n > 0) return res.send({code: 0, msg: '标签名已经存在'});
    db.$id.findOneAndUpdate({table_name: 'tags'}, {$inc: {sequence_value: 1}}, {new: true}, function(err, doc){
      if (err) return res.send(err);
      let tag = new db.Tag({
        id: doc.sequence_value,
        name: name,
        updated_at: null,
        created_at: $u.now()
      });
      tag.save()
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
  })
});

router.post('/update/:id', function(req, res, next) {
  let { id } = req.params;
  let { name } = req.body;
  if (!name) return res.send({code: 0, msg: '标签名不能为空'});
  db.Tag.count({id: id}, function(e, n){
    if (e) return res.send(e);
    if (n <= 0) return res.send({code: 0, msg: '标签不存在'});
    db.Tag.find({id: {$ne: id}, name: name}, function(er, d){
      if (er) return res.send(er);
      if (d.length > 0) return res.send({code: 0, msg: '标签名已经存在'});
      db.Tag.updateOne({id: id}, {$set: {name: name, updated_at: $u.now()}}, function(err, result){
        if (err) return res.send(err);
        if (result.n > 0) res.send({code: 1, msg: '标签更新成功'});
        else res.send({code: 0, msg: '标签更新失败'});
      })
    }).limit(1);
  })
});

router.post('/del/:id', function(req, res, next) {
  let { id } = req.params;
  db.Tag.deleteOne({id: id}, function(err, result){
    if (err) return res.send(err);
    if (result.result.ok) res.send({code: 1, msg: '删除标签成功'});
    else res.send({code: 0, msg: '删除标签失败'});
  })
});

module.exports = router;