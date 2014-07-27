'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    errors = require('./components/errors'),
    express = require('express'),
    session = require('express-session'), 
    passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy;

passport.use(new TwitterStrategy({
  consumerKey: 'ruXFonJxX4ZGRhkcoiLLo0hhs',
  consumerSecret: 'NYLgyj1JG4EG7JTea5Y9WXlXYOg6MupEsthLOTGWB8AlPUkI6Y',
  callbackURL: "http://localhost:9000/api/twitter/callback"
},
function(token, tokenSecret, profile, done) {
  console.log("token");
  console.log(token);
  console.log("tokenSecret");
  console.log(tokenSecret);
  console.log("profile");
  console.log(profile);
}));

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
  app.get('/api/user/twitter', passport.authenticate('twitter'));

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