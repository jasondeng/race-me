var mongoose = require('mongoose'),
    moment = require('moment');

var raceSchema = mongoose.Schema({
    challenger: String,
    challenged: String,
    route: {
        route: Array,
        created: {type: Number, default: moment().unix()}
    },
    status: String,
    start: {type: Number, default: moment().unix()},
    end: Number,
    distance: Number,
    speed: Number,
    duration: Number,
    created: {type: Number, default: moment().unix()}
});

module.exports = mongoose.model("Race", raceSchema);
