/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express 	= require('express');
var mongoose 	= require('mongoose');
var config 		= require('../config/environment');
var Twit    	= require('../lib/twitter');
var bot       = require('./bot');
var Users     = require('../api/user/user.model');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('../config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);

var usersDb = require('../api/user')(app);
require('../config/express')(app);
require('../api/thing')(app);
require('../api/twUser')(app);

// Start server
server.listen(config.followPort, config.ip, function () {
  console.log('Follow server listening on %d, in %s mode', config.followPort, app.get('env'));
});

function finishProcess(err) {
  if (err) console.log(err);
  mongoose.connection.close();
  server.close();
  return console.log("Waiting till next wave...");
}

function startFollowing(){
  var now = new Date().getTime();
  console.log(now);
  Users.find('Users', {'account.payments.dueDate': {$lt: now}}, function(err, users){
  	if (err) return finishProcess(err);
    console.log(users);

  });
  /*console.log("Getting following and followers");
  bot.getUsersToAddFollowing(function(err, users){
    if (err) return finishProcess(err);

    bot.findUsersAndFollow(users, function(err){
  		if (err) return finishProcess(err);

    });
  });*/
}


startFollowing();