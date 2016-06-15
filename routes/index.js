var express = require('express');
var router = express.Router();
var passport = require("passport");
var User = require('../models/user');

// Import User schema
var User = require("../models/user");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Get register page
router.get("/register", function(req, res) {
  res.render("register");
});

router.post("/register", function(req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(error, user){
    if(error) {
      console.log(error);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      console.log("SUCCESS");
      res.redirect("/");
    });

  });
});

// Get login page
router.get("/login", function(req, res) {
  res.render("login");
});

module.exports = router;
