'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    errors = require('./components/errors');

/**
 * Application routes
 */

module.exports = function(app) {

  /*
  *
  * USER
  *
  */

  // Get the user
  app.get('/api/user', api.login);
  app.post('/api/user', api.login);

  // Register new user
  app.post('/api/register', api.register);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

   // Go to the main page when entering to /App
  app.route('/login')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/login/index.html');
  });

  // Go to the main page when entering to /App
  app.route('/register')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/register/index.html');
  });

  // Go to the main page when entering to /App
  app.route('/App')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/app/index.html');
    });

  // All other routes should redirect to the landing page
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/landing/index.html');
    });

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/App', index.app);
  app.get('/App/*', index.app);
  app.get('/*', index.index);
};