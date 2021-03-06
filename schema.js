var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://hexson:hq123456@localhost:20002/blog');
mongoose.Promise = require('bluebird');

var CounterId = new Schema({
  table_name: String,
  sequence_value: Number,
  created_at: Number
}, {versionKey: false});
var PostSchema = new Schema({
  id: Number,
  title: String,
  classify: String,
  tags: String,
  preview: String,
  body: String,
  views: Number,
  show: Number,
  updated_at: Number,
  created_at: Number
}, {versionKey: false});
var ClassifySchema = new Schema({
  id: Number,
  name: String,
  updated_at: Number,
  created_at: Number
}, {versionKey: false});
var TagSchema = new Schema({
  id: Number,
  name: String,
  updated_at: Number,
  created_at: Number
}, {versionKey: false});



// admin
var Admin = new Schema({
  account: String,
  password: String,
  created_at: Number
}, {versionKey: false});


var schema = {
  $id: mongoose.model('counter', CounterId),
  Post: mongoose.model('post', PostSchema),
  Classify: mongoose.model('classify', ClassifySchema),
  Tag: mongoose.model('tag', TagSchema),
  // admin
  Admin: mongoose.model('admin', Admin)
};

module.exports = schema;