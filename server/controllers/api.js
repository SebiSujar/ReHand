'use strict';

var request = require('request');

// TWITTER -----------------------------

exports.getTwitterOauth = function(req, res){
  // Requests a Twitter authorization URL from the java webserver
  var uri = 'https://api.twitter.com/oauth/request_token';
  request.post(uri,
    {
      form: {oauth_callback: 'localhost:9000/api/twitter/callback/'}
    }, function (error, response, body) {
    console.log("error");
    console.log(error);
    console.log("body");
    console.log(body);
  });
};

exports.getTwitterCallback = function(req, res){
  // Sends the twitter oauth response callback to the java webserver
  var uri = 'http://54.245.112.164:8080/Tiempy/twitter/callback/?oauth_token=' + req.params.oauth_token + 
            '&oauth_verifier=' +req.params.oauth_verifier;

  request(
    { method: 'GET', uri: uri } , function (error, response, body) {
      if (checkIfUnauthorized(error,response,body)) return res.send(404);
      try {
        body = JSON.parse(body);
        res.json(body);
      }catch(err){
        console.log(body);
        res.send(404);
      }
    }
  );
};