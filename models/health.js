var mongoose = require('mongoose');

var healthSchema = mongoose.Schema({
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    walkRunDistance: Number,
    flightsClimbed: Number,
    steps: Number,
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Health", healthSchema);