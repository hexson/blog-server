var express = require('express');
var router = express.Router();
var $u = require('../../utils');
var db = require('../../schema');


router.get('/get', function(req, res, next) {
  let { limit, page } = req.query;
  limit = limit > 0 ? +limit : 10;
  page = page > 0 ? +page : 1;
  console.log('token: ', $u.token);
  let hide_mongoid = {_id: 0};
  db.Post.count({}, function(e, n){
    if (e) return res.send(e);
    db.Post.find({}, hide_mongoid, function(err, doc){
      if (err) return res.send(err);
      db.Classify.find({}, hide_mongoid, function(cerr, classifys){
        if (cerr) return res.send(cerr);
        db.Tag.find({}, hide_mongoid, function(terr, tags){
          if (terr) return res.send(terr);
          res.send({
            totalPage: Math.ceil(n / limit),
            currentPage: page,
            data: doc,
            class: classifys,
            tags: tags
          });
        })
      })
    }).sort({id: -1}).skip(limit * (page - 1)).limit(limit)
  })
});

module.exports = router;