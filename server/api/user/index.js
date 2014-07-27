
'use strict';

var express = require('express'),
	controller = require('./user.controller');

/**
 * TwUser model routes
 */
module.exports = function(app) {
	app.post('/user', controller.create);
};
