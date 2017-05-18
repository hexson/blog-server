var express = require('express');


var app = express();
var login = require('./login');
var posts = require('./posts');


app.use('/login', login);
app.use('/posts', posts);


module.exports = app;