var express = require('express');
var router = express.Router();
var $u = require('../../utils');
var db = require('../../schema');


router.get('/get', function(req, res, next) {
  let { limit, page, kw } = req.query;
  limit = limit > 0 ? +limit : 10;
  page = page > 0 ? +page : 1;
  let hide_mongoid = {_id: 0};
  let query = kw ? {$or: [{title: {$regex: kw, $options: 'i'}}, {body: {$regex: kw, $options: 'i'}}]} : {};
  db.Post.count({}, function(e, n){
    if (e) return res.send(e);
    db.Post.find(query, hide_mongoid, function(err, doc){
      if (err) return res.send(err);
      db.Classify.find({}, hide_mongoid, function(cerr, classifys){
        if (cerr) return res.send(cerr);
        db.Tag.find({}, hide_mongoid, function(terr, tags){
          if (terr) return res.send(terr);
          res.send({
            totalPage: Math.ceil(n / limit),
            currentPage: page,
            data: doc,
            classify: classifys,
            tags: tags
          });
        })
      })
    }).sort({id: -1}).skip(limit * (page - 1)).limit(limit)
  })
});

router.get('/get/:id', function(req, res, next) {
  let { id } = req.params;
  db.Post.findOne({id: id}, {_id: 0}, function(err, doc){
    if (err) return res.send(err);
    if (doc) res.send({code: 1, data: doc});
    else res.send({code: 0, msg: '没有查询到该条数据'});
  })
});

router.post('/add', function(req, res, next) {
  let { title, classify, tags, preview, body, created_at } = req.body;
  if (!title) return res.send({code: 0, msg: '文章标题不能为空'});
  if (!classify) return res.send({code: 0, msg: '文章分类不能为空'});
  if (!tags) return res.send({code: 0, msg: '文章标签不能为空'});
  if (!preview) return res.send({code: 0, msg: '文章快照不能为空'});
  if (!body) return res.send({code: 0, msg: '文章内容不能为空'});
  created_at = Math.floor(new Date(created_at).getTime() / 1000);
  let data = {
    title: title,
    classify: classify,
    tags: tags,
    preview: preview,
    body: body,
    views: 0,
    show: 1,
    updated_at: null,
    created_at: created_at
  };
  if (isNaN(created_at) || !created_at || created_at.toString().length !== 10) data.created_at = $u.now();
  db.Post.count({title: title}, function(e, n){
    if (e) return res.send(e);
    if (n > 0) return res.send({code: 0, msg: '文章标题已经存在'});
    db.$id.findOneAndUpdate({table_name: 'posts'}, {$inc: {sequence_value: 1}}, {new: true}, function(err, doc){
      if (err) return res.send(err);
      data.id = doc.sequence_value;
      let post = new db.Post(data);
      post.save()
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
  let { title, classify, tags, preview, body, created_at } = req.body;
  if (!title) return res.send({code: 0, msg: '文章标题不能为空'});
  if (!classify) return res.send({code: 0, msg: '文章分类不能为空'});
  if (!tags) return res.send({code: 0, msg: '文章标签不能为空'});
  if (!preview) return res.send({code: 0, msg: '文章快照不能为空'});
  if (!body) return res.send({code: 0, msg: '文章内容不能为空'});
  created_at = Math.floor(new Date(created_at).getTime() / 1000);
  let data = {
    title: title,
    classify: classify,
    tags: tags,
    preview: preview,
    body: body,
    updated_at: $u.now(),
    created_at: created_at
  };
  if (isNaN(created_at) || !created_at || created_at.toString().length !== 10) delete data.created_at;
  db.Post.count({id: id}, function(e, n){
    if (e) return res.send(e);
    if (n <= 0) return res.send({code: 0, msg: '文章不存在'});
    db.Post.find({id: {$ne: id}, title: title}, function(er, d){
      if (er) return res.send(er);
      if (d.length > 0) return res.send({code: 0, msg: '文章标题已经存在'});
      db.Post.updateOne({id: id}, {$set: data}, function(err, result){
        if (err) return res.send(err);
        if (result.n > 0) res.send({code: 1, msg: '文章更新成功'});
        else res.send({code: 0, msg: '文章更新失败'});
      })
    }).limit(1);
  })
});

router.post('/setshow/:id', function(req, res, next) {
  let { id } = req.params;
  let { show } = req.body;
  if (show != 0 && show != 1) return res.send({code: 0, msg: 'show 值非法'});
  db.Post.updateOne({id: id}, {$set: {show: show}}, function(err, result){
    if (err) return res.send(err);
    if (result.n > 0) res.send({code: 1, msg: '设置成功'});
    else res.send({code: 0, msg: '设置失败'});
  })
});

module.exports = router;