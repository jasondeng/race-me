var mongoose = require('mongoose'),
    moment = require('moment');

var raceSchema = mongoose.Schema({
    challenger: String,
    opponent: String,
    route: {
        route: Array,
        created: Number
    },
    status: String,
    start: Number,
    end: Number,
    distance: Number,
    speed: Number,
    duration: Number,
    created: Number
});

module.exports = mongoose.model("Race", raceSchema);
