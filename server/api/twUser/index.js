'use strict';

var express = require('express');
var controller = require('./twUser.controller');

var router = express.Router();

router.post('/twUser', controller.create);

module.exports = router;