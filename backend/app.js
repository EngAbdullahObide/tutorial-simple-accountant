require('dotenv').config();
var models = require('./models')

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cors = require('cors')
var bodyParser = require('body-parser')
var expressValidetor = require('express-validator');
var corsOptions = {
  origin: "http://localhost:3001"
};

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidetor());

app.use('/', indexRouter);
app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use((req,res,next) =>{
  const err = new Error('Not found');
  err.status= 404;
  next(err);
})
  // render the error page
app.use((error, req, res, next) =>{
  res.status(error.status || 500);
  res.json({
      message: error.message
  });
});

module.exports = app;
