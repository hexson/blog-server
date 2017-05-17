var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://hexson:hq123456@localhost:20002/blog');
mongoose.Promise = require('bluebird');

var CounterId = new Schema({
  table_name: String,
  sequence_value: Number
}, {versionKey: false});
var PostsSchema = new Schema({
  id: Number,
  title: String,
  classify: String,
  tags: String,
  preview: String,
  body: String,
  views: Number,
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
var tests = new Schema({
  name: String,
  index: Number
}, {versionKey: false});



// admin
var Admin = new Schema({
  account: String,
  password: String,
  created_at: Number
}, {versionKey: false});


var schema = {
  $id: mongoose.model('counter', CounterId),
  Post: mongoose.model('post', PostsSchema),
  Classify: mongoose.model('clas', ClassifySchema),
  Tag: mongoose.model('tag', TagSchema),
  tests: mongoose.model('test', tests),
  // admin
  Admin: mongoose.model('admin', Admin)
};

module.exports = schema;