'use strict';

var express = require('express');
var controller = require('./user.controller');

var router = express.Router();

router.post('/User', controller.create);

module.exports = router;