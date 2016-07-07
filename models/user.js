var mongoose = require("mongoose"),
	passportMongoose = require("passport-local-mongoose"),
  bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
	fullname: String,
	username: {type: String, unique: true},
	password: String,
  facebook: String,
  google: String,
	created: {type: Date, default: new Date().toString()},
    health: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Health"
        }
    }],
});

userSchema.pre('save', function(next) {
  const user = this;

  if (!user.isModified('password')) {
    console.log('password not modified');
    return next();
  }

  bcrypt.genSalt(32, function(error, salt) {
    if (error) {
      return next(error);
    }

    bcrypt.hash(user.password, salt, null, function(error, hash) {
      if (error) {
        return next(error);
      }

      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(error, isMatch) {
    if (error) {
      return callback(error);
    }

    callback(null, isMatch);
  });
};

// userSchema.plugin(passportMongoose);

module.exports = mongoose.model("User", userSchema);
