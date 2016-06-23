const User = require('../models/user'),
  jwt = require('jwt-simple'),
  config = require('../env.json');


function tokenForUser(user) {
  const timestamp = new Date().getTime();
  // iat = issued at time
  return jwt.encode({sub: user.id, iat: timestamp}, config.SECRET_KEY);
};


exports.signUp = function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const fullname = req.body.fullname;

  if(!username || !password) {
    return res.status(422).send({error: 'You must provide email and password'});
  }

  User.findOne({username: username}, function(error, existingUser) {
    if (error) {
      return next(error);
    }

    if (existingUser) {
      return res.status(422).send({error: 'Username is in use'});
    }

    const user = new User({
      fullname: fullname,
      username: username,
      password: password
    });

    user.save(function(error) {
      if (error) {
        return next(error);
      }

      res.json({token: tokenForUser(user)});
    })

  })
};

exports.signIn = function(req, res, next) {
  // Give token
  // req.user is from passport done(user)
  res.send({token: tokenForUser(req.user)});
};
