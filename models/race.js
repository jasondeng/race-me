var mongoose = require('mongoose'),
    moment = require('moment');

var raceSchema = mongoose.Schema({
    challenger: {
        username: String,
        start: Number,
        end: Number,
        speed: Number,
        duration: Number,
        route: {
            origin: {
                lat: Number,
                lng: Number
            },
            wayPoints: Array
        },
        created: Number,
    },
    opponent: {
        username: String,
        start: Number,
        end: Number,
        speed: Number,
        duration: Number,
        route: {
            origin: {
                lat: Number,
                lng: Number
            },
            wayPoints: Array
        },
        created: Number,
    },
    status: String,
    winner: String,
    created: Number
});

module.exports = mongoose.model("Race", raceSchema);
