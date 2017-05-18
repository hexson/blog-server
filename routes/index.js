var express = require('express');
var $u = require('../utils');
var db = require('../schema');
var router = express.Router();


// router.all('*', function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   if (req.method == 'OPTIONS'){
//     res.send(200);
//   }else next();
// });
router.all('*', function(req, res, next) {
  console.log(req.url);
  console.log(req.headers.token)
  next();
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


module.exports = router;
