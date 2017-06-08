var express = require('express');
var $u = require('../utils');
var db = require('../schema');
var router = express.Router();


router.get('/get', function(req, res, next) {
  db.Post.count({}, function(e, n){
    if (e) return res.send(e);
    db.Classify.count({}, function(cerr, cn){
      if (cerr) return res.send(cerr);
      db.Tag.count({}, function(terr, tn){
        if (terr) return res.send(terr);
        res.send({
          postsCount: n,
          classifyCount: cn,
          tagsCount: tn
        });
      })
    })
  })
});

module.exports = router;