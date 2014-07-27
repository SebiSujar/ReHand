
'use strict';

var express = require('express'),
		controller = require('./thing.controller');

/**
 * Thing model routes
 */
module.exports = function(app) {

	app.post('/thing/test', controller.test);
	app.get('/thing/', controller.index);
	app.get('/thing/:id', controller.show);
	app.post('/thing/', controller.create);
	app.put('/thing/:id', controller.update);
	app.patch('/thing/:id', controller.update);
	app.delete('/thing/:id', controller.destroy);
};