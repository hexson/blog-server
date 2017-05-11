var express = require('express');
var $u = require('../utils');
var db = require('../schema');
var router = express.Router();


router.get('/get', function(req, res, next) {
  let { limit, page } = req.query;
  limit = +limit || 10;
  page = +page || 1;
  db.Post.find({}, {_id: 0}, function(err, doc){
    if (err) return res.send(err);
    if (!doc.length) return res.send(doc);
    let lastId = doc.pop().id;
    let queryConf = page == 1 ? {} : {'id': {'$lt': lastId}};
    db.Post.find(queryConf, {_id: 0}, function(e, d){
      if (e) return res.send(e);
      setTimeout(function(){
        res.send(d);
      }, 2000)
    })
    .sort({id: -1})
    .limit(limit)
  })
  .sort({id: -1})
  .limit(limit * ((page - 1) || 1))
});

router.post('/create', function(req, res, next) {
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
      views: 0,
      updated_at: null,
      created_at: $u.getTime()
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