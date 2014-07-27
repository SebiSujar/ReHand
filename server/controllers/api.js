'use strict';

var request           = require('request'),
    qs                = require('querystring'),
    oauth,
    params;
// TWITTER -----------------------------

exports.oauth = function () {
  oauth = { 
    callback: 'http://localhost:9000/api/twitter/callback'
  , consumer_key: 'ruXFonJxX4ZGRhkcoiLLo0hhs'
  , consumer_secret: 'NYLgyj1JG4EG7JTea5Y9WXlXYOg6MupEsthLOTGWB8AlPUkI6Y'    
  };
};


exports.getTwitterOauth = function(req, res){
  var url = 'https://api.twitter.com/oauth/request_token';

  request.post({url:url, oauth:oauth}, function (err, req, body) {
    if (err) {
      console.log(err);
      return res.send("yeah no. didn't work.")
    }
    body = qs.parse(body);
    if (!body.oauth_callback_confirmed){
      console.log("bad authentication");
      return res.send("yeah no. didn't work.");
    }
    oauth.token = body.oauth_token;
    oauth.token_secret = body.oauth_token_secret;
    res.send('https://api.twitter.com/oauth/authorize?oauth_token=' + body.oauth_token);
  });
};

var getAccessToken = function(callback) {
  var url = 'https://api.twitter.com/oauth/access_token';
  request.post({url:url, oauth:oauth}, function (e, r, body) {
    body = qs.parse(body);
    oauth.token = body.oauth_token;
    oauth.token_secret = body.oauth_token_secret;
    params = {
      screen_name: body.screen_name, 
      user_id: body.user_id
    };

    callback();
  });
};

var getUserInfo = function(callback) {
  var url = 'https://api.twitter.com/1.1/users/show.json?';
  url += qs.stringify(params);

  request.get({url:url, oauth:oauth, json:true}, function (e, r, body) {
    var user = {
      twitter: {
        id: body.id,

        token: oauth.token,
        token_secret: oauth.token_secret,

        name: body.screen_name,
        picture: body.profile_image_url,
        
        following: body.friends_count,
        followers: body.followers_count,
        
        startingFollowing: body.friends_count,
        startingFollowers: body.followers_count,
      }
    };
    callback(user);
  });
};

var saveUser = function(user, callback){
  console.log("sending to save");
  console.log(user);
  request.post('http://localhost:9000/user', {form: user}, function (err, res){
    console.log("********API***********");
    console.log("err");
    console.log(err);
    console.log("err");
    console.log("user");
    console.log(JSON.parse(res.body));
    console.log("user");
    console.log("********API***********");
    callback();
  });
};

exports.getTwitterCallback = function(req, res){
  oauth.verifier = req.query.oauth_verifier;

  getAccessToken(function() {
    getUserInfo(function(user){
      saveUser(user, function(){
        res.redirect('/App');
      });
    });
  });
};