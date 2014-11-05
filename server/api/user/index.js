
'use strict';

var express = require('express'),
	controller = require('./user.controller');

/**
 * User model routes
 */
module.exports = function(app) {
	app.get('/user', controller.getUser);
	app.post('/user', controller.register);
	app.get('/user/:type/:id', controller.showUser);
  app.get('/users/patients', controller.getPatients);
};
