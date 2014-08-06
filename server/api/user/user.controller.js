'use strict';

var _               = require('lodash'),
    Users           = require('./user.model'),
    redis          = require("redis").createClient();

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

var findUserBySocialId = function(type, id, callback){
  switch(type) {
    case 'twitter':
      Users.findOne({'twitter.id': id}, function (err, user) {
        return callback(err, user);
      });
      break;
    case 'facebook':
      Users.findOne({'twitter.id': id}, function (err, user) {
        return callback(err, user);
      });
      break;
  };
};

var matchCookieInRedis = function(cookie, callback) {
  var json;
  // Parse the cookie if necesary
  try {
    json = JSON.parse(cookie);
  } catch (exception) {
    json = null;
  }
  if (json) {
    cookie = json;
  }

  // Match the cookie to an existing redis key and get the mongo id
  redis.get(cookie, function(err, key){
    if (err) { return callback(err); }
    if (!key) { return callback('Your cookie is invalid.'); }
    // If there was no error, send back the key of the cookie
    callback(null, key);
  });
};

var findUserById = function(id, callback) {
  // Find a user in the db with the id given
  Users.findById(id, function(err, user){
    if (err) { return callback(err); }
    if (!user) { return callback('There is no user user matching your cookie.'); }
    // If there was no error, send back the user
    callback(null, user);
  });
};

// Register or login a user.
exports.register = function(req, res) {
  console.log("Register");
  if(req.body._id) { delete req.body._id; }
  if(!req.body.sessionToken) { return handleError(res, 'No cookie founded.') }
  // Trying to match id given to existing user
  findUserBySocialId(req.params.type, req.params.id, function(err, user){
    if (err) { return handleError(res, err); }
    console.log(user);
    if(!user) { 
      console.log("User not found");
      // If there was no user, then create one
      Users.create(req.body, function (err, dbUser) {
        if(err) { return handleError(res, err); }

        // After creating user, assign the cookie for future requests        
        redis.set(req.body.sessionToken, dbUser._id);
        console.log("User matched with the cookie: " + req.body.sessionToken);

        // Send the user with the cookie back to the client
        return res.status(200).send(req.body.sessionToken);
      });
    } else {
      console.log("User found");
      // If there is one user with the same id, then login and update him
      var updated = _.merge(user, req.body);
      updated.save(function (err, dbUser) {
        if (err) { return handleError(res, err); }
        console.log("User updated");
        console.log("Finding if there is an existing cookie for the user");
        // Find if there is an existing cookie for that user
        redis.keys(dbUser._id, function(err, cookiesArray){
          if (err) { return handleError(res, err); }
          var cookie = req.body.sessionToken;
          // If there is one, then send it to the user
          if (cookiesArray.length > 0) {
            cookie = cookiesArray[0];
          }
          redis.set(cookie, user._id);
          console.log("Not found, assigning new cookie: " + cookie);
          // Send the cookie to the user
          return res.status(200).send(cookie);
        });
      });
    }
  });
};

exports.getUser = function(req, res) {

  console.log("************************************************************************GET USER************************************************************************************************")

  if(!req.cookies.JSESSIONID) { return handleError(res, 'No cookie founded.') }
  matchCookieInRedis(req.cookies.JSESSIONID, function(err, userId){
    if (err) { return handleError(res, err); }
    // Find a user with the userId gotted with the cookie
    findUserById(userId, function(err, user){
      if (err) { return handleError(res, err); }
      user = JSON.parse(JSON.stringify(user));
      user.sessionToken = req.cookies.JSESSIONID;
      console.log(user);
      return res.status(200).json(user);
    });
  });
};

exports.showUser = function(req, res) {
  if(!req.cookies.JSESSIONID) { return handleError(res, 'No cookie founded.') }
  matchCookieInRedis(req.cookies.JSESSIONID, function(err, userId){
    if (err) { return handleError(res, err); }
    // Find a user with the userId gotted with the cookie
    findUserById(userId, function(err, user){
      if (err) { return handleError(res, err); }
      



      user = JSON.parse(JSON.stringify(user));
      user.sessionToken = req.cookies.JSESSIONID;
      console.log(user);
      return res.status(200).json(user);
    });
  });
};


exports.UpdateFollowingFollowers = function(req, res) {
  // Get with the cookie a userId
  matchCookieInRedis(req.query.cookie, function(err, userId){
    if (err) { return handleError(res, err); }
    // Find a user with the userId gotted with the cookie
    findUserById(userId, function(err, user){
      if (err) { return handleError(res, err); }
      var toReplace = {
        following: req.body.following,
        followers: req.body.followers
      };
      // Update the user with the values given
      var updated = _.merge(user, toReplace);
      updated.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(updated);
      });
    });
  });
};

exports.addFollowers_earned = function(req,res){
  // Get with the cookie a userId
  matchCookieInRedis(req.query.cookie, function(err, userId){
    if (err) { return handleError(res, err); }
    // Find a user with the userId gotted with the cookie
    findUserById(userId, function(err, user){
      if (err) { return handleError(res, err); }
      // Add one follower earned unless there is an especific number to add in the request body
      var toAdd = 1;
      if (req.body.followers_earned) {
        toAdd = req.body.followers_earned;
      }
      Users.add({followers_earned: toAdd}, function(err, newUser){
        if (err) { return handleError(res, err); }
      var updated = _.merge(user,   toReplace);
      });
    });
  });
};


exports.addFollowings_earned = function(req,res){
  // Get with the cookie a userId
  matchCookieInRedis(req.query.cookie, function(err, userId){
    if (err) { return handleError(res, err); }
    // Find a user with the userId gotted with the cookie
    findUserById(userId, function(err, user){
      if (err) { return handleError(res, err); }
      // Add one follower earned unless there is an especific number to add in the request body
      var toAdd = 1;
      if (req.body.following_earned) {
        toAdd = req.body.following_earned;
      }
      Users.add({following_earned: toAdd}, function(err, newUser){
        if (err) { return handleError(res, err); }
        res.json(200, newUser);
      });
    });
  });
};

// Get a single user
exports.show = function(req, res) {
  var whereToFind = req.params.type + '.id';
  console.log("finding in " + whereToFind + " the value " + req.params.id);
  Users.findOne({'twitter.id': req.params.id}, function (err, user) {
    if(err) { return handleError(res, err); }
    if(!user) { return res.send('There is no user user matching your cookie.'); }
    return res.json(user);
  });
};

// Deletes a user from the DB.
exports.destroy = function(req, res) {
  // Get with the cookie a userId
  matchCookieInRedis(req.query.cookie, function(err, userId){
    if (err) { return handleError(res, err); }
    // Find a user with the userId gotted with the cookie
    findUserById(userId, function(err, user){
      if (err) { return handleError(res, err); }

      var newUser = {
        account: user.account,
        twitter: {
          id: user.twitter.id,
          token: user.twitter.token,
          token_secret: user.twitter.token_secret
        }
      };

      user.update(newUser, function(err){
        if(err) { return handleError(res, err); }
        return res.send(200);
      });      
    });
  });
};


function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
};
