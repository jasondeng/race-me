"use strict";

var express = require('express');
var router = express.Router();
var passport = require("passport");
// var middleware = require('../middleware/index');
var Authenticate = require('../middleware/authentication');
var request = require('request');
var moment = require('moment');
var jwt = require('jsonwebtoken');
var passportConfig = require('../middleware/passport');
var PythonShell = require('python-shell');

var config;
try {
    config = require('../env.json');
}
catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
        console.log("CANNOT LOAD env.json");
    }
    config = process.env;
}

var requireAuth = passport.authenticate('jwt', {session: false});
var requireSignin = passport.authenticate('local', {session: false});

// Import User schema
var User = require("../models/user");
var Health = require("../models/health");
// var Race = require("../models/race");

function createJWT(user, healthBool) {
    var payload = {
        sub: user._id,
        fullname: user.fullname,
        first_name: user.first_name,
        health: healthBool,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.sign(payload, config.SECRET_KEY);
}

function ensureAuthenticated(req, res, next) {
    if (!req.header('Authorization')) {
        return res.status(401).send({message: 'Please make sure your request has an Authorization header'});
    }
    var token = req.header('Authorization').split(' ')[1];

    var payload = null;
    try {
        payload = jwt.verify(token, config.SECRET_KEY);
    }
    catch (err) {
        return res.status(401).send({message: err.message});
    }

    if (payload.exp <= moment().unix()) {
        return res.status(401).send({message: 'Token has expired'});
    }
    req.user = payload;
    next();
}

function findUser(req, res, next) {
    User.findById(req.user.sub, {password: 0}, function(error, userData) {
        if (error) {
            console.log("error: ", error);
            return res.send(error);
        }
        if (userData) {
            console.log("GOT USER");
            req.userData = userData;
            next();
        } else {
            return res.send("User not found");
        }
    });
}

function rectangleRoute(length, BaseLocation) {
    /*  
        The algorithm was created based on the answers from these two stackoverflow links
        http://stackoverflow.com/questions/2187657/calculate-second-point-knowing-the-starting-point-and-distance
        http://stackoverflow.com/questions/30002372/given-point-of-latitude-longitude-distance-and-bearing-how-to-get-the-new-la
    */

    var wayPoints = [];
    var width = length / (Math.random() + 7);
    var height = width * 2;
    var diagonal = Math.sqrt(width * width + height * height);
    var theta = Math.acos(height / diagonal);
    var direction = Math.random() * 2 * Math.PI;
    var angle = 0 + direction;
    var dx = height * Math.cos(angle);
    var dy = height * Math.sin(angle);

    // One degree of latitude on the Earth's surface equals 110540 meters.
    // One degree of longitude equals 111320 meters (at the equator)
    var delta_lat = dy / 110540;
    // BaseLocation.lat * Math.PI / 180 = conversion of latitude from degrees to radians.
    var delta_lng = dx / (111320 * Math.cos(BaseLocation.lat * Math.PI / 180));
    wayPoints[0] = {
        lat: BaseLocation.lat + delta_lat,
        lng: BaseLocation.lng + delta_lng
    };

    angle = -1 * theta + direction;
    dx = diagonal * Math.cos(angle);
    dy = diagonal * Math.sin(angle);
    delta_lat = dy / 110540;
    delta_lng = dx / (111320 * Math.cos(BaseLocation.lat * Math.PI / 180));
    wayPoints[1] = {
        lat: BaseLocation.lat + delta_lat,
        lng: BaseLocation.lng + delta_lng
    };

    angle = -1 * Math.PI / 2 + direction;
    dx = width * Math.cos(angle);
    dy = width * Math.sin(angle);
    delta_lat = dy / 110540;
    delta_lng = dx / (111320 * Math.cos(BaseLocation.lat * Math.PI / 180));
    wayPoints[2] = {
        lat: BaseLocation.lat + delta_lat,
        lng: BaseLocation.lng + delta_lng
    };
    
    console.log(wayPoints);
    return wayPoints;
}

// INDEX ROUTE

router.get('/', function (req, res) {
    res.render('index');
});

// REGISTER ROUTE

router.post("/register", Authenticate.signUp);

// LOGIN ROUTE

router.post("/login", requireSignin, Authenticate.signIn);

// PROFILE ROUTE

router.get("/profile", ensureAuthenticated, function (req, res) {
    var user = req.user;

    User.findById(user.sub, {password: 0})
        .populate("health")
        .exec(function (err, foundUser) {
            if (err) {
                return res.send(err);
            }
            if (foundUser.health === undefined) {
                return res.send({message: "No health data"});
            }
            res.json(foundUser);
        });

});

// UPLOAD ROUTE

router.post("/upload", ensureAuthenticated, findUser, function (req, res) {
    var user = req.userData;
    console.log(user);

    var data = req.body;

    Health.findById(user.health, function (err, foundHealth) {
        if (err) {
            return res.send(err);
        } else {
            if (foundHealth === null) {
                var health = new Health({
                    totalWalkRunDistance: data.totalWalkRunDistance,
                    incrementsOfStepsForEachDay: data.incrementsOfStepsForEachDay,
                    totalFlights: data.totalFlights,
                    incrementsOfWalkRunDistanceForEachDay: data.incrementsOfWalkRunDistanceForEachDay,
                    biologicalSex: data.biologicalSex,
                    bloodType: data.bloodType,
                    totalWalkRunDistanceForEachDayOfYear: data.totalWalkRunDistanceForEachDayOfYear,
                    totalSteps: data.totalSteps,
                    incrementsOfFlightsForEachDay: data.incrementsOfFlightsForEachDay,
                    totalStepsForEachDayOfYear: data.totalStepsForEachDayOfYear,
                    totalFlightsForEachDayOfYear: data.totalFlightsForEachDayOfYear,
                    created: moment().unix()
                });
                health.save(function (err) {
                    if (err) {
                        return res.send(err);
                    }
                    res.status(201).send({message: "Health collection successfully created!"});
                });
                user.update({health: health._id}, function (err, raw) {
                    if (err) {
                        return res.send(err);
                    }
                    console.log(raw);
                });
            } else {
                var options = {
                    totalWalkRunDistance: data.totalWalkRunDistance || foundHealth.totalWalkRunDistance,
                    totalFlights: data.totalFlights || foundHealth.totalFlights,
                    biologicalSex: data.biologicalSex || foundHealth.biologicalSex,
                    bloodType: data.bloodType || foundHealth.bloodType,
                    totalSteps: data.totalSteps || foundHealth.totalSteps,
                    incrementsOfWalkRunDistanceForEachDay: data.incrementsOfWalkRunDistanceForEachDay || foundHealth.incrementsOfWalkRunDistanceForEachDay || [],
                    incrementsOfFlightsForEachDay: data.incrementsOfFlightsForEachDay || foundHealth.incrementsOfFlightsForEachDay || [],
                    totalStepsForEachDayOfYear: data.totalStepsForEachDayOfYear || foundHealth.totalStepsForEachDayOfYear || [],
                    incrementsOfStepsForEachDay: data.incrementsOfStepsForEachDay || foundHealth.incrementsOfStepsForEachDay || [],
                    totalWalkRunDistanceForEachDayOfYear: data.totalWalkRunDistanceForEachDayOfYear || foundHealth.totalWalkRunDistanceForEachDayOfYear || [],
                    totalFlightsForEachDayOfYear: data.totalFlightsForEachDayOfYear || foundHealth.totalFlightsForEachDayOfYear || [],
                    created: moment().unix()
                };
                foundHealth.update({$set: options}, {upsert: true}, function (err, result) {
                    if (err) {
                        return res.send(err);
                    }
                    res.send(result);
                });
            }
        }
    });


});

// RACE ROUTE

router.post("/race", ensureAuthenticated, (req, res) => {

    let user = req.user;
    let data = req.body;

    User.findById(user.sub, (err, foundUser) => {
        if (err) {
            console.log(err);
            res.send(err);
        }
        var race = new Race ({
            challenger: user.username,
            opponent: data.opponent,
            route: data.route,
            status: data.status,
            start: data.start,
            end: data.end,
            distance: data.distance,
            speed: data.speed,
            duration: data.duration
        });
        race.save((error, product) => {
            if (error) {
            res.send(error);
            }
            res.status(201).send({
                message: "Race collection successfully created!",
                result: product
            });
        });
        user.update({$push: {race: race._id}}, (err, raw) => {
            if (err) {
            res.send(err);
            }
            console.log(raw);
        });

    });


});

// Generate waypoints

router.post("/route", ensureAuthenticated, (req, res) => {
    var length = req.body.length;
    var origin = req.body.origin;

    res.send(rectangleRoute(length, origin));

});

// MATCH ROUTE

router.get("/match", ensureAuthenticated, (req, res) => {
    var pyOptions = {
        mode: 'text',
        args: [0, 'r', req.user.sub]
    };
    PythonShell.run('Python/Match_Python_v2_random.py', pyOptions, (err, results) => {
        if (err) throw err;
    // results is an array consisting of messages collected during execution
    console.log(results);
    res.send(JSON.parse(results[0]));
    });

});


/*
 |--------------------------------------------------------------------------
 | Login with Facebook
 |--------------------------------------------------------------------------
 */
router.post('/auth/facebook', function (req, res) {
    var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
    var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
    var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: config.FACEBOOK_SECRET || process.env.FACEBOOK_SECRET,
        redirect_uri: req.body.redirectUri
    };

    // Step 1. Exchange authorization code for access token.
    request.get({url: accessTokenUrl, qs: params, json: true}, function (err, response, accessToken) {
        if (response.statusCode !== 200) {
            return res.status(500).send({message: accessToken.error.message});
        }

        // Step 2. Retrieve profile information about the current user.
        request.get({url: graphApiUrl, qs: accessToken, json: true}, function (err, response, profile) {
            if (response.statusCode !== 200) {
                return res.status(500).send({message: profile.error.message});
            }
            if (req.header('Authorization')) {
                User.findOne({facebook: profile.id}, function (err, existingUser) {
                    if (existingUser) {
                        return res.status(409).send({message: 'There is already a Facebook account that belongs to you'});
                    }
                    var token = req.header('Authorization').split(' ')[1];
                    var payload = jwt.verify(token, config.SECRET_KEY);
                    User.findById(payload.sub, function (err, user) {
                        if (!user) {
                            return res.status(400).send({message: 'User not found'});
                        }
                        user.facebook = profile.id;
                        user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
                        user.fullname = user.fullname || profile.name;
                        user.first_name = user.first_name || profile.given_name;
                        user.username = user.username || profile.email;
                        user.save(function () {
                            var token = createJWT(user, false);
                            res.send({token: token});
                        });
                    });
                });
            } else {
                // Step 3. Create a new user account or return an existing one.
                User.findOne({facebook: profile.id}, function (err, existingUser) {
                    if (existingUser) {
                        var healthBool = existingUser === undefined ? false : true;
                        var token = createJWT(existingUser, healthBool);
                        return res.send({token: token});
                    }
                    var user = new User();
                    console.log('profile' + profile);
                    user.facebook = profile.id;
                    user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
                    user.fullname = user.fullname || profile.name;
                    user.first_name = user.first_name || profile.first_name;
                    user.username = user.username || profile.email;
                    console.log(user);

                    user.save(function () {
                        var token = createJWT(user, false);
                        res.send({token: token});
                    });
                });
            }
        });
    });
});

/*
 |--------------------------------------------------------------------------
 | Login with Google
 |--------------------------------------------------------------------------
 */
router.post('/auth/google', function (req, res) {
    var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
    var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: config.GOOGLE_SECRET || process.env.GOOGLE_SECRET,
        redirect_uri: req.body.redirectUri,
        grant_type: 'authorization_code'
    };

    // Step 1. Exchange authorization code for access token.
    request.post(accessTokenUrl, {json: true, form: params}, function (err, response, token) {
        var accessToken = token.access_token;
        var headers = {Authorization: 'Bearer ' + accessToken};

        // Step 2. Retrieve profile information about the current user.
        request.get({url: peopleApiUrl, headers: headers, json: true}, function (err, response, profile) {
            if (profile.error) {
                return res.status(500).send({message: profile.error.message});
            }
            // Step 3a. Link user accounts.
            if (req.header('Authorization')) {
                User.findOne({google: profile.sub}, function (err, existingUser) {
                    if (existingUser) {
                        return res.status(409).send({message: 'There is already a Google account that belongs to you'});
                    }
                    var token = req.header('Authorization').split(' ')[1];
                    var payload = jwt.verify(token, config.TOKEN_SECRET);
                    User.findById(payload.sub, function (err, user) {
                        if (!user) {
                            return res.status(400).send({message: 'User not found'});
                        }
                        user.google = profile.sub;
                        user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
                        user.fullname = user.fullname || profile.name;
                        user.first_name = user.first_name || profile.given_name;
                        user.username = user.username || profile.email;
                        user.save(function () {
                            var token = createJWT(user, false);
                            res.send({token: token});
                        });
                    });
                });
            } else {
                // Step 3b. Create a new user account or return an existing one.
                User.findOne({google: profile.sub}, function (err, existingUser) {
                    if (existingUser) {
                        var healthBool = existingUser === undefined ? false : true;
                        return res.send({token: createJWT(existingUser, healthBool)});
                    }
                    var user = new User();
                    user.google = profile.sub;
                    user.picture = profile.picture.replace('sz=50', 'sz=200');
                    user.fullname = profile.name;
                    user.first_name = profile.given_name;
                    user.username = profile.email;
                    user.save(function (err) {
                        if (err) {
                            console.log(err);
                        }
                        var token = createJWT(user, false);
                        res.send({token: token});
                    });
                });
            }
        });
    });
});

/*
 |--------------------------------------------------------------------------
 | Login with Instagram
 |--------------------------------------------------------------------------
 */
router.post('/auth/instagram', function (req, res) {
    var accessTokenUrl = 'https://api.instagram.com/oauth/access_token';

    var params = {
        client_id: req.body.clientId,
        redirect_uri: req.body.redirectUri,
        client_secret: config.INSTAGRAM_SECRET || process.en.INSTAGRAM_SECRET,
        code: req.body.code,
        grant_type: 'authorization_code'
    };

    // Step 1. Exchange authorization code for access token.
    request.post({url: accessTokenUrl, form: params, json: true}, function (error, response, body) {

        // Step 2a. Link user accounts.
        if (req.header('Authorization')) {
            User.findOne({instagram: body.user.id}, function (err, existingUser) {
                if (existingUser) {
                    return res.status(409).send({message: 'There is already an Instagram account that belongs to you'});
                }

                var token = req.header('Authorization').split(' ')[1];
                var payload = jwt.decode(token, config.TOKEN_SECRET);

                User.findById(payload.sub, function (err, user) {
                    if (!user) {
                        return res.status(400).send({message: 'User not found'});
                    }
                    user.instagram = body.user.id;
                    user.picture = user.picture || body.user.profile_picture;
                    user.fullname = user.displayName || body.user.username;
                    user.save(function () {
                        var token = createJWT(user, false);
                        res.send({token: token});
                    });
                });
            });
        } else {
            // Step 2b. Create a new user account or return an existing one.
            User.findOne({instagram: body.user.id}, function (err, existingUser) {
                if (existingUser) {
                    var healthBool = existingUser === undefined ? false : true;
                    return res.send({token: createJWT(existingUser, healthBool)});
                }

                var user = new User({
                    instagram: body.user.id,
                    picture: body.user.profile_picture,
                    displayName: body.user.username
                });

                user.save(function () {
                    var token = createJWT(user, false);
                    res.send({token: token, user: user});
                });
            });
        }
    });
});

router.post('/auth/unlink', ensureAuthenticated, function (req, res) {
    var provider = req.body.provider;
    var providers = ['facebook', 'foursquare', 'google', 'github', 'instagram',
        'linkedin', 'live', 'twitter', 'twitch', 'yahoo'];

    if (providers.indexOf(provider) === -1) {
        return res.status(400).send({message: 'Unknown OAuth Provider'});
    }

    User.findById(req.user, function (err, user) {
        if (!user) {
            return res.status(400).send({message: 'User Not Found'});
        }
        user[provider] = undefined;
        user.save(function () {
            res.status(200).end();
        });
    });
});

module.exports = router;
