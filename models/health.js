var mongoose = require('mongoose');

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
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Health", healthSchema);
