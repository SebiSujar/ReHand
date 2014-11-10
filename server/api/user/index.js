
'use strict';

var express = require('express'),
	controller = require('./user.controller');

/**
 * User model routes
 */
module.exports = function(app) {
	app.get('/user', controller.getUser);
	app.post('/user', controller.register);
	app.put('/user', controller.update);
	app.del('/user/:email', controller.delete);
	app.get('/user/:type/:id', controller.showUser);
  app.get('/users/patients', controller.getPatients);
  app.post('/user/test', controller.saveTest);
  app.post('/user/game', controller.saveGame);
};
