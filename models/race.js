var mongoose = require('mongoose'),
    moment = require('moment');

var raceSchema = mongoose.Schema({
    challenger: String,
    opponent: String,
    route: {
        route: Array,
        created: {type: Number, default: moment().unix()}
    },
    status: String,
    start: Number,
    end: Number,
    distance: Number,
    speed: Number,
    duration: Number,
    created: {type: Number, default: moment().unix()}
});

module.exports = mongoose.model("Race", raceSchema);
