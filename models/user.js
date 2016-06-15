var mongoose          = require("mongoose"),
	passportMongoose  = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	fullname: String,
	username: String,
	password: String
});

userSchema.plugin(passportMongoose);

module.exports = mongoose.model("User", userSchema);
