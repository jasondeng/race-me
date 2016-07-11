var mongoose = require('mongoose');

var healthSchema = mongoose.Schema({
    bloodType: String,
    biologicalSex: String,
    totalFlights: Number,
    incrementsOfFlightsForEachDay: [String],
    totalFlightsForEachDayOfYear: [String],
    totalWalkRunDistance: Number,
    incrementsOfWalkRunDistanceForEachDay: [String],
    totalWalkRunDistanceForEachDayOfYear: [String],
    totalSteps: Number,
    incrementsOfStepsForEachDay: [String],
    totalStepsForEachDayOfYear: [String],
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Health", healthSchema);
