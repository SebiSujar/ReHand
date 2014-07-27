
'use strict';

var express = require('express'),
	controller = require('./twUser.controller');

/**
 * TwUser model routes
 */
module.exports = function(app) {
	app.post('/twUser', controller.create);
};
