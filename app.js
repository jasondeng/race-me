'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var passportLocal = require('passport-local');
var expressSession = require('express-session');
var flash = require('connect-flash');
var PythonShell = require('python-shell');
var cors = require('cors');


// MODELS
var User = require('./models/user');
var Health = require('./models/health');

// ROUTES
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();


var url = process.env.MONGODB_URI;
// ENV
try {
  var config = require('./env.json');
  url = process.env.MONGODB_URI || config.MONGODB_URI;
}
catch (e) {
  if(e.code === 'MODULE_NOT_FOUND') {
    console.log("CANNOT LOAD env.json");
  }
}
/*
var options = {
  mode: 'text',
  pythonPath: 'C:\\Python27',
  pythonOptions: ['-u'],
  scriptPath: './Python',
};*/


// connect to database
// test
mongoose.connect(url);



// view engine setup

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(morgan('combined'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'client')));
app.use(flash());

// Passport config
app.use(expressSession({
  secret: process.env.SECRET_KEY || config.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new passportLocal(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

/*
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});*/

app.use('/', routes);
app.use('/users', users);

/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


// PythonShell.run('Python/Match_Python_v2_random.py', function (err) {
//   if (err) throw err;
//   console.log('success');
// });

module.exports = app;
