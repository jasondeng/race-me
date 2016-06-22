var mongoose = require('mongoose');

var healthSchema = mongoose.Schema({
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    walkRunDistance: Number,
    flightsClimbed: Number,
    steps: Number,
    created: {type: Date, default: new Date().toString()}
});

module.exports = mongoose.model("Health", healthSchema);
