var express = require('express');


var app = express();
var login = require('./login');
var posts = require('./posts');
var classify = require('./classify');
var tags = require('./tags');
var counters = require('./counters');


app.use('/login', login);
app.use('/posts', posts);
app.use('/classify', classify);
app.use('/tags', tags);
app.use('/counters', counters);


module.exports = app;