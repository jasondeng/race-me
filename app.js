'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const expressSession = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');

// MODELS
var User = require('./models/user');
var Health = require('./models/health');

// ROUTES
var routes = require('./routes/index');
var users = require('./routes/users');

const app = express();

var url = process.env.MONGODB_URI;
// ENV
try {
    var config = require('./env.json');
    url = process.env.MONGODB_URI || config.MONGODB_URI;
}
catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
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
mongoose.connect(url);

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({extended: false, limit: '5mb'}));

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

app.use('/', routes);
app.use('/users', users);

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
