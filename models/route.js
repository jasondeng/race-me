var mongoose = require('mongoose'),
    moment = require('moment');

var routeSchema = mongoose.Schema({
    route: Array,
    created: {type: Number, default: moment().unix()}
});

module.exports = mongoose.model("Route", healthSchema);
