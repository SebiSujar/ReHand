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
    return theCookie;
  }
};

// USER --------------------------------
exports.login = function(req, res, cookie){
  var uri = 'http://localhost:3000/user';
  console.log("--- LOGIN ---")
  console.log(req.body);
  var j = request.jar();
  var cookie = getCookie(req.headers);
  if (cookie) {
    cookie = request.cookie(cookie);
    j.setCookie(cookie, uri);
    console.log("trying to get user with cookie " + cookie);
  }
  request.get({url: uri, jar: j, form: req.body}, function (err, user){
    if (err) return handleError(res, err);
    try {
      res.status(200).json(JSON.parse(user.body));
    } catch (e) {
      res.status(500).send(user.body);
    }
  });
};

var saveUser = function(user, cookie, callback){
  var uri = 'http://localhost:3000/user';
  user.sessionToken = cookie;
  request.post(uri, {form: user}, function (err, res){
    if (err) return callback(err);
    callback(err, res.body);
  });
};

exports.register = function(req, res) {
  oauth.verifier = req.query.oauth_verifier;
  console.log(req.body);
  if (req.body.secret != 'ineba@123') {
    return res.status(500).send('no_root')
  }
  if (!req.params.name || !req.params.email || !req.params.password) {
    return res.status(500).send('user_incomplete')
  }
  var user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    job: 'doctor'
  };
  console.log(user);
  console.log("COOKIES");
  console.log(req.cookies);
  saveUser(user, req.cookies.JSESSIONID, function(err, user){
    if (err) return handleError(res, err);
    console.log("Setting cookie " + req.cookies.JSESSIONID);
    res.cookie('JSESSIONID', req.cookies.JSESSIONID, {maxAge: 604800000});
    res.redirect('/App');
  });
};

function handleError(res, err) {
  return res.send(500, err);
}