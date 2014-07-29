'use strict';

var request           = require('request'),
    qs                = require('querystring'),
    oauth             = {},
    params;


// TWITTER -----------------------------

exports.getTwitterOauth = function(req, res){
  var url = 'https://api.twitter.com/oauth/request_token';
  
  oauth = { 
    callback: 'http://localhost:9000/api/twitter/callback'
  , consumer_key: 'ruXFonJxX4ZGRhkcoiLLo0hhs'
  , consumer_secret: 'NYLgyj1JG4EG7JTea5Y9WXlXYOg6MupEsthLOTGWB8AlPUkI6Y'    
  };

  request.post({url:url, oauth:oauth}, function (err, req, body) {
    if (err) {
      console.log(err);
      console.log(body);
      return res.send("24. yeah no. didn't work.")
    }
    body = qs.parse(body);
    if (!body.oauth_callback_confirmed){
      console.log("28. bad authentication");
      console.log(body);
      console.log(oauth);
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

var saveUser = function(user, cookie, callback){
  console.log("sending to save the user");
  var url = 'http://localhost:9000/user/twitter/' + user.twitter.id;
  console.log(url);
  user.sessionToken = cookie;
  request.post(url, {form: user}, function (err, res){
    console.log("********API***********");
    console.log("err");
    console.log(err);
    console.log("err");
    console.log("user");
    console.log(res.body);
    console.log("user");
    console.log("********API***********");
    callback();
  });
};

exports.getTwitterCallback = function(req, res){
  oauth.verifier = req.query.oauth_verifier;

  getAccessToken(function() {
    getUserInfo(function(user){
      saveUser(user, req.cookies.uuid, function(){
        res.redirect('/App');
      });
    });
  });
};