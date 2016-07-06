var passport = require('passport'),
    localStrategy = require('passport-local'),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    User = require('../models/user');

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

const localOptions = {
  usernameField: 'username'
};

const localLogin = new localStrategy(localOptions, function(username, password, done) {
  User.findOne({username: username}, function(error, user) {
    if (error) {
      console.log("error: ",error);
      return done(error);
    }
    if (!user) {
      console.log("error:", error);
      return done(null, false);
    }

    // Compare hashed password
    console.log(user);
    user.comparePassword(password, function(error, isMatch) {
      if (error) {
        console.log("error1:", error);
        return done(error);
      }
      if (!isMatch) {
        console.log("error2:", error);
        return done(null, false);
      }

      return done(null, user);
    });

  });
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.SECRET_KEY
};

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if the User ID in the payload exists in our database
  // If it does, call 'done' with that
  // otherwise, call done without a user object
  User.findById(payload.sub, function(error, user) {
    if (error) {
      console.log("error: ", error);
      return done(error, false);
    }
    if (user) {
      console.log("GOT USER");
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.use(jwtLogin);
passport.use(localLogin);
