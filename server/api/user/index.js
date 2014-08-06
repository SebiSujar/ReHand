
'use strict';

var express = require('express'),
	controller = require('./user.controller');

/**
 * User model routes
 */
module.exports = function(app) {
	app.get('/user', controller.getUser);
	app.get('/user/:type/:id', controller.showUser);
	app.post('/user/:type/:id', controller.register);
	app.put('/user/twitter/ff', controller.UpdateFollowingFollowers);
	app.post('/user/lala', controller.addFollowers_earned);
	app.post('/user/lala', controller.addFollowings_earned);
	app.post('/user/lala', controller.show);
	app.post('/user/lala', controller.destroy);
};
