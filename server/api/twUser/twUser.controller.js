'use strict';

var _ = require('lodash');
var TwUser = require('./twUser.model');

// Creates a new twUser in the DB.
exports.create = function(req, res) {
  TwUser.create(req.body, function(err, twUser) {
    if(err) { return handleError(res, err); }
    return res.json(201, twUser);
  });
};

function handleError(res, err) {
  return res.send(500, err);
};