'use strict';

var request           = require('request').defaults({jar: false}),
    qs                = require('querystring'),
    oauth             = {},
    appConfig         = require('../appConfig'),
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
  console.log(req.data);
  console.log(req.body);
  var j = request.jar();
  var cookie = getCookie(req.headers);
  cookie = request.cookie(cookie);
  j.setCookie(cookie, uri);
  console.log("trying to get user with cookie " + cookie);
  request.get({url: uri, jar: j, form: req.body}, function (err, user){
    if (err) return handleError(res, err);
    res.status(200).json(JSON.parse(user.body));
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
  console.log(req.params);
  if (req.params.secret != 'ineba@123' || !req.params.name || !req.params.email || !req.params.password) {
    return res.redirect('/error');
  }
  var name = req.params.name.replace('+', ' '); 
  var user = {
    name: name,
    email: req.params.email,
    password: req.params.password,
    job: 'doctor'
  };
  console.log(user);
  saveUser(user, req.cookies.uuid, function(err, user){
    if (err) return handleError(res, err);
    console.log("Setting cookie " + req.cookies.uuid);
    res.cookie('JSESSIONID', req.cookies.uuid, {maxAge: 604800000});
    res.redirect('/App');
  });
};

function handleError(res, err) {
  return res.send(500, err);
}