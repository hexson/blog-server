var express = require('express');
var $u = require('../utils');
var db = require('../schema');
var router = express.Router();


router.get('/get', function(req, res, next) {
  db.Classify.find({}, {_id: 0}, function(err, doc){
    if (err) return res.send(err);
    res.send(doc);
  })
});

module.exports = router;