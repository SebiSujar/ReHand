'use strict';

var request           = require('request').defaults({jar: false}),
    qs                = require('querystring'),
    oauth             = {},
    params;


var getCookie = function(headers){
  if(headers.jsessionid){
    var jsessionid = headers.jsessionid;
    console.log('jsessionid: ' + jsessionid);
  }
  if(headers.cookie){
    var cookies = headers.cookie;
    //console.log(cookies);
    var arrHead = cookies.indexOf('JSESSIONID=');
    var theCookieStart = cookies.substr(arrHead);
    var theCookieArray = theCookieStart.split(';');
    var theCookie = theCookieArray[0];
    //console.log('The Cookie: ' + theCookie);
    return theCookie;
  }
};

// USER --------------------------------

exports.login = function(req, res, cookie){

  var uri = 'http://localhost:9000/user';
  
  var j = request.jar();
  var cookie = request.cookie(getCookie(req.headers));
  j.setCookie(cookie, uri);

  console.log("trying to get user with cookie " + cookie);
  request.get({url: uri, jar: j}, function (err, user){
    if (err) return handleError(res, err);
    console.log(user);
    console.log("api 39");
    if (user) {
      //res.status(200).json(JSON.parse(user.body));
    }
  });
};




// TWITTER -----------------------------

exports.getTwitterOauth = function(req, res){
  var uri = 'https://api.twitter.com/oauth/request_token';
  
  oauth = { 
    callback: 'http://localhost:9000/api/twitter/callback'
  , consumer_key: 'ruXFonJxX4ZGRhkcoiLLo0hhs'
  , consumer_secret: 'NYLgyj1JG4EG7JTea5Y9WXlXYOg6MupEsthLOTGWB8AlPUkI6Y'    
  };

  request.post({url: uri, oauth:oauth}, function (err, req, body) {
    if (err) return handleError(res, err);
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
  var uri = 'https://api.twitter.com/oauth/access_token';
  request.post({url:uri, oauth:oauth}, function (e, r, body) {
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

var disminifyTwUrl = function(toDisminify, index, disminified, callback){
  if (toDisminify.length <= index) {
    return callback(disminified);
  }
  request.post(toDisminify[index], function (err, body, tres){
    if (err){
      console.log(err);
      disminified.push(null); 
    } else {
      disminified.push(body.headers.location); 
    }
    return disminifyTwUrl(toDisminify, index + 1, disminified, callback);
  });
};

var getUserInfo = function(callback) {
  var uri = 'https://api.twitter.com/1.1/users/show.json?';
  uri += qs.stringify(params);

  request.get({url:uri, oauth:oauth, json:true}, function (e, r, body) {
    console.log(body);

    var user = {
      twitter: {
        id: body.id,

        token: oauth.token,
        token_secret: oauth.token_secret,

        name: body.name,
        screen_name: body.screen_name,
        picture: body.profile_image_url,
        cover: body.profile_banner_url,
        
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
  var uri = 'http://localhost:9000/user/twitter/' + user.twitter.id;
  user.sessionToken = cookie;
  request.post(uri, {form: user}, function (err, res){
    callback(err, res.body);
  });
};

exports.getTwitterCallback = function(req, res){
  oauth.verifier = req.query.oauth_verifier;

  getAccessToken(function() {
    getUserInfo(function(user){
      saveUser(user, req.cookies.uuid, function(err, cookie){
        if (err) return handleError(res, err);
        console.log("Setting cookie " + cookie);
        res.cookie('JSESSIONID', cookie, {maxAge: 604800000});
        res.redirect('/App');
      });
    });
  });
};

exports.test = function(req, res){

  
  request.get('https://twitter.com/sebisujar', function (e, r, page){
    var filtered = page.match(/(?:<span class="ProfileNav-value" data-is-compact="false">*)(\d+)(?=<\/span>)/g, '');
    filtered.forEach(function(span, i){
      filtered[i] = span.substring(span.indexOf('>') + 1)
    });

    var twUser = {
      following: filtered[2],
      followers: filtered[3],
      
    }

    //res.status(200).send(page);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}