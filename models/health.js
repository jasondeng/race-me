var mongoose = require('mongoose'),
    moment = require('moment');

var healthSchema = mongoose.Schema({
    bloodType: String,
    biologicalSex: String,
    totalFlights: Number,
    incrementsOfFlightsForEachDay: [Number],
    totalFlightsForEachDayOfYear: [String],
    totalWalkRunDistance: Number,
    incrementsOfWalkRunDistanceForEachDay: [Number],
    totalWalkRunDistanceForEachDayOfYear: [String],
    totalSteps: Number,
    incrementsOfStepsForEachDay: [Number],
    totalStepsForEachDayOfYear: [String],
    created: {type: Number, default: moment().unix()}
});

module.exports = mongoose.model("Health", healthSchema);
