var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/blog');
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
  update_at: Number,
  create_at: Number
}, {versionKey: false});
var ClassifySchema = new Schema({
  id: Number,
  name: String,
  update_at: Number,
  create_at: Number
}, {versionKey: false});
var TagSchema = new Schema({
  id: Number,
  name: String,
  update_at: Number,
  create_at: Number
}, {versionKey: false});

var schema = {
  $id: mongoose.model('counter', CounterId),
  Post: mongoose.model('post', PostsSchema),
  Classify: mongoose.model('Clas', ClassifySchema),
  Tag: mongoose.model('tag', TagSchema)
};

module.exports = schema;