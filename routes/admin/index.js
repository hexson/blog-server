var express = require('express');


var app = express();
var login = require('./login');


app.use('/login', login);


module.exports = app;