var express = require('express');
var router = express.Router();
var passport = require("passport");
var middleware = require('../middleware/index');
var Authenticate = require('../middleware/authentication');
var request = require('request');
var moment = require('moment');
var jwt = require('jsonwebtoken');
var passportConfig = require('../middleware/passport');

var config;
try {
  config = require('../env.json');
}
catch (e) {
  if(e.code === 'MODULE_NOT_FOUND') {
    console.log("CANNOT LOAD env.json");
  }
  config = process.env;
}

const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});

// Import User schema
var User = require("../models/user");
var Health = require("../models/health");

function createJWT(user) {
  var payload = {
    sub: user._id,
    fullname: user.fullname,
    first_name: user.first_name,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.sign(payload, config.SECRET_KEY);
}

function ensureAuthenticated(req, res, next) {
  if (!req.header('Authorization')) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }
  var token = req.header('Authorization').split(' ')[1];

  var payload = null;
  try {
    payload = jwt.decode(token, config.TOKEN_SECRET);
  }
  catch (err) {
    return res.status(401).send({ message: err.message });
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' });
  }
  req.user = payload.sub;
  next();
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

router.get("/profile", ensureAuthenticated, function(req, res) {
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
  // var options = {
  //     totalWalkRunDistance: data.totalWalkRunDistance,
  //     totalFlights: data.totalFlights || ,
  //     biologicalSex: data.biologicalSex,
  //     bloodType: data.bloodType,
  //     totalSteps: data.totalSteps,

  // };
  Health.findOne({ totalWalkRunDistance: {$exists: true}}, function(err, result) {
      var options = {
        totalWalkRunDistance: data.totalWalkRunDistance || result.totalWalkRunDistance,
        totalFlights: data.totalFlights || result.totalFlights,
        biologicalSex: data.biologicalSex || result.biologicalSex,
        bloodType: data.bloodType || result.bloodType,
        totalSteps: data.totalSteps || result.totalSteps
      };
      var arrOptions = {
        incrementsOfWalkRunDistanceForEachDay: {$each: data.incrementsOfWalkRunDistanceForEachDay || []},
        incrementsOfFlightsForEachDay: {$each: data.incrementsOfFlightsForEachDay || []},
        totalStepsForEachDayOfYear: {$each: data.totalStepsForEachDayOfYear || []},
        incrementsOfStepsForEachDay: {$each: data.incrementsOfStepsForEachDay || []},
        totalWalkRunDistanceForEachDayOfYear: {$each: data.totalWalkRunDistanceForEachDayOfYear || []},
        totalFlightsForEachDayOfYear: {$each: data.totalFlightsForEachDayOfYear || []}
      };
      result.update({$set: options, $push: arrOptions}, function(err, result) {
        if (err) {
          res.send(err);
        }
        res.send(result);
      });
  });
  // var arrOptions = {
  //   incrementsOfWalkRunDistanceForEachDay: data.incrementsOfWalkRunDistanceForEachDay,
  //   incrementsOfFlightsForEachDay: data.incrementsOfFlightsForEachDay,
  //   totalStepsForEachDayOfYear: data.totalStepsForEachDayOfYear,
  //   incrementsOfStepsForEachDay: data.incrementsOfStepsForEachDay,
  //   totalWalkRunDistanceForEachDayOfYear: data.totalWalkRunDistanceForEachDayOfYear,
  //   totalFlightsForEachDayOfYear: data.totalFlightsForEachDayOfYear
  // }
  // Health.findOneAndUpdate({ totalWalkRunDistance: {$exists: true} }, {$set: options, $push:{
  //   incrementsOfWalkRunDistanceForEachDay: {$each: data.incrementsOfWalkRunDistanceForEachDay || []},
  //   incrementsOfFlightsForEachDay: {$each: data.incrementsOfFlightsForEachDay || []},
  //   totalStepsForEachDayOfYear: {$each: data.totalStepsForEachDayOfYear || []},
  //   incrementsOfStepsForEachDay: {$each: data.incrementsOfStepsForEachDay || []},
  //   totalWalkRunDistanceForEachDayOfYear: {$each: data.totalWalkRunDistanceForEachDayOfYear || []},
  //   totalFlightsForEachDayOfYear: {$each: data.totalFlightsForEachDayOfYear || []}
  // }}, {new:true, upsert: true} ,function(err, result) {
  //   if (err) {
  //     console.log(err);
  //     res.send(err);
  //   } else {
  //     console.log(result);
  //     res.send(result);
  //     // var health = new Health({
  //     //   totalWalkRunDistance: data.totalWalkRunDistance,
  //     //   incrementsOfStepsForEachDay: data.incrementsOfStepsForEachDay,
  //     //   totalFlights: data.totalFlights,
  //     //   incrementsOfWalkRunDistanceForEachDay: data.incrementsOfWalkRunDistanceForEachDay,
  //     //   biologicalSex: data.biologicalSex,
  //     //   bloodType: data.bloodType,
  //     //   totalWalkRunDistanceForEachDayOfYear: data.totalWalkRunDistanceForEachDayOfYear,
  //     //   totalSteps: data.totalSteps,
  //     //   incrementsOfFlightsForEachDay: data.incrementsOfFlightsForEachDay,
  //     //   totalStepsForEachDayOfYear: data.totalStepsForEachDayOfYear,
  //     //   totalFlightsForEachDayOfYear: data.totalFlightsForEachDayOfYear
  //     // });
  //     // health.save(function(error) {
  //     //   if (error) {
  //     //     return error;
  //     //   }
  //     // });   
  //   }
  // });
/*  User.findOneAndUpdate({username: user.username}, {$push: {"health": health}}, {new: true},function(error, res) {
    if (error) {
      console.log(error);
      return error;
    }
    console.log(res);
  });*/

/*  user.health.push(health);
  user.save(function(error) {
    if (error) {
      return error;
    }
  });*/
  // console.log(user);
  // res.send(data);

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
 |--------------------------------------------------------------------------
 | Login with Google
 |--------------------------------------------------------------------------
 */
router.post('/auth/google', function(req, res) {
  var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
  var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.GOOGLE_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
    var accessToken = token.access_token;
    var headers = { Authorization: 'Bearer ' + accessToken };

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
      if (profile.error) {
        return res.status(500).send({message: profile.error.message});
      }
      // Step 3a. Link user accounts.
      if (req.header('Authorization')) {
        User.findOne({ google: profile.sub }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
          }
          var token = req.header('Authorization').split(' ')[1];
          var payload = jwt.verify(token, config.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.google = profile.sub;
            user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
            user.fullname = user.fullname || profile.name;
            user.first_name = user.first_name || profile.given_name;
            user.username = user.username || profile.email;
            user.save(function() {
              var token = createJWT(user);
              res.send({ token: token });
            });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ google: profile.sub }, function(err, existingUser) {
          if (existingUser) {
            return res.send({ token: createJWT(existingUser) });
          }
          var user = new User();
          user.google = profile.sub;
          user.picture = profile.picture.replace('sz=50', 'sz=200');
          user.fullname = profile.name;
          user.first_name = profile.given_name;
          user.username = profile.email;
          user.save(function(err) {
            if (err) {
              console.log(err);
            }
            var token = createJWT(user);
            res.send({ token: token });
          });
        });
      }
    });
  });
});


router.post('/auth/unlink', ensureAuthenticated, function(req, res) {
  var provider = req.body.provider;
  var providers = ['facebook', 'foursquare', 'google', 'github', 'instagram',
    'linkedin', 'live', 'twitter', 'twitch', 'yahoo'];

  if (providers.indexOf(provider) === -1) {
    return res.status(400).send({ message: 'Unknown OAuth Provider' });
  }

  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User Not Found' });
    }
    user[provider] = undefined;
    user.save(function() {
      res.status(200).end();
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
