//var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var fs = require('fs');
var cors = require('cors');

var allRouter = require('@r/config.js');

// load private/public key and store in process.env
process.env.PRIVATE_KEY = fs.readFileSync('jwtRS256.key');
process.env.PUBLIC_KEY = fs.readFileSync('jwtRS256.key.pub');

// connect mongoDB
mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log('connected to MongoDB'));

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// plugin setup
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

// use global middleware
app.use(function(req, res, next) {
  if (!req.mw) req.mw = {};
  next();
});
app.use(require('@mw/config')['TokenParsingMiddleware']);

// routes setup
app.use('/', allRouter);

// catch 404 and forward to error handler
app.use('/', function(req, res, next) {
  let err = new Error('not found.');
  err.status = 404;
  next(err);
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error response
  res.status(err.status || 500).json({
    errorCode: res.statusCode,
    errorMessage: err.message
  });
});

module.exports = app;
