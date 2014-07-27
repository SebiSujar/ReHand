'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    errors = require('./components/errors'),
    express = require('express'),
    session = require('express-session');

api.oauth();

/**
 * Application routes
 */
module.exports = function(app) {

  /*
  *
  * TWITTER
  *
  */

  // Get the user Twitter oauth
  app.get('/api/user/twitter', api.getTwitterOauth);

  // Receives the twitter oauth callback
  app.get('/api/twitter/callback', api.getTwitterCallback);
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/landing/index.html');
    });

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  //app.get('/App', index.error);
  app.get('/App', index.app);
  app.get('/App/*', index.app);
  app.get('/premium', index.premium);
  app.get('/plans', index.plans);
  app.get('/terms', index.terms);
  app.get('/privacy', index.privacy);
  app.get('/*', index.index);
};