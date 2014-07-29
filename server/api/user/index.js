
'use strict';

var express = require('express'),
	controller = require('./user.controller');

/**
 * TwUser model routes
 */
module.exports = function(app) {
	app.post('/user', controller.create);
};
module.exports = function UpdateFollowingFollowers(app){
	app.post('/user',controller.UpdateFollowingFollowers);
};
module.exports = function getplusFollowers_earned(app){
	app.post('/user',controller.getplusFollowers_earned);
};
module.exports = function getplusFollowings_earned(app){
	app.post('/user',controller.getplusFollowings_earned);
};
module.exports = function show(app){
	app.post('/user',controller.show);
};
module.exports = function update(app){
	app.post('/user',controller.update);
};
module.exports = function findUserById(app){
	app.post('/user',controller.findUserById);
};
module.exports = function destroy(app){
	app.post('/user',controller.destroy);
};	
