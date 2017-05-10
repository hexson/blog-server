var express = require('express');
var $u = require('../utils');
var db = require('../schema');
var router = express.Router();

router.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  if (req.method == 'OPTIONS') {
    res.send(200);
  }
  else {
    next();
  }
});

router.get('/', function(req, res, next) {
  res.send('<body style="padding: 50px;font: 14px \'Lucida Grande\', Helvetica, Arial, sans-serif;"><h1>api.hexson.cn</h1><p>Welcome to my site</p></body>');
});

router.post('/sequence/create', function(req, res, next) {
  let tablename = req.body.tablename;
  if (!tablename){
    return res.send({code: 0, msg: '参数传入错误'});
  }
  db.$id.findOne({table_name: tablename}, function(err, doc){
    if (err) return res.send(err);
    if (doc && doc.table_name) return res.send({code: 0, msg: '要创建的实例已经存在'});
    let sequence = new db.$id({
      table_name: tablename,
      sequence_value: 0
    });
    sequence
    .save()
    .then((r) => {
      res.send({
        table_name: r.table_name,
        sequence_value: r.sequence_value
      });
    })
    .catch((e) => {
      res.send(e);
    })
  })
});

router.get('/posts', function(req, res, next) {
  let { limit, page } = req.query;
  db.Post.find({}, {_id: 0}, function(err, doc){
    if (err) return res.send(err);
    if (!doc.length) return res.send(doc);
    let lastId = doc.pop().id;
    let queryConf = page == 1 ? {} : {'id': {'$lt': lastId}};
    db.Post.find(queryConf, {_id: 0}, function(e, d){
      if (e) return res.send(e);
      res.send(d);
    })
    .sort({id: -1})
    .limit(+limit)
  })
  .sort({id: -1})
  .limit(limit * ((page - 1) || 1))
});

router.post('/posts/create', function(req, res, next) {
  let { title, classify, tags, preview, body } = req.body;
  if (!title) return res.send({code: 0, msg: '标题不能为空'});
  if (!classify) return res.send({code: 0, msg: '分类不能为空'});
  if (!tags) return res.send({code: 0, msg: '标签不能为空'});
  if (!preview) return res.send({code: 0, msg: '预览不能为空'});
  if (!body) return res.send({code: 0, msg: '内容不能为空'});
  db.$id.findOneAndUpdate({table_name: 'posts'}, {$inc: {sequence_value: 1}}, {new: true}, function(err, doc){
    if (err) return res.send(err);
    let posts = new db.Post({
      id: doc.sequence_value,
      title: title,
      classify: classify,
      tags: tags,
      preview: preview,
      body: body,
      update_at: null,
      create_at: $u.getTime()
    });
    posts
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
