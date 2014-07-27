'use strict';

var request           = require('request'),
    OAuth             = require('oauth').OAuth;

var oa;

// TWITTER -----------------------------

exports.oauth = function () {
  oa = new OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    "ruXFonJxX4ZGRhkcoiLLo0hhs",
    "NYLgyj1JG4EG7JTea5Y9WXlXYOg6MupEsthLOTGWB8AlPUkI6Y",
    "1.0",
    "http://localhost:9000/api/twitter/callback",
    "HMAC-SHA1"
  );
};


exports.getTwitterOauth = function(req, res){
  oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
    if (error) {
      console.log(error);
      res.send("yeah no. didn't work.")
    }
    else {
      console.log("oauth_token");
      console.log(oauth_token);
      console.log("oauth_token_secret");
      console.log(oauth_token_secret);
      console.log("results");
      console.log(results);
      
      res.send('https://api.twitter.com/oauth/authorize?oauth_token=' + oauth_token);

      /*req.session.oauth = {};
      req.session.oauth.token = oauth_token;
      console.log('oauth.token: ' + req.session.oauth.token);
      req.session.oauth.token_secret = oauth_token_secret;
      console.log('oauth.token_secret: ' + req.session.oauth.token_secret);
      res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token)*/
  }
  });
};

var saveAccessToken = function(oauth_token, oauth_verifier, callback) {

  // Guardamos al usuario



  callback();
};

exports.getTwitterCallback = function(req, res){

  saveAccessToken(req.query.oauth_token, req.query.oauth_verifier, function () {
    res.redirect('https://localhost:9000/App');
  });
};