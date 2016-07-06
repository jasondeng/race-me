var express = require('express');
var router = express.Router();
var passport = require("passport");
var middleware = require('../middleware/index');
var Authenticate = require('../middleware/authentication');
var request = require('request');
var moment = require('moment');
var config = require('../env.json');
var jwt = require('jsonwebtoken');
var passportConfig = require('../middleware/passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});

// Import User schema
var User = require("../models/user");
var Health = require("../models/health");

function createJWT(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.SECRET_KEY);
}

/* GET home page. */
/*
router.get('/' , requireAuth ,function(req, res, next) {
  // res.send({hi: 'there'});
  console.log(req.user);
  res.render('index', { title: 'Express' });
});*/

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

router.get("/profile", requireAuth, function(req, res) {
  var user = {
    id: req.user.id,
    fullname: req.user.fullname,
    username: req.user.username,
  };

  res.json(user);
});

router.post("/upload", requireAuth, function(req, res) {
  var user = req.user;
  console.log(user);
  var data = req.body;
  var health = new Health({
    totalWalkRunDistance: data.totalWalkRunDistance,
    incrementsOfStepsForEachDay: data.incrementsOfStepsForEachDay,
    totalFlights: data.totalFlights,
    incrementsOfWalkRunDistanceForEachDay: data.incrementsOfWalkRunDistanceForEachDay,
    biologicalSex: data.biologicalSex,
    bloodType: data.bloodType,
    totalWalkRunDistanceForEachDayOfYear: data.totalWalkRunDistanceForEachDayOfYear,
    totalSteps: data.totalSteps,
    incrementsOfFlightsForEachDay: data.incrementsOfFlightsForEachDay,
    totalStepsForEachDayOfYear: data.totalStepsForEachDayOfYear,
    totalFlightsForEachDayOfYear: data.totalFlightsForEachDayOfYear
  });
  health.save(function(error) {
    if (error) {
      return error;
    }
  });
  User.findOneAndUpdate({username: user.username}, {$push: {"health": health}}, {new: true},function(error, res) {
    if (error) {
      console.log(error);
      return error;
    }
    console.log(res);
  });
/*  user.health.push(health);
  user.save(function(error) {
    if (error) {
      return error;
    }
  });*/
  console.log(user);
  res.send(data);

});

router.post('/auth/facebook', function(req, res) {
  var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
  var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.FACEBOOK_SECRET,
    redirect_uri: req.body.redirectUri
  };

  // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
    if (response.statusCode !== 200) {
      return res.status(500).send({ message: accessToken.error.message });
    }

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
      if (response.statusCode !== 200) {
        return res.status(500).send({ message: profile.error.message });
      }
      if (req.header('Authorization')) {
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
          }
          var token = req.header('Authorization').split(' ')[1];
          var payload = jwt.verify(token, config.SECRET_KEY);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.facebook = profile.id;
            user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
            user.displayName = user.displayName || profile.name;
            user.save(function() {
              var token = createJWT(user);
              res.send({ token: token });
            });
          });
        });
      } else {
        // Step 3. Create a new user account or return an existing one.
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          if (existingUser) {
            var token = createJWT(existingUser);
            return res.send({ token: token });
          }
          var user = new User();
          user.facebook = profile.id;
          user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.displayName = profile.name;
          user.save(function() {
            var token = createJWT(user);
            res.send({ token: token });
          });
        });
      }
    });
  });
});


/*
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "LOGGED OUT!");
  res.redirect("/");
});*/

module.exports = router;
