/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express 	= require('express');
var mongoose 	= require('mongoose');
var redis 		= require("redis"),
		client 		= redis.createClient();
var config 		= require('./config/environment');

// Connect to redis
client.on("error", function (err) {
	console.log("Error " + err);
});

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);

require('./config/express')(app);
require('./api/thing')(app);
require('./api/user')(app);
require('./api/twUser')(app);
require('./routes')(app);

// Start server
server.listen(3000, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', 3000, app.get('env'));
});

// Expose app
exports = module.exports = app;