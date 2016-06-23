var express = require('express');
var router = express.Router();
var passport = require("passport");
var middleware = require('../middleware/index');
var Authenticate = require('../middleware/authentication');
var passportConfig = require('../middleware/passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});

// Import User schema
var User = require("../models/user");

/* GET home page. */
/*
router.get('/' ,function(req, res, next) {
  // res.send({hi: 'there'});
  res.render('index', { title: 'Express' });
});
*/
// Get register page
/*
router.get("/register", function(req, res) {
  res.render("register");
});


*/

router.get('/', function(req, res, next) {
    res.render('index');
});


router.post("/register", Authenticate.signUp);

/*router.post("/register", function(req, res) {
  var newUser = new User({username: req.body.username, fullname: req.body.fullname});
  User.register(newUser, req.body.password, function(error, user){
    if(error) {
      req.flash("error", error.message);
      console.log(error);
      return res.redirect("register");
    }
    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Welcome " + user.username);
      console.log("SUCCESS");
      res.json({token: middleware.tokenForUser(user)});
      //res.redirect("/");
    });

  });
});*/

// Get login page
/*
router.get("/login", function(req, res) {
  res.render("login");
});*/

router.post("/login", requireSignin, Authenticate.signIn);

/*router.post("/login", passport.authenticate("local",
  {
    failureRedirect: "/login"
  }) ,function(req, res){
  if (req.session.returnTo) {
    req.flash("success", "Welcome back!");
    res.redirect("/");
    // console.log(req.session.returnTo);
    // delete req.session.returnTo;
  } else {
    req.flash("success", "Welcome back!");
    res.redirect("/");
  }
});*/

/*
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "LOGGED OUT!");
  res.redirect("/");
});*/

module.exports = router;
