var mongoose = require('mongoose'),
    moment = require('moment');

var rankSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    username: String,
    fullname: String,
    heartRate: Number,
    avgSpeed: Number,
    avgDistance: Number,
    rank: Number,
    randomIndex: Number,
    created: Number
});

module.exports = mongoose.model("Rank", rankSchema);
