var express = require('express');
var router = express.Router();
var $u = require('../../utils');
var db = require('../../schema');


router.get('/get', function(req, res, next) {
  let { limit, page, name } = req.query;
  limit = limit > 0 ? +limit : 10;
  page = page > 0 ? +page : 1;
  let query = name ? {name: {$regex: name, $options: 'i'}} : {};
  db.Classify.count({}, function(e, n){
    if (e) return res.send(e);
    db.Classify.find(query, {_id: 0}, function(err, doc){
      if (err) return res.send(err);
      res.send({
        totalPage: Math.ceil(n / limit),
        currentPage: page,
        data: doc
      });
    }).sort({id: -1}).skip(limit * (page - 1)).limit(limit)
  })
});

module.exports = router;