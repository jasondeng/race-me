var mongoose = require('mongoose'),
    moment = require('moment');

var raceSchema = mongoose.Schema([{
    challenger: String,
    challenged: String,
    route: {
            id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Route"
        }
    },
    status: String,
    start: {type: Number, default: moment().unix()},
    end: Number,
    duration: Number,
    created: {type: Number, default: moment().unix()}
}]);

module.exports = mongoose.model("Race", healthSchema);
