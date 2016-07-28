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
        }
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
        }
    },
    status: String,
    winner: String,
    created: Number
});

module.exports = mongoose.model("Race", raceSchema);
