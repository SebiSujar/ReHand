'use strict';

var path = require('path');

/**
 * Send partial, or 404 if it doesn't exist
 */
exports.partials = function(req, res) {
  var stripped = req.url.split('.')[0];
  var requestedView = path.join('./', stripped);
  res.render(requestedView, function(err, html) {
    if(err) {
      res.send(404);
    } else {
      res.send(html);
    }
  });
};

/**
 * Send our single page app landing
 */
exports.index = function(req, res) {
  res.render('landing/index');
};

/**
 * Send our single page app plans
 */
exports.plans = function(req, res) {
  res.render('plans/index');
};

/**
 * Send our single page app premium
 */
exports.premium = function(req, res) {
  res.render('premium/index');
};

/**
 * Send our single page app terms
 */
exports.terms = function(req, res) {
  res.render('terms/index');
};

/**
 * Send our single page app privacy
 */
exports.privacy = function(req, res) {
  res.render('privacy/index');
};

/**
 * Send our single page app
 */
exports.app = function(req, res) {
  res.render('index');
};

exports.error = function(req, res) {
  res.render('error/index');
};
