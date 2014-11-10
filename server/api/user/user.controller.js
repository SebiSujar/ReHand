'use strict';

var _               = require('lodash'),
    Users           = require('./user.model'),
    mongoose        = require('mongoose'),
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

var findUserByEmail = function(email, callback) {
  // Find a user in the db with the email given
  Users.findOne({ 'email': email }, function(err, user){
    if (err) { return callback(err); }
    // If there was no error, send back the user
    callback(null, user);
  });
};

var findUserById = function(id, callback) {
  // Find a user in the db with the id given
  Users.findById(id, function(err, user){
    if (err) { return callback(err); }
    // If there was no error, send back the user
    callback(null, user);
  });
};

function checkDoctors (doctors, index, validDoctors, callback) {
  if (index == doctors.length) {
    console.log("returning");
    return callback(validDoctors);
  }
  console.log("finding doctor " + doctors[index]);
  var validDoctors = [];
  findUserByEmail(doctors[index], function(err, findedDoctor){
    console.log("err");
    console.log(err);
    console.log("findedDoctor");
    console.log(findedDoctor);
    if (findedDoctor && findedDoctor._id) {
      validDoctors.push(findedDoctor.email);
      checkDoctors(doctors, index + 1, validDoctors, callback);
    }
  });
};

function userToDb (user, callback) {
  Users.create(user, function (err, dbUser) {
    console.log("err");
    console.log(err);
    console.log("dbUser");
    console.log(dbUser);
    // After creating user, assign the cookie for future requests        
    redis.set(user.sessionToken, dbUser._id);
    console.log("User matched with the cookie: " + user.sessionToken);
    dbUser.sessionToken = user.sessionToken;
    // Send the user with the cookie back to the client
    return callback(err, dbUser);
  });
};

// Register or login a user.
exports.register = function(req, res) {
  console.log("Register");
  var user = req.body;
  console.log("USER");
  console.log(user);
  console.log("passed doctors step");
  // Trying to match id given to existing user
  findUserByEmail(user.email, function(err, findedUser){
    if (err) { return handleError(res, err); }
    console.log("findedUser");
    console.log(findedUser);
    if(!findedUser) { 
      console.log("User not found, creating one with given data");
      console.log(user);
      if (user.job != "doctor") {
        if(!req.cookies.JSESSIONID) { return handleError(res, 'No cookie founded.') }
        console.log("Cookie");
        console.log(req.cookies.JSESSIONID);
        matchCookieInRedis(req.cookies.JSESSIONID, function(err, dbDoctorId){
          if (err) { return handleError(res, err); }
          // Find a user with the userId gotted with the cookie
          findUserById(dbDoctorId, function(err, dbDoctor){
            if (err) { return handleError(res, err); }
            if (!dbDoctor) {return handleError(res, 'No user with your cookie.'); }
            console.log(dbDoctor);
            console.log("Register Patient");
            user.organization = dbDoctor.organization;
            if (user.doctors.length == 0) {
              return res.status(500).send('no_doctors');
            }
            console.log("finding doctors:");
            console.log(user.doctors);
            checkDoctors(user.doctors, 0, [], function(validDoctors){
              if (validDoctors.length == 0) {
                console.log("no valid doctors");
                return res.status(500).send('no_valid_doctors');
              }
              console.log("all right with doctors");
              user.doctors = validDoctors;
              userToDb(user, function(err, dbUser){
                if(err) { return handleError(res, err); }
                return res.status(200).send(dbUser);
              });
            }); 
          });
        });
      } else {
        userToDb(user, function(err, dbUser){
          if(err) { return handleError(res, err); }
          return res.status(200).send(dbUser);
        });
      }
    } else {
      return res.status(500).send('email_used');
    }
  });
};

// Update a user.
exports.update = function(req, res) {
  var user = req.body;
  // Trying to match id given to existing user
  if(!req.cookies.JSESSIONID) { return handleError(res, 'no_cookie') }
  matchCookieInRedis(req.cookies.JSESSIONID, function(err, dbDoctorId){
    if (err) { return handleError(res, err); }
    // Find a user with the userId gotted with the cookie
    findUserById(dbDoctorId, function(err, dbDoctor){
      if (err) { return handleError(res, err); }
      if (!dbDoctor) {return handleError(res, 'bad_cookie'); }
      Users.findOne({email: user.email, doctors: { $in: [ dbDoctor.email ] } }, function (err, findedUser) {
        if (err) return handleError(res, err);
        if (!findedUser) return handleError(res, 'no_user');
        if (findedUser.job == "doctor") return handleError(res, 'doctor_account');
        findedUser.name = user.name;
        findedUser.password = user.password;
        findedUser.initialLevel = user.initialLevel;
        findedUser.gender = user.gender;
        findedUser.blockBreak = user.blockBreak;
        findedUser.save(function (err, userSaved) {
          if (err) return handleError(res, err);
          return res.status(200).send(userSaved);
        });
      });
    });
  });
};

// Deletes a user.
exports.delete = function(req, res) {
  // Trying to match id given to existing user
  if(!req.cookies.JSESSIONID) { return handleError(res, 'no_cookie') }
  matchCookieInRedis(req.cookies.JSESSIONID, function(err, dbDoctorId){
    if (err) { return handleError(res, err); }
    // Find a user with the userId gotted with the cookie
    findUserById(dbDoctorId, function(err, dbDoctor){
      if (err) { return handleError(res, err); }
      if (!dbDoctor) {return handleError(res, 'bad_cookie'); }
      Users.remove({email: req.params.email, doctors: { $in: [ dbDoctor.email ] } }, function (err) {
        console.log(err);
        if (err) return handleError(res, err);
        return res.status(200).send(req.params.email);
      });
    });
  });
};

exports.getUser = function(req, res) {
  if (req.body.email && req.body.password) {
    console.log("USER CONTROLLER");
    console.log(req.body);
    Users.findOne({'email': req.body.email, 'password': req.body.password}, function(err, user){
      if (err) { return handleError(res, err); }
      if (!user) { return res.status(404).send('no_user'); }
      user.sessionToken = req.cookies.JSESSIONID;
      redis.set(user.sessionToken, user._id);
      res.status(200).send(user);
    });
  } else if (req.cookies.JSESSIONID) {
    matchCookieInRedis(req.cookies.JSESSIONID, function(err, userId){
      if (err) { return handleError(res, err); }
      if (!userId) { return handleError(res, "No user Id"); }
      // Find a user with the userId gotted with the cookie
      findUserById(userId, function(err, user){
        if (err) { return handleError(res, err); }
        if (!user) {return handleError(res, 'No user with your cookie.'); }
        user = JSON.parse(JSON.stringify(user));
        user.sessionToken = req.cookies.JSESSIONID;
        console.log("User found by cookie");
        console.log(user);
        return res.status(200).json(user);
      });
    });
  } else {
    res.status(404).send('no_data');
  }
};

exports.getPatients = function(req, res) {
  if(!req.cookies.JSESSIONID) { return handleError(res, 'No cookie founded.') }
  console.log("Cookie");
  console.log(req.cookies.JSESSIONID);
  matchCookieInRedis(req.cookies.JSESSIONID, function(err, userId){
    if (err) { return handleError(res, err); }
    // Find a user with the userId gotted with the cookie
    findUserById(userId, function(err, user){
      if (err) { return handleError(res, err); }
      if (!user) {return handleError(res, 'No user with your cookie.'); }
      console.log(user);
      console.log("Get Patients");
      Users.find({ 'job': 'patient', doctors: { $in: [ user.email ] } }, function(err, users){
        if (err) { return handleError(res, err); }
        console.log("patients");
        console.log(users);
        return res.status(200).json(users);
      });
      return;
      user = JSON.parse(JSON.stringify(user));
      user.sessionToken = req.cookies.JSESSIONID;
      console.log(user);
      console.log("151");
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
      if (!user) {return handleError(res, 'No user with your cookie.'); }


      user = JSON.parse(JSON.stringify(user));
      user.sessionToken = req.cookies.JSESSIONID;
      console.log(user);
      console.log("151");
      return res.status(200).json(user);
    });
  });
};

exports.saveGame = function(req, res) {
  console.log("Save Game");
  console.log(req.body);
  console.log("Save Game");
  findUserByEmail(req.body.email, function(err, findedUser){
    if (err) { return handleError(res, err); }
    console.log("Your user is:");
    console.log(findedUser);
    if(!findedUser) { 
      return handleError(res, 'no_user');
    } else {
      findedUser.games.push(req.body);
      findedUser.save(function(err, dbUser){
        if (err) return handleError(res, err);
        console.log("Result");
        console.log(findedUser);
        return res.status(200).send(findedUser);
      });
    }
  });
};

exports.saveTest = function(req, res) {
  console.log("Save Test");
  console.log(req.body);
  console.log("Save Test");
  findUserByEmail(req.body.email, function(err, findedUser){
    if (err) { return handleError(res, err); }
    console.log("Your user is:");
    console.log(findedUser);
    if(!findedUser) { 
      return handleError(res, 'no_user');
    } else {
      findedUser.performanceTest.push(req.body);
      findedUser.save(function(err, dbUser){
        if (err) return handleError(res, err);
        console.log("Result");
        console.log(findedUser);
        return res.status(200).send(findedUser);
      });
    }
  });
};

function handleError(res, err) {
  console.log(err);
  console.log("************************************HANDLE ERROR************************************************")
  return res.status(500).send(err);
};
