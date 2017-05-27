var express = require('express');
var $u = require('../utils');
var db = require('../schema');
var router = express.Router();


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
            count: n,
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

module.exports = router;