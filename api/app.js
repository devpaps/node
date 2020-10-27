var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var landRouter = require('./routes/land');
var stadRouter = require('./routes/stad');
var indexRouter = require('./routes/index');


var app = express();

app.use(logger('dev'));
app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/land', landRouter);
app.use('/stad', stadRouter);



module.exports = app;
