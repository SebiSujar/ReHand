'use strict';

var request           = require('request')
  , passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy;

// TWITTER -----------------------------

exports.oauth = function () {
  

  exports.passport = passport;
};


exports.getTwitterOauth = function(req, res){
  console.log("authenticate");
  passport.authenticate('twitter');
};

var saveAccessToken = function(oauth_token, oauth_verifier, callback) {

  // TEST
  oa.get(
      'https://api.twitter.com/1.1/trends/place.json?id=23424977',
      oauth_token, //test user token
      oauthCookie.token_secret, //test user secret            
      function (e, data, res){
        if (e) console.error(e);        
        console.log(require('util').inspect(data));
        done();
  });    
  // END OF TEST

  // Guardamos al usuario

  callback();
};

var getAccessToken = function(oauth_token, oauth_verifier, callback) {
  console.log(oauth_token);
  console.log(oauth_verifier);

  oa.getOAuthAccessToken(oauth_token, oauth_verifier, function (err, uno, dos, tres){
    if (err) {
      console.log(err);
      // TODO HANDLE
    } else {
      console.log("uno");
      console.log(uno);
      console.log("dos");
      console.log(dos);
      console.log("tres");
      console.log(tres);
    }
  });

/*





  console.log("getting access token");
  console.log(oauth_verifier);
  request.post('https://api.twitter.com/oauth/access_token?oauth_token=' + oauth_verifier, function (e, data, res){
  //request.post('https://api.twitter.com/oauth/access_token', {'oauth_token': oauth_token}, function (e, data, res){
    if (e) console.error(e);
    console.log("res");
    console.log(res);
  });*/
};

exports.getTwitterCallback = function(req, res){
  getAccessToken(req.query.oauth_token, req.query.oauth_verifier, function () {
    res.redirect('https://localhost:9000/App');
  });
};